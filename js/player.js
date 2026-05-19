window.Game = window.Game || {};

Game.Player = (function () {
  const P = Game.Physics;

  const STAND_W = 32;
  const STAND_H = 52;
  const SLIDE_W = 32;
  const SLIDE_H = 28;
  const COYOTE_TIME = 0.08;     // grace period to jump after walking off a ledge
  const JUMP_BUFFER = 0.12;     // grace period if player presses jump just before landing

  function create(spawn) {
    return {
      x: spawn.x,
      y: spawn.y,
      w: STAND_W,
      h: STAND_H,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: false,
      onWallLeft: false,
      onWallRight: false,
      jumpsLeft: 2,
      sliding: false,
      slideTimer: 0,
      coyote: 0,
      jumpBuffer: 0,
      bouncing: false,
      dead: false,
      reachedGoal: false,
      climbing: null,
      climbGrace: 0,           // tiny window after attach where jump-release is suppressed
      rope: null,
      ropeReleaseCooldown: 0,  // brief window after release so we don't instantly re-grab
      zipline: null,
      zipT: 0,
      zipSpeed: 0,
      ziplineReleaseCooldown: 0,
      cannonCooldown: 0,
    };
  }

  function tryStandUp(player, solids) {
    const probe = { x: player.x, y: player.y - (STAND_H - SLIDE_H), w: STAND_W, h: STAND_H };
    for (const s of solids) {
      if (P.aabbOverlap(probe, s)) return false;
    }
    player.y -= (STAND_H - SLIDE_H);
    player.w = STAND_W;
    player.h = STAND_H;
    player.sliding = false;
    return true;
  }

  function checkHazardsAndGoal(player, level) {
    for (const h of level.hazards) {
      if (P.aabbOverlap(player, h)) { player.dead = true; return true; }
    }
    if (level.coins) {
      for (const c of level.coins) {
        if (!c.collected && P.aabbOverlap(player, c)) c.collected = true;
      }
    }
    if (level.checkpoints) {
      for (const cp of level.checkpoints) {
        if (!cp.activated && P.aabbOverlap(player, cp)) cp.activated = true;
      }
    }
    if (player.y > level.height + 200) { player.dead = true; return true; }
    if (P.aabbOverlap(player, level.goal)) { player.reachedGoal = true; return true; }
    return false;
  }

  function updateClimbing(player, level, dt) {
    const Input = Game.Input;
    const c = player.climbing;

    // Release with jump — small upward hop. Suppressed during attach grace so the
    // press that brought you here doesn't immediately let go.
    if (player.climbGrace <= 0 && Input.wasPressed('jump')) {
      player.climbing = null;
      player.vy = P.JUMP_VELOCITY * 0.7;
      player.vx = 0;
      player.jumpsLeft = 1;
      return;
    }

    const left = Input.isDown('left');
    const right = Input.isDown('right');
    const down = Input.isDown('slide');

    // Strafe left/right along the bars; default gentle climb-up unless slide is held.
    player.vx = (right ? 180 : 0) - (left ? 180 : 0);
    player.vy = down ? 180 : -160;

    player.x += player.vx * dt;
    player.y += player.vy * dt;

    // Side-exit: dropped off the side of the climb area.
    if (player.x + player.w * 0.5 < c.x || player.x + player.w * 0.5 > c.x + c.w) {
      player.climbing = null;
    }
    // Bottom-exit: just fall away.
    if (player.y > c.y + c.h) {
      player.climbing = null;
    }
    // Top-exit: small hop so you clear onto whatever's above.
    if (player.y + player.h < c.y) {
      player.climbing = null;
      player.vy = P.JUMP_VELOCITY * 0.5;
    }

    checkHazardsAndGoal(player, level);
  }

  function tryAttachClimb(player, level) {
    if (player.climbing || player.rope || player.zipline) return false;
    for (const c of level.climbs) {
      if (P.aabbOverlap(player, c)) {
        player.climbing = c;
        player.climbGrace = 0.15;
        player.vx = 0; player.vy = 0;
        return true;
      }
    }
    return false;
  }

  function updateRope(player, level, dt) {
    const Input = Game.Input;
    const r = player.rope;
    r.occupied = true;

    // Left/right input pushes the swing.
    const dir = (Input.isDown('right') ? 1 : 0) - (Input.isDown('left') ? 1 : 0);
    if (dir !== 0) player.facing = dir;
    const SWING_PUSH = 6.0;
    r.omega += dir * SWING_PUSH * dt;

    // Pendulum integration (very light damping while held — feels lively).
    const alpha = -(P.GRAVITY / r.length) * Math.sin(r.angle) - 0.15 * r.omega;
    r.omega += alpha * dt;
    r.angle += r.omega * dt;

    const tipX = r.x + Math.sin(r.angle) * r.length;
    const tipY = r.y + Math.cos(r.angle) * r.length;
    player.x = tipX - player.w / 2;
    player.y = tipY - player.h / 2;

    if (Input.wasPressed('jump')) {
      // Release tangentially: velocity = omega * length, perpendicular to rope (radial direction).
      const tangentX = Math.cos(r.angle);
      const tangentY = -Math.sin(r.angle);
      const speed = r.omega * r.length;
      player.vx = speed * tangentX;
      player.vy = speed * tangentY - 280; // upward kick on release
      player.jumpsLeft = 1;
      player.ropeReleaseCooldown = 0.25;
      r.occupied = false;
      player.rope = null;
    }

    checkHazardsAndGoal(player, level);
  }

  function tryAttachRope(player, level) {
    if (player.climbing || player.rope || player.zipline) return false;
    if (player.ropeReleaseCooldown > 0) return false;
    for (const r of level.ropes) {
      const tipX = r.x + Math.sin(r.angle) * r.length;
      const tipY = r.y + Math.cos(r.angle) * r.length;
      if (tipX < player.x || tipX > player.x + player.w) continue;
      if (tipY < player.y || tipY > player.y + player.h) continue;
      // Seed angular velocity from current linear motion.
      r.omega = (player.vx * Math.cos(r.angle) - player.vy * Math.sin(r.angle)) / r.length;
      player.rope = r;
      return true;
    }
    return false;
  }

  function updateZipline(player, level, dt) {
    const Input = Game.Input;
    const z = player.zipline;
    const dx = z.x2 - z.x1;
    const dy = z.y2 - z.y1;
    const L = Math.hypot(dx, dy);
    const ux = dx / L;
    const uy = dy / L;

    // Gravity component along line, halved for snappier ride feel.
    player.zipSpeed += (P.GRAVITY * uy * 0.5) * dt;
    player.zipSpeed *= 0.998;
    player.zipT += (player.zipSpeed * dt) / L;

    let released = false;
    if (player.zipT >= 1) { player.zipT = 1; released = true; }
    if (player.zipT <= 0) { player.zipT = 0; released = true; }
    if (Input.wasPressed('jump')) released = true;

    const px = z.x1 + dx * player.zipT;
    const py = z.y1 + dy * player.zipT;
    player.x = px - player.w / 2;
    player.y = py - player.h / 2 + 14; // hang slightly below the cable

    if (released) {
      player.vx = player.zipSpeed * ux;
      player.vy = player.zipSpeed * uy - (Input.wasPressed('jump') ? 280 : 0);
      player.jumpsLeft = 1;
      player.zipline = null;
      player.ziplineReleaseCooldown = 0.25;
    }

    checkHazardsAndGoal(player, level);
  }

  function tryAttachZipline(player, level) {
    if (player.climbing || player.rope || player.zipline) return false;
    if (player.ziplineReleaseCooldown > 0) return false;
    if (player.vy < 0) return false; // only attach while falling/stationary
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h / 2;
    for (const z of level.ziplines) {
      const dx = z.x2 - z.x1;
      const dy = z.y2 - z.y1;
      const L2 = dx * dx + dy * dy;
      if (L2 === 0) continue;
      let t = ((cx - z.x1) * dx + (cy - z.y1) * dy) / L2;
      if (t < 0 || t > 1) continue;
      const px = z.x1 + dx * t;
      const py = z.y1 + dy * t;
      const dist = Math.hypot(cx - px, cy - py);
      if (dist > 28) continue;
      player.zipline = z;
      player.zipT = t;
      // Start speed = projection of current velocity onto line.
      const L = Math.sqrt(L2);
      player.zipSpeed = (player.vx * dx + player.vy * dy) / L;
      if (player.zipSpeed < 40) player.zipSpeed = 40; // give a small push if attached from rest
      return true;
    }
    return false;
  }

  function update(player, level, dt) {
    if (player.dead || player.reachedGoal) return;

    // Cooldowns
    if (player.ropeReleaseCooldown > 0) player.ropeReleaseCooldown -= dt;
    if (player.ziplineReleaseCooldown > 0) player.ziplineReleaseCooldown -= dt;
    if (player.climbGrace > 0) player.climbGrace -= dt;
    if (player.cannonCooldown > 0) player.cannonCooldown -= dt;

    // ----- Attached states preempt normal physics -----
    if (player.climbing) { updateClimbing(player, level, dt); return; }
    if (player.rope)     { updateRope(player, level, dt);     return; }
    if (player.zipline)  { updateZipline(player, level, dt);  return; }

    const Input = Game.Input;
    const solids = Game.Level.allSolids(level);

    // ----- Horizontal input -----
    const left = Input.isDown('left');
    const right = Input.isDown('right');
    const dir = (right ? 1 : 0) - (left ? 1 : 0);
    if (dir !== 0) player.facing = dir;

    // Slippery ground: standing on ice slashes friction + acceleration.
    const onIce = player.onGround && player.carry && player.carry.type === 'ice';
    const groundAccel = onIce ? 800 : P.RUN_ACCEL;
    const groundFriction = onIce ? 120 : P.FRICTION;

    const accel = player.onGround ? groundAccel : P.AIR_ACCEL;
    if (dir !== 0) {
      player.vx += dir * accel * dt;
    } else if (player.onGround) {
      // friction toward zero
      const sign = Math.sign(player.vx);
      const dec = groundFriction * dt;
      player.vx = Math.abs(player.vx) <= dec ? 0 : player.vx - sign * dec;
    }
    const maxSpeed = player.sliding ? P.MAX_RUN_SPEED + P.SLIDE_SPEED_BOOST : P.MAX_RUN_SPEED;
    if (player.vx >  maxSpeed) player.vx =  maxSpeed;
    if (player.vx < -maxSpeed) player.vx = -maxSpeed;

    // ----- Slide -----
    if (!player.sliding && Input.isDown('slide') && player.onGround && Math.abs(player.vx) > 40) {
      player.sliding = true;
      player.slideTimer = P.SLIDE_DURATION;
      // shrink hitbox from the top so feet stay planted
      player.y += (STAND_H - SLIDE_H);
      player.w = SLIDE_W;
      player.h = SLIDE_H;
      // small speed kick in facing direction
      player.vx += player.facing * P.SLIDE_SPEED_BOOST;
    }
    if (player.sliding) {
      player.slideTimer -= dt;
      const wantsUp = !Input.isDown('slide');
      if ((player.slideTimer <= 0 || wantsUp) && tryStandUp(player, solids)) {
        // standing up handled inside tryStandUp
      }
    }

    // ----- Jump / wall-jump (with coyote time and jump buffer) -----
    if (Input.wasPressed('jump')) player.jumpBuffer = JUMP_BUFFER;

    const onWall = player.onWallLeft || player.onWallRight;
    const wallSliding = onWall && !player.onGround && player.vy > 0;

    if (player.jumpBuffer > 0) {
      if (player.onGround || player.coyote > 0) {
        player.vy = P.JUMP_VELOCITY;
        player.jumpsLeft = 1;  // one air jump remaining
        player.jumpBuffer = 0;
        player.coyote = 0;
        player.onGround = false;
      } else if (wallSliding) {
        const away = player.onWallLeft ? 1 : -1;
        player.vx = away * P.WALL_JUMP_X;
        player.vy = P.WALL_JUMP_Y;
        player.jumpsLeft = 1;  // wall jump refreshes the air jump
        player.jumpBuffer = 0;
        player.facing = away;
      } else if (player.jumpsLeft > 0) {
        player.vy = P.DOUBLE_JUMP_VELOCITY;
        player.jumpsLeft -= 1;
        player.jumpBuffer = 0;
      }
    }

    // Variable jump height — release Space to cut upward velocity.
    // Suppressed while rising from a trampoline: the player isn't holding jump
    // during a bounce, so without this guard the launch gets slashed to ~74px.
    if (!Input.isDown('jump') && player.vy < 0 && !player.bouncing) {
      player.vy *= 0.55;
    }

    // ----- Gravity -----
    const grav = wallSliding ? P.WALL_SLIDE_GRAVITY : P.GRAVITY;
    player.vy += grav * dt;
    if (player.vy > P.MAX_FALL_SPEED) player.vy = P.MAX_FALL_SPEED;

    // ----- Carry by moving platform (apply BEFORE moveAndCollide) -----
    // The carrying platform set the carry reference last frame; we then re-detect this frame.
    // Simple approach: if standing on a platform with vx, add its delta this frame.
    if (player.carry && player.carry.move) {
      player.x += player.carry.vx * dt;
      // vertical carry: only when platform moves down faster than gravity could pull;
      // for upward-moving platform, collision will push the player.
    }

    // ----- Move & collide -----
    const res = P.moveAndCollide(player, solids, dt);
    player.onGround = res.onGround;
    player.onWallLeft = res.onWallLeft;
    player.onWallRight = res.onWallRight;
    player.carry = res.carry;

    // ----- Trigger falling platform when stood on -----
    if (player.carry && player.carry.fall && !player.carry.triggered) {
      player.carry.triggered = true;
      player.carry.fallTimer = player.carry.delay;
    }

    // ----- Bouncy tile launch — fire whenever player is grounded on a bouncy tile.
    // The launch immediately sets onGround=false, so this can't double-fire within a frame;
    // continuous bouncing only happens after the player falls back down onto it.
    if (player.onGround && player.carry && player.carry.type === 'bouncy') {
      player.vy = -940;
      player.jumpsLeft = 2;
      player.onGround = false;
      player.bouncing = true;
    }
    if (player.bouncing && player.vy >= 0) player.bouncing = false;

    if (player.onGround) {
      player.jumpsLeft = 2;
      player.coyote = COYOTE_TIME;
    } else {
      player.coyote = Math.max(0, player.coyote - dt);
    }

    player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);

    // ----- Cannon launch — fires once when the player enters the AABB, then a brief
    // cooldown prevents re-trigger so they actually leave the cannon. Sets `bouncing`
    // so the variable-jump cutoff above doesn't slash the launch velocity.
    if (level.cannons && player.cannonCooldown <= 0) {
      for (const c of level.cannons) {
        if (P.aabbOverlap(player, c)) {
          const rad = c.angle * Math.PI / 180;
          player.vx = c.power * Math.cos(rad);
          player.vy = c.power * Math.sin(rad);
          player.cannonCooldown = 0.3;
          player.jumpsLeft = 2;
          player.onGround = false;
          player.bouncing = true;
          break;
        }
      }
    }

    // ----- Try attach to new mechanics (zipline first — most aggressive, then rope, then climb) -----
    if (level.ziplines && level.ziplines.length) tryAttachZipline(player, level);
    if (!player.zipline && level.ropes && level.ropes.length) tryAttachRope(player, level);
    if (!player.zipline && !player.rope && level.climbs && level.climbs.length) tryAttachClimb(player, level);

    if (checkHazardsAndGoal(player, level)) return;
  }

  return { create, update };
})();
