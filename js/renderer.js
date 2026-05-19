window.Game = window.Game || {};

Game.Renderer = (function () {
  const TILE_COLORS = {
    ground:   { fill: '#6b8e3a', top: '#9bcc55', shadow: '#4a6326' },
    branch:   { fill: '#8a5a3b', top: '#a67149', shadow: '#5e3d27' },
    wall:     { fill: '#7d6243', top: '#a17e57', shadow: '#523f2c' },
    platform: { fill: '#8a5a3b', top: '#a67149', shadow: '#5e3d27' },
    bouncy:   { fill: '#ff7eb6', top: '#ffb3d2', shadow: '#c04a82' },
    ice:      { fill: '#b6e3f5', top: '#e5f7ff', shadow: '#7aafc4' },
    oneway:   { fill: 'rgba(166, 113, 73, 0.35)', top: '#c98c5e', shadow: 'rgba(94, 61, 39, 0.4)' },
  };

  function drawSky(ctx, viewW, viewH, sky) {
    const grad = ctx.createLinearGradient(0, 0, 0, viewH);
    grad.addColorStop(0, sky);
    grad.addColorStop(1, '#cdebc4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, viewW, viewH);
  }

  function drawParallaxTrees(ctx, cam, viewW, viewH) {
    // Background hills + trees that scroll slower than the camera.
    const px = -cam.x * 0.3;
    ctx.fillStyle = '#4a7a4a';
    for (let i = 0; i < 8; i++) {
      const cx = (i * 280 + px) % (viewW + 280) - 140;
      ctx.beginPath();
      ctx.arc(cx, viewH - 80, 180, Math.PI, 0);
      ctx.fill();
    }
    ctx.fillStyle = '#3a6a3a';
    const px2 = -cam.x * 0.55;
    for (let i = 0; i < 12; i++) {
      const cx = (i * 200 + px2) % (viewW + 200) - 100;
      // tree trunks
      ctx.fillRect(cx - 6, viewH - 180, 12, 80);
      // canopy
      ctx.beginPath();
      ctx.arc(cx, viewH - 200, 40, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawTile(ctx, t, cam, time) {
    const colors = TILE_COLORS[t.type] || TILE_COLORS.ground;
    // shake an about-to-fall platform to telegraph the drop
    const jitter = (t.triggered && !t.falling) ? Math.sin((time || 0) * 40) * 1.5 : 0;
    const x = Math.round(t.x - cam.x + jitter);
    const y = Math.round(t.y - cam.y);
    ctx.fillStyle = colors.fill;
    ctx.fillRect(x, y, t.w, t.h);
    // grass / top edge
    ctx.fillStyle = colors.top;
    ctx.fillRect(x, y, t.w, Math.min(6, t.h));
    // shadow on right
    ctx.fillStyle = colors.shadow;
    ctx.fillRect(x + t.w - 3, y, 3, t.h);

    // ice tile — sprinkle a few white sparkles to read as slippery
    if (t.type === 'ice') {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      const seed = Math.floor(t.x * 13.37 + t.y * 7.11);
      const count = Math.max(2, Math.floor(t.w / 40));
      for (let i = 0; i < count; i++) {
        const sx = x + ((seed * (i + 1)) % t.w);
        const sy = y + 8 + ((seed * (i + 3)) % Math.max(8, t.h - 12));
        ctx.fillRect(sx, sy, 2, 2);
      }
    }

    // one-way platform — emphasize the top edge; faint body
    if (t.type === 'oneway') {
      ctx.fillStyle = '#5e3d27';
      ctx.fillRect(x, y, t.w, 2);
    }

    // bouncy tile — zig-zag spring along the top
    if (t.type === 'bouncy') {
      ctx.strokeStyle = '#6e1e4a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const segs = Math.max(2, Math.floor(t.w / 10));
      const segW = t.w / segs;
      for (let i = 0; i <= segs; i++) {
        const sx = x + i * segW;
        const sy = y + (i % 2 === 0 ? 1 : 5);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }
  }

  function drawHazard(ctx, h, cam) {
    const x = Math.round(h.x - cam.x);
    const y = Math.round(h.y - cam.y);
    ctx.fillStyle = '#a8a8a8';
    const spikeW = 12;
    const count = Math.max(1, Math.floor(h.w / spikeW));
    const actualW = h.w / count;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const sx = x + i * actualW;
      ctx.moveTo(sx, y + h.h);
      ctx.lineTo(sx + actualW / 2, y);
      ctx.lineTo(sx + actualW, y + h.h);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawGoal(ctx, g, cam, t) {
    const x = Math.round(g.x - cam.x);
    const y = Math.round(g.y - cam.y);
    // pole
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(x + g.w / 2 - 2, y, 4, g.h);
    // flag waves with time
    const wave = Math.sin(t * 4) * 4;
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.moveTo(x + g.w / 2 + 2, y);
    ctx.lineTo(x + g.w / 2 + 28 + wave, y + 10);
    ctx.lineTo(x + g.w / 2 + 2, y + 22);
    ctx.closePath();
    ctx.fill();
  }

  function drawPlayer(ctx, p, cam, t) {
    const x = Math.round(p.x - cam.x);
    const y = Math.round(p.y - cam.y);

    // Body — soft rounded rectangle in warm purple
    ctx.fillStyle = '#9b6bd6';
    roundRect(ctx, x, y, p.w, p.h, 8);
    ctx.fill();

    // Subtle shadow on the lower body
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    roundRect(ctx, x, y + p.h * 0.6, p.w, p.h * 0.4, 8);
    ctx.fill();

    if (!p.sliding) {
      // Face — two eyes + smile, facing direction
      const eyeY = y + 16;
      const eyeOffset = p.facing > 0 ? 4 : -4;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + p.w / 2 - 5 + eyeOffset, eyeY, 4, 0, Math.PI * 2);
      ctx.arc(x + p.w / 2 + 5 + eyeOffset, eyeY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(x + p.w / 2 - 5 + eyeOffset + p.facing, eyeY, 2, 0, Math.PI * 2);
      ctx.arc(x + p.w / 2 + 5 + eyeOffset + p.facing, eyeY, 2, 0, Math.PI * 2);
      ctx.fill();
      // smile
      ctx.strokeStyle = '#3a1f5c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x + p.w / 2 + eyeOffset * 0.5, y + 28, 4, 0, Math.PI);
      ctx.stroke();
      // little hair tuft
      ctx.fillStyle = '#3a1f5c';
      ctx.fillRect(x + p.w / 2 - 6, y - 2, 12, 4);
      ctx.fillRect(x + p.w / 2 + 2, y - 5, 4, 4);
    } else {
      // sliding pose — just a squished face
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + p.w / 2 + (p.facing * 6), y + p.h / 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wall-slide effect — little dust puffs
    if ((p.onWallLeft || p.onWallRight) && !p.onGround && p.vy > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      const dx = p.onWallLeft ? x : x + p.w;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(dx, y + 10 + i * 14 + (t * 200) % 14, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawCoin(ctx, c, cam, time) {
    const cx = Math.round(c.x + c.w / 2 - cam.x);
    const cy = Math.round(c.y + c.h / 2 - cam.y);
    const r = c.w / 2;
    // x-radius scales with cos(t) so it appears to spin around its vertical axis
    const sx = Math.max(2, Math.abs(Math.cos(time * 4)) * r);
    ctx.fillStyle = '#f5c542';
    ctx.beginPath();
    ctx.ellipse(cx, cy, sx, r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a07a14';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // shine
    ctx.fillStyle = '#fff6c0';
    ctx.beginPath();
    ctx.ellipse(cx - sx * 0.3, cy - r * 0.3, Math.max(1, sx * 0.3), r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawClimb(ctx, c, cam) {
    const x = Math.round(c.x - cam.x);
    const y = Math.round(c.y - cam.y);
    // posts
    ctx.fillStyle = '#5e3d27';
    ctx.fillRect(x, y, 4, c.h);
    ctx.fillRect(x + c.w - 4, y, 4, c.h);
    // rungs every 22px
    ctx.fillStyle = '#a67149';
    const step = 22;
    for (let ry = y + 8; ry < y + c.h - 2; ry += step) {
      ctx.fillRect(x + 2, ry, c.w - 4, 5);
      ctx.fillStyle = '#5e3d27';
      ctx.fillRect(x + 2, ry + 5, c.w - 4, 1);
      ctx.fillStyle = '#a67149';
    }
  }

  function drawRope(ctx, r, cam) {
    const ax = Math.round(r.x - cam.x);
    const ay = Math.round(r.y - cam.y);
    const tipX = ax + Math.sin(r.angle) * r.length;
    const tipY = ay + Math.cos(r.angle) * r.length;
    // anchor knot
    ctx.fillStyle = '#3a2618';
    ctx.beginPath();
    ctx.arc(ax, ay, 5, 0, Math.PI * 2);
    ctx.fill();
    // rope line
    ctx.strokeStyle = '#8a5a3b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    // tip handle
    ctx.fillStyle = '#5e3d27';
    ctx.beginPath();
    ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a2618';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawZipline(ctx, z, cam) {
    const x1 = Math.round(z.x1 - cam.x);
    const y1 = Math.round(z.y1 - cam.y);
    const x2 = Math.round(z.x2 - cam.x);
    const y2 = Math.round(z.y2 - cam.y);
    // posts at each end
    ctx.fillStyle = '#3a2618';
    ctx.fillRect(x1 - 3, y1 - 4, 6, 14);
    ctx.fillRect(x2 - 3, y2 - 4, 6, 14);
    // cable
    ctx.strokeStyle = '#4a3a2a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1 - 1);
    ctx.lineTo(x2, y2 - 1);
    ctx.stroke();
  }

  function drawCannon(ctx, c, cam) {
    const cx = Math.round(c.x + c.w / 2 - cam.x);
    const cy = Math.round(c.y + c.h / 2 - cam.y);
    const rad = c.angle * Math.PI / 180;
    // base mount
    ctx.fillStyle = '#2a2a3a';
    ctx.beginPath();
    ctx.arc(cx, cy, c.w / 2, 0, Math.PI * 2);
    ctx.fill();
    // angled barrel
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rad);
    const barrelLen = c.w * 0.95;
    const barrelW = Math.max(10, c.w * 0.45);
    ctx.fillStyle = '#444a60';
    ctx.fillRect(0, -barrelW / 2, barrelLen, barrelW);
    // barrel mouth (darker tip)
    ctx.fillStyle = '#15151f';
    ctx.fillRect(barrelLen - 6, -barrelW / 2, 6, barrelW);
    // gold accent stripe
    ctx.fillStyle = '#f5c542';
    ctx.fillRect(4, -2, barrelLen - 10, 4);
    ctx.restore();
    // rim highlight on the base
    ctx.strokeStyle = '#6a6a8a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, c.w / 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawCheckpoint(ctx, cp, cam, time) {
    const x = Math.round(cp.x - cam.x);
    const y = Math.round(cp.y - cam.y);
    const midX = x + cp.w / 2;
    // pole
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(midX - 2, y, 4, cp.h);
    // flag — grey when dormant, green-waving when activated
    const wave = cp.activated ? Math.sin((time || 0) * 5) * 4 : 0;
    ctx.fillStyle = cp.activated ? '#42f5a1' : '#9a9a9a';
    ctx.beginPath();
    ctx.moveTo(midX + 2, y + 4);
    ctx.lineTo(midX + 28 + wave, y + 14);
    ctx.lineTo(midX + 2, y + 26);
    ctx.closePath();
    ctx.fill();
    // base
    ctx.fillStyle = cp.activated ? '#2da77a' : '#555';
    ctx.fillRect(midX - 10, y + cp.h - 6, 20, 6);
  }

  function drawCoinHud(ctx, collected, total) {
    if (!total) return;
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, sans-serif';
    const label = `Coins: ${collected} / ${total}`;
    const padX = 10, padY = 6;
    const w = ctx.measureText(label).width + padX * 2 + 24;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(12, 12, w, 28);
    // mini coin icon
    ctx.fillStyle = '#f5c542';
    ctx.beginPath();
    ctx.arc(12 + padX + 7, 12 + 14, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a07a14';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(label, 12 + padX + 20, 12 + 21);
  }

  function drawBestTime(ctx, seconds, yOffset) {
    if (seconds == null) return;
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    const label = `Best: ${seconds.toFixed(2)}s`;
    const padX = 10;
    const w = ctx.measureText(label).width + padX * 2;
    const y = (yOffset || 0) + 12;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(12, y, w, 24);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(label, 12 + padX, y + 16);
  }

  function drawOverlay(ctx, viewW, viewH, text, sub) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(text, viewW / 2, viewH / 2 - 10);
    if (sub) {
      ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(sub, viewW / 2, viewH / 2 + 28);
    }
    ctx.textAlign = 'left';
  }

  return {
    drawSky,
    drawParallaxTrees,
    drawTile,
    drawHazard,
    drawGoal,
    drawPlayer,
    drawCoin,
    drawClimb,
    drawRope,
    drawZipline,
    drawCannon,
    drawCheckpoint,
    drawCoinHud,
    drawBestTime,
    drawOverlay,
  };
})();
