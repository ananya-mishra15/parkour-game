window.Game = window.Game || {};

Game.Input = (function () {
  const held = {};
  const pressedThisFrame = {};
  const pressedQueue = {};

  const KEY_MAP = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'jump',
    KeyA: 'left',
    KeyD: 'right',
    KeyW: 'jump',
    Space: 'jump',
    ShiftLeft: 'slide',
    ShiftRight: 'slide',
    KeyS: 'slide',
    ArrowDown: 'slide',
    KeyR: 'restart',
  };

  window.addEventListener('keydown', (e) => {
    const action = KEY_MAP[e.code];
    if (!action) return;
    if (!held[action]) pressedQueue[action] = true;
    held[action] = true;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    const action = KEY_MAP[e.code];
    if (!action) return;
    held[action] = false;
  });

  // Lose focus → release everything so the player doesn't run into a wall forever
  window.addEventListener('blur', () => {
    for (const k of Object.keys(held)) held[k] = false;
  });

  function beginFrame() {
    Object.assign(pressedThisFrame, pressedQueue);
    for (const k of Object.keys(pressedQueue)) delete pressedQueue[k];
  }

  function endFrame() {
    for (const k of Object.keys(pressedThisFrame)) delete pressedThisFrame[k];
  }

  return {
    beginFrame,
    endFrame,
    isDown: (action) => !!held[action],
    wasPressed: (action) => !!pressedThisFrame[action],
    setHeld: (action, state) => { held[action] = state; },
    press: (action) => { pressedQueue[action] = true; held[action] = true; },
    release: (action) => { held[action] = false; },
  };
})();
