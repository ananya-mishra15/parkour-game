window.Game = window.Game || {};

// Level format — kept as a plain JS array so the page works without a server.
// Coordinates: +x right, +y down. Canvas is 960x540. Levels can be wider than the screen.
// Add a level: append to this array. Adding new entity types (ziplines, ropes,
// collectibles, enemies) means adding a new array key here + a renderer + a
// collision handler — the loader ignores unknown keys, so old levels keep working.
Game.LEVELS = [
  {
    name: '1 · First Steps',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2300, y: 380 },
    sky: '#9ad6ff',
    tiles: [
      { x: 0,    y: 480, w: 600, h: 60, type: 'ground' },
      { x: 720,  y: 480, w: 360, h: 60, type: 'ground' },
      { x: 1200, y: 480, w: 280, h: 60, type: 'ground' },
      { x: 1700, y: 480, w: 700, h: 60, type: 'ground' },

      // a couple of low stepping branches
      { x: 1480, y: 420, w: 90,  h: 18, type: 'branch' },
      { x: 1580, y: 360, w: 90,  h: 18, type: 'branch' },
    ],
    hazards: [],
    platforms: [],
  },

  {
    name: '2 · Up the Canopy',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2280, y: 80 },
    sky: '#7fc7ff',
    tiles: [
      { x: 0,    y: 480, w: 400, h: 60, type: 'ground' },
      { x: 560,  y: 480, w: 480, h: 60, type: 'ground' },

      // low ceiling — must slide under
      { x: 700,  y: 360, w: 280, h: 30, type: 'branch' },

      // landing pad after the slide
      { x: 1100, y: 480, w: 260, h: 60, type: 'ground' },

      // wall-jump shaft (two walls + a top platform)
      { x: 1500, y: 100, w: 40,  h: 420, type: 'wall' },
      { x: 1760, y: 100, w: 40,  h: 380, type: 'wall' },

      // top finish platform
      { x: 1540, y: 100, w: 220, h: 20, type: 'branch' },
      { x: 1800, y: 120, w: 600, h: 20, type: 'branch' },
    ],
    hazards: [
      // spike pit between first two grounds
      { x: 400, y: 510, w: 160, h: 30, type: 'spikes' },
      // spikes at bottom of wall-jump shaft so falling kills
      { x: 1540, y: 510, w: 220, h: 30, type: 'spikes' },
    ],
    platforms: [],
  },

  {
    name: '3 · Moving Bridges',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2480, y: 380 },
    sky: '#a8e3ff',
    tiles: [
      { x: 0,    y: 480, w: 360, h: 60, type: 'ground' },
      { x: 2300, y: 480, w: 300, h: 60, type: 'ground' },

      // wall-jump finish shaft
      { x: 2160, y: 200, w: 40,  h: 320, type: 'wall' },
      { x: 2300, y: 200, w: 40,  h: 280, type: 'wall' },
    ],
    hazards: [
      // huge spike pit under the moving platforms
      { x: 360, y: 510, w: 1800, h: 30, type: 'spikes' },
      // spikes at base of wall shaft
      { x: 2200, y: 510, w: 100,  h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 440,  y: 440, w: 140, h: 18, move: { axis: 'x', range: 110, speed: 50 } },
      // rest block between plats 1 and 2
      { x: 620,  y: 440, w: 90,  h: 18 },
      { x: 720,  y: 400, w: 140, h: 18, move: { axis: 'y', range: 90,  speed: 45 } },
      // rest block between plats 2 and 3
      { x: 880,  y: 440, w: 90,  h: 18 },
      { x: 980,  y: 440, w: 140, h: 18, move: { axis: 'x', range: 130, speed: 60 } },
      { x: 1130, y: 430, w: 120, h: 18 }, // widened rest block
      { x: 1280, y: 380, w: 140, h: 18, move: { axis: 'y', range: 100, speed: 50 } },
      // rest block between plats 4 and 5
      { x: 1440, y: 430, w: 100, h: 18 },
      { x: 1560, y: 440, w: 140, h: 18, move: { axis: 'x', range: 140, speed: 55 } },
      // rest block between plats 5 and 6
      { x: 1740, y: 430, w: 100, h: 18 },
      { x: 1860, y: 380, w: 140, h: 18, move: { axis: 'y', range: 90,  speed: 50 } },
      // rest block before the wall-jump shaft
      { x: 2020, y: 420, w: 120, h: 18 },
    ],
  },

  {
    name: '4 · Spring Garden',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2300, y: 380 },
    sky: '#bfe9c0',
    tiles: [
      // ground 1 — split around bouncy at x=380..460
      { x: 0,    y: 480, w: 380, h: 60, type: 'ground' },
      { x: 460,  y: 480, w: 140, h: 60, type: 'ground' },
      // small island between two spike pits — split around bouncy at x=740..800
      { x: 720,  y: 480, w: 20,  h: 60, type: 'ground' },
      { x: 800,  y: 480, w: 20,  h: 60, type: 'ground' },
      // big mid section with the slide-under — split around bouncy at x=1440..1520
      { x: 940,  y: 480, w: 500, h: 60, type: 'ground' },
      { x: 1520, y: 480, w: 40,  h: 60, type: 'ground' },
      { x: 1100, y: 420, w: 200, h: 18, type: 'branch' }, // forces slide
      // final stretch
      { x: 1760, y: 480, w: 640, h: 60, type: 'ground' },
      // bouncy "posts" — flush with ground top so player walks onto them and is launched
      { x: 380,  y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 740,  y: 480, w: 60,  h: 60, type: 'bouncy' },
      { x: 1440, y: 480, w: 80,  h: 60, type: 'bouncy' },
    ],
    hazards: [
      { x: 600, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 820, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 1560, y: 510, w: 200, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      // arc above bouncy 1
      { x: 360, y: 280 }, { x: 410, y: 240 }, { x: 470, y: 280 },
      // high above the small island
      { x: 740, y: 240 }, { x: 800, y: 220 },
      // arc above bouncy 3 (clears the second pit)
      { x: 1500, y: 280 }, { x: 1580, y: 240 }, { x: 1660, y: 280 },
    ],
  },

  {
    name: '5 · Crumbling Sky',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2530, y: 380 },
    sky: '#d8c5ff',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      // mid rest island
      { x: 1100, y: 460, w: 180, h: 80, type: 'ground' },
      // final ground with the goal
      { x: 2400, y: 480, w: 200, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 300,  y: 510, w: 800,  h: 30, type: 'spikes' },
      { x: 1280, y: 510, w: 1120, h: 30, type: 'spikes' },
    ],
    platforms: [
      // chain 1
      { x: 350, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 540, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 730, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 920, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
      // chain 2
      { x: 1320, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 1510, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 1700, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 1890, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 2080, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 2270, y: 440, w: 120, h: 18, fall: true, delay: 0.5 },
    ],
    coins: [
      { x: 400, y: 380 }, { x: 590, y: 380 }, { x: 780, y: 380 },
      { x: 970, y: 320 },
      { x: 1370, y: 380 }, { x: 1560, y: 380 }, { x: 1750, y: 380 },
      { x: 1940, y: 380 }, { x: 2130, y: 320 }, { x: 2320, y: 380 },
    ],
  },

  {
    name: '6 · The Pendulum Run',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2680, y: 60 },
    sky: '#a8e3ff',
    tiles: [
      // start ground + immediate slide-under
      { x: 0,    y: 480, w: 400, h: 60, type: 'ground' },
      { x: 220,  y: 420, w: 140, h: 18, type: 'branch' },
      // mid landing — split around bouncy at x=1050..1130
      { x: 940,  y: 480, w: 110, h: 60, type: 'ground' },
      { x: 1130, y: 480, w: 90,  h: 60, type: 'ground' },
      { x: 1050, y: 480, w: 80,  h: 60, type: 'bouncy' },
      // wall-jump shaft
      { x: 1820, y: 140, w: 40,  h: 380, type: 'wall' },
      { x: 1960, y: 140, w: 40,  h: 340, type: 'wall' },
      // top finish branches
      { x: 1860, y: 140, w: 100, h: 20,  type: 'branch' },
      { x: 2000, y: 120, w: 800, h: 20,  type: 'branch' },
    ],
    hazards: [
      // pit beneath the diagonal patrol
      { x: 400,  y: 510, w: 540, h: 30, type: 'spikes' },
      // pit beneath the falling tower
      { x: 1220, y: 510, w: 600, h: 30, type: 'spikes' },
      // pit beneath the wall shaft
      { x: 1820, y: 510, w: 180, h: 30, type: 'spikes' },
    ],
    platforms: [
      // diagonal patrol over first pit
      { x: 460,  y: 400, w: 120, h: 18, move: { axis: 'xy', range: 60,  speed: 50 } },
      { x: 720,  y: 400, w: 120, h: 18, move: { axis: 'xy', range: 60,  speed: 50 } },
      // horizontal patrol high above the bouncy
      { x: 1020, y: 260, w: 140, h: 18, move: { axis: 'x',  range: 110, speed: 60 } },
      // ascending falling-platform tower
      { x: 1280, y: 400, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 1450, y: 340, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 1620, y: 280, w: 120, h: 18, fall: true, delay: 0.5 },
      { x: 1770, y: 220, w: 90,  h: 18, fall: true, delay: 0.5 },
    ],
    coins: [
      // above the diagonal patrol
      { x: 540, y: 320 }, { x: 700, y: 320 }, { x: 820, y: 280 },
      // ladder of coins through the bouncy launch
      { x: 1080, y: 380 }, { x: 1080, y: 300 }, { x: 1080, y: 200 },
      // dangling above the falling tower
      { x: 1330, y: 360 }, { x: 1500, y: 280 },
    ],
  },

  {
    name: '7 · Bounce Highway',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2520, y: 380 },
    sky: '#ffd0e8',
    tiles: [
      // starting ground
      { x: 0,    y: 480, w: 320, h: 60, type: 'ground' },
      // bounce islands strung across long spike pits
      { x: 380,  y: 480, w: 90,  h: 60, type: 'bouncy' },
      { x: 720,  y: 480, w: 90,  h: 60, type: 'bouncy' },
      { x: 1080, y: 480, w: 90,  h: 60, type: 'bouncy' },
      { x: 1460, y: 480, w: 90,  h: 60, type: 'bouncy' },
      // mid rest island
      { x: 1820, y: 480, w: 240, h: 60, type: 'ground' },
      // slide-under section + finish ground
      { x: 2060, y: 420, w: 180, h: 20, type: 'branch' },
      { x: 2060, y: 480, w: 540, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 320,  y: 510, w: 60,  h: 30, type: 'spikes' },
      { x: 470,  y: 510, w: 250, h: 30, type: 'spikes' },
      { x: 810,  y: 510, w: 270, h: 30, type: 'spikes' },
      { x: 1170, y: 510, w: 290, h: 30, type: 'spikes' },
      { x: 1550, y: 510, w: 270, h: 30, type: 'spikes' },
    ],
    platforms: [
      // safer aerial alternates above the bouncy chain
      { x: 530,  y: 360, w: 110, h: 18, move: { axis: 'x', range: 80,  speed: 50 } },
      { x: 890,  y: 320, w: 110, h: 18, move: { axis: 'x', range: 90,  speed: 55 } },
      { x: 1280, y: 280, w: 110, h: 18, move: { axis: 'x', range: 100, speed: 60 } },
      { x: 1650, y: 320, w: 110, h: 18, move: { axis: 'x', range: 90,  speed: 55 } },
    ],
    coins: [
      // arcs above each bounce apex
      { x: 420, y: 360 }, { x: 420, y: 260 }, { x: 420, y: 180 },
      { x: 760, y: 260 }, { x: 760, y: 180 },
      { x: 1120, y: 220 },
      { x: 1500, y: 220 }, { x: 1500, y: 320 },
      // rest stretch
      { x: 1900, y: 420 }, { x: 2000, y: 420 },
    ],
  },

  {
    name: '8 · Vertical Ascent',
    width: 1400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 1320, y: 60 },
    sky: '#86c4ff',
    tiles: [
      // starting platform
      { x: 0,    y: 480, w: 240, h: 60, type: 'ground' },
      // first wall-jump shaft
      { x: 280,  y: 220, w: 40,  h: 260, type: 'wall' },
      { x: 420,  y: 220, w: 40,  h: 260, type: 'wall' },
      // landing branch at top of first shaft
      { x: 320,  y: 220, w: 100, h: 18,  type: 'branch' },
      // mid-air rest between elevators
      { x: 720,  y: 220, w: 120, h: 18,  type: 'branch' },
      // second wall-jump shaft (higher)
      { x: 1020, y: 80,  w: 40,  h: 180, type: 'wall' },
      { x: 1160, y: 80,  w: 40,  h: 180, type: 'wall' },
      // top exit branch and goal landing
      { x: 1060, y: 80,  w: 100, h: 18,  type: 'branch' },
      { x: 1200, y: 120, w: 200, h: 18,  type: 'branch' },
    ],
    hazards: [
      // everything below is spikes
      { x: 240, y: 510, w: 1160, h: 30, type: 'spikes' },
    ],
    platforms: [
      // vertical elevator linking shaft exit to mid-rest
      { x: 540, y: 260, w: 100, h: 18, move: { axis: 'y', range: 80, speed: 50 } },
      // falling stepping stones up toward second shaft
      { x: 870, y: 200, w: 80,  h: 18, fall: true, delay: 0.4 },
      { x: 980, y: 160, w: 80,  h: 18, fall: true, delay: 0.4 },
    ],
    coins: [
      { x: 370,  y: 180 },
      { x: 580,  y: 180 },
      { x: 780,  y: 160 },
      { x: 1010, y: 120 },
      { x: 1110, y: 200 },
      { x: 1280, y: 60  },
    ],
  },

  {
    name: '9 · The Gauntlet',
    width: 3200,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3100, y: 60 },
    sky: '#0d1b4d',
    tiles: [
      // Zone A: start ground
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      // Zone A: rest island between diagonal patrols
      { x: 760,  y: 480, w: 140, h: 60, type: 'ground' },
      // Zone B: bouncy launchpad ground
      { x: 1100, y: 480, w: 220, h: 60, type: 'ground' },
      { x: 1320, y: 480, w: 80,  h: 60, type: 'bouncy' },
      // Zone B: landing branch after bounce
      { x: 1480, y: 380, w: 120, h: 18, type: 'branch' },
      // Zone C: falling-staircase base
      { x: 1700, y: 480, w: 200, h: 60, type: 'ground' },
      // Zone D: branch onto wall shaft
      { x: 2360, y: 200, w: 140, h: 18, type: 'branch' },
      // Zone D: finish wall-jump shaft
      { x: 2600, y: 60,  w: 40,  h: 200, type: 'wall' },
      { x: 2740, y: 60,  w: 40,  h: 200, type: 'wall' },
      { x: 2640, y: 60,  w: 100, h: 18,  type: 'branch' },
      // top branch leading to goal
      { x: 2780, y: 120, w: 420, h: 18,  type: 'branch' },
    ],
    hazards: [
      // Zone A pit
      { x: 300,  y: 510, w: 460, h: 30, type: 'spikes' },
      // between Zone A and Zone B
      { x: 900,  y: 510, w: 200, h: 30, type: 'spikes' },
      // Zone B pit beneath bounce launch
      { x: 1400, y: 510, w: 300, h: 30, type: 'spikes' },
      // Zone C pit beneath falling staircase
      { x: 1900, y: 510, w: 700, h: 30, type: 'spikes' },
      // Zone D pit below shaft
      { x: 2600, y: 510, w: 200, h: 30, type: 'spikes' },
    ],
    platforms: [
      // Zone A: diagonal patrol pair over first pit
      { x: 360,  y: 400, w: 120, h: 18, move: { axis: 'xy', range: 70,  speed: 55 } },
      { x: 580,  y: 400, w: 120, h: 18, move: { axis: 'xy', range: 70,  speed: 55 } },
      // Zone B: horizontal patrol high above bouncy
      { x: 1340, y: 280, w: 140, h: 18, move: { axis: 'x',  range: 100, speed: 60 } },
      // Zone C: ascending falling staircase to Zone D entry
      { x: 1960, y: 400, w: 100, h: 18, fall: true, delay: 0.45 },
      { x: 2100, y: 340, w: 100, h: 18, fall: true, delay: 0.45 },
      { x: 2240, y: 280, w: 100, h: 18, fall: true, delay: 0.45 },
    ],
    coins: [
      // Zone A
      { x: 420,  y: 340 }, { x: 640, y: 340 }, { x: 820, y: 420 },
      // Zone B
      { x: 1360, y: 380 }, { x: 1360, y: 280 }, { x: 1360, y: 180 },
      { x: 1540, y: 320 },
      // Zone C
      { x: 2000, y: 340 }, { x: 2140, y: 280 }, { x: 2280, y: 220 },
      // Zone D
      { x: 2680, y: 200 }, { x: 3000, y: 80  },
    ],
  },

  // ===== Levels 10-24: expansion pack with new mechanics =====

  {
    name: '10 · Cavern Climb',
    width: 2200,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2100, y: 380 },
    sky: '#3a3050',
    tiles: [
      { x: 0,    y: 480, w: 400, h: 60, type: 'ground' },
      { x: 460,  y: 300, w: 120, h: 20, type: 'branch' },
      { x: 680,  y: 200, w: 120, h: 20, type: 'branch' },
      { x: 900,  y: 280, w: 120, h: 20, type: 'branch' },
      { x: 1120, y: 200, w: 120, h: 20, type: 'branch' },
      { x: 1340, y: 320, w: 120, h: 20, type: 'branch' },
      { x: 1900, y: 480, w: 300, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 400, y: 510, w: 1500, h: 30, type: 'spikes' },
    ],
    platforms: [],
    climbs: [
      { x: 480,  y: 320, w: 50, h: 180 },
      { x: 700,  y: 220, w: 50, h: 280 },
      { x: 920,  y: 300, w: 50, h: 200 },
      { x: 1140, y: 220, w: 50, h: 280 },
      { x: 1360, y: 340, w: 50, h: 160 },
      { x: 1580, y: 240, w: 50, h: 280 },
    ],
    coins: [
      { x: 490, y: 240 }, { x: 710, y: 140 }, { x: 930, y: 220 },
      { x: 1150, y: 140 }, { x: 1370, y: 260 }, { x: 1590, y: 160 },
    ],
  },

  {
    name: '11 · Icy Cliffs',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2300, y: 380 },
    sky: '#dcefff',
    tiles: [
      // ice patch start
      { x: 0,    y: 480, w: 120, h: 60, type: 'ground' },
      { x: 120,  y: 480, w: 280, h: 60, type: 'ice' },
      // gap
      { x: 540,  y: 480, w: 360, h: 60, type: 'ice' },
      // mid rest
      { x: 1040, y: 480, w: 160, h: 60, type: 'ground' },
      // slide-under ice section
      { x: 1340, y: 480, w: 380, h: 60, type: 'ice' },
      { x: 1480, y: 400, w: 220, h: 18, type: 'branch' },
      // final ground
      { x: 1860, y: 480, w: 540, h: 60, type: 'ground' },
      // wall-jump shaft at the end leading up
      { x: 2160, y: 240, w: 30,  h: 240, type: 'wall' },
      { x: 2280, y: 240, w: 30,  h: 240, type: 'wall' },
      { x: 2200, y: 240, w: 80,  h: 18,  type: 'branch' },
    ],
    hazards: [
      { x: 400,  y: 510, w: 140, h: 30, type: 'spikes' },
      { x: 900,  y: 510, w: 140, h: 30, type: 'spikes' },
      { x: 1200, y: 510, w: 140, h: 30, type: 'spikes' },
      { x: 1720, y: 510, w: 140, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 250, y: 420 }, { x: 700, y: 420 }, { x: 1100, y: 420 },
      { x: 1580, y: 360 }, { x: 1980, y: 420 }, { x: 2210, y: 200 },
    ],
  },

  {
    name: '12 · Vine Forest',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2500, y: 380 },
    sky: '#a8d479',
    tiles: [
      { x: 0,    y: 480, w: 360, h: 60, type: 'ground' },
      { x: 900,  y: 480, w: 220, h: 60, type: 'ground' },
      { x: 1700, y: 480, w: 220, h: 60, type: 'ground' },
      { x: 2300, y: 480, w: 300, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 360,  y: 510, w: 540, h: 30, type: 'spikes' },
      { x: 1120, y: 510, w: 580, h: 30, type: 'spikes' },
      { x: 1920, y: 510, w: 380, h: 30, type: 'spikes' },
    ],
    platforms: [],
    ropes: [
      { x: 520,  y: 80,  length: 280 },
      { x: 780,  y: 60,  length: 300 },
      { x: 1280, y: 80,  length: 290 },
      { x: 1540, y: 60,  length: 280 },
      { x: 2080, y: 80,  length: 270 },
    ],
    coins: [
      { x: 520, y: 200 }, { x: 780, y: 180 },
      { x: 1280, y: 200 }, { x: 1540, y: 180 },
      { x: 2080, y: 200 },
    ],
  },

  {
    name: '13 · Skywire Sunset',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2300, y: 380 },
    sky: '#ffb074',
    tiles: [
      { x: 0,    y: 480, w: 400, h: 60, type: 'ground' },
      { x: 1180, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 1380, y: 480, w: 80,  h: 60, type: 'bouncy' },
      // mid air branch landing for second zip
      { x: 1900, y: 320, w: 160, h: 18, type: 'branch' },
      { x: 2080, y: 480, w: 320, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 400,  y: 510, w: 780, h: 30, type: 'spikes' },
      { x: 1460, y: 510, w: 620, h: 30, type: 'spikes' },
    ],
    platforms: [],
    ziplines: [
      { x1: 400, y1: 360, x2: 1180, y2: 460 },
      { x1: 1440, y1: 280, x2: 1900, y2: 380 },
    ],
    coins: [
      { x: 600, y: 380 }, { x: 800, y: 400 }, { x: 1000, y: 430 },
      { x: 1600, y: 320 }, { x: 1780, y: 350 },
      { x: 2200, y: 420 },
    ],
  },

  {
    name: '14 · Ruined Aqueduct',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2300, y: 60 },
    sky: '#8a90c5',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      // ascending one-way arches
      { x: 320,  y: 420, w: 200, h: 12, type: 'oneway' },
      { x: 580,  y: 360, w: 200, h: 12, type: 'oneway' },
      { x: 840,  y: 300, w: 200, h: 12, type: 'oneway' },
      { x: 1100, y: 240, w: 200, h: 12, type: 'oneway' },
      { x: 1360, y: 180, w: 200, h: 12, type: 'oneway' },
      { x: 1620, y: 120, w: 200, h: 12, type: 'oneway' },
      // top: a normal branch leading to the goal
      { x: 1900, y: 120, w: 500, h: 20, type: 'branch' },
    ],
    hazards: [
      { x: 300, y: 510, w: 1900, h: 30, type: 'spikes' },
    ],
    platforms: [
      // a falling support tucked between the arches to reward speed
      { x: 480, y: 440, w: 80, h: 16, fall: true, delay: 0.4 },
      { x: 740, y: 380, w: 80, h: 16, fall: true, delay: 0.4 },
    ],
    coins: [
      { x: 420, y: 380 }, { x: 680, y: 320 }, { x: 940, y: 260 },
      { x: 1200, y: 200 }, { x: 1460, y: 140 }, { x: 1720, y: 80 },
    ],
  },

  {
    name: '15 · Frozen Spire',
    width: 1800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 1700, y: 80 },
    sky: '#bdd9e8',
    tiles: [
      // base
      { x: 0,    y: 480, w: 280, h: 60, type: 'ice' },
      // wall-jump shaft up the spire
      { x: 380,  y: 240, w: 30,  h: 240, type: 'wall' },
      { x: 500,  y: 240, w: 30,  h: 240, type: 'wall' },
      // platform between shaft and climbs
      { x: 410,  y: 240, w: 90,  h: 18,  type: 'branch' },
      // mid icy ledge
      { x: 620,  y: 240, w: 220, h: 18,  type: 'ice' },
      // upper ledge after second climb
      { x: 1000, y: 140, w: 240, h: 18,  type: 'ice' },
      // peak with goal
      { x: 1400, y: 140, w: 380, h: 18,  type: 'branch' },
    ],
    hazards: [
      { x: 280,  y: 510, w: 1500, h: 30, type: 'spikes' },
    ],
    platforms: [],
    climbs: [
      { x: 860,  y: 160, w: 50, h: 280 },
      { x: 1260, y: 80,  w: 50, h: 280 },
    ],
    coins: [
      { x: 420, y: 320 }, { x: 700, y: 200 },
      { x: 1080, y: 100 }, { x: 1500, y: 100 }, { x: 1640, y: 100 },
    ],
  },

  {
    name: '16 · Jungle Highway',
    width: 3000,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2900, y: 380 },
    sky: '#9bcc55',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      // bouncy launchpad
      { x: 280,  y: 480, w: 60,  h: 60, type: 'bouncy' },
      // post-rope landing
      { x: 900,  y: 380, w: 160, h: 18, type: 'branch' },
      // zipline target landing
      { x: 1700, y: 440, w: 200, h: 18, type: 'branch' },
      // mid rope-chain landing
      { x: 2100, y: 380, w: 140, h: 18, type: 'branch' },
      // final ground
      { x: 2700, y: 480, w: 300, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 340,  y: 510, w: 560,  h: 30, type: 'spikes' },
      { x: 1060, y: 510, w: 640,  h: 30, type: 'spikes' },
      { x: 1900, y: 510, w: 200,  h: 30, type: 'spikes' },
      { x: 2240, y: 510, w: 460,  h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 2360, y: 380, w: 120, h: 18, move: { axis: 'x', range: 110, speed: 60 } },
    ],
    ropes: [
      { x: 540,  y: 60, length: 280 },
      { x: 760,  y: 60, length: 300 },
    ],
    ziplines: [
      { x1: 1060, y1: 340, x2: 1700, y2: 420 },
    ],
    coins: [
      { x: 540, y: 200 }, { x: 760, y: 200 },
      { x: 1200, y: 360 }, { x: 1400, y: 380 },
      { x: 1780, y: 380 }, { x: 2160, y: 320 }, { x: 2400, y: 320 },
    ],
  },

  {
    name: '17 · Crystal Tunnels',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2500, y: 60 },
    sky: '#502d6e',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      // ascending one-way ledges
      { x: 320,  y: 420, w: 140, h: 12, type: 'oneway' },
      { x: 520,  y: 360, w: 140, h: 12, type: 'oneway' },
      // mid rest
      { x: 720,  y: 360, w: 180, h: 60, type: 'ground' },
      // mid spike pit
      // climb up section
      { x: 1240, y: 360, w: 60,  h: 60, type: 'ground' },
      // peak ledge before goal
      { x: 2300, y: 120, w: 300, h: 18, type: 'branch' },
    ],
    hazards: [
      { x: 300,  y: 510, w: 420, h: 30, type: 'spikes' },
      { x: 900,  y: 510, w: 340, h: 30, type: 'spikes' },
      { x: 1300, y: 510, w: 1000, h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 940,  y: 380, w: 100, h: 16, fall: true, delay: 0.4 },
      { x: 1080, y: 360, w: 100, h: 16, fall: true, delay: 0.4 },
      // ascending falling steps next to climb
      { x: 1700, y: 320, w: 100, h: 16, fall: true, delay: 0.4 },
      { x: 1900, y: 240, w: 100, h: 16, fall: true, delay: 0.4 },
      { x: 2100, y: 180, w: 100, h: 16, fall: true, delay: 0.4 },
    ],
    climbs: [
      { x: 1380, y: 140, w: 50, h: 240 },
      { x: 1560, y: 100, w: 50, h: 260 },
    ],
    coins: [
      { x: 390, y: 380 }, { x: 590, y: 320 }, { x: 1000, y: 320 },
      { x: 1400, y: 200 }, { x: 1580, y: 160 },
      { x: 1740, y: 280 }, { x: 1940, y: 200 }, { x: 2140, y: 140 },
      { x: 2400, y: 80 },
    ],
  },

  {
    name: '18 · Sky Bridge',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2500, y: 60 },
    sky: '#a8e3ff',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      // ascending one-ways
      { x: 320,  y: 440, w: 160, h: 12, type: 'oneway' },
      { x: 540,  y: 380, w: 160, h: 12, type: 'oneway' },
      { x: 760,  y: 320, w: 160, h: 12, type: 'oneway' },
      // wall-jump shaft
      { x: 1000, y: 80,  w: 30,  h: 280, type: 'wall' },
      { x: 1120, y: 80,  w: 30,  h: 240, type: 'wall' },
      { x: 1030, y: 80,  w: 90,  h: 18,  type: 'branch' },
      // post-shaft one-way bridge
      { x: 1200, y: 140, w: 180, h: 12, type: 'oneway' },
      { x: 1440, y: 120, w: 180, h: 12, type: 'oneway' },
      // finish branch
      { x: 2300, y: 120, w: 280, h: 18, type: 'branch' },
    ],
    hazards: [
      { x: 280, y: 510, w: 2320, h: 30, type: 'spikes' },
    ],
    platforms: [
      // moving connectors
      { x: 1660, y: 160, w: 120, h: 18, move: { axis: 'x', range: 120, speed: 60 } },
      { x: 1920, y: 140, w: 120, h: 18, move: { axis: 'y', range: 80,  speed: 50 } },
      { x: 2160, y: 140, w: 120, h: 18, move: { axis: 'x', range: 110, speed: 60 } },
    ],
    coins: [
      { x: 380, y: 380 }, { x: 600, y: 320 }, { x: 820, y: 260 },
      { x: 1060, y: 40 }, { x: 1260, y: 80 }, { x: 1500, y: 60 },
      { x: 1700, y: 100 }, { x: 2000, y: 80 }, { x: 2400, y: 60 },
    ],
  },

  {
    name: '19 · Storm Peaks',
    width: 3000,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2900, y: 80 },
    sky: '#5e6e85',
    tiles: [
      { x: 0,    y: 480, w: 240, h: 60, type: 'ice' },
      // first ice cliff
      { x: 460,  y: 440, w: 220, h: 100, type: 'ice' },
      // mid rope-landing
      { x: 1080, y: 400, w: 160, h: 18,  type: 'branch' },
      // ice plateau after rope
      { x: 1500, y: 440, w: 220, h: 100, type: 'ice' },
      // wall shaft entry
      { x: 2400, y: 100, w: 30,  h: 360, type: 'wall' },
      { x: 2520, y: 100, w: 30,  h: 320, type: 'wall' },
      { x: 2430, y: 100, w: 90,  h: 18,  type: 'branch' },
      // top finish
      { x: 2580, y: 120, w: 380, h: 18,  type: 'branch' },
    ],
    hazards: [
      { x: 240,  y: 510, w: 220, h: 30, type: 'spikes' },
      { x: 680,  y: 510, w: 400, h: 30, type: 'spikes' },
      { x: 1240, y: 510, w: 260, h: 30, type: 'spikes' },
      { x: 1720, y: 510, w: 680, h: 30, type: 'spikes' },
    ],
    platforms: [
      // ice patrol — slippery + moving (still uses ice friction when carried)
      { x: 1880, y: 380, w: 140, h: 18, move: { axis: 'x', range: 110, speed: 55 }, type: 'ice' },
      { x: 2160, y: 320, w: 140, h: 18, move: { axis: 'y', range: 80,  speed: 50 } },
    ],
    ropes: [
      { x: 800,  y: 60, length: 320 },
      { x: 1320, y: 60, length: 300 },
    ],
    coins: [
      { x: 540, y: 380 }, { x: 800, y: 200 },
      { x: 1140, y: 340 }, { x: 1320, y: 200 },
      { x: 1900, y: 320 }, { x: 2200, y: 240 },
      { x: 2440, y: 60 }, { x: 2700, y: 80 },
    ],
  },

  {
    name: '20 · Spire of Bells',
    width: 1600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 1500, y: 40 },
    sky: '#f1c878',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      // bouncy launch
      { x: 280,  y: 480, w: 60,  h: 60, type: 'bouncy' },
      // first branch high
      { x: 400,  y: 220, w: 140, h: 18, type: 'branch' },
      // mid stack
      { x: 700,  y: 260, w: 140, h: 18, type: 'branch' },
      // upper landing after climb
      { x: 1100, y: 80,  w: 200, h: 18, type: 'branch' },
      // goal landing
      { x: 1380, y: 100, w: 220, h: 18, type: 'branch' },
    ],
    hazards: [
      { x: 340, y: 510, w: 1260, h: 30, type: 'spikes' },
    ],
    platforms: [],
    climbs: [
      { x: 900, y: 100, w: 50, h: 200 },
    ],
    ziplines: [
      { x1: 540, y1: 200, x2: 1100, y2: 80 },
    ],
    ropes: [
      { x: 760, y: 60, length: 200 },
    ],
    coins: [
      { x: 290, y: 380 }, { x: 290, y: 280 }, { x: 290, y: 180 },
      { x: 460, y: 180 }, { x: 760, y: 200 }, { x: 920, y: 80 },
      { x: 1180, y: 40 }, { x: 1420, y: 60 },
    ],
  },

  {
    name: '21 · Sunken Glade',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#5a7a4a',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      // tiny safe islands
      { x: 800,  y: 440, w: 80,  h: 100, type: 'ground' },
      { x: 1500, y: 440, w: 80,  h: 100, type: 'ground' },
      { x: 2120, y: 440, w: 80,  h: 100, type: 'ground' },
      { x: 2500, y: 480, w: 300, h: 60,  type: 'ground' },
      // one-way platforms scattered overhead as alternate routes
      { x: 460,  y: 320, w: 160, h: 12, type: 'oneway' },
      { x: 1100, y: 280, w: 160, h: 12, type: 'oneway' },
      { x: 1800, y: 280, w: 160, h: 12, type: 'oneway' },
      { x: 2280, y: 320, w: 160, h: 12, type: 'oneway' },
    ],
    hazards: [
      { x: 280,  y: 510, w: 520, h: 30, type: 'spikes' },
      { x: 880,  y: 510, w: 620, h: 30, type: 'spikes' },
      { x: 1580, y: 510, w: 540, h: 30, type: 'spikes' },
      { x: 2200, y: 510, w: 300, h: 30, type: 'spikes' },
    ],
    platforms: [],
    ropes: [
      { x: 460,  y: 80,  length: 280 },
      { x: 720,  y: 60,  length: 300 },
      { x: 1120, y: 60,  length: 300 },
      { x: 1400, y: 60,  length: 300 },
      { x: 1780, y: 80,  length: 280 },
      { x: 2040, y: 60,  length: 300 },
      { x: 2360, y: 80,  length: 280 },
    ],
    coins: [
      { x: 460, y: 200 }, { x: 720, y: 180 },
      { x: 1120, y: 180 }, { x: 1400, y: 180 },
      { x: 1780, y: 200 }, { x: 2040, y: 180 }, { x: 2360, y: 200 },
    ],
  },

  {
    name: '22 · Glacier Run',
    width: 3000,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2900, y: 100 },
    sky: '#cae6f1',
    tiles: [
      { x: 0,    y: 480, w: 320, h: 60, type: 'ice' },
      // zipline target ledge
      { x: 1080, y: 440, w: 200, h: 18, type: 'ice' },
      // climb base
      { x: 1500, y: 480, w: 200, h: 60, type: 'ground' },
      // upper landings
      { x: 1820, y: 240, w: 220, h: 18, type: 'ice' },
      { x: 2280, y: 180, w: 220, h: 18, type: 'branch' },
      // finish branch
      { x: 2680, y: 160, w: 320, h: 18, type: 'branch' },
    ],
    hazards: [
      { x: 320,  y: 510, w: 760,  h: 30, type: 'spikes' },
      { x: 1280, y: 510, w: 220,  h: 30, type: 'spikes' },
      { x: 1700, y: 510, w: 1180, h: 30, type: 'spikes' },
    ],
    platforms: [
      // a couple of falling stepping stones between top ledges
      { x: 2060, y: 220, w: 100, h: 16, fall: true, delay: 0.4 },
      { x: 2540, y: 200, w: 100, h: 16, fall: true, delay: 0.4 },
    ],
    climbs: [
      { x: 1600, y: 260, w: 50, h: 220 },
    ],
    ziplines: [
      { x1: 320, y1: 420, x2: 1080, y2: 440 },
    ],
    coins: [
      { x: 600, y: 400 }, { x: 900, y: 420 },
      { x: 1180, y: 380 }, { x: 1620, y: 320 },
      { x: 1900, y: 200 }, { x: 2120, y: 180 },
      { x: 2360, y: 140 }, { x: 2780, y: 100 },
    ],
  },

  {
    name: '23 · The Forge',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 80 },
    sky: '#3e2a2a',
    tiles: [
      // entry
      { x: 0,    y: 480, w: 260, h: 60, type: 'ground' },
      // bouncy hop-start
      { x: 260,  y: 480, w: 60,  h: 60, type: 'bouncy' },
      // first one-way bridge
      { x: 380,  y: 360, w: 180, h: 12, type: 'oneway' },
      { x: 620,  y: 280, w: 180, h: 12, type: 'oneway' },
      // ice mid-platform (slippery rest)
      { x: 860,  y: 300, w: 220, h: 18, type: 'ice' },
      // climb to upper deck
      // upper deck branches
      { x: 1340, y: 200, w: 220, h: 18, type: 'branch' },
      { x: 1640, y: 140, w: 60,  h: 60, type: 'bouncy' },
      // finish stretch
      { x: 2200, y: 120, w: 200, h: 18, type: 'oneway' },
      { x: 2480, y: 100, w: 320, h: 18, type: 'branch' },
    ],
    hazards: [
      { x: 320, y: 510, w: 2480, h: 30, type: 'spikes' },
    ],
    platforms: [
      // falling steps above the ice (alternate quick route)
      { x: 1140, y: 260, w: 100, h: 16, fall: true, delay: 0.4 },
      { x: 1280, y: 220, w: 100, h: 16, fall: true, delay: 0.4 },
      // a falling step that drops to the bouncy below
      { x: 1820, y: 240, w: 100, h: 16, fall: true, delay: 0.45 },
      // moving platform across the gap
      { x: 1960, y: 200, w: 120, h: 18, move: { axis: 'x', range: 100, speed: 55 } },
    ],
    climbs: [
      { x: 1200, y: 100, w: 50, h: 220 },
    ],
    coins: [
      { x: 460, y: 320 }, { x: 700, y: 240 },
      { x: 940, y: 260 }, { x: 1220, y: 60 },
      { x: 1440, y: 160 }, { x: 1660, y: 80 },
      { x: 2020, y: 160 }, { x: 2280, y: 80 }, { x: 2580, y: 60 },
    ],
  },

  {
    name: '24 · The Vault',
    width: 3600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3500, y: 60 },
    sky: '#0a0f30',
    tiles: [
      // Zone A: rope launch
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      { x: 660,  y: 380, w: 140, h: 18, type: 'branch' },
      // Zone B: ice + bouncy
      { x: 880,  y: 480, w: 240, h: 60, type: 'ice' },
      { x: 1100, y: 480, w: 60,  h: 60, type: 'bouncy' },
      // Zone B landing branch
      { x: 1260, y: 260, w: 160, h: 18, type: 'branch' },
      // Zone C: zipline target
      { x: 1900, y: 380, w: 200, h: 18, type: 'branch' },
      // Zone D: climb tower base
      { x: 2200, y: 480, w: 200, h: 60, type: 'ground' },
      // Zone E: one-way + moving finale
      { x: 2900, y: 260, w: 180, h: 12, type: 'oneway' },
      { x: 3200, y: 200, w: 180, h: 12, type: 'oneway' },
      // wall-jump finale shaft
      { x: 3260, y: 60,  w: 30,  h: 200, type: 'wall' },
      { x: 3380, y: 60,  w: 30,  h: 160, type: 'wall' },
      { x: 3290, y: 60,  w: 90,  h: 18,  type: 'branch' },
      { x: 3410, y: 80,  w: 200, h: 18,  type: 'branch' },
    ],
    hazards: [
      { x: 280,  y: 510, w: 600,  h: 30, type: 'spikes' },
      { x: 1120, y: 510, w: 1080, h: 30, type: 'spikes' },
      { x: 2400, y: 510, w: 1200, h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 1480, y: 240, w: 120, h: 18, move: { axis: 'x', range: 110, speed: 60 } },
      { x: 2600, y: 380, w: 100, h: 16, fall: true, delay: 0.4 },
      { x: 2760, y: 340, w: 100, h: 16, fall: true, delay: 0.4 },
    ],
    ropes: [
      { x: 380, y: 60, length: 320 },
      { x: 540, y: 60, length: 320 },
    ],
    ziplines: [
      { x1: 1420, y1: 220, x2: 1900, y2: 360 },
    ],
    climbs: [
      { x: 2280, y: 200, w: 50, h: 280 },
      { x: 2480, y: 100, w: 50, h: 260 },
    ],
    coins: [
      { x: 380, y: 200 }, { x: 540, y: 200 }, { x: 720, y: 340 },
      { x: 1120, y: 380 }, { x: 1120, y: 280 }, { x: 1120, y: 180 },
      { x: 1340, y: 220 }, { x: 1620, y: 200 }, { x: 1980, y: 340 },
      { x: 2300, y: 280 }, { x: 2500, y: 180 }, { x: 2680, y: 320 },
      { x: 2980, y: 220 }, { x: 3280, y: 160 }, { x: 3460, y: 40  },
    ],
  },

  {
    name: '25 · Coin Cavern',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#2b6f7a',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      { x: 1000, y: 460, w: 200, h: 80, type: 'ground' },
      { x: 1820, y: 420, w: 180, h: 120, type: 'ground' },
      // coin alcove branches above the spike pits
      { x: 380,  y: 240, w: 100, h: 14, type: 'branch' },
      { x: 720,  y: 220, w: 100, h: 14, type: 'branch' },
      { x: 2160, y: 220, w: 100, h: 14, type: 'branch' },
      { x: 2500, y: 480, w: 300, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 510, w: 720, h: 30, type: 'spikes' },
      { x: 1200, y: 510, w: 620, h: 30, type: 'spikes' },
      { x: 2000, y: 510, w: 500, h: 30, type: 'spikes' },
    ],
    platforms: [],
    ropes: [
      { x: 500,  y: 80, length: 300 },
      { x: 720,  y: 60, length: 320 },
      { x: 2120, y: 80, length: 300 },
      { x: 2340, y: 60, length: 320 },
    ],
    ziplines: [
      { x1: 1200, y1: 380, x2: 1800, y2: 420 },
    ],
    coins: [
      { x: 400, y: 200 }, { x: 500, y: 180 }, { x: 720, y: 180 },
      { x: 1100, y: 380 }, { x: 1100, y: 320 },
      { x: 1300, y: 420 }, { x: 1450, y: 410 }, { x: 1600, y: 400 }, { x: 1750, y: 400 },
      { x: 1900, y: 340 },
      { x: 2120, y: 200 }, { x: 2180, y: 180 }, { x: 2340, y: 180 },
      { x: 2620, y: 420 },
    ],
  },

  {
    name: '26 · Frost Ascent',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2330, y: 380 },
    sky: '#cfe9ff',
    tiles: [
      { x: 0,    y: 480, w: 160, h: 60, type: 'ground' },
      // slippery approach
      { x: 160,  y: 480, w: 600, h: 60, type: 'ice' },
      // mid rest before the tower
      { x: 760,  y: 480, w: 140, h: 60, type: 'ground' },
      // ice tower — alternating ledges to hop, or use the climb bar to bypass
      { x: 920,  y: 420, w: 80,  h: 18, type: 'ice' },
      { x: 1060, y: 360, w: 80,  h: 18, type: 'ice' },
      { x: 920,  y: 300, w: 80,  h: 18, type: 'ice' },
      { x: 1060, y: 240, w: 80,  h: 18, type: 'ice' },
      // summit
      { x: 1180, y: 240, w: 240, h: 18, type: 'ground' },
      // one-way descent steps over the spike pit
      { x: 1500, y: 320, w: 160, h: 14, type: 'oneway' },
      { x: 1720, y: 380, w: 160, h: 14, type: 'oneway' },
      { x: 1940, y: 440, w: 160, h: 14, type: 'oneway' },
      // landing
      { x: 2150, y: 480, w: 250, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 900, y: 510, w: 1250, h: 30, type: 'spikes' },
    ],
    platforms: [
      // a moving ice slab makes the descent trickier
      { x: 1600, y: 280, w: 80, h: 14, move: { axis: 'x', range: 60, speed: 50 }, type: 'ice' },
    ],
    climbs: [
      // the safety route up the tower
      { x: 1000, y: 240, w: 50, h: 200 },
    ],
    coins: [
      { x: 240, y: 420 }, { x: 420, y: 420 }, { x: 600, y: 420 },
      { x: 950, y: 360 }, { x: 1090, y: 300 }, { x: 950, y: 240 }, { x: 1090, y: 180 },
      { x: 1300, y: 180 }, { x: 1580, y: 260 }, { x: 1800, y: 320 }, { x: 2020, y: 380 },
      { x: 2250, y: 420 },
    ],
  },

  {
    name: '27 · Beyond the Vault',
    width: 3800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3700, y: 380 },
    sky: '#1d1233',
    tiles: [
      // Segment 1: spawn ground
      { x: 0,    y: 480, w: 200, h: 60, type: 'ground' },
      { x: 700,  y: 480, w: 140, h: 60, type: 'ground' },
      // Segment 2: ice slip into bouncy launcher with wall shaft above
      { x: 840,  y: 480, w: 180, h: 60, type: 'ice' },
      { x: 1020, y: 480, w: 100, h: 60, type: 'bouncy' },
      { x: 980,  y: 140, w: 30,  h: 240, type: 'wall' },
      { x: 1130, y: 140, w: 30,  h: 240, type: 'wall' },
      { x: 1160, y: 140, w: 200, h: 18,  type: 'branch' },
      // Segment 3: mid-air branch into rope then zipline (ground tile is the zipline landing)
      { x: 1430, y: 280, w: 120, h: 14, type: 'branch' },
      { x: 2150, y: 480, w: 330, h: 60, type: 'ground' },
      // Segment 4: climb tower with high branch landing
      { x: 2580, y: 120, w: 180, h: 18, type: 'branch' },
      // Segment 5: final ground for the goal
      { x: 3600, y: 480, w: 200, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 200,  y: 510, w: 500,  h: 30, type: 'spikes' },
      { x: 1120, y: 510, w: 1030, h: 30, type: 'spikes' },
      { x: 2480, y: 510, w: 1120, h: 30, type: 'spikes' },
    ],
    platforms: [
      // Segment 1: falling-platform chain over the first spike pit
      { x: 240, y: 440, w: 80, h: 14, fall: true, delay: 0.4 },
      { x: 360, y: 420, w: 80, h: 14, fall: true, delay: 0.4 },
      { x: 480, y: 440, w: 80, h: 14, fall: true, delay: 0.4 },
      { x: 600, y: 420, w: 80, h: 14, fall: true, delay: 0.4 },
      // Segment 5: precision moving-platform descent to the goal
      { x: 2880, y: 200, w: 100, h: 14, move: { axis: 'x',  range: 90,  speed: 70 } },
      { x: 3080, y: 260, w: 100, h: 14, move: { axis: 'y',  range: 100, speed: 60 } },
      { x: 3280, y: 320, w: 100, h: 14, move: { axis: 'xy', range: 80,  speed: 60 }, type: 'ice' },
      { x: 3480, y: 380, w: 100, h: 14, move: { axis: 'x',  range: 70,  speed: 75 } },
    ],
    ropes: [
      { x: 1620, y: 80, length: 300 },
    ],
    ziplines: [
      { x1: 1800, y1: 320, x2: 2200, y2: 430 },
    ],
    climbs: [
      { x: 2520, y: 120, w: 50, h: 380 },
    ],
    coins: [
      { x: 280,  y: 380 }, { x: 400,  y: 360 }, { x: 520,  y: 380 }, { x: 640, y: 360 },
      { x: 1060, y: 380 }, { x: 1060, y: 280 }, { x: 1060, y: 180 },
      { x: 1480, y: 220 }, { x: 1720, y: 260 }, { x: 1980, y: 360 },
      { x: 2540, y: 380 }, { x: 2540, y: 240 }, { x: 2660, y: 80  },
      { x: 2920, y: 160 }, { x: 3120, y: 220 }, { x: 3320, y: 280 }, { x: 3520, y: 340 },
    ],
  },

  {
    name: '28 · Spring Festival',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2500, y: 380 },
    sky: '#ffb3d2',
    tiles: [
      { x: 0,    y: 480, w: 200, h: 60, type: 'ground' },
      // bouncy hop chain over spikes
      { x: 280,  y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 480,  y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 680,  y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 880,  y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 1080, y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 1280, y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 1480, y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 1680, y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 1880, y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 2080, y: 480, w: 80, h: 60, type: 'bouncy' },
      // coin perches high above
      { x: 500,  y: 180, w: 80, h: 14, type: 'branch' },
      { x: 1000, y: 160, w: 80, h: 14, type: 'branch' },
      { x: 1500, y: 180, w: 80, h: 14, type: 'branch' },
      { x: 2000, y: 160, w: 80, h: 14, type: 'branch' },
      { x: 2300, y: 480, w: 300, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 200, y: 510, w: 80,  h: 30, type: 'spikes' },
      { x: 360, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 560, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 760, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 960, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 1160, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 1360, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 1560, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 1760, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 1960, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 2160, y: 510, w: 140, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 320, y: 240 }, { x: 520, y: 140 }, { x: 720, y: 240 },
      { x: 1020, y: 120 }, { x: 1220, y: 240 },
      { x: 1520, y: 140 }, { x: 1720, y: 240 },
      { x: 2020, y: 120 }, { x: 2220, y: 240 }, { x: 2420, y: 420 },
    ],
  },

  {
    name: '29 · Pendulum Labyrinth',
    width: 3000,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2900, y: 380 },
    sky: '#3a5a4a',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      { x: 1460, y: 420, w: 160, h: 120, type: 'ground' },
      { x: 2700, y: 480, w: 300, h: 60, type: 'ground' },
      // coin alcove branches
      { x: 1500, y: 200, w: 100, h: 14, type: 'branch' },
    ],
    hazards: [
      { x: 280,  y: 510, w: 1180, h: 30, type: 'spikes' },
      { x: 1620, y: 510, w: 1080, h: 30, type: 'spikes' },
    ],
    platforms: [],
    ropes: [
      { x: 420,  y: 70, length: 320 },
      { x: 620,  y: 50, length: 320 },
      { x: 820,  y: 70, length: 320 },
      { x: 1020, y: 50, length: 320 },
      { x: 1240, y: 70, length: 320 },
      { x: 1780, y: 70, length: 320 },
      { x: 1980, y: 50, length: 320 },
      { x: 2180, y: 70, length: 320 },
      { x: 2380, y: 50, length: 320 },
      { x: 2580, y: 70, length: 320 },
    ],
    coins: [
      { x: 420, y: 200 }, { x: 620, y: 180 }, { x: 820, y: 200 },
      { x: 1020, y: 180 }, { x: 1240, y: 200 },
      { x: 1530, y: 150 }, { x: 1780, y: 200 },
      { x: 1980, y: 180 }, { x: 2180, y: 200 }, { x: 2380, y: 180 }, { x: 2580, y: 200 },
    ],
  },

  {
    name: '30 · Cannon Battery',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2500, y: 380 },
    sky: '#4a3a6a',
    tiles: [
      { x: 0,    y: 480, w: 200, h: 60, type: 'ground' },
      { x: 640,  y: 480, w: 200, h: 60, type: 'ground' },
      { x: 1180, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 1840, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 2300, y: 480, w: 300, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 200,  y: 510, w: 440, h: 30, type: 'spikes' },
      { x: 840,  y: 510, w: 340, h: 30, type: 'spikes' },
      { x: 1380, y: 510, w: 460, h: 30, type: 'spikes' },
      { x: 2040, y: 510, w: 260, h: 30, type: 'spikes' },
    ],
    platforms: [],
    cannons: [
      // four shots across rising chasms; -30° gives a nice arc, last one is bigger
      { x: 140, y: 400, w: 70, h: 70, angle: -30, power: 900 },
      { x: 720, y: 400, w: 70, h: 70, angle: -30, power: 900 },
      { x: 1260, y: 400, w: 70, h: 70, angle: -45, power: 950 },
      { x: 1920, y: 400, w: 70, h: 70, angle: -30, power: 860 },
    ],
    coins: [
      { x: 360, y: 320 }, { x: 480, y: 260 },
      { x: 900, y: 320 }, { x: 1020, y: 260 },
      { x: 1500, y: 200 }, { x: 1680, y: 240 },
      { x: 2080, y: 320 }, { x: 2200, y: 280 },
      { x: 2420, y: 420 }, { x: 2480, y: 420 },
    ],
  },

  {
    name: '31 · Frostfall Cascade',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#dcefff',
    tiles: [
      { x: 0,    y: 480, w: 200, h: 60, type: 'ground' },
      // mid rest island halfway through
      { x: 1320, y: 460, w: 160, h: 80, type: 'ground' },
      { x: 2600, y: 480, w: 200, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 200,  y: 510, w: 1120, h: 30, type: 'spikes' },
      { x: 1480, y: 510, w: 1120, h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 260,  y: 440, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 440,  y: 420, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 620,  y: 440, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 800,  y: 420, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 980,  y: 440, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 1160, y: 460, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 1520, y: 440, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 1700, y: 420, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 1880, y: 440, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 2060, y: 420, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 2240, y: 440, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
      { x: 2420, y: 460, w: 120, h: 14, fall: true, delay: 0.4, type: 'ice' },
    ],
    coins: [
      { x: 300, y: 380 }, { x: 480, y: 360 }, { x: 660, y: 380 },
      { x: 840, y: 360 }, { x: 1020, y: 380 }, { x: 1380, y: 380 },
      { x: 1560, y: 380 }, { x: 1740, y: 360 }, { x: 1920, y: 380 },
      { x: 2100, y: 360 }, { x: 2280, y: 380 }, { x: 2460, y: 400 },
    ],
  },

  {
    name: '32 · The Catwalk',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 140 },
    goal:  { x: 2440, y: 140 },
    sky: '#5a4a7a',
    tiles: [
      // top-left start
      { x: 0,    y: 200, w: 280, h: 18, type: 'ground' },
      // zig-zag oneway descent (left half)
      { x: 320,  y: 260, w: 180, h: 14, type: 'oneway' },
      { x: 100,  y: 320, w: 180, h: 14, type: 'oneway' },
      { x: 320,  y: 380, w: 180, h: 14, type: 'oneway' },
      { x: 100,  y: 440, w: 180, h: 14, type: 'oneway' },
      // basement floor with spike gaps
      { x: 0,    y: 500, w: 400, h: 40, type: 'ground' },
      { x: 600,  y: 500, w: 300, h: 40, type: 'ground' },
      { x: 1100, y: 500, w: 300, h: 40, type: 'ground' },
      { x: 1600, y: 500, w: 300, h: 40, type: 'ground' },
      // right-side ascent oneway
      { x: 1980, y: 440, w: 180, h: 14, type: 'oneway' },
      { x: 2200, y: 380, w: 180, h: 14, type: 'oneway' },
      { x: 1980, y: 320, w: 180, h: 14, type: 'oneway' },
      { x: 2200, y: 260, w: 180, h: 14, type: 'oneway' },
      // top-right finish
      { x: 2320, y: 200, w: 280, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 400,  y: 510, w: 200, h: 30, type: 'spikes' },
      { x: 900,  y: 510, w: 200, h: 30, type: 'spikes' },
      { x: 1400, y: 510, w: 200, h: 30, type: 'spikes' },
    ],
    platforms: [
      // moving platforms bridge the basement gaps
      { x: 420, y: 460, w: 100, h: 14, move: { axis: 'x', range: 70, speed: 50 } },
      { x: 920, y: 460, w: 100, h: 14, move: { axis: 'x', range: 70, speed: 50 } },
      { x: 1420, y: 460, w: 100, h: 14, move: { axis: 'x', range: 70, speed: 50 } },
    ],
    coins: [
      { x: 360, y: 220 }, { x: 140, y: 280 }, { x: 360, y: 340 }, { x: 140, y: 400 },
      { x: 460, y: 460 }, { x: 960, y: 460 }, { x: 1460, y: 460 },
      { x: 2020, y: 400 }, { x: 2240, y: 340 }, { x: 2020, y: 280 }, { x: 2240, y: 220 },
    ],
  },

  {
    name: '33 · Stormwire Express',
    width: 3000,
    height: 540,
    spawn: { x: 60, y: 140 },
    goal:  { x: 2900, y: 380 },
    sky: '#3a4a6a',
    tiles: [
      // high start
      { x: 0,    y: 200, w: 240, h: 18, type: 'ground' },
      // mid landing (lower)
      { x: 1180, y: 400, w: 220, h: 60, type: 'ground' },
      // mid high (rope station)
      { x: 1600, y: 200, w: 200, h: 18, type: 'ground' },
      // final landing
      { x: 2800, y: 480, w: 200, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 240,  y: 510, w: 940,  h: 30, type: 'spikes' },
      { x: 1400, y: 510, w: 1400, h: 30, type: 'spikes' },
    ],
    platforms: [],
    ropes: [
      { x: 1400, y: 60, length: 280 },
    ],
    ziplines: [
      { x1: 240,  y1: 218, x2: 1180, y2: 400 },
      { x1: 1800, y1: 218, x2: 2800, y2: 480 },
    ],
    coins: [
      { x: 380, y: 260 }, { x: 600, y: 300 }, { x: 820, y: 340 }, { x: 1040, y: 380 },
      { x: 1280, y: 360 }, { x: 1420, y: 220 },
      { x: 1900, y: 260 }, { x: 2150, y: 320 }, { x: 2400, y: 380 }, { x: 2650, y: 440 },
    ],
  },

  {
    name: '34 · Skyward Cannons',
    width: 1800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 1700, y: 80 },
    sky: '#1a2438',
    tiles: [
      { x: 0,    y: 480, w: 200, h: 60, type: 'ground' },
      // zig-zag branches between cannon launches
      { x: 460,  y: 320, w: 180, h: 14, type: 'branch' },
      { x: 760,  y: 320, w: 180, h: 14, type: 'branch' },
      { x: 1060, y: 320, w: 180, h: 14, type: 'branch' },
      { x: 1380, y: 320, w: 180, h: 14, type: 'branch' },
      // summit
      { x: 1600, y: 140, w: 200, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 200, y: 510, w: 1400, h: 30, type: 'spikes' },
    ],
    platforms: [],
    cannons: [
      // ground cannon arcs to first branch
      { x: 240, y: 400, w: 70, h: 70, angle: -55, power: 900 },
      // each branch holds a cannon angled toward the next
      { x: 520, y: 250, w: 70, h: 70, angle: -45, power: 850 },
      { x: 820, y: 250, w: 70, h: 70, angle: -55, power: 900 },
      { x: 1120, y: 250, w: 70, h: 70, angle: -45, power: 850 },
      { x: 1440, y: 250, w: 70, h: 70, angle: -60, power: 950 },
    ],
    coins: [
      { x: 380, y: 220 }, { x: 540, y: 260 },
      { x: 680, y: 220 }, { x: 840, y: 260 },
      { x: 980, y: 220 }, { x: 1140, y: 260 },
      { x: 1280, y: 220 }, { x: 1480, y: 180 },
      { x: 1680, y: 100 },
    ],
  },

  {
    name: '35 · Cliffside Bells',
    width: 3000,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2900, y: 140 },
    sky: '#7a4a6a',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      // platforms to bounce between
      { x: 600,  y: 360, w: 80, h: 20, type: 'bouncy' },
      { x: 800,  y: 360, w: 80, h: 20, type: 'bouncy' },
      { x: 1000, y: 360, w: 80, h: 20, type: 'bouncy' },
      // checkpoint landing
      { x: 1080, y: 300, w: 240, h: 18, type: 'ground' },
      // climb tower into rope canopy
      { x: 1700, y: 300, w: 100, h: 18, type: 'branch' },
      // summit
      { x: 2780, y: 200, w: 220, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 280, y: 510, w: 2500, h: 30, type: 'spikes' },
    ],
    platforms: [],
    climbs: [
      { x: 320,  y: 300, w: 50, h: 180 },
      { x: 1480, y: 100, w: 50, h: 220 },
      { x: 2540, y: 60,  w: 50, h: 240 },
    ],
    ropes: [
      { x: 1900, y: 60, length: 240 },
      { x: 2100, y: 60, length: 240 },
      { x: 2300, y: 60, length: 240 },
    ],
    checkpoints: [
      // halfway through, on the mid landing
      { x: 1180, y: 240, w: 40, h: 60 },
    ],
    coins: [
      { x: 340, y: 380 }, { x: 340, y: 280 },
      { x: 640, y: 280 }, { x: 840, y: 280 }, { x: 1040, y: 280 },
      { x: 1200, y: 220 }, { x: 1500, y: 200 }, { x: 1500, y: 80  },
      { x: 1920, y: 200 }, { x: 2120, y: 200 }, { x: 2320, y: 200 },
      { x: 2560, y: 80  }, { x: 2820, y: 140 },
    ],
  },

  {
    name: '36 · The Aviary',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 140 },
    goal:  { x: 2700, y: 140 },
    sky: '#3a4a5a',
    tiles: [
      { x: 0,    y: 200, w: 200, h: 14, type: 'ground' },
      { x: 1380, y: 320, w: 200, h: 18, type: 'ground' },
      { x: 2620, y: 200, w: 200, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 0, y: 530, w: 2800, h: 10, type: 'spikes' },
    ],
    platforms: [
      // falling perch chain — first half
      { x: 240,  y: 220, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 360,  y: 240, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 480,  y: 260, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 600,  y: 280, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 720,  y: 300, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 840,  y: 320, w: 80, h: 12, fall: true, delay: 0.35 },
      // falling perch chain — second half (after mid sturdy)
      { x: 1620, y: 320, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 1740, y: 300, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 1860, y: 280, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 1980, y: 260, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 2100, y: 240, w: 80, h: 12, fall: true, delay: 0.35 },
      { x: 2220, y: 220, w: 80, h: 12, fall: true, delay: 0.35 },
    ],
    ropes: [
      { x: 1000, y: 60, length: 240 },
      { x: 1180, y: 60, length: 240 },
      { x: 2400, y: 60, length: 220 },
      { x: 2560, y: 60, length: 220 },
    ],
    coins: [
      { x: 280, y: 180 }, { x: 400, y: 200 }, { x: 520, y: 220 }, { x: 640, y: 240 }, { x: 760, y: 260 }, { x: 880, y: 280 },
      { x: 1020, y: 180 }, { x: 1200, y: 180 }, { x: 1440, y: 280 },
      { x: 1660, y: 280 }, { x: 1780, y: 260 }, { x: 1900, y: 240 }, { x: 2020, y: 220 }, { x: 2140, y: 200 }, { x: 2260, y: 180 },
      { x: 2420, y: 180 }, { x: 2580, y: 180 },
    ],
  },

  {
    name: '37 · Last Sanctuary',
    width: 4400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 4300, y: 140 },
    sky: '#0a0518',
    tiles: [
      // Segment 1: cannon shooting gallery
      { x: 0,    y: 480, w: 200, h: 60, type: 'ground' },
      { x: 540,  y: 480, w: 180, h: 60, type: 'ground' },
      { x: 1060, y: 480, w: 180, h: 60, type: 'ground' },
      // Segment 2: climb tower lifts to first checkpoint
      { x: 1340, y: 480, w: 220, h: 60, type: 'ground' },
      { x: 1700, y: 280, w: 240, h: 18, type: 'ground' },  // checkpoint platform
      // Segment 3: rope swing onto ice slip + zipline down
      { x: 2240, y: 280, w: 180, h: 18, type: 'ice' },
      { x: 2920, y: 480, w: 200, h: 60, type: 'ground' },
      // Segment 4: bouncy + oneway gauntlet with second checkpoint
      { x: 3000, y: 480, w: 80, h: 60, type: 'bouncy' },
      { x: 3180, y: 320, w: 200, h: 14, type: 'oneway' },
      { x: 3440, y: 240, w: 200, h: 14, type: 'oneway' },
      { x: 3700, y: 160, w: 280, h: 18, type: 'ground' },  // checkpoint 2 platform
      // Segment 5: final cannon-launch sprint into goal
      { x: 4200, y: 200, w: 200, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 200,  y: 510, w: 340,  h: 30, type: 'spikes' },
      { x: 720,  y: 510, w: 340,  h: 30, type: 'spikes' },
      { x: 1240, y: 510, w: 100,  h: 30, type: 'spikes' },
      { x: 1560, y: 510, w: 1360, h: 30, type: 'spikes' },
      { x: 3120, y: 510, w: 580,  h: 30, type: 'spikes' },
    ],
    platforms: [
      // Segment 1 falling chain (alt path through cannons)
      // none — cannons handle traversal
    ],
    cannons: [
      // Segment 1: cross-pit cannon shots
      { x: 140, y: 400, w: 70, h: 70, angle: -30, power: 880 },
      { x: 660, y: 400, w: 70, h: 70, angle: -30, power: 880 },
      // Segment 5 launcher into the goal
      { x: 3920, y: 80, w: 70, h: 70, angle: -10, power: 950 },
    ],
    climbs: [
      // Segment 2 tower
      { x: 1480, y: 280, w: 50, h: 200 },
    ],
    ropes: [
      // Segment 3 rope swing
      { x: 2020, y: 80, length: 220 },
    ],
    ziplines: [
      // Segment 3 zipline down off ice ledge
      { x1: 2420, y1: 260, x2: 2920, y2: 460 },
    ],
    checkpoints: [
      { x: 1820, y: 220, w: 40, h: 60 },   // top of climb tower
      { x: 3820, y: 100, w: 40, h: 60 },   // top of oneway ascent
    ],
    coins: [
      { x: 320, y: 320 }, { x: 460, y: 260 },
      { x: 840, y: 320 }, { x: 980, y: 260 },
      { x: 1400, y: 380 }, { x: 1500, y: 200 }, { x: 1700, y: 200 },
      { x: 1900, y: 240 }, { x: 2050, y: 200 }, { x: 2280, y: 240 }, { x: 2620, y: 360 },
      { x: 3020, y: 380 }, { x: 3220, y: 280 }, { x: 3480, y: 200 }, { x: 3760, y: 120 },
      { x: 4000, y: 60  }, { x: 4250, y: 160 },
    ],
  },

  // ===================================================================
  // PART TWO — NEON CYBER CITY (levels 38 - 47)
  // ===================================================================

  {
    name: '38 · Boot Sequence',
    width: 2200,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2120, y: 380 },
    sky: '#1a0a2e',
    tiles: [
      { x: 0,    y: 480, w: 500, h: 60, type: 'ground' },
      { x: 620,  y: 480, w: 380, h: 60, type: 'ground' },
      { x: 1080, y: 420, w: 100, h: 18, type: 'branch' },
      { x: 1240, y: 360, w: 100, h: 18, type: 'branch' },
      { x: 1400, y: 480, w: 260, h: 60, type: 'ground' },
      { x: 1680, y: 480, w: 100, h: 60, type: 'bouncy' },
      { x: 1900, y: 320, w: 160, h: 18, type: 'branch' },
      { x: 2000, y: 480, w: 200, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 500,  y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 1000, y: 510, w: 400, h: 30, type: 'spikes' },
      { x: 1780, y: 510, w: 120, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 360, y: 420 }, { x: 800, y: 420 },
      { x: 1100, y: 380 }, { x: 1260, y: 320 },
      { x: 1500, y: 420 }, { x: 1960, y: 280 },
      { x: 2080, y: 420 },
    ],
  },

  {
    name: '39 · Holo-Rooftops',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2320, y: 100 },
    sky: '#21063a',
    tiles: [
      { x: 0,    y: 480, w: 360, h: 60, type: 'ground' },
      // rising holograms — pass through from below, land on top
      { x: 420,  y: 420, w: 140, h: 14, type: 'oneway' },
      { x: 620,  y: 360, w: 140, h: 14, type: 'oneway' },
      { x: 820,  y: 300, w: 140, h: 14, type: 'oneway' },
      // mid rooftop with one-way ceiling above
      { x: 1020, y: 300, w: 220, h: 18, type: 'ground' },
      { x: 1080, y: 220, w: 160, h: 14, type: 'oneway' },
      // ascending hologram zigzag
      { x: 1320, y: 260, w: 140, h: 14, type: 'oneway' },
      { x: 1520, y: 200, w: 140, h: 14, type: 'oneway' },
      { x: 1720, y: 240, w: 140, h: 14, type: 'oneway' },
      { x: 1920, y: 180, w: 140, h: 14, type: 'oneway' },
      // final rooftop with goal
      { x: 2160, y: 160, w: 240, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 360, y: 530, w: 2040, h: 10, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 200, y: 420 }, { x: 480, y: 380 }, { x: 680, y: 320 }, { x: 880, y: 260 },
      { x: 1100, y: 260 }, { x: 1140, y: 180 },
      { x: 1380, y: 220 }, { x: 1580, y: 160 }, { x: 1780, y: 200 }, { x: 1980, y: 140 },
      { x: 2240, y: 120 },
    ],
  },

  {
    name: '40 · Light Bridges',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 320 },
    goal:  { x: 2700, y: 220 },
    sky: '#100a3e',
    tiles: [
      // start skyscraper
      { x: 0,    y: 420, w: 320, h: 120, type: 'ground' },
      // mid skyscraper
      { x: 1080, y: 500, w: 280, h: 40, type: 'ground' },
      { x: 1100, y: 360, w: 260, h: 18, type: 'ground' },
      // third skyscraper
      { x: 1820, y: 440, w: 260, h: 100, type: 'ground' },
      // final skyscraper
      { x: 2520, y: 320, w: 280, h: 220, type: 'ground' },
    ],
    hazards: [
      { x: 320,  y: 530, w: 760,  h: 10, type: 'spikes' },
      { x: 1360, y: 530, w: 460,  h: 10, type: 'spikes' },
      { x: 2080, y: 530, w: 440,  h: 10, type: 'spikes' },
    ],
    platforms: [],
    ziplines: [
      { x1: 320,  y1: 360, x2: 1080, y2: 480 },
      { x1: 1360, y1: 300, x2: 1820, y2: 420 },
      { x1: 2080, y1: 380, x2: 2520, y2: 320 },
    ],
    coins: [
      { x: 160, y: 360 },
      { x: 600, y: 420 }, { x: 820, y: 460 },
      { x: 1200, y: 300 }, { x: 1500, y: 280 },
      { x: 1900, y: 380 }, { x: 2280, y: 360 },
      { x: 2640, y: 260 },
    ],
  },

  {
    name: '41 · Server Stacks',
    width: 2000,
    height: 540,
    spawn: { x: 60, y: 480 },
    goal:  { x: 1880, y: 100 },
    sky: '#2a0a3e',
    tiles: [
      // entry deck
      { x: 0,   y: 480, w: 280, h: 60, type: 'ground' },
      // first wall-jump shaft (width 160)
      { x: 360, y: 220, w: 40, h: 320, type: 'wall' },
      { x: 520, y: 100, w: 40, h: 440, type: 'wall' },
      // ledge to break shaft
      { x: 400, y: 200, w: 120, h: 14, type: 'branch' },
      // platform after first shaft
      { x: 620, y: 160, w: 180, h: 18, type: 'ground' },
      // climbable antenna leading up
      { x: 880, y: 480, w: 60, h: 60, type: 'ground' },
      // second wall-jump shaft (width 170)
      { x: 1080, y: 200, w: 40, h: 340, type: 'wall' },
      { x: 1250, y: 80,  w: 40, h: 460, type: 'wall' },
      // catch ledge near top
      { x: 1120, y: 120, w: 130, h: 14, type: 'branch' },
      // bridge to goal tower
      { x: 1320, y: 100, w: 200, h: 18, type: 'ground' },
      // hover-disc up to goal platform
      { x: 1560, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 1700, y: 200, w: 80,  h: 14, type: 'branch' },
      { x: 1820, y: 160, w: 180, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 280, y: 530, w: 600, h: 10, type: 'spikes' },
      { x: 940, y: 530, w: 140, h: 10, type: 'spikes' },
      { x: 1290, y: 530, w: 270, h: 10, type: 'spikes' },
      { x: 1640, y: 530, w: 60, h: 10, type: 'spikes' },
    ],
    platforms: [],
    climbs: [
      { x: 890, y: 200, w: 40, h: 280 },
      { x: 1820, y: 120, w: 40, h: 60 },
    ],
    coins: [
      { x: 160, y: 420 },
      { x: 440, y: 160 }, { x: 460, y: 380 },
      { x: 700, y: 120 },
      { x: 900, y: 360 }, { x: 905, y: 240 },
      { x: 1180, y: 80  }, { x: 1180, y: 320 },
      { x: 1420, y: 60  },
      { x: 1740, y: 160 }, { x: 1880, y: 120 },
    ],
  },

  {
    name: '42 · Bouncepads.exe',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#3a0a2a',
    tiles: [
      { x: 0,    y: 480, w: 240, h: 60, type: 'ground' },
      // bouncy chain over spike pit
      { x: 360,  y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 540,  y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 720,  y: 480, w: 80,  h: 60, type: 'bouncy' },
      // catch branch chain across the top
      { x: 480,  y: 200, w: 120, h: 14, type: 'branch' },
      { x: 680,  y: 200, w: 120, h: 14, type: 'branch' },
      { x: 880,  y: 200, w: 120, h: 14, type: 'branch' },
      // mid ground refuge
      { x: 1040, y: 480, w: 220, h: 60, type: 'ground' },
      // higher bouncy + branch puzzle
      { x: 1320, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 1440, y: 320, w: 140, h: 14, type: 'branch' },
      { x: 1620, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 1740, y: 280, w: 140, h: 14, type: 'branch' },
      { x: 1920, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 2040, y: 240, w: 140, h: 14, type: 'branch' },
      // final stretch
      { x: 2240, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 2360, y: 320, w: 160, h: 14, type: 'branch' },
      { x: 2560, y: 480, w: 240, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 240,  y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 440,  y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 620,  y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 800,  y: 510, w: 240, h: 30, type: 'spikes' },
      { x: 1260, y: 510, w: 60,  h: 30, type: 'spikes' },
      { x: 1400, y: 510, w: 220, h: 30, type: 'spikes' },
      { x: 1700, y: 510, w: 220, h: 30, type: 'spikes' },
      { x: 2000, y: 510, w: 240, h: 30, type: 'spikes' },
      { x: 2320, y: 510, w: 240, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 400, y: 380 }, { x: 580, y: 380 }, { x: 760, y: 380 },
      { x: 540, y: 160 }, { x: 740, y: 160 }, { x: 940, y: 160 },
      { x: 1140, y: 420 },
      { x: 1500, y: 280 }, { x: 1800, y: 240 }, { x: 2100, y: 200 },
      { x: 2440, y: 280 }, { x: 2680, y: 420 },
    ],
  },

  {
    name: '43 · Glitch Falls',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#0a0a3a',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      // mid safe ground
      { x: 1180, y: 480, w: 220, h: 60, type: 'ground' },
      // final ground
      { x: 2400, y: 480, w: 400, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 510, w: 900, h: 30, type: 'spikes' },
      { x: 1400, y: 510, w: 1000, h: 30, type: 'spikes' },
    ],
    platforms: [
      // first glitch sequence — descending
      { x: 320,  y: 420, w: 90, h: 14, fall: true, delay: 0.35 },
      { x: 460,  y: 380, w: 90, h: 14, fall: true, delay: 0.35 },
      { x: 600,  y: 360, w: 90, h: 14, fall: true, delay: 0.35 },
      { x: 740,  y: 360, w: 90, h: 14, fall: true, delay: 0.35 },
      { x: 880,  y: 380, w: 90, h: 14, fall: true, delay: 0.35 },
      { x: 1020, y: 420, w: 90, h: 14, fall: true, delay: 0.35 },
      // second sequence — rising arc, faster decay
      { x: 1440, y: 420, w: 90, h: 14, fall: true, delay: 0.25 },
      { x: 1580, y: 360, w: 90, h: 14, fall: true, delay: 0.25 },
      { x: 1720, y: 300, w: 90, h: 14, fall: true, delay: 0.25 },
      { x: 1860, y: 260, w: 90, h: 14, fall: true, delay: 0.25 },
      { x: 2000, y: 300, w: 90, h: 14, fall: true, delay: 0.25 },
      { x: 2140, y: 360, w: 90, h: 14, fall: true, delay: 0.25 },
      { x: 2280, y: 420, w: 90, h: 14, fall: true, delay: 0.25 },
    ],
    coins: [
      { x: 360, y: 380 }, { x: 500, y: 340 }, { x: 640, y: 320 }, { x: 780, y: 320 }, { x: 920, y: 340 }, { x: 1060, y: 380 },
      { x: 1240, y: 420 },
      { x: 1480, y: 380 }, { x: 1620, y: 320 }, { x: 1760, y: 260 }, { x: 1900, y: 220 },
      { x: 2040, y: 260 }, { x: 2180, y: 320 }, { x: 2320, y: 380 },
      { x: 2520, y: 420 },
    ],
  },

  {
    name: '44 · Cryo Coolant',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2500, y: 380 },
    sky: '#0a263a',
    tiles: [
      { x: 0,    y: 480, w: 240, h: 60, type: 'ground' },
      // long slippery deck
      { x: 240,  y: 480, w: 520, h: 60, type: 'ice' },
      // gap with moving drone lift below
      { x: 1020, y: 480, w: 200, h: 60, type: 'ice' },
      // mid ice island
      { x: 1480, y: 380, w: 220, h: 18, type: 'ice' },
      // upper ice ledge
      { x: 1820, y: 280, w: 220, h: 18, type: 'ice' },
      // final solid landing
      { x: 2280, y: 480, w: 320, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 760,  y: 510, w: 260, h: 30, type: 'spikes' },
      { x: 1220, y: 510, w: 260, h: 30, type: 'spikes' },
      { x: 1700, y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 2040, y: 510, w: 240, h: 30, type: 'spikes' },
    ],
    platforms: [
      // drone lift bridging the first gap (x-axis sweep)
      { x: 820,  y: 460, w: 140, h: 16, move: { axis: 'x', range: 120, speed: 70 } },
      // vertical drone bridging up to ice island
      { x: 1320, y: 460, w: 120, h: 16, move: { axis: 'y', range: 90,  speed: 55 } },
      // diagonal drone connecting two ice ledges
      { x: 2100, y: 360, w: 120, h: 16, move: { axis: 'xy', range: 120, speed: 55 } },
    ],
    coins: [
      { x: 320, y: 420 }, { x: 520, y: 420 }, { x: 720, y: 420 },
      { x: 900, y: 400 },
      { x: 1100, y: 420 }, { x: 1380, y: 400 },
      { x: 1560, y: 320 }, { x: 1900, y: 220 }, { x: 2160, y: 300 },
      { x: 2360, y: 420 },
    ],
  },

  {
    name: '45 · Drone Highway',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2720, y: 380 },
    sky: '#1a0a40',
    tiles: [
      { x: 0,    y: 480, w: 260, h: 60, type: 'ground' },
      // small refuge mid-route
      { x: 1100, y: 460, w: 160, h: 18, type: 'ground' },
      // hangar wall to swing past
      { x: 1820, y: 360, w: 200, h: 18, type: 'ground' },
      // landing for goal run
      { x: 2520, y: 480, w: 280, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 260,  y: 530, w: 840,  h: 10, type: 'spikes' },
      { x: 1260, y: 530, w: 560,  h: 10, type: 'spikes' },
      { x: 2020, y: 530, w: 500,  h: 10, type: 'spikes' },
    ],
    platforms: [
      // diagonal drone over first pit
      { x: 320,  y: 400, w: 120, h: 16, move: { axis: 'xy', range: 140, speed: 60 } },
      // horizontal drone shuttle
      { x: 620,  y: 360, w: 140, h: 16, move: { axis: 'x', range: 160, speed: 80 } },
      // vertical drone elevator before refuge
      { x: 920,  y: 440, w: 120, h: 16, move: { axis: 'y', range: 110, speed: 55 } },
      // diagonal drone after refuge
      { x: 1320, y: 400, w: 120, h: 16, move: { axis: 'xy', range: 130, speed: 65 } },
      // vertical drone before rope grab zone
      { x: 1620, y: 420, w: 120, h: 16, move: { axis: 'y', range: 80,  speed: 50 } },
      // post-rope diagonal drone to goal landing
      { x: 2280, y: 380, w: 120, h: 16, move: { axis: 'xy', range: 120, speed: 60 } },
    ],
    ropes: [
      // power cables across hangar
      { x: 1960, y: 80,  length: 240 },
      { x: 2160, y: 80,  length: 240 },
    ],
    coins: [
      { x: 360, y: 340 }, { x: 660, y: 300 }, { x: 960, y: 360 },
      { x: 1180, y: 400 },
      { x: 1360, y: 340 }, { x: 1660, y: 360 },
      { x: 1900, y: 280 }, { x: 2100, y: 280 },
      { x: 2320, y: 320 }, { x: 2620, y: 420 },
    ],
  },

  {
    name: '46 · The Megaplex',
    width: 3200,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3120, y: 200 },
    sky: '#180538',
    tiles: [
      // Segment 1: cannon shoot into climb tower
      { x: 0,    y: 480, w: 240, h: 60, type: 'ground' },
      { x: 660,  y: 480, w: 200, h: 60, type: 'ground' },
      // Segment 2: climb tower to high deck
      { x: 860,  y: 200, w: 200, h: 18, type: 'ground' },
      // Segment 3: hologram ascent
      { x: 1140, y: 240, w: 140, h: 14, type: 'oneway' },
      { x: 1340, y: 180, w: 140, h: 14, type: 'oneway' },
      { x: 1540, y: 220, w: 140, h: 14, type: 'oneway' },
      { x: 1740, y: 160, w: 200, h: 18, type: 'ground' },
      // Segment 4: ice slide into bouncy
      { x: 1940, y: 160, w: 360, h: 18, type: 'ice' },
      { x: 2380, y: 480, w: 80,  h: 60, type: 'bouncy' },
      // Segment 5: catwalk run + final platform
      { x: 2540, y: 280, w: 160, h: 14, type: 'branch' },
      { x: 2760, y: 240, w: 160, h: 14, type: 'branch' },
      { x: 2980, y: 240, w: 220, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 240,  y: 510, w: 420, h: 30, type: 'spikes' },
      { x: 860,  y: 530, w: 1080, h: 10, type: 'spikes' },
      { x: 1940, y: 530, w: 440, h: 10, type: 'spikes' },
      { x: 2460, y: 530, w: 520, h: 10, type: 'spikes' },
    ],
    platforms: [],
    cannons: [
      { x: 160, y: 400, w: 70, h: 70, angle: -25, power: 880 },
    ],
    climbs: [
      { x: 880, y: 220, w: 40, h: 260 },
    ],
    ropes: [
      { x: 2500, y: 60, length: 180 },
    ],
    ziplines: [
      { x1: 2300, y1: 140, x2: 2540, y2: 260 },
    ],
    coins: [
      { x: 360, y: 320 }, { x: 540, y: 280 }, { x: 760, y: 420 },
      { x: 900, y: 160 }, { x: 1000, y: 360 },
      { x: 1200, y: 200 }, { x: 1400, y: 140 }, { x: 1600, y: 180 }, { x: 1800, y: 120 },
      { x: 2000, y: 120 }, { x: 2200, y: 120 },
      { x: 2420, y: 320 }, { x: 2620, y: 240 }, { x: 2840, y: 200 },
      { x: 3060, y: 200 },
    ],
  },

  {
    name: '47 · Mainframe Override',
    width: 4000,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3920, y: 100 },
    sky: '#0a0418',
    tiles: [
      // Segment 1: cannon volley across spike pit
      { x: 0,    y: 480, w: 220, h: 60, type: 'ground' },
      { x: 560,  y: 480, w: 200, h: 60, type: 'ground' },
      { x: 1000, y: 480, w: 200, h: 60, type: 'ground' },
      // Segment 2: wall-jump tower up to checkpoint deck
      { x: 1280, y: 220, w: 40,  h: 320, type: 'wall' },
      { x: 1440, y: 100, w: 40,  h: 440, type: 'wall' },
      { x: 1320, y: 200, w: 120, h: 14, type: 'branch' },
      { x: 1480, y: 100, w: 220, h: 18, type: 'ground' },   // checkpoint deck
      // Segment 3: rope swing to ice slide to zipline
      { x: 1980, y: 240, w: 220, h: 18, type: 'ice' },
      // Segment 4: hologram zigzag with bouncy assist
      { x: 2680, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 2880, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 3020, y: 320, w: 160, h: 14, type: 'oneway' },
      { x: 3220, y: 260, w: 160, h: 14, type: 'oneway' },
      { x: 3420, y: 200, w: 240, h: 18, type: 'ground' },   // checkpoint 2 deck
      // Segment 5: final cannon launch to goal
      { x: 3820, y: 160, w: 200, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 220,  y: 510, w: 340, h: 30, type: 'spikes' },
      { x: 760,  y: 510, w: 240, h: 30, type: 'spikes' },
      { x: 1200, y: 510, w: 240, h: 30, type: 'spikes' },
      { x: 1480, y: 530, w: 1200, h: 10, type: 'spikes' },
      { x: 2960, y: 530, w: 460, h: 10, type: 'spikes' },
    ],
    platforms: [],
    cannons: [
      // Segment 1 cross-pit volley
      { x: 160, y: 400, w: 70, h: 70, angle: -28, power: 900 },
      { x: 680, y: 400, w: 70, h: 70, angle: -28, power: 900 },
      // Final cannon launching toward the goal
      { x: 3660, y: 80, w: 70, h: 70, angle: -12, power: 940 },
    ],
    climbs: [
      // Antenna up the side of checkpoint deck
      { x: 1490, y: 120, w: 40, h: 60 },
    ],
    ropes: [
      // Power cable for Segment 3 swing
      { x: 1780, y: 60, length: 220 },
    ],
    ziplines: [
      // Data stream off the ice ledge down to Segment 4 ground
      { x1: 2200, y1: 220, x2: 2680, y2: 460 },
    ],
    checkpoints: [
      { x: 1580, y: 40,  w: 40, h: 60 },   // top of wall-jump tower
      { x: 3540, y: 140, w: 40, h: 60 },   // post-hologram deck
    ],
    coins: [
      { x: 320, y: 320 }, { x: 480, y: 260 },
      { x: 880, y: 320 }, { x: 1100, y: 320 },
      { x: 1360, y: 160 }, { x: 1380, y: 360 },
      { x: 1560, y: 60  }, { x: 1640, y: 60  },
      { x: 1820, y: 180 }, { x: 2040, y: 200 }, { x: 2160, y: 180 },
      { x: 2400, y: 320 }, { x: 2780, y: 420 },
      { x: 3080, y: 280 }, { x: 3280, y: 220 }, { x: 3520, y: 160 },
      { x: 3760, y: 80  }, { x: 3880, y: 120 },
    ],
  },

  // ===================================================================
  // PART THREE — ASTRAL VOID (levels 48 - 62)
  // ===================================================================

  {
    name: '48 · Liftoff',
    width: 2200,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2120, y: 380 },
    sky: '#050518',
    tiles: [
      { x: 0,    y: 480, w: 460, h: 60, type: 'ground' },
      { x: 580,  y: 440, w: 100, h: 18, type: 'branch' },
      { x: 740,  y: 480, w: 360, h: 60, type: 'ground' },
      { x: 1200, y: 420, w: 100, h: 18, type: 'branch' },
      { x: 1360, y: 360, w: 100, h: 18, type: 'branch' },
      { x: 1520, y: 480, w: 220, h: 60, type: 'ground' },
      { x: 1780, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 1900, y: 320, w: 120, h: 18, type: 'branch' },
      { x: 2000, y: 480, w: 200, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 460,  y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 680,  y: 510, w: 60,  h: 30, type: 'spikes' },
      { x: 1100, y: 510, w: 420, h: 30, type: 'spikes' },
      { x: 1740, y: 510, w: 40,  h: 30, type: 'spikes' },
      { x: 1860, y: 510, w: 140, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 240, y: 420 }, { x: 620, y: 380 }, { x: 920, y: 420 },
      { x: 1220, y: 380 }, { x: 1380, y: 320 },
      { x: 1620, y: 420 }, { x: 1940, y: 280 },
      { x: 2080, y: 420 },
    ],
  },

  {
    name: '49 · Asteroid Belt',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2320, y: 320 },
    sky: '#0a0a2e',
    tiles: [
      { x: 0,    y: 480, w: 220, h: 60, type: 'ground' },
      { x: 320,  y: 440, w: 140, h: 24, type: 'ground' },
      { x: 540,  y: 400, w: 140, h: 24, type: 'ground' },
      { x: 760,  y: 360, w: 140, h: 24, type: 'ground' },
      { x: 980,  y: 400, w: 140, h: 24, type: 'ground' },
      { x: 1200, y: 440, w: 140, h: 24, type: 'ground' },
      { x: 1420, y: 380, w: 80,  h: 18, type: 'branch' },
      { x: 1580, y: 420, w: 180, h: 30, type: 'ground' },
      { x: 1840, y: 360, w: 120, h: 24, type: 'ground' },
      { x: 2040, y: 320, w: 120, h: 24, type: 'ground' },
      { x: 2240, y: 380, w: 180, h: 30, type: 'ground' },
    ],
    hazards: [
      { x: 220, y: 530, w: 2180, h: 10, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 380, y: 380 }, { x: 600, y: 340 }, { x: 820, y: 300 },
      { x: 1040, y: 340 }, { x: 1260, y: 380 },
      { x: 1460, y: 320 }, { x: 1660, y: 360 },
      { x: 1900, y: 300 }, { x: 2100, y: 260 }, { x: 2300, y: 320 },
    ],
  },

  {
    name: '50 · Comet Trail',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 280 },
    goal:  { x: 2700, y: 240 },
    sky: '#000010',
    tiles: [
      { x: 0,    y: 380, w: 280, h: 160, type: 'ground' },
      { x: 1000, y: 460, w: 240, h: 80,  type: 'ground' },
      { x: 1020, y: 320, w: 220, h: 18,  type: 'ground' },
      { x: 1700, y: 400, w: 240, h: 140, type: 'ground' },
      { x: 2520, y: 340, w: 280, h: 200, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 720, h: 10, type: 'spikes' },
      { x: 1240, y: 530, w: 460, h: 10, type: 'spikes' },
      { x: 1940, y: 530, w: 580, h: 10, type: 'spikes' },
    ],
    platforms: [],
    ziplines: [
      { x1: 280,  y1: 320, x2: 1000, y2: 440 },
      { x1: 1240, y1: 280, x2: 1700, y2: 380 },
      { x1: 1940, y1: 340, x2: 2520, y2: 320 },
    ],
    coins: [
      { x: 160, y: 320 },
      { x: 540, y: 360 }, { x: 780, y: 400 },
      { x: 1100, y: 260 }, { x: 1400, y: 240 },
      { x: 1800, y: 340 },
      { x: 2120, y: 300 }, { x: 2380, y: 280 },
      { x: 2620, y: 280 },
    ],
  },

  {
    name: '51 · Lunar Frostfield',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2320, y: 380 },
    sky: '#000a1a',
    tiles: [
      { x: 0,    y: 480, w: 180, h: 60, type: 'ground' },
      { x: 180,  y: 480, w: 480, h: 60, type: 'ice' },
      { x: 820,  y: 480, w: 300, h: 60, type: 'ice' },
      { x: 1200, y: 400, w: 200, h: 18, type: 'ice' },
      { x: 1480, y: 480, w: 460, h: 60, type: 'ice' },
      { x: 2080, y: 480, w: 320, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 660,  y: 510, w: 160, h: 30, type: 'spikes' },
      { x: 1120, y: 510, w: 80,  h: 30, type: 'spikes' },
      { x: 1400, y: 510, w: 80,  h: 30, type: 'spikes' },
      { x: 1940, y: 510, w: 140, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 240, y: 420 }, { x: 400, y: 420 }, { x: 580, y: 420 },
      { x: 900, y: 420 }, { x: 1060, y: 420 },
      { x: 1260, y: 340 },
      { x: 1540, y: 420 }, { x: 1720, y: 420 }, { x: 1880, y: 420 },
      { x: 2200, y: 420 },
    ],
  },

  {
    name: '52 · Solar Sails',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2320, y: 100 },
    sky: '#0a0028',
    tiles: [
      { x: 0,    y: 480, w: 320, h: 60, type: 'ground' },
      { x: 400,  y: 420, w: 160, h: 14, type: 'oneway' },
      { x: 620,  y: 360, w: 160, h: 14, type: 'oneway' },
      { x: 840,  y: 300, w: 160, h: 14, type: 'oneway' },
      { x: 1060, y: 280, w: 200, h: 18, type: 'ground' },
      { x: 1320, y: 240, w: 160, h: 14, type: 'oneway' },
      { x: 1540, y: 200, w: 160, h: 14, type: 'oneway' },
      { x: 1760, y: 160, w: 160, h: 14, type: 'oneway' },
      { x: 1980, y: 160, w: 420, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 320, y: 530, w: 2080, h: 10, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 200, y: 420 }, { x: 460, y: 380 }, { x: 680, y: 320 }, { x: 900, y: 260 },
      { x: 1140, y: 240 },
      { x: 1380, y: 200 }, { x: 1600, y: 160 }, { x: 1820, y: 120 },
      { x: 2040, y: 120 }, { x: 2280, y: 120 },
    ],
  },

  {
    name: '53 · Gravity Wells',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#050518',
    tiles: [
      { x: 0,    y: 480, w: 220, h: 60, type: 'ground' },
      { x: 320,  y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 500,  y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 680,  y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 440,  y: 220, w: 100, h: 14, type: 'branch' },
      { x: 620,  y: 220, w: 100, h: 14, type: 'branch' },
      { x: 860,  y: 480, w: 220, h: 60, type: 'ground' },
      { x: 1140, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 1280, y: 320, w: 140, h: 14, type: 'branch' },
      { x: 1460, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 1600, y: 280, w: 140, h: 14, type: 'branch' },
      { x: 1780, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 1920, y: 240, w: 140, h: 14, type: 'branch' },
      { x: 2100, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 2240, y: 320, w: 160, h: 14, type: 'branch' },
      { x: 2440, y: 480, w: 360, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 220,  y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 400,  y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 580,  y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 760,  y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 1080, y: 510, w: 60,  h: 30, type: 'spikes' },
      { x: 1220, y: 510, w: 240, h: 30, type: 'spikes' },
      { x: 1540, y: 510, w: 240, h: 30, type: 'spikes' },
      { x: 1860, y: 510, w: 240, h: 30, type: 'spikes' },
      { x: 2180, y: 510, w: 260, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 360, y: 380 }, { x: 540, y: 380 }, { x: 720, y: 380 },
      { x: 480, y: 180 }, { x: 660, y: 180 },
      { x: 960, y: 420 },
      { x: 1340, y: 280 }, { x: 1660, y: 240 }, { x: 1980, y: 200 },
      { x: 2320, y: 280 }, { x: 2560, y: 420 },
    ],
  },

  {
    name: '54 · Dark Matter Drift',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#08001a',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      { x: 1180, y: 480, w: 220, h: 60, type: 'ground' },
      { x: 2400, y: 480, w: 400, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 900,  h: 10, type: 'spikes' },
      { x: 1400, y: 530, w: 1000, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 320,  y: 420, w: 90, h: 14, fall: true, delay: 0.32 },
      { x: 460,  y: 400, w: 90, h: 14, fall: true, delay: 0.32 },
      { x: 600,  y: 380, w: 90, h: 14, fall: true, delay: 0.32 },
      { x: 740,  y: 380, w: 90, h: 14, fall: true, delay: 0.32 },
      { x: 880,  y: 400, w: 90, h: 14, fall: true, delay: 0.32 },
      { x: 1020, y: 420, w: 90, h: 14, fall: true, delay: 0.32 },
      { x: 1440, y: 420, w: 90, h: 14, fall: true, delay: 0.24 },
      { x: 1580, y: 360, w: 90, h: 14, fall: true, delay: 0.24 },
      { x: 1720, y: 300, w: 90, h: 14, fall: true, delay: 0.24 },
      { x: 1860, y: 260, w: 90, h: 14, fall: true, delay: 0.24 },
      { x: 2000, y: 300, w: 90, h: 14, fall: true, delay: 0.24 },
      { x: 2140, y: 360, w: 90, h: 14, fall: true, delay: 0.24 },
      { x: 2280, y: 420, w: 90, h: 14, fall: true, delay: 0.24 },
    ],
    coins: [
      { x: 360, y: 380 }, { x: 500, y: 360 }, { x: 640, y: 340 }, { x: 780, y: 340 }, { x: 920, y: 360 }, { x: 1060, y: 380 },
      { x: 1240, y: 420 },
      { x: 1480, y: 380 }, { x: 1620, y: 320 }, { x: 1760, y: 260 }, { x: 1900, y: 220 },
      { x: 2040, y: 260 }, { x: 2180, y: 320 }, { x: 2320, y: 380 },
      { x: 2520, y: 420 },
    ],
  },

  {
    name: '55 · Station Climb',
    width: 2000,
    height: 540,
    spawn: { x: 60, y: 480 },
    goal:  { x: 1880, y: 100 },
    sky: '#000a1a',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      { x: 360,  y: 220, w: 40,  h: 320, type: 'wall' },
      { x: 520,  y: 100, w: 40,  h: 440, type: 'wall' },
      { x: 400,  y: 200, w: 120, h: 14, type: 'branch' },
      { x: 620,  y: 160, w: 180, h: 18, type: 'ground' },
      { x: 880,  y: 480, w: 60,  h: 60, type: 'ground' },
      { x: 1080, y: 200, w: 40,  h: 340, type: 'wall' },
      { x: 1250, y: 80,  w: 40,  h: 460, type: 'wall' },
      { x: 1120, y: 120, w: 130, h: 14, type: 'branch' },
      { x: 1320, y: 100, w: 200, h: 18, type: 'ground' },
      { x: 1560, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 1700, y: 200, w: 80,  h: 14, type: 'branch' },
      { x: 1820, y: 160, w: 180, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 600, h: 10, type: 'spikes' },
      { x: 940,  y: 530, w: 140, h: 10, type: 'spikes' },
      { x: 1290, y: 530, w: 270, h: 10, type: 'spikes' },
      { x: 1640, y: 530, w: 60,  h: 10, type: 'spikes' },
    ],
    platforms: [],
    climbs: [
      { x: 890,  y: 200, w: 40, h: 280 },
      { x: 1820, y: 120, w: 40, h: 60 },
    ],
    coins: [
      { x: 160, y: 420 },
      { x: 440, y: 160 }, { x: 460, y: 360 },
      { x: 700, y: 120 },
      { x: 900, y: 360 }, { x: 905, y: 240 },
      { x: 1180, y: 80  }, { x: 1180, y: 320 },
      { x: 1420, y: 60  },
      { x: 1740, y: 160 }, { x: 1880, y: 120 },
    ],
  },

  {
    name: '56 · Nebula Currents',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#0a0028',
    tiles: [
      { x: 0,    y: 480, w: 260, h: 60, type: 'ground' },
      { x: 1100, y: 460, w: 180, h: 18, type: 'ground' },
      { x: 1920, y: 400, w: 200, h: 18, type: 'ground' },
      { x: 2520, y: 480, w: 280, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 260,  y: 530, w: 840, h: 10, type: 'spikes' },
      { x: 1280, y: 530, w: 640, h: 10, type: 'spikes' },
      { x: 2120, y: 530, w: 400, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 320,  y: 440, w: 120, h: 16, move: { axis: 'x', range: 140, speed: 70 } },
      { x: 580,  y: 400, w: 120, h: 16, move: { axis: 'x', range: 160, speed: 85 } },
      { x: 840,  y: 440, w: 120, h: 16, move: { axis: 'x', range: 140, speed: 70 } },
      { x: 1340, y: 420, w: 120, h: 16, move: { axis: 'x', range: 160, speed: 80 } },
      { x: 1600, y: 380, w: 120, h: 16, move: { axis: 'x', range: 160, speed: 90 } },
      { x: 2200, y: 420, w: 120, h: 16, move: { axis: 'x', range: 140, speed: 75 } },
      { x: 2400, y: 440, w: 120, h: 16, move: { axis: 'x', range: 120, speed: 65 } },
    ],
    coins: [
      { x: 380, y: 380 }, { x: 640, y: 340 }, { x: 900, y: 380 },
      { x: 1180, y: 400 },
      { x: 1400, y: 360 }, { x: 1660, y: 320 },
      { x: 1980, y: 340 },
      { x: 2260, y: 360 }, { x: 2460, y: 380 },
      { x: 2620, y: 420 },
    ],
  },

  {
    name: '57 · Tractor Lanes',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#000010',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      { x: 1080, y: 480, w: 240, h: 60, type: 'ground' },
      { x: 1920, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 2480, y: 480, w: 320, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 800, h: 10, type: 'spikes' },
      { x: 1320, y: 530, w: 600, h: 10, type: 'spikes' },
      { x: 2120, y: 530, w: 360, h: 10, type: 'spikes' },
    ],
    platforms: [],
    ropes: [
      { x: 480,  y: 80, length: 280 },
      { x: 720,  y: 80, length: 280 },
      { x: 940,  y: 80, length: 280 },
      { x: 1520, y: 80, length: 280 },
      { x: 1740, y: 80, length: 280 },
      { x: 2280, y: 80, length: 260 },
    ],
    coins: [
      { x: 380, y: 320 },
      { x: 540, y: 260 }, { x: 760, y: 260 }, { x: 980, y: 260 },
      { x: 1200, y: 420 },
      { x: 1560, y: 280 }, { x: 1780, y: 280 },
      { x: 2020, y: 420 },
      { x: 2320, y: 280 }, { x: 2620, y: 420 },
    ],
  },

  {
    name: '58 · Orbital Rings',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 220 },
    sky: '#050518',
    tiles: [
      // Start deck (ground level), then ascending pillars
      { x: 0,    y: 480, w: 320, h: 60,  type: 'ground' },
      { x: 580,  y: 440, w: 240, h: 100, type: 'ground' },
      { x: 1080, y: 400, w: 240, h: 140, type: 'ground' },
      { x: 1580, y: 360, w: 240, h: 180, type: 'ground' },
      { x: 2080, y: 320, w: 240, h: 220, type: 'ground' },
      { x: 2520, y: 280, w: 280, h: 260, type: 'ground' },
    ],
    hazards: [
      { x: 320,  y: 530, w: 260, h: 10, type: 'spikes' },
      { x: 820,  y: 530, w: 260, h: 10, type: 'spikes' },
      { x: 1320, y: 530, w: 260, h: 10, type: 'spikes' },
      { x: 1820, y: 530, w: 260, h: 10, type: 'spikes' },
      { x: 2320, y: 530, w: 200, h: 10, type: 'spikes' },
    ],
    platforms: [],
    cannons: [
      // Each cannon sits on its pillar; bottom of cannon AABB = pillar top
      { x: 180,  y: 410, w: 70, h: 70, angle: -35, power: 920 },
      { x: 680,  y: 370, w: 70, h: 70, angle: -35, power: 900 },
      { x: 1180, y: 330, w: 70, h: 70, angle: -35, power: 900 },
      { x: 1680, y: 290, w: 70, h: 70, angle: -35, power: 900 },
      { x: 2180, y: 250, w: 70, h: 70, angle: -30, power: 880 },
    ],
    coins: [
      { x: 200,  y: 360 }, { x: 460,  y: 320 },
      { x: 700,  y: 320 }, { x: 940,  y: 280 },
      { x: 1200, y: 280 }, { x: 1440, y: 240 },
      { x: 1700, y: 240 }, { x: 1940, y: 200 },
      { x: 2200, y: 200 }, { x: 2440, y: 160 },
      { x: 2640, y: 220 },
    ],
  },

  {
    name: '59 · Eclipse Run',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#08001a',
    tiles: [
      { x: 0,    y: 480, w: 220, h: 60, type: 'ground' },
      { x: 220,  y: 480, w: 420, h: 60, type: 'ice' },
      { x: 1080, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 1340, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 1460, y: 280, w: 140, h: 14, type: 'branch' },
      { x: 1660, y: 280, w: 240, h: 18, type: 'ice' },
      { x: 1960, y: 380, w: 100, h: 18, type: 'ground' },
      { x: 2420, y: 480, w: 380, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 640,  y: 510, w: 440,  h: 30, type: 'spikes' },
      { x: 1280, y: 510, w: 60,   h: 30, type: 'spikes' },
      { x: 1420, y: 510, w: 1000, h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 740,  y: 440, w: 90, h: 14, fall: true, delay: 0.28 },
      { x: 880,  y: 440, w: 90, h: 14, fall: true, delay: 0.28 },
      { x: 1020, y: 440, w: 90, h: 14, fall: true, delay: 0.28 },
      { x: 2080, y: 420, w: 90, h: 14, fall: true, delay: 0.28 },
      { x: 2200, y: 400, w: 90, h: 14, fall: true, delay: 0.28 },
      { x: 2320, y: 420, w: 90, h: 14, fall: true, delay: 0.28 },
    ],
    coins: [
      { x: 320,  y: 420 }, { x: 480,  y: 420 }, { x: 620,  y: 420 },
      { x: 780,  y: 380 }, { x: 920,  y: 380 },
      { x: 1140, y: 420 },
      { x: 1500, y: 240 }, { x: 1700, y: 240 }, { x: 1900, y: 240 },
      { x: 2120, y: 360 }, { x: 2360, y: 380 }, { x: 2580, y: 420 },
    ],
  },

  {
    name: '60 · Quasar Cascade',
    width: 3000,
    height: 540,
    spawn: { x: 60, y: 280 },
    goal:  { x: 2900, y: 240 },
    sky: '#0a0028',
    tiles: [
      { x: 0,    y: 360, w: 280, h: 180, type: 'ground' },
      { x: 1080, y: 440, w: 220, h: 100, type: 'ground' },
      { x: 1120, y: 300, w: 180, h: 18,  type: 'ground' },
      { x: 1820, y: 380, w: 220, h: 18,  type: 'ground' },
      { x: 2360, y: 360, w: 100, h: 18,  type: 'ground' },
      { x: 2720, y: 360, w: 280, h: 180, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 800, h: 10, type: 'spikes' },
      { x: 1300, y: 530, w: 520, h: 10, type: 'spikes' },
      { x: 2040, y: 530, w: 320, h: 10, type: 'spikes' },
      { x: 2460, y: 530, w: 260, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 2480, y: 320, w: 100, h: 16, move: { axis: 'x',  range: 140, speed: 75 } },
      { x: 2620, y: 280, w: 100, h: 16, move: { axis: 'xy', range: 100, speed: 55 } },
    ],
    ropes: [
      { x: 1500, y: 60, length: 240 },
      { x: 1680, y: 60, length: 240 },
    ],
    ziplines: [
      { x1: 280,  y1: 320, x2: 1080, y2: 420 },
      { x1: 2040, y1: 340, x2: 2360, y2: 340 },
    ],
    coins: [
      { x: 160,  y: 320 },
      { x: 540,  y: 360 }, { x: 820,  y: 400 },
      { x: 1180, y: 260 },
      { x: 1540, y: 200 }, { x: 1720, y: 200 },
      { x: 1900, y: 340 },
      { x: 2200, y: 300 }, { x: 2520, y: 280 },
      { x: 2780, y: 320 },
    ],
  },

  {
    name: '61 · Galactic Core',
    width: 3200,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3120, y: 160 },
    sky: '#000010',
    tiles: [
      { x: 0,    y: 480, w: 240, h: 60, type: 'ground' },
      { x: 660,  y: 480, w: 200, h: 60, type: 'ground' },
      { x: 860,  y: 200, w: 200, h: 18, type: 'ground' },
      { x: 1140, y: 240, w: 140, h: 14, type: 'oneway' },
      { x: 1340, y: 180, w: 140, h: 14, type: 'oneway' },
      { x: 1540, y: 220, w: 140, h: 14, type: 'oneway' },
      { x: 1740, y: 160, w: 200, h: 18, type: 'ground' },
      { x: 1940, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 2080, y: 320, w: 140, h: 14, type: 'branch' },
      { x: 2280, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 2420, y: 260, w: 140, h: 14, type: 'branch' },
      { x: 2620, y: 220, w: 160, h: 14, type: 'branch' },
      { x: 2820, y: 200, w: 160, h: 14, type: 'branch' },
      { x: 3020, y: 200, w: 200, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 240,  y: 510, w: 420,  h: 30, type: 'spikes' },
      { x: 860,  y: 530, w: 1080, h: 10, type: 'spikes' },
      { x: 2020, y: 510, w: 260,  h: 30, type: 'spikes' },
      { x: 2360, y: 510, w: 260,  h: 30, type: 'spikes' },
      { x: 2620, y: 530, w: 400,  h: 10, type: 'spikes' },
    ],
    platforms: [],
    cannons: [
      { x: 160, y: 400, w: 70, h: 70, angle: -25, power: 880 },
    ],
    climbs: [
      { x: 880, y: 220, w: 40, h: 260 },
    ],
    coins: [
      { x: 360,  y: 320 }, { x: 540,  y: 280 }, { x: 760,  y: 420 },
      { x: 900,  y: 160 }, { x: 1000, y: 360 },
      { x: 1200, y: 200 }, { x: 1400, y: 140 }, { x: 1600, y: 180 }, { x: 1800, y: 120 },
      { x: 2140, y: 280 }, { x: 2480, y: 220 },
      { x: 2680, y: 180 }, { x: 2880, y: 160 }, { x: 3080, y: 160 },
    ],
  },

  {
    name: '62 · Singularity',
    width: 4400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 4300, y: 80 },
    sky: '#000000',
    tiles: [
      // Segment 1: cannon volley
      { x: 0,    y: 480, w: 220, h: 60, type: 'ground' },
      { x: 560,  y: 480, w: 200, h: 60, type: 'ground' },
      { x: 1000, y: 480, w: 200, h: 60, type: 'ground' },
      // Segment 2: wall-jump tower -> checkpoint 1
      { x: 1280, y: 220, w: 40,  h: 320, type: 'wall' },
      { x: 1440, y: 100, w: 40,  h: 440, type: 'wall' },
      { x: 1320, y: 200, w: 120, h: 14, type: 'branch' },
      { x: 1480, y: 100, w: 220, h: 18, type: 'ground' },
      // Segment 3: rope -> ice -> zipline
      { x: 1980, y: 240, w: 220, h: 18, type: 'ice' },
      // Segment 4: bouncy + oneway -> checkpoint 2
      { x: 2680, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 2880, y: 480, w: 80,  h: 60, type: 'bouncy' },
      { x: 3020, y: 320, w: 160, h: 14, type: 'oneway' },
      { x: 3220, y: 260, w: 160, h: 14, type: 'oneway' },
      { x: 3420, y: 200, w: 240, h: 18, type: 'ground' },
      // Segment 5: drift -> checkpoint 3 -> goal
      { x: 3820, y: 160, w: 200, h: 18, type: 'ground' },
      { x: 4200, y: 120, w: 200, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 220,  y: 510, w: 340,  h: 30, type: 'spikes' },
      { x: 760,  y: 510, w: 240,  h: 30, type: 'spikes' },
      { x: 1200, y: 510, w: 240,  h: 30, type: 'spikes' },
      { x: 1480, y: 530, w: 1200, h: 10, type: 'spikes' },
      { x: 2960, y: 530, w: 460,  h: 10, type: 'spikes' },
      { x: 3660, y: 530, w: 540,  h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 3700, y: 180, w: 100, h: 16, move: { axis: 'xy', range: 120, speed: 60 } },
      { x: 4040, y: 140, w: 100, h: 16, move: { axis: 'x',  range: 80,  speed: 55 } },
    ],
    cannons: [
      { x: 160, y: 400, w: 70, h: 70, angle: -28, power: 900 },
      { x: 680, y: 400, w: 70, h: 70, angle: -28, power: 900 },
    ],
    climbs: [
      { x: 1490, y: 120, w: 40, h: 60 },
    ],
    ropes: [
      { x: 1780, y: 60, length: 220 },
    ],
    ziplines: [
      { x1: 2200, y1: 220, x2: 2680, y2: 460 },
    ],
    checkpoints: [
      { x: 1580, y: 40,  w: 40, h: 60 },
      { x: 3540, y: 140, w: 40, h: 60 },
      { x: 3880, y: 100, w: 40, h: 60 },
    ],
    coins: [
      { x: 320,  y: 320 }, { x: 480,  y: 260 },
      { x: 880,  y: 320 }, { x: 1100, y: 320 },
      { x: 1360, y: 160 }, { x: 1380, y: 360 },
      { x: 1560, y: 60  }, { x: 1640, y: 60  },
      { x: 1820, y: 180 }, { x: 2040, y: 200 }, { x: 2160, y: 180 },
      { x: 2400, y: 320 }, { x: 2780, y: 420 },
      { x: 3080, y: 280 }, { x: 3280, y: 220 }, { x: 3520, y: 160 },
      { x: 3740, y: 140 }, { x: 4080, y: 100 }, { x: 4280, y: 80  },
    ],
  },

  // ── Part Three continued ──────────────────────────────────────────────────

  {
    name: '63 · Void Currents',
    width: 2800,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#020d1a',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      { x: 1180, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 2440, y: 480, w: 360, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 300,  y: 530, w: 880,  h: 10, type: 'spikes' },
      { x: 1380, y: 530, w: 1060, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 340,  y: 430, w: 130, h: 16, move: { axis: 'x', range: 100, speed: 50 } },
      { x: 560,  y: 400, w: 130, h: 16, move: { axis: 'y', range:  80, speed: 45 } },
      { x: 780,  y: 430, w: 130, h: 16, move: { axis: 'x', range: 110, speed: 55 } },
      { x: 1000, y: 400, w: 130, h: 16, move: { axis: 'y', range:  80, speed: 50 } },
      { x: 1420, y: 430, w: 120, h: 16, move: { axis: 'x', range: 120, speed: 60 } },
      { x: 1640, y: 390, w: 120, h: 16, move: { axis: 'y', range:  90, speed: 55 } },
      { x: 1860, y: 430, w: 120, h: 16, move: { axis: 'x', range: 130, speed: 65 } },
      { x: 2080, y: 400, w: 120, h: 16, move: { axis: 'y', range:  90, speed: 60 } },
      { x: 2300, y: 430, w: 120, h: 16, move: { axis: 'x', range: 100, speed: 60 } },
    ],
    coins: [
      { x: 380, y: 390 }, { x: 600, y: 360 }, { x: 820, y: 390 }, { x: 1040, y: 360 },
      { x: 1220, y: 420 },
      { x: 1460, y: 390 }, { x: 1680, y: 350 }, { x: 1900, y: 390 },
      { x: 2120, y: 360 }, { x: 2340, y: 390 },
      { x: 2560, y: 420 }, { x: 2680, y: 420 },
    ],
  },

  {
    name: '64 · Ion Storm',
    width: 2600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2520, y: 80 },
    sky: '#00001a',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      // bouncy pads — flush with ground
      { x: 380,  y: 480, w: 70,  h: 60, type: 'bouncy' },
      { x: 600,  y: 480, w: 70,  h: 60, type: 'bouncy' },
      // mid rest
      { x: 760,  y: 480, w: 160, h: 60, type: 'ground' },
      { x: 1000, y: 480, w: 70,  h: 60, type: 'bouncy' },
      { x: 1160, y: 480, w: 70,  h: 60, type: 'bouncy' },
      // one-way shelves to catch height from bounces
      { x: 380,  y: 300, w: 110, h: 14, type: 'oneway' },
      { x: 600,  y: 220, w: 110, h: 14, type: 'oneway' },
      { x: 800,  y: 300, w: 110, h: 14, type: 'oneway' },  // over mid rest
      { x: 1000, y: 240, w: 110, h: 14, type: 'oneway' },
      { x: 1160, y: 180, w: 110, h: 14, type: 'oneway' },
      // upper path branches
      { x: 1380, y: 180, w: 180, h: 18, type: 'branch' },
      { x: 1680, y: 160, w: 180, h: 18, type: 'branch' },
      { x: 1980, y: 140, w: 180, h: 18, type: 'branch' },
      { x: 2280, y: 120, w: 180, h: 18, type: 'branch' },
      // goal platform
      { x: 2480, y: 100, w: 140, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 300,  y: 510, w: 80,  h: 30, type: 'spikes' },
      { x: 450,  y: 510, w: 150, h: 30, type: 'spikes' },
      { x: 670,  y: 510, w: 90,  h: 30, type: 'spikes' },
      { x: 920,  y: 510, w: 80,  h: 30, type: 'spikes' },
      { x: 1230, y: 510, w: 150, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 420, y: 260 }, { x: 640, y: 180 }, { x: 840, y: 260 },
      { x: 1040, y: 200 }, { x: 1200, y: 140 },
      { x: 1420, y: 140 }, { x: 1720, y: 120 }, { x: 2020, y: 100 },
      { x: 2320, y: 80  }, { x: 2540, y: 60  },
    ],
  },

  {
    name: '65 · Pulsar Walls',
    width: 2400,
    height: 540,
    spawn: { x: 60, y: 460 },
    goal:  { x: 2300, y: 80 },
    sky: '#05000f',
    tiles: [
      { x: 0,    y: 480, w: 260, h: 60, type: 'ground' },
      // shaft 1
      { x: 360,  y: 100, w: 40,  h: 420, type: 'wall' },
      { x: 560,  y: 100, w: 40,  h: 380, type: 'wall' },
      { x: 400,  y: 100, w: 160, h: 18,  type: 'branch' },
      // bridge between shaft 1 and 2
      { x: 600,  y: 200, w: 160, h: 18,  type: 'branch' },
      // shaft 2
      { x: 860,  y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 1060, y: 60,  w: 40,  h: 420, type: 'wall' },
      { x: 900,  y: 60,  w: 160, h: 18,  type: 'branch' },
      // bridge between shaft 2 and 3
      { x: 1100, y: 120, w: 180, h: 18,  type: 'branch' },
      // shaft 3
      { x: 1380, y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 1580, y: 60,  w: 40,  h: 440, type: 'wall' },
      { x: 1420, y: 60,  w: 160, h: 18,  type: 'branch' },
      // final run
      { x: 1620, y: 100, w: 780, h: 18,  type: 'branch' },
      { x: 2260, y: 120, w: 140, h: 60,  type: 'ground' },
    ],
    hazards: [
      { x: 260,  y: 510, w: 100, h: 30, type: 'spikes' },
      // spike floors in each shaft
      { x: 400,  y: 510, w: 160, h: 30, type: 'spikes' },
      { x: 900,  y: 510, w: 160, h: 30, type: 'spikes' },
      { x: 1420, y: 510, w: 160, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 300, y: 420 },
      { x: 440, y: 300 }, { x: 440, y: 160 },
      { x: 660, y: 160 },
      { x: 940, y: 200 }, { x: 940, y: 80  },
      { x: 1140, y: 80  },
      { x: 1460, y: 200 }, { x: 1460, y: 80  },
      { x: 1700, y: 60  }, { x: 1900, y: 60  }, { x: 2100, y: 60  },
    ],
  },

  {
    name: '66 · Frozen Orbit',
    width: 3000,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2900, y: 380 },
    sky: '#00080f',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      { x: 1340, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 2680, y: 480, w: 320, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 1060, h: 10, type: 'spikes' },
      { x: 1540, y: 530, w: 1140, h: 10, type: 'spikes' },
    ],
    platforms: [
      // chain 1 — ice moving platforms
      { x: 320,  y: 420, w: 140, h: 16, move: { axis: 'x', range: 80,  speed: 45 }, type: 'ice' },
      { x: 540,  y: 400, w: 140, h: 16, move: { axis: 'y', range: 70,  speed: 40 }, type: 'ice' },
      { x: 760,  y: 420, w: 140, h: 16, move: { axis: 'x', range: 90,  speed: 50 }, type: 'ice' },
      { x: 980,  y: 400, w: 140, h: 16, move: { axis: 'y', range: 80,  speed: 45 }, type: 'ice' },
      { x: 1200, y: 420, w: 120, h: 16, move: { axis: 'x', range: 80,  speed: 50 }, type: 'ice' },
      // chain 2 — faster
      { x: 1580, y: 420, w: 120, h: 16, move: { axis: 'x', range: 100, speed: 60 }, type: 'ice' },
      { x: 1800, y: 390, w: 120, h: 16, move: { axis: 'y', range:  90, speed: 55 }, type: 'ice' },
      { x: 2020, y: 420, w: 120, h: 16, move: { axis: 'x', range: 110, speed: 65 }, type: 'ice' },
      { x: 2240, y: 390, w: 120, h: 16, move: { axis: 'y', range:  80, speed: 60 }, type: 'ice' },
      { x: 2460, y: 420, w: 120, h: 16, move: { axis: 'x', range: 100, speed: 65 }, type: 'ice' },
    ],
    coins: [
      { x: 380, y: 380 }, { x: 600, y: 360 }, { x: 820, y: 380 },
      { x: 1020, y: 360 }, { x: 1240, y: 380 },
      { x: 1400, y: 420 },
      { x: 1620, y: 380 }, { x: 1840, y: 350 }, { x: 2060, y: 380 },
      { x: 2280, y: 350 }, { x: 2500, y: 380 },
      { x: 2760, y: 420 }, { x: 2880, y: 420 },
    ],
  },

  {
    name: '67 · Comet Shower',
    width: 3200,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3100, y: 380 },
    sky: '#020010',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      { x: 1160, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 2960, y: 480, w: 240, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 880,  h: 10, type: 'spikes' },
      { x: 1360, y: 530, w: 1600, h: 10, type: 'spikes' },
    ],
    platforms: [
      // chain 1 — delay 0.4s
      { x: 320,  y: 440, w: 110, h: 16, fall: true, delay: 0.4 },
      { x: 490,  y: 420, w: 110, h: 16, fall: true, delay: 0.4 },
      { x: 660,  y: 400, w: 110, h: 16, fall: true, delay: 0.4 },
      { x: 830,  y: 420, w: 110, h: 16, fall: true, delay: 0.4 },
      { x: 1000, y: 440, w: 110, h: 16, fall: true, delay: 0.4 },
      // chain 2 — delay 0.28s (faster)
      { x: 1400, y: 440, w: 100, h: 16, fall: true, delay: 0.28 },
      { x: 1570, y: 400, w: 100, h: 16, fall: true, delay: 0.28 },
      { x: 1740, y: 360, w: 100, h: 16, fall: true, delay: 0.28 },
      { x: 1910, y: 320, w: 100, h: 16, fall: true, delay: 0.28 },
      { x: 2080, y: 360, w: 100, h: 16, fall: true, delay: 0.28 },
      { x: 2250, y: 400, w: 100, h: 16, fall: true, delay: 0.28 },
      { x: 2420, y: 440, w: 100, h: 16, fall: true, delay: 0.28 },
      { x: 2590, y: 400, w: 100, h: 16, fall: true, delay: 0.28 },
      { x: 2760, y: 440, w: 100, h: 16, fall: true, delay: 0.28 },
    ],
    checkpoints: [
      { x: 1200, y: 420, w: 40, h: 60 },
    ],
    coins: [
      { x: 360, y: 400 }, { x: 530, y: 380 }, { x: 700, y: 360 },
      { x: 870, y: 380 }, { x: 1040, y: 400 },
      { x: 1200, y: 420 },
      { x: 1440, y: 400 }, { x: 1610, y: 360 }, { x: 1780, y: 320 },
      { x: 1950, y: 280 }, { x: 2120, y: 320 }, { x: 2290, y: 360 },
      { x: 2460, y: 400 }, { x: 2630, y: 360 }, { x: 2800, y: 400 },
      { x: 3000, y: 420 },
    ],
  },

  {
    name: '68 · Warp Gate',
    width: 3000,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2900, y: 200 },
    sky: '#00000f',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      // rope anchor platforms (high up, slim)
      { x: 460,  y: 140, w: 100, h: 14, type: 'branch' },
      { x: 820,  y: 100, w: 100, h: 14, type: 'branch' },
      // zipline landing pads
      { x: 1120, y: 260, w: 180, h: 18, type: 'ground' },
      { x: 1560, y: 340, w: 180, h: 18, type: 'ground' },
      // mid rest
      { x: 1900, y: 480, w: 200, h: 60, type: 'ground' },
      // upper finish platform
      { x: 2400, y: 300, w: 180, h: 18, type: 'branch' },
      { x: 2760, y: 220, w: 240, h: 18, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 510, w: 840,  h: 30, type: 'spikes' },
      { x: 1300, y: 510, w: 600,  h: 30, type: 'spikes' },
      { x: 2100, y: 510, w: 660,  h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 300,  y: 420, w: 120, h: 16, move: { axis: 'y', range: 60, speed: 45 } },
    ],
    ropes: [
      { x: 510,  y: 140, length: 200 },
      { x: 870,  y: 100, length: 200 },
    ],
    ziplines: [
      { x1: 920,  y1: 100, x2: 1120, y2: 260 },
      { x1: 1300, y1: 260, x2: 1560, y2: 340 },
      { x1: 1740, y1: 340, x2: 1900, y2: 440 },
      { x1: 2100, y1: 340, x2: 2400, y2: 300 },
    ],
    checkpoints: [
      { x: 1940, y: 420, w: 40, h: 60 },
    ],
    coins: [
      { x: 340, y: 380 },
      { x: 500, y: 100 }, { x: 860, y: 60  },
      { x: 1180, y: 220 }, { x: 1620, y: 300 },
      { x: 1960, y: 420 },
      { x: 2440, y: 260 }, { x: 2600, y: 240 },
      { x: 2820, y: 180 }, { x: 2940, y: 160 },
    ],
  },

  {
    name: '69 · Neutron Rush',
    width: 3400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3300, y: 100 },
    sky: '#000508',
    tiles: [
      { x: 0,    y: 480, w: 200, h: 60, type: 'ground' },
      // cannon 1 landing
      { x: 600,  y: 360, w: 160, h: 18, type: 'ground' },
      // bouncy run
      { x: 820,  y: 480, w: 60,  h: 60, type: 'bouncy' },
      { x: 980,  y: 480, w: 60,  h: 60, type: 'bouncy' },
      { x: 1140, y: 480, w: 60,  h: 60, type: 'bouncy' },
      // catch shelves above bouncy
      { x: 840,  y: 260, w: 100, h: 14, type: 'oneway' },
      { x: 1000, y: 200, w: 100, h: 14, type: 'oneway' },
      { x: 1160, y: 160, w: 100, h: 14, type: 'oneway' },
      // mid rest
      { x: 1300, y: 480, w: 200, h: 60, type: 'ground' },
      // cannon 2 landing — matched to trajectory apex (x≈1714, y=360 going down)
      { x: 1660, y: 360, w: 200, h: 18, type: 'ground' },
      // bouncy run 2
      { x: 2120, y: 480, w: 60,  h: 60, type: 'bouncy' },
      { x: 2280, y: 480, w: 60,  h: 60, type: 'bouncy' },
      { x: 2440, y: 480, w: 60,  h: 60, type: 'bouncy' },
      { x: 2060, y: 200, w: 100, h: 14, type: 'oneway' },
      { x: 2220, y: 160, w: 100, h: 14, type: 'oneway' },
      { x: 2380, y: 120, w: 100, h: 14, type: 'oneway' },
      // final ground + goal
      { x: 2700, y: 480, w: 200, h: 60, type: 'ground' },
      { x: 2980, y: 360, w: 160, h: 18, type: 'branch' },
      { x: 3220, y: 240, w: 160, h: 18, type: 'branch' },
      { x: 3260, y: 120, w: 140, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 200,  y: 510, w: 400,  h: 30, type: 'spikes' },
      { x: 760,  y: 510, w: 60,   h: 30, type: 'spikes' },
      { x: 1040, y: 510, w: 260,  h: 30, type: 'spikes' },
      { x: 1500, y: 510, w: 400,  h: 30, type: 'spikes' },
      { x: 2060, y: 510, w: 60,   h: 30, type: 'spikes' },
      { x: 2340, y: 510, w: 360,  h: 30, type: 'spikes' },
      { x: 2900, y: 510, w: 360,  h: 30, type: 'spikes' },
    ],
    platforms: [],
    cannons: [
      { x: 120, y: 420, w: 60, h: 60, angle: -32, power: 880 },
      { x: 1380, y: 420, w: 60, h: 60, angle: -35, power: 900 },
      { x: 2760, y: 420, w: 60, h: 60, angle: -40, power: 850 },
    ],
    checkpoints: [
      { x: 1320, y: 420, w: 40, h: 60 },
    ],
    coins: [
      { x: 640, y: 320 }, { x: 880, y: 220 }, { x: 1040, y: 160 }, { x: 1200, y: 120 },
      { x: 1380, y: 420 },
      { x: 1720, y: 320 }, { x: 2100, y: 160 }, { x: 2260, y: 120 }, { x: 2420, y: 80 },
      { x: 2740, y: 420 },
      { x: 3020, y: 320 }, { x: 3260, y: 200 }, { x: 3360, y: 80 },
    ],
  },

  {
    name: '70 · Event Horizon',
    width: 3600,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3500, y: 200 },
    sky: '#030008',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60, type: 'ground' },
      // segment 1: ice ground + spike gaps
      { x: 440,  y: 480, w: 240, h: 60, type: 'ice' },
      { x: 800,  y: 480, w: 200, h: 60, type: 'ice' },
      // segment 2: wall jump shaft -> checkpoint
      { x: 1120, y: 160, w: 40,  h: 360, type: 'wall' },
      { x: 1280, y: 80,  w: 40,  h: 440, type: 'wall' },
      { x: 1160, y: 140, w: 120, h: 14,  type: 'branch' },
      { x: 1320, y: 80,  w: 260, h: 18,  type: 'ground' },
      // segment 3: zipline descent
      { x: 1800, y: 300, w: 200, h: 18,  type: 'ground' },
      // segment 4: fall platforms + checkpoint 2
      { x: 2480, y: 480, w: 200, h: 60,  type: 'ground' },
      // segment 5: bouncy + upper run -> goal
      { x: 3000, y: 480, w: 60,  h: 60,  type: 'bouncy' },
      { x: 3100, y: 480, w: 60,  h: 60,  type: 'bouncy' },
      { x: 3160, y: 300, w: 160, h: 14,  type: 'oneway' },
      { x: 3360, y: 240, w: 160, h: 14,  type: 'oneway' },
      { x: 3460, y: 220, w: 140, h: 60,  type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 510, w: 160,  h: 30, type: 'spikes' },
      { x: 680,  y: 510, w: 120,  h: 30, type: 'spikes' },
      { x: 1000, y: 510, w: 120,  h: 30, type: 'spikes' },
      { x: 1160, y: 510, w: 160,  h: 30, type: 'spikes' },
      { x: 1580, y: 510, w: 220,  h: 30, type: 'spikes' },
      { x: 2000, y: 510, w: 480,  h: 30, type: 'spikes' },
      { x: 2680, y: 510, w: 320,  h: 30, type: 'spikes' },
      { x: 3060, y: 510, w: 400,  h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 2100, y: 430, w: 100, h: 16, fall: true, delay: 0.30 },
      { x: 2260, y: 400, w: 100, h: 16, fall: true, delay: 0.30 },
      { x: 2420, y: 430, w: 100, h: 16, fall: true, delay: 0.30 },
      { x: 2700, y: 430, w: 110, h: 16, move: { axis: 'x', range: 90, speed: 60 } },
      { x: 2900, y: 400, w: 110, h: 16, move: { axis: 'y', range: 80, speed: 55 } },
    ],
    ziplines: [
      { x1: 1580, y1: 80, x2: 1800, y2: 300 },
    ],
    cannons: [
      { x: 2540, y: 420, w: 60, h: 60, angle: -38, power: 860 },
    ],
    checkpoints: [
      { x: 1380, y: 20,  w: 40, h: 60 },
      { x: 2520, y: 420, w: 40, h: 60 },
    ],
    coins: [
      { x: 480, y: 440 }, { x: 840, y: 440 },
      { x: 1200, y: 100 }, { x: 1360, y: 40 },
      { x: 1840, y: 260 }, { x: 1960, y: 260 },
      { x: 2140, y: 390 }, { x: 2300, y: 360 }, { x: 2460, y: 390 },
      { x: 2740, y: 390 }, { x: 2940, y: 360 },
      { x: 3040, y: 440 }, { x: 3200, y: 260 }, { x: 3400, y: 200 },
    ],
  },

  {
    name: '71 · Starfall',
    width: 4000,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3880, y: 80 },
    sky: '#010005',
    tiles: [
      { x: 0,    y: 480, w: 200, h: 60, type: 'ground' },
      // segment 1: cannon launch — matched to trajectory (apex x=334,y=340; lands y=380 at x≈478)
      { x: 460,  y: 380, w: 200, h: 18, type: 'ground' },
      // segment 2: tight fall platform chain
      { x: 1060, y: 480, w: 180, h: 60, type: 'ground' },
      // segment 3: wall jump shaft + climb
      { x: 1500, y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 1680, y: 80,  w: 40,  h: 420, type: 'wall' },
      { x: 1540, y: 60,  w: 140, h: 18,  type: 'branch' },
      // segment 4: rope + zipline descent
      { x: 1800, y: 60,  w: 200, h: 18,  type: 'ground' },
      { x: 2300, y: 220, w: 160, h: 18,  type: 'ground' },
      // segment 5: checkpoint + ice moving
      { x: 2700, y: 480, w: 200, h: 60,  type: 'ground' },
      // segment 6: cannon 2 + bouncy upper — matched to trajectory (apex x=3014,y=319; lands y=400 at x≈3214)
      { x: 3180, y: 400, w: 200, h: 18,  type: 'ground' },
      { x: 3480, y: 480, w: 60,  h: 60,  type: 'bouncy' },
      { x: 3580, y: 480, w: 60,  h: 60,  type: 'bouncy' },
      { x: 3520, y: 220, w: 120, h: 14,  type: 'oneway' },
      { x: 3700, y: 160, w: 120, h: 14,  type: 'oneway' },
      // final
      { x: 3840, y: 100, w: 160, h: 60,  type: 'ground' },
    ],
    hazards: [
      { x: 200,  y: 510, w: 480,  h: 30, type: 'spikes' },
      { x: 840,  y: 510, w: 220,  h: 30, type: 'spikes' },
      { x: 1240, y: 510, w: 260,  h: 30, type: 'spikes' },
      { x: 1540, y: 510, w: 180,  h: 30, type: 'spikes' },
      { x: 2000, y: 510, w: 300,  h: 30, type: 'spikes' },
      { x: 2460, y: 510, w: 240,  h: 30, type: 'spikes' },
      { x: 2900, y: 510, w: 360,  h: 30, type: 'spikes' },
      { x: 3420, y: 510, w: 60,   h: 30, type: 'spikes' },
      { x: 3640, y: 510, w: 200,  h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 870,  y: 430, w: 100, h: 16, fall: true, delay: 0.26 },
      { x: 1020, y: 400, w: 100, h: 16, fall: true, delay: 0.26 },
      { x: 1170, y: 440, w: 100, h: 16, fall: true, delay: 0.26 }, // catches before rest island
      { x: 2460, y: 420, w: 100, h: 16, move: { axis: 'x', range: 80, speed: 55 }, type: 'ice' },
      { x: 2640, y: 390, w: 100, h: 16, move: { axis: 'y', range: 70, speed: 50 }, type: 'ice' },
      { x: 2820, y: 420, w: 100, h: 16, move: { axis: 'x', range: 80, speed: 60 }, type: 'ice' },
    ],
    cannons: [
      { x: 100,  y: 420, w: 60, h: 60, angle: -38, power: 870 },
      { x: 2760, y: 420, w: 60, h: 60, angle: -42, power: 900 },
    ],
    ropes: [
      { x: 1900, y: 60, length: 200 },
    ],
    ziplines: [
      { x1: 2100, y1: 60, x2: 2300, y2: 220 },
    ],
    checkpoints: [
      { x: 1100, y: 420, w: 40, h: 60 },
      { x: 2740, y: 420, w: 40, h: 60 },
    ],
    coins: [
      { x: 500, y: 340 },
      { x: 910, y: 390 }, { x: 1060, y: 360 },
      { x: 1580, y: 180 }, { x: 1580, y: 20  },
      { x: 1860, y: 20  }, { x: 1940, y: 140 },
      { x: 2340, y: 180 }, { x: 2500, y: 380 }, { x: 2680, y: 350 },
      { x: 2860, y: 380 },
      { x: 3220, y: 360 }, { x: 3560, y: 180 }, { x: 3740, y: 120 },
      { x: 3900, y: 60  },
    ],
  },

  {
    name: '72 · Absolute Zero',
    width: 4400,
    height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 4300, y: 80 },
    sky: '#000000',
    tiles: [
      // Segment 1: cannon volley over spikes
      { x: 0,    y: 480, w: 200, h: 60, type: 'ground' },
      { x: 620,  y: 380, w: 160, h: 18, type: 'ground' },
      { x: 1060, y: 480, w: 200, h: 60, type: 'ground' },
      // Segment 2: ice moving chain -> checkpoint 1
      // Segment 3: wall-jump tower + climb
      { x: 1540, y: 100, w: 40,  h: 440, type: 'wall' },
      { x: 1720, y: 80,  w: 40,  h: 440, type: 'wall' },
      { x: 1580, y: 80,  w: 140, h: 18,  type: 'branch' },
      { x: 1760, y: 80,  w: 260, h: 18,  type: 'ground' },
      // Segment 4: rope + zipline sequence
      { x: 2360, y: 200, w: 160, h: 18,  type: 'ground' },
      { x: 2800, y: 360, w: 200, h: 18,  type: 'ground' },
      // Segment 5: fall platforms + checkpoint 2
      { x: 3260, y: 480, w: 200, h: 60,  type: 'ground' },
      // Segment 6: bouncy + oneway -> checkpoint 3 -> goal
      { x: 3780, y: 480, w: 60,  h: 60,  type: 'bouncy' },
      { x: 3900, y: 480, w: 60,  h: 60,  type: 'bouncy' },
      { x: 3820, y: 280, w: 140, h: 14,  type: 'oneway' },
      { x: 4000, y: 200, w: 140, h: 14,  type: 'oneway' },
      { x: 4200, y: 120, w: 200, h: 60,  type: 'ground' },
    ],
    hazards: [
      { x: 200,  y: 510, w: 420,  h: 30, type: 'spikes' },
      { x: 780,  y: 510, w: 280,  h: 30, type: 'spikes' },
      { x: 1260, y: 510, w: 280,  h: 30, type: 'spikes' },
      { x: 1580, y: 530, w: 180,  h: 10, type: 'spikes' },
      { x: 2020, y: 510, w: 340,  h: 30, type: 'spikes' },
      { x: 2520, y: 530, w: 1000, h: 10, type: 'spikes' },
      { x: 3460, y: 530, w: 800,  h: 10, type: 'spikes' },
      { x: 3840, y: 510, w: 60,   h: 30, type: 'spikes' },
      { x: 3960, y: 510, w: 240,  h: 30, type: 'spikes' },
    ],
    platforms: [
      // ice chain after checkpoint 1
      { x: 1300, y: 420, w: 110, h: 16, move: { axis: 'x', range: 80,  speed: 55 }, type: 'ice' },
      { x: 1460, y: 390, w: 110, h: 16, move: { axis: 'y', range: 70,  speed: 50 }, type: 'ice' },
      // fall platforms before checkpoint 2
      { x: 3060, y: 430, w: 100, h: 16, fall: true, delay: 0.26 },
      { x: 3220, y: 400, w: 100, h: 16, fall: true, delay: 0.26 },
      { x: 3380, y: 430, w: 100, h: 16, fall: true, delay: 0.26 }, // leads to rest
      // moving platforms near goal
      { x: 4020, y: 160, w: 100, h: 16, move: { axis: 'x', range: 80, speed: 60 } },
    ],
    cannons: [
      { x: 120,  y: 420, w: 60, h: 60, angle: -30, power: 880 },
      { x: 680,  y: 320, w: 60, h: 60, angle: -28, power: 860 },
    ],
    ropes: [
      { x: 2100, y: 60, length: 220 },
    ],
    ziplines: [
      { x1: 2320, y1: 200, x2: 2800, y2: 360 },
    ],
    climbs: [
      { x: 1770, y: 100, w: 40, h: 60 },
    ],
    checkpoints: [
      { x: 1100, y: 420, w: 40, h: 60 },
      { x: 3280, y: 420, w: 40, h: 60 },
      { x: 4220, y: 60,  w: 40, h: 60 },
    ],
    coins: [
      { x: 260,  y: 320 }, { x: 660,  y: 240 },
      { x: 1100, y: 420 },
      { x: 1340, y: 380 }, { x: 1500, y: 350 },
      { x: 1620, y: 220 }, { x: 1620, y: 40  },
      { x: 1820, y: 40  }, { x: 1940, y: 40  },
      { x: 2140, y: 180 }, { x: 2400, y: 160 },
      { x: 2840, y: 320 }, { x: 2960, y: 320 },
      { x: 3100, y: 390 }, { x: 3260, y: 360 }, { x: 3420, y: 390 },
      { x: 3860, y: 440 }, { x: 3980, y: 440 },
      { x: 4060, y: 160 }, { x: 4260, y: 80  }, { x: 4360, y: 60  },
    ],
  },

  // ── Part Four: Neon Underground (levels 83–97) ────────────────────────────
  // Levels 73–82 (currently being built) will be inserted above this block.

  {
    name: '73 · Neon Underground',
    width: 2200, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2100, y: 380 },
    sky: '#001020',
    tiles: [
      { x: 0,    y: 480, w: 320, h: 60,  type: 'ground' },
      { x: 440,  y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 700,  y: 440, w: 100, h: 18,  type: 'branch' },
      { x: 860,  y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 1100, y: 420, w: 40,  h: 120, type: 'wall' },
      { x: 1240, y: 280, w: 40,  h: 260, type: 'wall' },
      { x: 1140, y: 280, w: 100, h: 18,  type: 'branch' },
      { x: 1280, y: 160, w: 200, h: 18,  type: 'ground' },
      { x: 1560, y: 320, w: 100, h: 18,  type: 'branch' },
      { x: 1720, y: 480, w: 60,  h: 60,  type: 'bouncy' },
      { x: 1840, y: 480, w: 360, h: 60,  type: 'ground' },
    ],
    hazards: [
      { x: 320,  y: 510, w: 120, h: 30, type: 'spikes' },
      { x: 640,  y: 510, w: 60,  h: 30, type: 'spikes' },
      { x: 800,  y: 510, w: 60,  h: 30, type: 'spikes' },
      { x: 1540, y: 510, w: 180, h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 460, y: 440, w: 120, h: 18, move: { axis: 'x', range: 80, speed: 50 } },
    ],
    coins: [
      { x: 160, y: 420 }, { x: 500, y: 380 }, { x: 720, y: 380 },
      { x: 940, y: 420 }, { x: 1160, y: 240 }, { x: 1320, y: 120 },
      { x: 1580, y: 280 }, { x: 1780, y: 260 }, { x: 1960, y: 420 },
    ],
  },
  {
    name: '74 · Neon Corridor',
    width: 2800, height: 540,
    spawn: { x: 60, y: 280 },
    goal:  { x: 2700, y: 360 },
    sky: '#001530',
    tiles: [
      { x: 0,    y: 340, w: 280, h: 200, type: 'ground' },
      { x: 680,  y: 420, w: 240, h: 120, type: 'ground' },
      { x: 1360, y: 380, w: 200, h: 160, type: 'ground' },
      { x: 1980, y: 340, w: 240, h: 200, type: 'ground' },
      { x: 2560, y: 400, w: 240, h: 140, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 400, h: 10, type: 'spikes' },
      { x: 920,  y: 530, w: 440, h: 10, type: 'spikes' },
      { x: 1560, y: 530, w: 420, h: 10, type: 'spikes' },
      { x: 2220, y: 530, w: 340, h: 10, type: 'spikes' },
    ],
    platforms: [],
    ziplines: [
      { x1: 280,  y1: 300, x2: 680,  y2: 400 },
      { x1: 920,  y1: 360, x2: 1360, y2: 360 },
      { x1: 1560, y1: 320, x2: 1980, y2: 320 },
      { x1: 2220, y1: 280, x2: 2560, y2: 380 },
    ],
    coins: [
      { x: 140, y: 280 }, { x: 440, y: 340 }, { x: 600, y: 380 },
      { x: 1080, y: 320 }, { x: 1240, y: 340 },
      { x: 1720, y: 280 }, { x: 1880, y: 300 },
      { x: 2360, y: 240 }, { x: 2460, y: 340 }, { x: 2660, y: 340 },
    ],
  },
  {
    name: '75 · Circuit Shafts',
    width: 2600, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2520, y: 380 },
    sky: '#000c1e',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60,  type: 'ground' },
      { x: 440,  y: 100, w: 40,  h: 420, type: 'wall' },
      { x: 600,  y: 100, w: 40,  h: 420, type: 'wall' },
      { x: 480,  y: 100, w: 120, h: 18,  type: 'branch' },
      { x: 640,  y: 480, w: 280, h: 60,  type: 'ground' },
      { x: 640,  y: 320, w: 120, h: 18,  type: 'branch' },
      { x: 980,  y: 80,  w: 40,  h: 440, type: 'wall' },
      { x: 1140, y: 80,  w: 40,  h: 440, type: 'wall' },
      { x: 1020, y: 80,  w: 120, h: 18,  type: 'branch' },
      { x: 1180, y: 480, w: 300, h: 60,  type: 'ground' },
      { x: 1280, y: 340, w: 100, h: 18,  type: 'branch' },
      { x: 1560, y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 1740, y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 1600, y: 60,  w: 140, h: 18,  type: 'branch' },
      { x: 1780, y: 480, w: 820, h: 60,  type: 'ground' },
      { x: 1900, y: 360, w: 120, h: 18,  type: 'branch' },
      { x: 2080, y: 280, w: 100, h: 18,  type: 'branch' },
      { x: 2280, y: 360, w: 120, h: 18,  type: 'branch' },
    ],
    hazards: [
      { x: 300,  y: 510, w: 140, h: 30, type: 'spikes' },
      { x: 920,  y: 510, w: 60,  h: 30, type: 'spikes' },
      { x: 1480, y: 510, w: 80,  h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 700,  y: 380, w: 100, h: 18, move: { axis: 'y', range: 80,  speed: 45 } },
      { x: 1220, y: 400, w: 100, h: 18, move: { axis: 'x', range: 60,  speed: 50 } },
    ],
    coins: [
      { x: 160, y: 420 },
      { x: 520, y: 300 }, { x: 520, y: 180 },
      { x: 700, y: 260 }, { x: 760, y: 420 },
      { x: 1060, y: 280 }, { x: 1060, y: 160 },
      { x: 1260, y: 280 }, { x: 1300, y: 420 },
      { x: 1640, y: 260 }, { x: 1640, y: 140 },
      { x: 1950, y: 300 }, { x: 2120, y: 220 }, { x: 2320, y: 300 }, { x: 2460, y: 420 },
    ],
  },
  {
    name: '76 · Live Wire',
    width: 3200, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3120, y: 220 },
    sky: '#001028',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60,  type: 'ground' },
      { x: 700,  y: 400, w: 180, h: 140, type: 'ground' },
      { x: 1200, y: 440, w: 160, h: 100, type: 'ground' },
      { x: 1720, y: 360, w: 160, h: 180, type: 'ground' },
      { x: 2220, y: 400, w: 160, h: 140, type: 'ground' },
      { x: 2720, y: 300, w: 180, h: 240, type: 'ground' },
      { x: 2980, y: 260, w: 220, h: 18,  type: 'ground' },
    ],
    hazards: [
      { x: 300,  y: 530, w: 400, h: 10, type: 'spikes' },
      { x: 880,  y: 530, w: 320, h: 10, type: 'spikes' },
      { x: 1360, y: 530, w: 360, h: 10, type: 'spikes' },
      { x: 1880, y: 530, w: 340, h: 10, type: 'spikes' },
      { x: 2380, y: 530, w: 340, h: 10, type: 'spikes' },
      { x: 2900, y: 530, w: 80,  h: 10, type: 'spikes' },
    ],
    platforms: [],
    ziplines: [
      { x1: 300,  y1: 380, x2: 700,  y2: 380 },
      { x1: 880,  y1: 360, x2: 1200, y2: 420 },
      { x1: 1360, y1: 400, x2: 1720, y2: 340 },
      { x1: 1880, y1: 360, x2: 2220, y2: 380 },
      { x1: 2380, y1: 360, x2: 2720, y2: 280 },
    ],
    ropes: [
      { x: 1060, y: 60, length: 200 },
      { x: 2540, y: 60, length: 180 },
    ],
    coins: [
      { x: 160, y: 420 }, { x: 480, y: 340 }, { x: 600, y: 360 },
      { x: 1040, y: 380 }, { x: 1100, y: 180 },
      { x: 1460, y: 360 }, { x: 1600, y: 300 },
      { x: 1980, y: 320 }, { x: 2120, y: 360 },
      { x: 2460, y: 320 }, { x: 2580, y: 200 },
      { x: 2840, y: 260 }, { x: 3060, y: 200 },
    ],
  },
  {
    name: '77 · Crumbling Grid',
    width: 2800, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2700, y: 380 },
    sky: '#000c20',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      { x: 1200, y: 480, w: 240, h: 60, type: 'ground' },
      { x: 2480, y: 480, w: 320, h: 60, type: 'ground' },
    ],
    hazards: [
      { x: 300,  y: 510, w: 900,  h: 30, type: 'spikes' },
      { x: 1440, y: 510, w: 1040, h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 360,  y: 440, w: 100, h: 18, fall: true, delay: 0.4 },
      { x: 520,  y: 400, w: 100, h: 18, move: { axis: 'x', range: 100, speed: 55 } },
      { x: 680,  y: 440, w: 100, h: 18, fall: true, delay: 0.5 },
      { x: 840,  y: 380, w: 100, h: 18, move: { axis: 'y', range: 80,  speed: 48 } },
      { x: 1000, y: 440, w: 100, h: 18, fall: true, delay: 0.4 },
      { x: 1500, y: 440, w: 100, h: 18, fall: true, delay: 0.3 },
      { x: 1660, y: 400, w: 80,  h: 18, move: { axis: 'x', range: 120, speed: 65 } },
      { x: 1840, y: 440, w: 100, h: 18, fall: true, delay: 0.3 },
      { x: 1960, y: 360, w: 100, h: 18, move: { axis: 'y', range: 100, speed: 55 } },
      { x: 2100, y: 440, w: 100, h: 18, fall: true, delay: 0.3 },
      { x: 2260, y: 400, w: 80,  h: 18, move: { axis: 'xy', range: 80, speed: 58 } },
      { x: 2380, y: 440, w: 80,  h: 18, fall: true, delay: 0.3 },
    ],
    coins: [
      { x: 160, y: 420 },
      { x: 400, y: 380 }, { x: 560, y: 360 }, { x: 720, y: 380 },
      { x: 880, y: 340 }, { x: 1040, y: 380 },
      { x: 1540, y: 380 }, { x: 1700, y: 360 }, { x: 1880, y: 380 },
      { x: 2000, y: 320 }, { x: 2140, y: 380 },
      { x: 2650, y: 420 },
    ],
  },
  {
    name: '78 · Power Core',
    width: 2400, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2320, y: 120 },
    sky: '#001535',
    tiles: [
      { x: 0,    y: 480, w: 340, h: 60,  type: 'ground' },
      { x: 340,  y: 480, w: 80,  h: 60,  type: 'bouncy' },
      { x: 520,  y: 200, w: 200, h: 18,  type: 'branch' },
      { x: 520,  y: 220, w: 40,  h: 300, type: 'wall' },
      { x: 720,  y: 220, w: 40,  h: 300, type: 'wall' },
      { x: 760,  y: 200, w: 200, h: 18,  type: 'branch' },
      { x: 960,  y: 480, w: 80,  h: 60,  type: 'bouncy' },
      { x: 1140, y: 160, w: 200, h: 18,  type: 'branch' },
      { x: 1140, y: 200, w: 40,  h: 340, type: 'wall' },
      { x: 1340, y: 200, w: 40,  h: 340, type: 'wall' },
      { x: 1380, y: 160, w: 200, h: 18,  type: 'branch' },
      { x: 1580, y: 480, w: 80,  h: 60,  type: 'bouncy' },
      { x: 1760, y: 100, w: 40,  h: 440, type: 'wall' },
      { x: 1940, y: 100, w: 40,  h: 440, type: 'wall' },
      { x: 1800, y: 100, w: 140, h: 18,  type: 'branch' },
      { x: 1980, y: 160, w: 440, h: 18,  type: 'ground' },
    ],
    hazards: [
      { x: 420,  y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 860,  y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 1480, y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 1660, y: 510, w: 100, h: 30, type: 'spikes' },
    ],
    platforms: [],
    coins: [
      { x: 160, y: 420 },
      { x: 440, y: 160 }, { x: 560, y: 140 }, { x: 640, y: 360 },
      { x: 800, y: 140 }, { x: 860, y: 160 },
      { x: 1060, y: 120 }, { x: 1180, y: 100 }, { x: 1260, y: 360 },
      { x: 1420, y: 100 }, { x: 1480, y: 120 },
      { x: 1680, y: 80  }, { x: 1820, y: 60  },
      { x: 2100, y: 120 }, { x: 2280, y: 80  },
    ],
  },
  {
    name: '79 · Static Field',
    width: 2600, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2520, y: 380 },
    sky: '#000d22',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60, type: 'ground' },
      { x: 300,  y: 480, w: 200, h: 60, type: 'ice' },
      { x: 500,  y: 480, w: 80,  h: 60, type: 'ground' },
      { x: 580,  y: 420, w: 100, h: 18, type: 'branch' },
      { x: 760,  y: 480, w: 300, h: 60, type: 'ice' },
      { x: 1060, y: 480, w: 100, h: 60, type: 'ground' },
      { x: 1200, y: 420, w: 80,  h: 18, type: 'branch' },
      { x: 1340, y: 480, w: 60,  h: 60, type: 'bouncy' },
      { x: 1560, y: 480, w: 240, h: 60, type: 'ice' },
      { x: 1800, y: 480, w: 60,  h: 60, type: 'ground' },
      { x: 1940, y: 420, w: 100, h: 18, type: 'oneway' },
      { x: 2100, y: 360, w: 100, h: 18, type: 'oneway' },
      { x: 2260, y: 480, w: 340, h: 60, type: 'ground' },
      { x: 2360, y: 300, w: 100, h: 18, type: 'branch' },
    ],
    hazards: [
      { x: 500,  y: 510, w: 80,  h: 30, type: 'spikes' },
      { x: 680,  y: 510, w: 80,  h: 30, type: 'spikes' },
      { x: 1060, y: 510, w: 140, h: 30, type: 'spikes' },
      { x: 1400, y: 510, w: 160, h: 30, type: 'spikes' },
      { x: 1800, y: 510, w: 140, h: 30, type: 'spikes' },
      { x: 2160, y: 510, w: 100, h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 860, y: 440, w: 100, h: 18, move: { axis: 'x', range: 100, speed: 48 } },
    ],
    coins: [
      { x: 160, y: 420 },
      { x: 360, y: 420 }, { x: 460, y: 420 },
      { x: 600, y: 360 },
      { x: 840, y: 420 }, { x: 960, y: 420 }, { x: 1000, y: 420 },
      { x: 1240, y: 360 },
      { x: 1480, y: 320 }, { x: 1560, y: 360 },
      { x: 1620, y: 420 }, { x: 1720, y: 420 },
      { x: 1980, y: 380 }, { x: 2140, y: 320 },
      { x: 2380, y: 260 }, { x: 2460, y: 420 },
    ],
  },
  {
    name: '80 · Data Storm',
    width: 3000, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2900, y: 280 },
    sky: '#001240',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60,  type: 'ground' },
      { x: 580,  y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 1060, y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 1520, y: 420, w: 200, h: 18,  type: 'ground' },
      { x: 1920, y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 2380, y: 380, w: 180, h: 20,  type: 'ground' },
      { x: 2720, y: 320, w: 280, h: 220, type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 300, h: 10, type: 'spikes' },
      { x: 780,  y: 530, w: 280, h: 10, type: 'spikes' },
      { x: 1260, y: 530, w: 260, h: 10, type: 'spikes' },
      { x: 1720, y: 530, w: 200, h: 10, type: 'spikes' },
      { x: 2120, y: 530, w: 260, h: 10, type: 'spikes' },
      { x: 2560, y: 530, w: 160, h: 10, type: 'spikes' },
    ],
    platforms: [],
    cannons: [
      { x: 180, y: 400, w: 70, h: 70, angle: -20, power: 860 },
      { x: 1080, y: 400, w: 70, h: 70, angle: -25, power: 880 },
    ],
    ropes: [
      { x: 880,  y: 60, length: 200 },
      { x: 1760, y: 60, length: 240 },
      { x: 2540, y: 60, length: 200 },
    ],
    ziplines: [
      { x1: 1720, y1: 380, x2: 1920, y2: 460 },
    ],
    coins: [
      { x: 360, y: 320 }, { x: 480, y: 280 },
      { x: 660, y: 420 },
      { x: 880, y: 200 }, { x: 940, y: 300 },
      { x: 1140, y: 320 },
      { x: 1580, y: 380 },
      { x: 1760, y: 260 }, { x: 1780, y: 320 },
      { x: 2040, y: 420 },
      { x: 2440, y: 340 }, { x: 2540, y: 260 },
      { x: 2800, y: 280 }, { x: 2940, y: 240 },
    ],
  },
  {
    name: '81 · Deep Current',
    width: 3200, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3120, y: 160 },
    sky: '#000e2a',
    tiles: [
      { x: 0,    y: 480, w: 260, h: 60,  type: 'ground' },
      { x: 900,  y: 460, w: 180, h: 80,  type: 'ground' },
      { x: 1760, y: 460, w: 180, h: 80,  type: 'ground' },
      { x: 2620, y: 400, w: 180, h: 140, type: 'ground' },
      { x: 2980, y: 200, w: 220, h: 340, type: 'ground' },
    ],
    hazards: [
      { x: 260,  y: 510, w: 640, h: 30, type: 'spikes' },
      { x: 1080, y: 510, w: 680, h: 30, type: 'spikes' },
      { x: 1940, y: 510, w: 680, h: 30, type: 'spikes' },
      { x: 2800, y: 510, w: 180, h: 30, type: 'spikes' },
    ],
    platforms: [
      { x: 320,  y: 440, w: 100, h: 18, move: { axis: 'x',  range: 140, speed: 60 } },
      { x: 500,  y: 380, w: 100, h: 18, move: { axis: 'y',  range: 100, speed: 52 } },
      { x: 680,  y: 440, w: 80,  h: 18, move: { axis: 'xy', range: 80,  speed: 55 } },
      { x: 1140, y: 440, w: 100, h: 18, move: { axis: 'y',  range: 120, speed: 56 } },
      { x: 1320, y: 380, w: 80,  h: 18, move: { axis: 'x',  range: 160, speed: 65 } },
      { x: 1540, y: 440, w: 100, h: 18, move: { axis: 'xy', range: 100, speed: 60 } },
      { x: 2000, y: 420, w: 80,  h: 18, move: { axis: 'x',  range: 120, speed: 68 } },
      { x: 2200, y: 360, w: 80,  h: 18, move: { axis: 'y',  range: 140, speed: 58 } },
      { x: 2380, y: 400, w: 80,  h: 18, move: { axis: 'xy', range: 110, speed: 63 } },
      { x: 2760, y: 260, w: 100, h: 18, move: { axis: 'y',  range: 60,  speed: 50 } },
      { x: 2880, y: 220, w: 80,  h: 18, move: { axis: 'x',  range: 40,  speed: 45 } },
    ],
    coins: [
      { x: 160, y: 420 },
      { x: 360, y: 380 }, { x: 540, y: 340 }, { x: 720, y: 380 },
      { x: 1000, y: 400 },
      { x: 1180, y: 360 }, { x: 1360, y: 320 }, { x: 1580, y: 380 },
      { x: 1860, y: 400 },
      { x: 2040, y: 360 }, { x: 2240, y: 300 }, { x: 2420, y: 360 },
      { x: 2680, y: 360 }, { x: 2800, y: 200 }, { x: 3060, y: 160 },
    ],
  },
  {
    name: '82 · Underworld Gate',
    width: 3600, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3520, y: 320 },
    sky: '#00101e',
    tiles: [
      { x: 0,    y: 480, w: 300, h: 60,  type: 'ground' },
      { x: 680,  y: 420, w: 200, h: 120, type: 'ground' },
      { x: 1100, y: 100, w: 40,  h: 440, type: 'wall' },
      { x: 1280, y: 100, w: 40,  h: 440, type: 'wall' },
      { x: 1140, y: 100, w: 140, h: 18,  type: 'branch' },
      { x: 1320, y: 180, w: 240, h: 18,  type: 'ground' },
      { x: 1680, y: 480, w: 60,  h: 60,  type: 'ground' },
      { x: 1740, y: 480, w: 300, h: 60,  type: 'ice' },
      { x: 2040, y: 480, w: 60,  h: 60,  type: 'ground' },
      { x: 2360, y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 2960, y: 340, w: 40,  h: 200, type: 'wall' },
      { x: 3120, y: 200, w: 40,  h: 340, type: 'wall' },
      { x: 3000, y: 200, w: 120, h: 18,  type: 'branch' },
      { x: 3160, y: 360, w: 440, h: 180, type: 'ground' },
      { x: 3260, y: 320, w: 240, h: 18,  type: 'ground' },
    ],
    hazards: [
      { x: 300,  y: 530, w: 380, h: 10, type: 'spikes' },
      { x: 880,  y: 530, w: 220, h: 10, type: 'spikes' },
      { x: 2100, y: 530, w: 260, h: 10, type: 'spikes' },
      { x: 2560, y: 530, w: 400, h: 10, type: 'spikes' },
      { x: 2960, y: 530, w: 200, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 2160, y: 440, w: 100, h: 18, fall: true, delay: 0.4 },
      { x: 2280, y: 440, w: 80,  h: 18, move: { axis: 'x', range: 80,  speed: 55 } },
      { x: 2680, y: 400, w: 80,  h: 18, move: { axis: 'y', range: 100, speed: 50 } },
      { x: 2820, y: 440, w: 100, h: 18, fall: true, delay: 0.35 },
    ],
    ziplines: [
      { x1: 300,  y1: 380, x2: 680,  y2: 400 },
      { x1: 1560, y1: 160, x2: 1680, y2: 460 },
    ],
    checkpoints: [
      { x: 1380, y: 140, w: 40, h: 60 },
      { x: 2420, y: 420, w: 40, h: 60 },
    ],
    coins: [
      { x: 160, y: 420 }, { x: 460, y: 340 }, { x: 580, y: 360 },
      { x: 760, y: 360 },
      { x: 1180, y: 300 }, { x: 1180, y: 180 }, { x: 1380, y: 140 },
      { x: 1780, y: 420 }, { x: 1900, y: 420 }, { x: 2000, y: 420 },
      { x: 2200, y: 380 }, { x: 2320, y: 380 },
      { x: 2720, y: 360 }, { x: 3040, y: 160 },
      { x: 3320, y: 280 }, { x: 3480, y: 280 },
    ],
  },
  {
    name: '83 · Reactor Core',
    width: 3000, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 2900, y: 140 },
    sky: '#001240',
    tiles: [
      { x: 0,    y: 480, w: 260, h: 60,  type: 'ground' },
      { x: 580,  y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 1080, y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 1080, y: 200, w: 40,  h: 280, type: 'wall' },
      { x: 1540, y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 1540, y: 160, w: 40,  h: 320, type: 'wall' },
      { x: 2080, y: 480, w: 200, h: 60,  type: 'ground' },
      { x: 2520, y: 240, w: 240, h: 20,  type: 'ground' },
      { x: 2760, y: 180, w: 240, h: 360, type: 'ground' },
    ],
    hazards: [
      { x: 260,  y: 530, w: 320, h: 10, type: 'spikes' },
      { x: 780,  y: 530, w: 300, h: 10, type: 'spikes' },
      { x: 1280, y: 530, w: 260, h: 10, type: 'spikes' },
      { x: 1740, y: 530, w: 340, h: 10, type: 'spikes' },
      { x: 2280, y: 530, w: 240, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 2200, y: 380, w: 80, h: 18, move: { axis: 'x', range: 100, speed: 60 } },
    ],
    cannons: [
      { x: 160, y: 400, w: 70, h: 70, angle: -22, power: 870 },
      { x: 700, y: 400, w: 70, h: 70, angle: -18, power: 850 },
    ],
    climbs: [
      { x: 1080, y: 200, w: 40, h: 280 },
      { x: 1540, y: 160, w: 40, h: 320 },
    ],
    ropes: [
      { x: 1380, y: 60, length: 220, startAngle: 0.3 },
      { x: 2340, y: 60, length: 200 },
    ],
    checkpoints: [
      { x: 1160, y: 120, w: 40, h: 60 },
    ],
    coins: [
      { x: 160, y: 420 }, { x: 380, y: 300 }, { x: 480, y: 260 },
      { x: 680, y: 420 },
      { x: 1120, y: 360 }, { x: 1120, y: 260 }, { x: 1140, y: 160 },
      { x: 1400, y: 240 }, { x: 1440, y: 360 },
      { x: 1580, y: 320 }, { x: 1580, y: 200 }, { x: 1580, y: 100 },
      { x: 2240, y: 340 }, { x: 2380, y: 260 },
      { x: 2600, y: 200 }, { x: 2700, y: 160 }, { x: 2860, y: 120 },
    ],
  },
  {
    name: '84 · Final Surge',
    width: 3400, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3300, y: 200 },
    sky: '#000820',
    tiles: [
      { x: 0,    y: 480, w: 260, h: 60,  type: 'ground' },
      { x: 680,  y: 440, w: 160, h: 100, type: 'ground' },
      { x: 1200, y: 400, w: 160, h: 140, type: 'ground' },
      { x: 1720, y: 360, w: 160, h: 180, type: 'ground' },
      { x: 2260, y: 400, w: 160, h: 140, type: 'ground' },
      { x: 2780, y: 300, w: 160, h: 240, type: 'ground' },
      { x: 3120, y: 240, w: 280, h: 300, type: 'ground' },
    ],
    hazards: [
      { x: 260,  y: 530, w: 420, h: 10, type: 'spikes' },
      { x: 840,  y: 530, w: 360, h: 10, type: 'spikes' },
      { x: 1360, y: 530, w: 360, h: 10, type: 'spikes' },
      { x: 1880, y: 530, w: 380, h: 10, type: 'spikes' },
      { x: 2420, y: 530, w: 360, h: 10, type: 'spikes' },
      { x: 2940, y: 530, w: 180, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 2500, y: 360, w: 80, h: 18, move: { axis: 'xy', range: 100, speed: 62 } },
      { x: 2660, y: 300, w: 80, h: 18, move: { axis: 'y',  range: 80,  speed: 55 } },
    ],
    ropes: [
      { x: 460,  y: 60, length: 240 },
      { x: 1000, y: 60, length: 220 },
      { x: 1520, y: 60, length: 200 },
      { x: 2060, y: 60, length: 220 },
    ],
    ziplines: [
      { x1: 2940, y1: 260, x2: 3120, y2: 220 },
    ],
    checkpoints: [
      { x: 1760, y: 300, w: 40, h: 60 },
    ],
    coins: [
      { x: 160, y: 420 },
      { x: 460, y: 280 }, { x: 520, y: 320 }, { x: 760, y: 380 },
      { x: 1000, y: 260 }, { x: 1080, y: 300 }, { x: 1280, y: 340 },
      { x: 1520, y: 240 }, { x: 1600, y: 280 }, { x: 1820, y: 300 },
      { x: 2060, y: 260 }, { x: 2160, y: 300 }, { x: 2360, y: 340 },
      { x: 2540, y: 320 }, { x: 2700, y: 260 }, { x: 2840, y: 260 },
      { x: 3200, y: 180 }, { x: 3360, y: 160 },
    ],
  },
  {
    name: '85 · The Grid Breaks',
    width: 4000, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3900, y: 140 },
    sky: '#00061a',
    tiles: [
      { x: 0,    y: 480, w: 260, h: 60,  type: 'ground' },
      { x: 860,  y: 460, w: 180, h: 80,  type: 'ground' },
      { x: 1380, y: 80,  w: 40,  h: 460, type: 'wall' },
      { x: 1560, y: 80,  w: 40,  h: 460, type: 'wall' },
      { x: 1420, y: 80,  w: 140, h: 18,  type: 'branch' },
      { x: 1600, y: 160, w: 240, h: 18,  type: 'ground' },
      { x: 2100, y: 480, w: 60,  h: 60,  type: 'ground' },
      { x: 2160, y: 480, w: 200, h: 60,  type: 'ice' },
      { x: 2360, y: 480, w: 80,  h: 60,  type: 'bouncy' },
      { x: 2540, y: 260, w: 180, h: 18,  type: 'branch' },
      { x: 2900, y: 340, w: 160, h: 200, type: 'ground' },
      { x: 3600, y: 220, w: 180, h: 20,  type: 'ground' },
      { x: 3800, y: 180, w: 200, h: 360, type: 'ground' },
    ],
    hazards: [
      { x: 260,  y: 510, w: 600, h: 30, type: 'spikes' },
      { x: 1040, y: 510, w: 340, h: 30, type: 'spikes' },
      { x: 1600, y: 530, w: 500, h: 10, type: 'spikes' },
      { x: 2440, y: 510, w: 100, h: 30, type: 'spikes' },
      { x: 2720, y: 530, w: 180, h: 10, type: 'spikes' },
      { x: 3060, y: 530, w: 540, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 320,  y: 440, w: 100, h: 18, fall: true,  delay: 0.4 },
      { x: 480,  y: 400, w: 100, h: 18, move: { axis: 'x',  range: 120, speed: 60 } },
      { x: 660,  y: 440, w: 80,  h: 18, fall: true,  delay: 0.35 },
      { x: 3220, y: 280, w: 80,  h: 18, move: { axis: 'xy', range: 100, speed: 62 } },
      { x: 3400, y: 240, w: 80,  h: 18, move: { axis: 'x',  range: 80,  speed: 58 } },
      { x: 3540, y: 200, w: 80,  h: 18, move: { axis: 'y',  range: 80,  speed: 55 } },
    ],
    ziplines: [
      { x1: 1840, y1: 140, x2: 2100, y2: 460 },
    ],
    ropes: [
      { x: 2740, y: 60, length: 240 },
      { x: 3100, y: 60, length: 200 },
    ],
    cannons: [
      { x: 180, y: 400, w: 70, h: 70, angle: -15, power: 840 },
    ],
    checkpoints: [
      { x: 1640, y: 120, w: 40, h: 60 },
      { x: 2960, y: 280, w: 40, h: 60 },
    ],
    coins: [
      { x: 160, y: 420 },
      { x: 360, y: 380 }, { x: 520, y: 360 }, { x: 700, y: 380 },
      { x: 960, y: 400 },
      { x: 1460, y: 300 }, { x: 1460, y: 180 }, { x: 1480, y: 60  },
      { x: 1660, y: 120 },
      { x: 2200, y: 420 }, { x: 2300, y: 420 }, { x: 2480, y: 220 },
      { x: 2620, y: 340 }, { x: 2760, y: 220 }, { x: 2840, y: 280 },
      { x: 3000, y: 280 }, { x: 3100, y: 260 },
      { x: 3260, y: 240 }, { x: 3460, y: 200 },
      { x: 3640, y: 180 }, { x: 3840, y: 140 },
    ],
  },
  {
    name: '86 · Ascension',
    width: 3800, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 3700, y: 60 },
    sky: '#000315',
    tiles: [
      { x: 0,    y: 480, w: 280, h: 60,  type: 'ground' },
      { x: 380,  y: 100, w: 40,  h: 420, type: 'wall' },
      { x: 580,  y: 100, w: 40,  h: 420, type: 'wall' },
      { x: 420,  y: 100, w: 160, h: 18,  type: 'branch' },
      { x: 620,  y: 200, w: 200, h: 18,  type: 'ground' },
      { x: 620,  y: 220, w: 40,  h: 200, type: 'wall' },
      { x: 940,  y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 1140, y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 980,  y: 60,  w: 160, h: 18,  type: 'branch' },
      { x: 1180, y: 120, w: 200, h: 18,  type: 'ground' },
      { x: 1380, y: 120, w: 40,  h: 280, type: 'wall' },
      { x: 1540, y: 100, w: 160, h: 18,  type: 'branch' },
      { x: 1820, y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 2020, y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 1860, y: 60,  w: 160, h: 18,  type: 'branch' },
      { x: 2060, y: 100, w: 240, h: 18,  type: 'ground' },
      { x: 2560, y: 160, w: 200, h: 18,  type: 'ground' },
      { x: 2940, y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 3140, y: 60,  w: 40,  h: 460, type: 'wall' },
      { x: 2980, y: 60,  w: 160, h: 18,  type: 'branch' },
      { x: 3180, y: 100, w: 320, h: 18,  type: 'ground' },
      { x: 3500, y: 100, w: 300, h: 18,  type: 'ground' },
    ],
    hazards: [
      { x: 280,  y: 530, w: 100, h: 10, type: 'spikes' },
      { x: 820,  y: 530, w: 120, h: 10, type: 'spikes' },
      { x: 1580, y: 530, w: 240, h: 10, type: 'spikes' },
      { x: 2300, y: 530, w: 260, h: 10, type: 'spikes' },
      { x: 2740, y: 530, w: 200, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 2360, y: 200, w: 100, h: 18, move: { axis: 'x', range: 100, speed: 55 } },
      { x: 2480, y: 220, w: 80,  h: 18, move: { axis: 'y', range: 80,  speed: 50 } },
    ],
    climbs: [
      { x: 620,  y: 220, w: 40, h: 200 },
      { x: 1380, y: 120, w: 40, h: 280 },
    ],
    checkpoints: [
      { x: 1220, y: 80,  w: 40, h: 60 },
      { x: 2100, y: 60,  w: 40, h: 60 },
    ],
    coins: [
      { x: 160, y: 420 },
      { x: 460, y: 360 }, { x: 480, y: 240 }, { x: 500, y: 120 },
      { x: 680, y: 160 }, { x: 700, y: 360 }, { x: 720, y: 240 },
      { x: 1020, y: 340 }, { x: 1040, y: 220 }, { x: 1060, y: 100 },
      { x: 1220, y: 80  }, { x: 1440, y: 280 }, { x: 1580, y: 60  },
      { x: 1900, y: 320 }, { x: 1920, y: 200 }, { x: 1940, y: 80  },
      { x: 2100, y: 60  }, { x: 2440, y: 160 }, { x: 2620, y: 120 },
      { x: 3020, y: 280 }, { x: 3040, y: 160 }, { x: 3060, y: 60  },
      { x: 3260, y: 60  }, { x: 3560, y: 60  }, { x: 3700, y: 60  },
    ],
  },
  {
    name: '87 · Zero Point',
    width: 4400, height: 540,
    spawn: { x: 60, y: 380 },
    goal:  { x: 4300, y: 60 },
    sky: '#000000',
    tiles: [
      { x: 0,    y: 480, w: 240, h: 60,  type: 'ground' },
      { x: 680,  y: 480, w: 180, h: 60,  type: 'ground' },
      { x: 1060, y: 80,  w: 40,  h: 460, type: 'wall' },
      { x: 1240, y: 80,  w: 40,  h: 460, type: 'wall' },
      { x: 1100, y: 80,  w: 140, h: 18,  type: 'branch' },
      { x: 1280, y: 140, w: 240, h: 18,  type: 'ground' },
      { x: 1780, y: 280, w: 200, h: 18,  type: 'ice' },
      { x: 2180, y: 340, w: 180, h: 200, type: 'ground' },
      { x: 2660, y: 400, w: 180, h: 140, type: 'ground' },
      { x: 2980, y: 380, w: 140, h: 14,  type: 'oneway' },
      { x: 3180, y: 320, w: 140, h: 14,  type: 'oneway' },
      { x: 3380, y: 260, w: 140, h: 14,  type: 'oneway' },
      { x: 3580, y: 200, w: 140, h: 14,  type: 'oneway' },
      { x: 3780, y: 140, w: 140, h: 14,  type: 'oneway' },
      { x: 3980, y: 100, w: 420, h: 18,  type: 'ground' },
    ],
    hazards: [
      { x: 240,  y: 510, w: 440, h: 30, type: 'spikes' },
      { x: 860,  y: 510, w: 200, h: 30, type: 'spikes' },
      { x: 1280, y: 530, w: 500, h: 10, type: 'spikes' },
      { x: 2180, y: 530, w: 480, h: 10, type: 'spikes' },
      { x: 2840, y: 530, w: 140, h: 10, type: 'spikes' },
      { x: 3060, y: 530, w: 920, h: 10, type: 'spikes' },
    ],
    platforms: [
      { x: 2740, y: 360, w: 80, h: 18, move: { axis: 'xy', range: 100, speed: 62 } },
      { x: 2880, y: 400, w: 80, h: 18, move: { axis: 'x',  range: 80,  speed: 58 } },
    ],
    cannons: [
      { x: 160, y: 400, w: 70, h: 70, angle: -22, power: 880 },
      { x: 800, y: 400, w: 70, h: 70, angle: -20, power: 860 },
    ],
    ropes: [
      { x: 2000, y: 60, length: 240 },
    ],
    ziplines: [
      { x1: 2360, y1: 260, x2: 2660, y2: 380 },
    ],
    climbs: [
      { x: 1280, y: 140, w: 40, h: 80 },
    ],
    checkpoints: [
      { x: 1360, y: 100, w: 40, h: 60 },
      { x: 2700, y: 340, w: 40, h: 60 },
      { x: 3820, y: 100, w: 40, h: 60 },
    ],
    coins: [
      { x: 160, y: 420 }, { x: 360, y: 320 }, { x: 480, y: 280 },
      { x: 760, y: 420 },
      { x: 1140, y: 340 }, { x: 1160, y: 220 }, { x: 1180, y: 100 },
      { x: 1380, y: 100 }, { x: 1440, y: 100 },
      { x: 1840, y: 240 }, { x: 2060, y: 220 },
      { x: 2240, y: 300 }, { x: 2400, y: 300 },
      { x: 2720, y: 320 }, { x: 2940, y: 360 },
      { x: 3040, y: 340 }, { x: 3240, y: 280 }, { x: 3440, y: 220 },
      { x: 3640, y: 160 }, { x: 3840, y: 100 },
      { x: 4060, y: 60  }, { x: 4200, y: 60  }, { x: 4340, y: 60  },
    ],
  },
];
