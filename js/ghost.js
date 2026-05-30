window.Game = window.Game || {};

Game.Ghost = (function () {
  const SAMPLE_INTERVAL = 4;

  let recording = [];
  let frameCounter = 0;
  let isRecording = false;

  let ghostData = null;
  let ghostFrame = 0;
  let playbackCounter = 0;
  let enabled = true;

  function startRecording() {
    recording = [];
    frameCounter = 0;
    isRecording = true;
  }

  function recordFrame(player) {
    if (!isRecording) return;
    frameCounter++;
    if (frameCounter % SAMPLE_INTERVAL !== 0) return;
    recording.push([
      Math.round(player.x),
      Math.round(player.y),
      player.facing,
      player.sliding ? 1 : 0,
    ]);
  }

  function stopRecording(levelIndex, elapsedTime) {
    isRecording = false;
    return {
      levelIndex: levelIndex,
      frames: recording,
      time: +elapsedTime.toFixed(2),
    };
  }

  function cancelRecording() {
    isRecording = false;
    recording = [];
  }

  function loadGhost(data) {
    ghostData = data;
    ghostFrame = 0;
    playbackCounter = 0;
  }

  function clearGhost() {
    ghostData = null;
    ghostFrame = 0;
  }

  function getPosition() {
    if (!ghostData || !enabled || !ghostData.frames.length) return null;
    const idx = Math.min(ghostFrame, ghostData.frames.length - 1);
    const f = ghostData.frames[idx];
    return { x: f[0], y: f[1], facing: f[2], sliding: f[3] };
  }

  function advanceFrame() {
    if (!ghostData || !enabled) return;
    playbackCounter++;
    if (playbackCounter % SAMPLE_INTERVAL === 0) {
      ghostFrame++;
    }
  }

  function toggle() { enabled = !enabled; }
  function isEnabled() { return enabled; }

  // --- Storage with delta compression ---
  function compress(ghost) {
    const frames = ghost.frames;
    if (!frames.length) return ghost;
    const deltas = [frames[0]];
    for (let i = 1; i < frames.length; i++) {
      deltas.push([
        frames[i][0] - frames[i - 1][0],
        frames[i][1] - frames[i - 1][1],
        frames[i][2],
        frames[i][3],
      ]);
    }
    return { levelIndex: ghost.levelIndex, frames: deltas, time: ghost.time, compressed: true };
  }

  function decompress(data) {
    if (!data || !data.compressed) return data;
    const deltas = data.frames;
    if (!deltas.length) return data;
    const frames = [deltas[0]];
    for (let i = 1; i < deltas.length; i++) {
      frames.push([
        frames[i - 1][0] + deltas[i][0],
        frames[i - 1][1] + deltas[i][1],
        deltas[i][2],
        deltas[i][3],
      ]);
    }
    return { levelIndex: data.levelIndex, frames: frames, time: data.time };
  }

  function saveGhost(levelIndex, ghostObj) {
    const key = 'parkour_ghost_v1_' + levelIndex;
    try {
      localStorage.setItem(key, JSON.stringify(compress(ghostObj)));
    } catch (_) {}
  }

  function loadSavedGhost(levelIndex) {
    const key = 'parkour_ghost_v1_' + levelIndex;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return decompress(JSON.parse(raw));
    } catch (_) { return null; }
  }

  return {
    startRecording, recordFrame, stopRecording, cancelRecording,
    loadGhost, clearGhost, getPosition, advanceFrame,
    toggle, isEnabled,
    saveGhost, loadSavedGhost,
  };
})();
