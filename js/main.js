(function () {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const VIEW_W = canvas.width;
  const VIEW_H = canvas.height;

  const levelNameEl = document.getElementById('level-name');

  const STATE = { PLAYING: 'playing', DEAD: 'dead', WON: 'won', COMPLETE: 'complete' };

  // Resume at the highest level the player has cleared (clamped to last existing level
  // so a save from a longer build can't crash this one). `#level=N` in the URL
  // overrides for quick playtesting (1-indexed to match the in-game numbering).
  const hashMatch = /level=(\d+)/.exec(location.hash);
  const hashLevel = hashMatch ? parseInt(hashMatch[1], 10) - 1 : -1;
  let levelIndex = (hashLevel >= 0 && hashLevel < Game.LEVELS.length)
    ? hashLevel
    : Math.min(Game.Save.get().highestLevel, Game.LEVELS.length - 1);
  let level = Game.Level.load(levelIndex);
  applySavedCoins(level, levelIndex);
  let player = Game.Player.create(level.spawn);
  let camera = Game.Camera.create();
  let state = STATE.PLAYING;
  let stateTimer = 0;
  let totalTime = 0;
  let levelStartTime = 0;
  // Checkpoint respawn point for the current level (cleared on level progression).
  let respawnPoint = null;
  levelNameEl.textContent = level.name;

  function applySavedCoins(lvl, i) {
    const saved = Game.Save.get().coins[i] || [];
    for (let k = 0; k < lvl.coins.length; k++) {
      if (saved[k]) lvl.coins[k].collected = true;
    }
  }

  function loadLevel(i) {
    const sameLevel = (i === levelIndex);
    levelIndex = i;
    level = Game.Level.load(i);
    if (!level) {
      state = STATE.COMPLETE;
      return;
    }
    applySavedCoins(level, i);
    // Same-level reload (death): keep checkpoint and re-mark the matching flag.
    // New level: clear respawn point so we start at the level's spawn.
    if (!sameLevel) respawnPoint = null;
    if (respawnPoint && level.checkpoints) {
      for (const cp of level.checkpoints) {
        if (Math.abs(cp.x + cp.w / 2 - respawnPoint.flagX) < 1 &&
            Math.abs(cp.y - respawnPoint.flagY) < 1) {
          cp.activated = true;
        }
      }
    }
    const spawn = respawnPoint ? { x: respawnPoint.x, y: respawnPoint.y } : level.spawn;
    player = Game.Player.create(spawn);
    camera = Game.Camera.create();
    state = STATE.PLAYING;
    stateTimer = 0;
    levelStartTime = totalTime;
    levelNameEl.textContent = level.name;
  }

  function restartLevel() {
    loadLevel(levelIndex);
  }

  // Shift+R clears the save and restarts at level 1. Handled outside the Input layer
  // because that layer doesn't expose modifier state.
  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.code === 'KeyR') {
      Game.Save.reset();
      loadLevel(0);
    }
  });

  // Fixed-timestep game loop
  const FIXED_DT = 1 / 120;
  let acc = 0;
  let last = performance.now();

  function frame(now) {
    let frameDt = (now - last) / 1000;
    if (frameDt > 0.1) frameDt = 0.1; // clamp huge spikes (tab was backgrounded)
    last = now;
    acc += frameDt;
    totalTime += frameDt;

    while (acc >= FIXED_DT) {
      step(FIXED_DT);
      acc -= FIXED_DT;
    }

    render();
    requestAnimationFrame(frame);
  }

  function step(dt) {
    Game.Input.beginFrame();

    if (Game.Input.wasPressed('restart')) {
      if (state === STATE.COMPLETE) {
        loadLevel(0);
      } else {
        restartLevel();
      }
      Game.Input.endFrame();
      return;
    }

    if (state === STATE.PLAYING) {
      Game.Level.update(level, dt);
      Game.Player.update(player, level, dt);

      // Promote any freshly-activated checkpoint to the current respawn point.
      if (level.checkpoints) {
        for (const cp of level.checkpoints) {
          if (cp.activated && (!respawnPoint || respawnPoint.flagX !== cp.x + cp.w / 2 || respawnPoint.flagY !== cp.y)) {
            respawnPoint = {
              x: cp.x + cp.w / 2 - player.w / 2,
              y: cp.y + cp.h - player.h,
              flagX: cp.x + cp.w / 2,
              flagY: cp.y,
            };
          }
        }
      }

      if (player.dead) {
        state = STATE.DEAD;
        stateTimer = 0;
      } else if (player.reachedGoal) {
        state = STATE.WON;
        stateTimer = 0;
      }
    } else {
      stateTimer += dt;
      if (state === STATE.DEAD && stateTimer > 0.8) {
        restartLevel();
      } else if (state === STATE.WON && stateTimer > 1.2) {
        const elapsed = totalTime - levelStartTime - stateTimer;
        const collected = level.coins.map((c) => c.collected);
        Game.Save.recordWin(levelIndex, elapsed, collected);
        if (levelIndex + 1 < Game.LEVELS.length) {
          loadLevel(levelIndex + 1);
        } else {
          state = STATE.COMPLETE;
        }
      }
    }

    Game.Camera.update(camera, player, level, VIEW_W, VIEW_H, dt);
    Game.Input.endFrame();
  }

  function render() {
    Game.Renderer.drawSky(ctx, VIEW_W, VIEW_H, level.sky);
    Game.Renderer.drawParallaxTrees(ctx, camera, VIEW_W, VIEW_H);

    for (const t of level.tiles) Game.Renderer.drawTile(ctx, t, camera, totalTime);
    for (const p of level.platforms) Game.Renderer.drawTile(ctx, p, camera, totalTime);
    if (level.climbs) for (const c of level.climbs) Game.Renderer.drawClimb(ctx, c, camera);
    if (level.ziplines) for (const z of level.ziplines) Game.Renderer.drawZipline(ctx, z, camera);
    if (level.ropes) for (const r of level.ropes) Game.Renderer.drawRope(ctx, r, camera);
    if (level.cannons) for (const c of level.cannons) Game.Renderer.drawCannon(ctx, c, camera);
    if (level.checkpoints) for (const cp of level.checkpoints) Game.Renderer.drawCheckpoint(ctx, cp, camera, totalTime);
    for (const h of level.hazards) Game.Renderer.drawHazard(ctx, h, camera);
    if (level.coins) {
      for (const c of level.coins) {
        if (!c.collected) Game.Renderer.drawCoin(ctx, c, camera, totalTime);
      }
    }
    Game.Renderer.drawGoal(ctx, level.goal, camera, totalTime);
    Game.Renderer.drawPlayer(ctx, player, camera, totalTime);

    let hudOffset = 0;
    if (level.coins && level.coins.length) {
      let got = 0;
      for (const c of level.coins) if (c.collected) got++;
      Game.Renderer.drawCoinHud(ctx, got, level.coins.length);
      hudOffset += 32;
    }
    const best = Game.Save.get().bestTimes[levelIndex];
    if (best != null) {
      Game.Renderer.drawBestTime(ctx, best, hudOffset);
    }

    if (state === STATE.DEAD) {
      Game.Renderer.drawOverlay(ctx, VIEW_W, VIEW_H, 'Ouch!', 'restarting…');
    } else if (state === STATE.WON) {
      Game.Renderer.drawOverlay(ctx, VIEW_W, VIEW_H, 'Level Clear!', 'next…');
    } else if (state === STATE.COMPLETE) {
      Game.Renderer.drawOverlay(ctx, VIEW_W, VIEW_H, 'You Win!', 'press R to play again from level 1');
    }
  }

  requestAnimationFrame((t) => { last = t; frame(t); });
})();
