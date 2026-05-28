window.Game = window.Game || {};

Game.Touch = (function () {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return { isTouch: false };

  const buttons = [
    { id: 'touch-left',  action: 'left'  },
    { id: 'touch-right', action: 'right' },
    { id: 'touch-jump',  action: 'jump'  },
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

    for (const btn of buttons) {
      const el = document.getElementById(btn.id);
      if (!el) continue;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        for (const t of e.changedTouches) {
          activeTouches[t.identifier] = btn.action;
        }
        Game.Input.press(btn.action);
      }, { passive: false });

      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        for (const t of e.changedTouches) {
          delete activeTouches[t.identifier];
        }
        if (!actionStillHeld(btn.action)) {
          Game.Input.release(btn.action);
        }
      }, { passive: false });

      el.addEventListener('touchcancel', (e) => {
        for (const t of e.changedTouches) {
          delete activeTouches[t.identifier];
        }
        if (!actionStillHeld(btn.action)) {
          Game.Input.release(btn.action);
        }
      });
    }

    const canvas = document.getElementById('game');
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      for (const t of e.changedTouches) {
        const x = t.clientX - rect.left;
        if (x > rect.width * 0.4) {
          swipeTracking[t.identifier] = { startY: t.clientY, startX: t.clientX };
        }
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        const sw = swipeTracking[t.identifier];
        if (!sw || sw.triggered) continue;
        const dy = t.clientY - sw.startY;
        if (dy > SWIPE_THRESHOLD) {
          sw.triggered = true;
          Game.Input.press('slide');
          Game.Input.setHeld('slide', true);
          setTimeout(() => Game.Input.release('slide'), 450);
        }
      }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        delete swipeTracking[t.identifier];
      }
    }, { passive: false });

    canvas.addEventListener('touchcancel', (e) => {
      for (const t of e.changedTouches) {
        delete swipeTracking[t.identifier];
      }
    });

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
      hint.textContent = 'L / R move · Jump button · Swipe ↓ slide · ↺ restart';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { isTouch: true };
})();
