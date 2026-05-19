# Parkour Game

A small 2D side-scrolling parkour platformer that runs in any modern browser. No build step, no dependencies — pure HTML, CSS, and JavaScript.

## Play

Visit the live site (link will appear here once GitHub Pages is enabled), or clone this repo and double-click `index.html`.

## Controls

| Action | Key |
| --- | --- |
| Move | ← → (or A / D) |
| Jump | Space (press twice for double jump) |
| Wall jump | Press jump while sliding down a wall |
| Slide / crouch | Shift (or ↓ / S) |
| Restart level | R |

## Levels

1. **First Steps** — learn run, jump, and double-jump.
2. **Up the Canopy** — spikes, slide-under, and a wall-jump shaft.
3. **Moving Bridges** — moving platforms over a spike pit.

## Project layout

```
index.html      ← entry point
css/style.css   ← page styling
js/
  input.js      ← keyboard handling
  physics.js    ← gravity + AABB collision (tune game feel here)
  player.js     ← character state and moves
  camera.js     ← follow camera
  level.js      ← load + update level data
  levels.js     ← all level data (add new levels here)
  renderer.js   ← canvas drawing
  main.js       ← game loop + state machine
```

Adding a new level: append an object to `Game.LEVELS` in `js/levels.js`. The loader ignores unknown keys, so new entity types (ziplines, collectibles, enemies) can be added without breaking existing levels.
