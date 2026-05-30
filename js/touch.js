window.Game = window.Game || {};

Game.Touch = (function () {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return { isTouch: false };

  const zones = [
    { id: 'touch-left',  action: 'left'  },
    { id: 'touch-right', action: 'right' },
    { id: 'touch-jump',  action: 'jump'  },
    { id: 'touch-pause', action: 'pause' },
    { id: 'touch-restart', action: 'restart' },
  ];

  const activeTouches = {};
  const SWIPE_THRESHOLD = 30;
  const swipeTracking = {};

  function init() {
    document.body.classList.add('touch-device');

    const container = document.getElementById('touch-controls');
    if (!container) return;
    container.style.display = '';

    for (const zone of zones) {
      const el = document.getElementById(zone.id);
      if (!el) continue;

      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        el.classList.add('pressed');
        for (const t of e.changedTouches) {
          activeTouches[t.identifier] = zone.action;
          if (zone.action === 'jump') {
            const rect = el.getBoundingClientRect();
            const relY = (t.clientY - rect.top) / rect.height;
            swipeTracking[t.identifier] = { startY: t.clientY, lowerZone: relY > 0.6 };
          }
        }
        Game.Input.press(zone.action);
      }, { passive: false });

      el.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (zone.action !== 'jump') return;
        for (const t of e.changedTouches) {
          const sw = swipeTracking[t.identifier];
          if (!sw || sw.triggered || !sw.lowerZone) continue;
          if (t.clientY - sw.startY > SWIPE_THRESHOLD) {
            sw.triggered = true;
            Game.Input.press('slide');
            Game.Input.setHeld('slide', true);
            setTimeout(() => Game.Input.release('slide'), 450);
          }
        }
      }, { passive: false });

      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        for (const t of e.changedTouches) {
          delete activeTouches[t.identifier];
          delete swipeTracking[t.identifier];
        }
        if (!actionStillHeld(zone.action)) {
          el.classList.remove('pressed');
          Game.Input.release(zone.action);
        }
      }, { passive: false });

      el.addEventListener('touchcancel', (e) => {
        for (const t of e.changedTouches) {
          delete activeTouches[t.identifier];
          delete swipeTracking[t.identifier];
        }
        if (!actionStillHeld(zone.action)) {
          el.classList.remove('pressed');
          Game.Input.release(zone.action);
        }
      });
    }

    const canvas = document.getElementById('game');
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });

    try {
      screen.orientation.lock('landscape').catch(() => {});
    } catch (_) {}

    updateHint();
  }

  function actionStillHeld(action) {
    for (const id in activeTouches) {
      if (activeTouches[id] === action) return true;
    }
    return false;
  }

  function updateHint() {
    const hint = document.getElementById('hint');
    if (hint) {
      hint.textContent = 'L / R move · Jump tap · Swipe ↓ slide · ↺ restart';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { isTouch: true };
})();
