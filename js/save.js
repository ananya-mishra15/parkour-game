window.Game = window.Game || {};

Game.Save = (function () {
  const KEY = 'parkour_game_save_v1';
  const empty = () => ({ highestLevel: 0, coins: {}, bestTimes: {}, stars: {} });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
    } catch (_) { return empty(); }
  }

  let state = load();

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  function get() { return state; }

  function recordWin(levelIndex, elapsedSec, collectedBools) {
    state.highestLevel = Math.max(state.highestLevel, levelIndex + 1);
    const prev = state.bestTimes[levelIndex];
    if (prev == null || elapsedSec < prev) {
      state.bestTimes[levelIndex] = +elapsedSec.toFixed(2);
    }
    // Merge collected coins — never un-collect what was previously saved.
    const old = state.coins[levelIndex] || [];
    state.coins[levelIndex] = collectedBools.map((c, i) => c || !!old[i]);
    persist();
  }

  function reset() {
    state = empty();
    persist();
  }

  function recordStars(levelIndex, newStars) {
    const old = state.stars[levelIndex] || [false, false, false];
    state.stars[levelIndex] = newStars.map((s, i) => s || !!old[i]);
    persist();
  }

  return { get, recordWin, recordStars, reset };
})();
