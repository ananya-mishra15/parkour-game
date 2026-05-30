(function () {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const VIEW_W = canvas.width;
  const VIEW_H = canvas.height;

  const levelNameEl = document.getElementById('level-name');
  const hudEl = document.getElementById('hud');
  const hintEl = document.getElementById('hint');
  const touchCtrl = document.getElementById('touch-controls');

  const STATE = { TITLE: 'title', LEVEL_SELECT: 'levelselect', PLAYING: 'playing', DEAD: 'dead', WON: 'won', COMPLETE: 'complete', PAUSED: 'paused' };
  const PAUSE_OPTIONS = ['Resume', 'Restart Level', 'Level Select', 'Title Screen'];
  let pauseSelection = 0;
  let titleSelection = 0;
  let lsSelected = 0;
  let lsPage = 0;
  const LS_COLS = 10;
  const LS_ROWS = 5;
  const LS_PER_PAGE = LS_COLS * LS_ROWS;

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
  let state = hashLevel >= 0 ? STATE.PLAYING : STATE.TITLE;
  let stateTimer = 0;
  let totalTime = 0;
  let levelStartTime = 0;
  // Checkpoint respawn point for the current level (cleared on level progression).
  let respawnPoint = null;
  let wonStars = null;
  let wonMedal = null;
  let wonElapsed = 0;
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
        if (Math.abs(cp.x + cp.w / 2 - respawnPoint.flagX) < 4 &&
            Math.abs(cp.y - respawnPoint.flagY) < 4) {
          cp.activated = true;
        }
      }
    }
    const spawn = respawnPoint ? { x: respawnPoint.x, y: respawnPoint.y } : level.spawn;
    player = Game.Player.create(spawn);
    camera = Game.Camera.create();
    Game.Particles.clear();
    Game.Ghost.startRecording();
    const savedGhost = Game.Ghost.loadSavedGhost(i);
    if (savedGhost) Game.Ghost.loadGhost(savedGhost);
    else Game.Ghost.clearGhost();
    state = STATE.PLAYING;
    stateTimer = 0;
    levelStartTime = totalTime;
    levelNameEl.textContent = level.name;
  }

  function restartLevel() {
    loadLevel(levelIndex);
  }

  function setHudVisible(visible) {
    const d = visible ? '' : 'none';
    if (hudEl) hudEl.style.display = visible ? '' : 'none';
    if (touchCtrl && Game.Touch && Game.Touch.isTouch) touchCtrl.style.display = visible ? '' : 'none';
  }

  function enterTitle() {
    state = STATE.TITLE;
    titleSelection = 0;
    setHudVisible(false);
  }

  function enterLevelSelect() {
    state = STATE.LEVEL_SELECT;
    lsSelected = Math.min(Game.Save.get().highestLevel, Game.LEVELS.length - 1);
    lsPage = Math.floor(lsSelected / LS_PER_PAGE);
    setHudVisible(false);
  }

  function enterPlaying(idx) {
    loadLevel(idx);
    setHudVisible(true);
  }

  if (state === STATE.TITLE) setHudVisible(false);

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (VIEW_W / rect.width);
    const cy = (e.clientY - rect.top) * (VIEW_H / rect.height);

    if (state === STATE.TITLE) {
      // Play button area
      if (cy > 212 && cy < 258) {
        titleSelection = 0;
        Game.Input.press('confirm');
      } else if (cy > 272 && cy < 318) {
        titleSelection = 1;
        Game.Input.press('confirm');
      }
    } else if (state === STATE.LEVEL_SELECT) {
      const gridLeft = 40;
      const gridTop = 56;
      const cellW = (VIEW_W - 80) / LS_COLS;
      const cellH = 78;
      const col = Math.floor((cx - gridLeft) / cellW);
      const row = Math.floor((cy - gridTop) / cellH);
      if (col >= 0 && col < LS_COLS && row >= 0 && row < LS_ROWS) {
        const idx = lsPage * LS_PER_PAGE + row * LS_COLS + col;
        if (idx < Game.LEVELS.length) {
          if (idx === lsSelected && idx <= Game.Save.get().highestLevel) {
            Game.Input.press('confirm');
          } else {
            lsSelected = idx;
          }
        }
      }
    } else if (state === STATE.PAUSED) {
      const startY = VIEW_H / 2 - 20;
      const itemH = 44;
      for (let i = 0; i < PAUSE_OPTIONS.length; i++) {
        const y = startY + i * itemH;
        if (cy > y - 22 && cy < y + 14) {
          pauseSelection = i;
          Game.Input.press('confirm');
          break;
        }
      }
    }
  });

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
    if (frameDt > 0.1) frameDt = 0.1;
    last = now;
    totalTime += frameDt;
    if (state === STATE.PAUSED || state === STATE.TITLE || state === STATE.LEVEL_SELECT) {
      step(FIXED_DT);
    } else {
      acc += frameDt;
      while (acc >= FIXED_DT) {
        step(FIXED_DT);
        acc -= FIXED_DT;
      }
    }

    render();
    requestAnimationFrame(frame);
  }

  function step(dt) {
    Game.Input.beginFrame();

    if (state === STATE.TITLE) {
      if (Game.Input.wasPressed('jump')) {
        titleSelection = Math.max(0, titleSelection - 1);
      } else if (Game.Input.wasPressed('slide')) {
        titleSelection = Math.min(1, titleSelection + 1);
      } else if (Game.Input.wasPressed('confirm') || Game.Input.wasPressed('restart')) {
        if (titleSelection === 0) {
          enterPlaying(Math.min(Game.Save.get().highestLevel, Game.LEVELS.length - 1));
        } else {
          enterLevelSelect();
        }
      } else if (Game.Input.wasPressed('levelselect')) {
        enterLevelSelect();
      }
      Game.Input.endFrame();
      return;
    }

    if (state === STATE.LEVEL_SELECT) {
      const highest = Game.Save.get().highestLevel;
      if (Game.Input.wasPressed('pause') || Game.Input.wasPressed('back')) {
        enterTitle();
      } else if (Game.Input.wasPressed('left')) {
        if (lsSelected % LS_COLS > 0) lsSelected--;
      } else if (Game.Input.wasPressed('right')) {
        if (lsSelected % LS_COLS < LS_COLS - 1 && lsSelected + 1 < Game.LEVELS.length) lsSelected++;
      } else if (Game.Input.wasPressed('jump')) {
        if (lsSelected - LS_COLS >= 0) lsSelected -= LS_COLS;
      } else if (Game.Input.wasPressed('slide')) {
        if (lsSelected + LS_COLS < Game.LEVELS.length) lsSelected += LS_COLS;
      } else if (Game.Input.wasPressed('confirm') || Game.Input.wasPressed('restart')) {
        if (lsSelected <= highest) {
          enterPlaying(lsSelected);
        }
      }
      // page change keys
      if (Game.Input.isDown('left') && Game.Input.wasPressed('left') && lsSelected < lsPage * LS_PER_PAGE) {
        lsPage = Math.max(0, lsPage - 1);
      }
      // auto-update page based on selection
      lsPage = Math.floor(lsSelected / LS_PER_PAGE);
      Game.Input.endFrame();
      return;
    }

    if (state === STATE.PAUSED) {
      if (Game.Input.wasPressed('pause') || Game.Input.wasPressed('back')) {
        state = STATE.PLAYING;
      } else if (Game.Input.wasPressed('jump') || Game.Input.wasPressed('slide')) {
        if (Game.Input.wasPressed('jump')) {
          pauseSelection = Math.max(0, pauseSelection - 1);
        }
        if (Game.Input.wasPressed('slide')) {
          pauseSelection = Math.min(PAUSE_OPTIONS.length - 1, pauseSelection + 1);
        }
      } else if (Game.Input.wasPressed('confirm') || Game.Input.wasPressed('restart')) {
        if (pauseSelection === 0) {
          state = STATE.PLAYING;
        } else if (pauseSelection === 1) {
          state = STATE.PLAYING;
          restartLevel();
        } else if (pauseSelection === 2) {
          enterLevelSelect();
        } else if (pauseSelection === 3) {
          enterTitle();
        }
      }
      Game.Input.endFrame();
      return;
    }

    if (Game.Input.wasPressed('ghost') && state === STATE.PLAYING) {
      Game.Ghost.toggle();
    }

    if (Game.Input.wasPressed('pause') && state === STATE.PLAYING) {
      state = STATE.PAUSED;
      pauseSelection = 0;
      Game.Input.endFrame();
      return;
    }

    if (state === STATE.COMPLETE) {
      if (Game.Input.wasPressed('restart')) {
        enterPlaying(0);
      } else if (Game.Input.wasPressed('pause') || Game.Input.wasPressed('back')) {
        enterTitle();
      }
      Game.Input.endFrame();
      return;
    }

    if (Game.Input.wasPressed('restart')) {
      restartLevel();
      Game.Input.endFrame();
      return;
    }

    if (state === STATE.PLAYING) {
      Game.Level.update(level, dt);
      Game.Player.update(player, level, dt);
      Game.Ghost.recordFrame(player);
      Game.Ghost.advanceFrame();

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

      // Particle event flags
      if (player.justLanded) {
        Game.Particles.landingDust(player.x + player.w / 2, player.y + player.h);
        player.justLanded = false;
      }
      if (player.justCollectedCoin) {
        Game.Particles.coinSparkle(player.justCollectedCoin.x, player.justCollectedCoin.y);
        player.justCollectedCoin = null;
      }
      if (player.justCheckpoint) {
        Game.Particles.checkpointGlow(player.justCheckpoint.x, player.justCheckpoint.y);
        player.justCheckpoint = null;
      }
      if (player.justCannon) {
        Game.ScreenShake.trigger(0.2, 4);
        player.justCannon = false;
      }
      if (Math.abs(player.vx) > 270 && player.onGround) {
        Game.Particles.speedLine(player.x + (player.facing > 0 ? 0 : player.w), player.y + player.h / 2, player.facing);
      }

      if (player.dead) {
        state = STATE.DEAD;
        stateTimer = 0;
        Game.Particles.deathPop(player.x + player.w / 2, player.y + player.h / 2);
        Game.ScreenShake.trigger(0.3, 6);
        Game.Ghost.cancelRecording();
      } else if (player.reachedGoal) {
        state = STATE.WON;
        stateTimer = 0;
        wonElapsed = totalTime - levelStartTime;
        const ghostResult = Game.Ghost.stopRecording(levelIndex, wonElapsed);
        const prevBest = Game.Save.get().bestTimes[levelIndex];
        if (prevBest == null || wonElapsed < prevBest) {
          Game.Ghost.saveGhost(levelIndex, ghostResult);
        }
        const allCoins = level.coins.length === 0 || level.coins.every((c) => c.collected);
        const sr = Game.Stars.calculate(levelIndex, allCoins, wonElapsed);
        wonStars = sr.stars;
        wonMedal = Game.Stars.getMedal(levelIndex, wonElapsed);
      }
    } else {
      stateTimer += dt;
      if (state === STATE.DEAD && stateTimer > 0.8) {
        restartLevel();
      } else if (state === STATE.WON && stateTimer > 1.2) {
        const elapsed = totalTime - levelStartTime - stateTimer;
        const collected = level.coins.map((c) => c.collected);
        Game.Save.recordWin(levelIndex, elapsed, collected);
        const allCoins = level.coins.length === 0 || level.coins.every((c) => c.collected);
        const starResult = Game.Stars.calculate(levelIndex, allCoins, elapsed);
        Game.Save.recordStars(levelIndex, starResult.stars);
        if (levelIndex + 1 < Game.LEVELS.length) {
          loadLevel(levelIndex + 1);
        } else {
          state = STATE.COMPLETE;
        }
      }
    }

    Game.Camera.update(camera, player, level, VIEW_W, VIEW_H, dt);
    Game.Particles.update(dt);
    Game.ScreenShake.update(dt);
    Game.Input.endFrame();
  }

  function render() {
    if (state === STATE.TITLE) {
      Game.Renderer.drawTitleScreen(ctx, VIEW_W, VIEW_H, totalTime, titleSelection);
      return;
    }
    if (state === STATE.LEVEL_SELECT) {
      Game.Renderer.drawLevelSelect(ctx, VIEW_W, VIEW_H, Game.LEVELS, Game.Save.get(), lsSelected, lsPage, Game.LEVELS.length);
      return;
    }

    const savedCamX = camera.x, savedCamY = camera.y;
    Game.ScreenShake.apply(camera);

    Game.Renderer.drawSky(ctx, VIEW_W, VIEW_H, level.sky);
    Game.Renderer.drawParallaxTrees(ctx, camera, VIEW_W, VIEW_H);

    const R = Game.Renderer;
    for (const t of level.tiles) { if (R.isVisible(t, camera, VIEW_W, VIEW_H)) R.drawTile(ctx, t, camera, totalTime); }
    for (const p of level.platforms) { if (R.isVisible(p, camera, VIEW_W, VIEW_H)) R.drawTile(ctx, p, camera, totalTime); }
    if (level.climbs) for (const c of level.climbs) { if (R.isVisible(c, camera, VIEW_W, VIEW_H)) R.drawClimb(ctx, c, camera); }
    if (level.ziplines) for (const z of level.ziplines) R.drawZipline(ctx, z, camera);
    if (level.ropes) for (const r of level.ropes) R.drawRope(ctx, r, camera);
    if (level.cannons) for (const c of level.cannons) { if (R.isVisible(c, camera, VIEW_W, VIEW_H)) R.drawCannon(ctx, c, camera); }
    if (level.checkpoints) for (const cp of level.checkpoints) { if (R.isVisible(cp, camera, VIEW_W, VIEW_H)) R.drawCheckpoint(ctx, cp, camera, totalTime); }
    for (const h of level.hazards) { if (R.isVisible(h, camera, VIEW_W, VIEW_H)) R.drawHazard(ctx, h, camera); }
    if (level.coins) {
      for (const c of level.coins) {
        if (!c.collected && R.isVisible(c, camera, VIEW_W, VIEW_H)) R.drawCoin(ctx, c, camera, totalTime);
      }
    }
    Game.Renderer.drawGoal(ctx, level.goal, camera, totalTime);
    const ghostPos = Game.Ghost.getPosition();
    if (ghostPos) Game.Renderer.drawGhost(ctx, ghostPos, camera);
    Game.Renderer.drawPlayer(ctx, player, camera, totalTime);
    Game.Renderer.drawParticles(ctx, Game.Particles.getAll(), camera);

    camera.x = savedCamX;
    camera.y = savedCamY;

    let hudOffset = 0;
    const liveElapsed = state === STATE.WON ? wonElapsed : totalTime - levelStartTime;
    Game.Renderer.drawTimer(ctx, liveElapsed, hudOffset);
    hudOffset += 32;
    if (level.coins && level.coins.length) {
      let got = 0;
      for (const c of level.coins) if (c.collected) got++;
      Game.Renderer.drawCoinHud(ctx, got, level.coins.length, hudOffset);
      hudOffset += 32;
    }
    const best = Game.Save.get().bestTimes[levelIndex];
    if (best != null) {
      Game.Renderer.drawBestTime(ctx, best, hudOffset);
    }

    const totalStars = Game.Stars.getTotalStars(Game.Save.get());
    Game.Renderer.drawStarHud(ctx, totalStars, Game.LEVELS.length * 3);
    Game.Renderer.drawGhostHud(ctx, Game.Ghost.isEnabled());

    if (state === STATE.PAUSED) {
      Game.Renderer.drawPauseMenu(ctx, VIEW_W, VIEW_H, pauseSelection, PAUSE_OPTIONS);
    } else if (state === STATE.DEAD) {
      Game.Renderer.drawOverlay(ctx, VIEW_W, VIEW_H, 'Ouch!', 'restarting…');
    } else if (state === STATE.WON) {
      Game.Renderer.drawOverlay(ctx, VIEW_W, VIEW_H, 'Level Clear!', 'next…', wonStars, wonMedal, wonElapsed);
    } else if (state === STATE.COMPLETE) {
      Game.Renderer.drawOverlay(ctx, VIEW_W, VIEW_H, 'You Win!', 'press R to play again from level 1');
    }
  }

  requestAnimationFrame((t) => { last = t; frame(t); });
})();
