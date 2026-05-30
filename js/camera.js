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
    const maxX = level.width - viewW;
    const maxY = level.height - viewH;
    cam.x = maxX <= 0 ? maxX / 2 : Math.max(0, Math.min(maxX, cam.x));
    cam.y = maxY <= 0 ? maxY / 2 : Math.max(0, Math.min(maxY, cam.y));
  }

  return { create, update };
})();
