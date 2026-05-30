window.Game = window.Game || {};

Game.Particles = (function () {
  const particles = [];
  const MAX = 200;

  function emit(cfg) {
    const baseAngle = cfg.baseAngle || 0;
    for (let i = 0; i < cfg.count && particles.length < MAX; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * (cfg.spread || Math.PI * 2);
      const speed = cfg.speed * (0.6 + Math.random() * 0.8);
      particles.push({
        x: cfg.x + (Math.random() - 0.5) * (cfg.radius || 0),
        y: cfg.y + (Math.random() - 0.5) * (cfg.radius || 0),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: cfg.life * (0.7 + Math.random() * 0.6),
        maxLife: cfg.life,
        size: cfg.size * (0.6 + Math.random() * 0.8),
        color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
        type: cfg.type || 'circle',
        gravity: cfg.gravity || 0,
      });
    }
  }

  function update(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        particles[i] = particles[particles.length - 1];
        particles.pop();
      }
    }
  }

  function getAll() { return particles; }
  function clear() { particles.length = 0; }

  // --- Presets ---
  function landingDust(x, y) {
    emit({
      x: x, y: y, count: 10,
      baseAngle: -Math.PI / 2, spread: Math.PI * 0.8,
      speed: 60, life: 0.3, size: 4,
      colors: ['#c4a97a', '#a08050', '#d4c09a'],
      gravity: 200,
    });
  }

  function coinSparkle(x, y) {
    emit({
      x: x, y: y, count: 12,
      spread: Math.PI * 2,
      speed: 100, life: 0.5, size: 3,
      colors: ['#f5c542', '#fff6c0', '#ffffff'],
      gravity: 0,
    });
  }

  function deathPop(x, y) {
    emit({
      x: x, y: y, count: 18,
      spread: Math.PI * 2,
      speed: 180, life: 0.8, size: 6,
      colors: ['#9b6bd6', '#6a3fa0', '#c49be8', '#f5c542'],
      type: 'square',
      gravity: 500,
    });
  }

  function checkpointGlow(x, y) {
    emit({
      x: x, y: y, count: 14,
      baseAngle: -Math.PI / 2, spread: Math.PI * 0.6,
      speed: 80, life: 0.6, size: 4,
      colors: ['#42f5a1', '#2da77a', '#80ffcc'],
      gravity: -40,
    });
  }

  function speedLine(x, y, facing) {
    emit({
      x: x, y: y, count: 1,
      baseAngle: facing > 0 ? Math.PI : 0,
      spread: 0.3,
      speed: 30, life: 0.15, size: 3,
      colors: ['rgba(255,255,255,0.5)'],
      type: 'line',
      gravity: 0,
    });
  }

  return { emit, update, getAll, clear, landingDust, coinSparkle, deathPop, checkpointGlow, speedLine };
})();

Game.ScreenShake = (function () {
  let timer = 0;
  let intensity = 0;

  function trigger(dur, power) {
    timer = dur;
    intensity = power;
  }

  function update(dt) {
    if (timer > 0) timer -= dt;
  }

  function apply(camera) {
    if (timer <= 0) return;
    camera.x += (Math.random() - 0.5) * intensity * 2;
    camera.y += (Math.random() - 0.5) * intensity * 2;
  }

  return { trigger, update, apply, isActive: () => timer > 0 };
})();
