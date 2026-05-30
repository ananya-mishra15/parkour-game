window.Game = window.Game || {};

Game.Level = (function () {
  function load(index) {
    const def = Game.LEVELS[index];
    if (!def) return null;

    // Deep-ish copy so platforms can carry runtime state without mutating LEVELS.
    const platforms = (def.platforms || []).map((p) => ({
      x: p.x, y: p.y, w: p.w, h: p.h,
      originX: p.x, originY: p.y,
      vx: 0, vy: 0,
      move: p.move ? { ...p.move, t: 0 } : null,
      fall: !!p.fall,
      delay: p.delay != null ? p.delay : 0.4,
      triggered: false,
      falling: false,
      fallTimer: 0,
      type: p.type || 'platform',
    }));

    const coins = (def.coins || []).map((c) => ({
      x: c.x, y: c.y, w: 20, h: 20, collected: false,
    }));

    // Climb bars are rectangular regions; not solid, just interaction zones.
    const climbs = (def.climbs || []).map((c) => ({
      x: c.x, y: c.y, w: c.w, h: c.h,
    }));

    // Ropes hang from an anchor; integrated as pendulums in update().
    const ropes = (def.ropes || []).map((r) => ({
      x: r.x, y: r.y, length: r.length,
      angle: r.startAngle != null ? r.startAngle : 0,
      omega: 0,
      occupied: false,
    }));

    // Ziplines are straight cables.
    const ziplines = (def.ziplines || []).map((z) => ({
      x1: z.x1, y1: z.y1, x2: z.x2, y2: z.y2,
    }));

    // Cannons launch the player at an angle on overlap. `angle` is degrees in screen
    // space (0 = right, -90 = straight up, 90 = down). `power` is the launch speed.
    const cannons = (def.cannons || []).map((c) => ({
      x: c.x, y: c.y, w: c.w, h: c.h,
      angle: c.angle != null ? c.angle : -90,
      power: c.power != null ? c.power : 900,
    }));

    // Checkpoints record a respawn point when first touched. The `activated` flag
    // is set by the player and read by the renderer (for the flag color).
    const checkpoints = (def.checkpoints || []).map((c) => ({
      x: c.x, y: c.y, w: c.w, h: c.h,
      activated: false,
    }));

    return {
      index,
      name: def.name,
      width: def.width,
      height: def.height,
      sky: def.sky || '#9ad6ff',
      spawn: { ...def.spawn },
      goal:  { x: def.goal.x, y: def.goal.y, w: 36, h: 60 },
      tiles: (def.tiles || []).map((t) => ({ ...t })),
      hazards: (def.hazards || []).map((h) => ({ ...h })),
      platforms,
      coins,
      climbs,
      ropes,
      ziplines,
      cannons,
      checkpoints,
    };
  }

  function update(level, dt) {
    // Rope pendulum integration — runs every frame so unoccupied ropes sway and
    // settle naturally. Occupied ropes get driven by the player elsewhere.
    const DAMP = 0.4;
    for (const r of level.ropes) {
      if (r.occupied) continue;
      const alpha = -(Game.Physics.GRAVITY / r.length) * Math.sin(r.angle) - DAMP * r.omega;
      r.omega += alpha * dt;
      r.angle += r.omega * dt;
    }

    for (const p of level.platforms) {
      const prevX = p.x;
      const prevY = p.y;

      if (p.move && !p.falling) {
        const m = p.move;
        m.t += dt;
        // Smooth ping-pong via sine wave.
        const offset = Math.sin(m.t * (m.speed / m.range) * 2) * m.range;
        if (m.axis === 'x')       p.x = p.originX + offset;
        else if (m.axis === 'xy') { p.x = p.originX + offset; p.y = p.originY + offset; }
        else                       p.y = p.originY + offset;
      }

      if (p.fall) {
        if (p.triggered && !p.falling) {
          p.fallTimer -= dt;
          if (p.fallTimer <= 0) p.falling = true;
        }
        if (p.falling) {
          p.vy += Game.Physics.GRAVITY * dt;
          p.y += p.vy * dt;
          if (p.y > level.height + 100) {
            // park it far off-screen so collision skips it
            p.x = -99999;
          }
        }
      }

      if (!p.falling) {
        p.vx = (p.x - prevX) / dt;
        p.vy = (p.y - prevY) / dt;
      } else {
        p.vx = 0;
      }
    }
  }

  function allSolids(level) {
    // Tiles + moving platforms are both solid.
    return level.tiles.concat(level.platforms);
  }

  return { load, update, allSolids };
})();
