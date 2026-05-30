window.Game = window.Game || {};

Game.Physics = (function () {
  // Tunable constants — adjust here to change game feel.
  const GRAVITY = 1800;            // px/sec^2
  const MAX_FALL_SPEED = 1200;
  const RUN_ACCEL = 2400;
  const AIR_ACCEL = 1400;
  const FRICTION = 2000;
  const MAX_RUN_SPEED = 340;
  const JUMP_VELOCITY = -640;
  const DOUBLE_JUMP_VELOCITY = -560;
  const WALL_SLIDE_GRAVITY = 400;
  const WALL_JUMP_X = 380;
  const WALL_JUMP_Y = -580;
  const SLIDE_SPEED_BOOST = 80;
  const SLIDE_DURATION = 0.45;

  function aabbOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  // Resolve player movement against a list of solid rects, one axis at a time.
  // Returns { onGround, onWallLeft, onWallRight, carry }.
  // One-way platforms (type 'oneway'): never block horizontally, only block on Y when
  // entity is moving down AND its previous-frame bottom was above the platform top.
  function moveAndCollide(entity, solids, dt) {
    const result = { onGround: false, onWallLeft: false, onWallRight: false, carry: null };

    const prevBottom = entity.y + entity.h; // before this frame's Y move

    // ----- X axis -----
    entity.x += entity.vx * dt;
    for (const s of solids) {
      if (s.type === 'oneway') continue;
      if (!aabbOverlap(entity, s)) continue;
      if (entity.vx > 0) {
        entity.x = s.x - entity.w;
        entity.vx = 0;
        result.onWallRight = true;
      } else if (entity.vx < 0) {
        entity.x = s.x + s.w;
        entity.vx = 0;
        result.onWallLeft = true;
      } else {
        const overlapLeft = (entity.x + entity.w) - s.x;
        const overlapRight = (s.x + s.w) - entity.x;
        if (overlapLeft < overlapRight) {
          entity.x = s.x - entity.w;
          result.onWallRight = true;
        } else {
          entity.x = s.x + s.w;
          result.onWallLeft = true;
        }
      }
    }

    // ----- Y axis -----
    entity.y += entity.vy * dt;
    for (const s of solids) {
      if (!aabbOverlap(entity, s)) continue;
      if (s.type === 'oneway') {
        // Only catch a falling entity whose previous-frame bottom was at/above the platform top.
        if (entity.vy <= 0) continue;
        if (prevBottom > s.y + Math.max(1, entity.vy * dt * 0.5)) continue;
        entity.y = s.y - entity.h;
        entity.vy = 0;
        result.onGround = true;
        result.carry = s;
        continue;
      }
      if (entity.vy > 0) {
        entity.y = s.y - entity.h;
        entity.vy = 0;
        result.onGround = true;
        result.carry = s; // for moving platforms
      } else if (entity.vy < 0) {
        entity.y = s.y + s.h;
        entity.vy = 0;
      }
    }

    return result;
  }

  return {
    GRAVITY,
    MAX_FALL_SPEED,
    RUN_ACCEL,
    AIR_ACCEL,
    FRICTION,
    MAX_RUN_SPEED,
    JUMP_VELOCITY,
    DOUBLE_JUMP_VELOCITY,
    WALL_SLIDE_GRAVITY,
    WALL_JUMP_X,
    WALL_JUMP_Y,
    SLIDE_SPEED_BOOST,
    SLIDE_DURATION,
    aabbOverlap,
    moveAndCollide,
  };
})();
