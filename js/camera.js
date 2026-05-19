window.Game = window.Game || {};

Game.Camera = (function () {
  function create() {
    return { x: 0, y: 0 };
  }

  function update(cam, target, level, viewW, viewH, dt) {
    // Follow with a dead-zone so small movement doesn't shake the camera.
    const targetX = target.x + target.w / 2 - viewW / 2;
    const targetY = target.y + target.h / 2 - viewH / 2;

    // Smooth toward target
    const smoothing = 8 * dt;
    cam.x += (targetX - cam.x) * Math.min(1, smoothing);
    cam.y += (targetY - cam.y) * Math.min(1, smoothing);

    // Clamp to level
    cam.x = Math.max(0, Math.min(level.width - viewW, cam.x));
    cam.y = Math.max(0, Math.min(Math.max(0, level.height - viewH), cam.y));
  }

  return { create, update };
})();
