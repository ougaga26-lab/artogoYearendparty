/* 大螢幕轉播：把手機小遊戲回傳的進度畫成轉播畫面
   Broadcast.panel(player, game, data) → HTML 字串
   字級全部用 em，外層容器決定大小 */
(function () {
  const G = window.GAME;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const css = `
  .bc { position: relative; flex: 1; min-width: 0; background: #fff; border: 3px solid var(--ink); border-radius: 16px; padding: .7em .9em; display: flex; flex-direction: column; align-items: center; gap: .45em; overflow: hidden; }
  .bc-who { display: flex; align-items: center; gap: .5em; font-weight: 900; font-size: 1.15em; align-self: stretch; }
  .bc-who .avatar { width: 1.9em; height: 1.9em; font-size: 1.1em; }
  .bc-who .st { margin-left: auto; font-size: .75em; background: var(--ink); color: #fff; border-radius: 99px; padding: .1em .7em; }
  .bc-bar { align-self: stretch; height: .45em; border: 2px solid var(--ink); border-radius: 99px; overflow: hidden; background: var(--cream); }
  .bc-bar i { display: block; height: 100%; background: var(--red); transition: width .4s linear; }
  .bc-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .4em; width: 100%; text-align: center; }
  .bc-huge { font-size: 3.4em; font-weight: 900; line-height: 1; }
  .bc-big { font-size: 1.9em; font-weight: 900; line-height: 1.15; }
  .bc-mid { font-size: 1.15em; font-weight: 900; }
  .bc-sub { font-size: .9em; font-weight: 700; color: var(--muted); }
  .bc-sw { display: flex; gap: .5em; width: 100%; }
  .bc-sw div { flex: 1; height: 4.2em; border: 3px solid var(--ink); border-radius: 12px; display: grid; place-items: end center; padding-bottom: .2em; color: #fff; font-weight: 900; font-size: .85em; text-shadow: 0 1px 2px #000; }
  .bc-meter { width: 100%; height: 1.1em; border: 2px solid var(--ink); border-radius: 99px; overflow: hidden; background: var(--cream); }
  .bc-meter i { display: block; height: 100%; background: var(--green); transition: width .25s; }
  .bc-type { font-size: 1.5em; font-weight: 900; letter-spacing: .05em; }
  .bc-type .ok { color: var(--green); } .bc-type .no { color: var(--red); text-decoration: underline; } .bc-type .todo { color: #c9c9c9; }
  .bc-lamp { width: 4.5em; height: 4.5em; border-radius: 50%; border: 4px solid var(--ink); }
  .bc-area { position: relative; width: 11em; height: 11em; border: 3px solid var(--ink); border-radius: 10px; background: var(--cream); }
  .bc-area .t { position: absolute; border: 3px dashed var(--red); border-radius: 4px; }
  .bc-area .b { position: absolute; background: var(--navy); border: 2px solid var(--ink); border-radius: 4px; transition: left .18s linear, top .18s linear; }
  .bc-dots { display: flex; gap: .35em; } .bc-dots i { width: 1.2em; height: 1.2em; border-radius: 50%; border: 2px solid var(--ink); background: #fff; } .bc-dots i.on { background: var(--yellow); }
  .bc.win { box-shadow: 0 0 0 5px var(--yellow); }
  .bc-pulse { animation: bcp 1s ease-in-out infinite; } @keyframes bcp { 50% { opacity: .35; } }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const hsl = (a) => `hsl(${a[0]},${a[1]}%,${a[2]}%)`;

  function body(game, d) {
    if (!d || d.stage === 'ready' || !d.stage) {
      return `<div class="bc-huge bc-pulse">${d && d.count ? d.count : '…'}</div><div class="bc-sub">準備中</div>`;
    }
    const def = G.games[game];
    if (d.stage === 'done') {
      const s = d.score;
      const shown = s == null ? '沒完成' : `${game === 'M9' ? Math.floor(s) : s}${def.unit}`;
      return `<div class="bc-sub">完成！</div><div class="bc-big">${shown}</div>${extraDone(game, d)}`;
    }
    switch (game) {
      case 'M1': return `<div class="bc-sw"><div style="background:${hsl(d.target)}">目標</div><div style="background:${hsl(d.cur)}">調色中</div></div>
        <div class="bc-meter"><i style="width:${d.sim}%"></i></div><div class="bc-big">${d.sim}%</div><div class="bc-sub">相似度</div>`;
      case 'M2': return `<div class="bc-big">${esc(d.q)} = <span style="color:var(--red)">${esc(d.input) || '?'}</span></div><div class="bc-mid">答對 ${d.score} 題</div>`;
      case 'M3': return `<div class="bc-big">第 ${d.round} / 3 關</div><div class="bc-dots">${[1, 2, 3].map((i) => `<i class="${i < d.round ? 'on' : ''}"></i>`).join('')}</div><div class="bc-mid">點錯 ${d.wrong || 0} 次</div><div class="bc-sub">找出唯一不一樣的那個字</div>`;
      case 'M4': {
        const ph = [...(d.phrase || '')], ty = [...(d.typed || '').replace(/\s/g, '')];
        return `<div class="bc-type">${ph.map((c, i) => `<span class="${i >= ty.length ? 'todo' : ty[i] === c ? 'ok' : 'no'}">${esc(c)}</span>`).join('')}</div><div class="bc-sub">已打 ${Math.min(ty.length, ph.length)} / ${ph.length} 字</div>`;
      }
      case 'M5': return `<div class="bc-huge">${d.n || 0}</div><div class="bc-meter"><i style="width:${Math.min(100, (d.n || 0) / 90 * 100)}%;background:var(--red)"></i></div><div class="bc-sub">10 秒狂點</div>`;
      case 'M6': return `<div class="bc-lamp" style="background:${d.light === 'green' ? 'var(--green)' : d.light === 'decoy' ? 'var(--yellow)' : d.light === 'red' ? 'var(--red)' : '#ddd'}"></div>${d.light === 'decoy' ? '<div class="bc-mid">👔 假動作！</div>' : ''}
        <div class="bc-mid">第 ${d.trial} / 3 次</div><div class="bc-sub">${(d.times || []).map((t) => t >= 1.2 ? '失誤' : t.toFixed(3) + 's').join('　') || '等變綠…'}</div>`;
      case 'M7':
        if (d.timing === 'running') return `<div class="bc-big bc-pulse">⏱️ 計時中…</div><div class="bc-sub">目標：剛好 5.00 秒（全場不准幫忙數！）</div>`;
        if (d.timing === 'done') return `<div class="bc-huge">${d.elapsed.toFixed(2)}</div><div class="bc-mid">秒（差 ${Math.abs(d.elapsed - 5).toFixed(2)}）</div>`;
        return `<div class="bc-big">準備按開始</div>`;
      case 'M8': {
        const pc = (v) => (v * 100) + '%';
        return `<div class="bc-area"><div class="t" style="left:${pc(d.target[0])};top:${pc(d.target[1])};width:${pc(d.size)};height:${pc(d.size)}"></div>
          <div class="b" style="left:${pc(d.box[0])};top:${pc(d.box[1])};width:${pc(d.size)};height:${pc(d.size)}"></div></div>`;
      }
      case 'M9':
        if (d.mem === 'show') return `<div class="bc-big bc-pulse">👀 第 ${d.level || 1} 關</div><div class="bc-sub">記住 ${d.n || ''} 件作品的位置</div>`;
        return `<div class="bc-big">第 ${d.level || 1} 關</div><div class="bc-mid">找到 ${d.found || 0} / ${d.n || ''}</div><div class="bc-dots">${Array.from({ length: d.n || 0 }, (_, i) => `<i class="${i < (d.found || 0) ? 'on' : ''}"></i>`).join('')}</div>`;
      case 'M10':
        if (d.crowd === 'show') return `<div class="bc-big bc-pulse">👥 觀察人潮中…</div>`;
        return `<div class="bc-sub">猜有幾個人？${d.opts ? '（' + d.opts.join('／') + '）' : ''}</div><div class="bc-huge">${esc(d.guess) || '?'}</div>`;
      case 'S1': {
        if (d.sensor === 'wait') return `<div class="bc-big bc-pulse">🦩 準備中…</div>`;
        if (d.sensor === 'count' && !d.s1) return `<div class="bc-huge">${d.count}</div>`;
        const pct = Math.min(100, (d.wob || 0) / (d.th || 3.2) * 80);
        const out = d.s1 === 'out' || d.s1 === 'down';
        return `<div class="bc-mid">${out ? '😵 出局！' : d.s1 === 'full' ? '🏆 撐滿了！' : esc(d.inst || '')}</div><div class="bc-huge" style="${out ? 'color:var(--red)' : ''}">${(d.t || 0).toFixed(1)}<span style="font-size:.35em">秒</span></div>
          <div class="bc-meter"><i style="width:${pct}%;background:${pct > 60 ? 'var(--red)' : pct > 35 ? 'var(--yellow)' : 'var(--green)'}"></i></div><div class="bc-sub">晃動量</div>`;
      }
      case 'S2':
        if (d.sensor === 'wait') return `<div class="bc-big bc-pulse">📱 準備中…</div>`;
        if (d.sensor === 'count' && d.n == null) return `<div class="bc-huge">${d.count}</div>`;
        return `<div class="bc-huge">${d.n || 0}</div><div class="bc-meter"><i style="width:${Math.min(100, (d.n || 0) / 300 * 100)}%;background:var(--red)"></i></div><div class="bc-mid">${d.last10 ? '🔥 最後 10 秒！' : '搖！搖！搖！'}</div>`;
    }
    return '';
  }
  function extraDone(game, d) {
    if (game === 'M10' && d.answer) return `<div class="bc-sub">正確答案 ${d.answer} 人・猜 ${esc(d.guess)}</div>`;
    if (game === 'M7' && d.elapsed != null) return `<div class="bc-sub">按在 ${d.elapsed.toFixed(2)} 秒</div>`;
    if (game === 'M1' && d.target) return `<div class="bc-sw"><div style="background:${hsl(d.target)}">目標</div><div style="background:${hsl(d.cur)}">成品</div></div>`;
    return '';
  }

  window.Broadcast = {
    panel(player, game, d, opts = {}) {
      const left = d && typeof d.left === 'number' && d.stage === 'play' ? d.left : null;
      return `<div class="bc${opts.win ? ' win' : ''}">
        <div class="bc-who">${player ? `<span class="avatar" style="--c:${player.color}">${player.avatar}</span>${esc(player.name)}` : ''}<span class="st">${!d || d.stage === 'ready' ? '準備' : d.stage === 'done' ? '完成' : 'LIVE'}</span></div>
        ${left != null ? `<div class="bc-bar"><i style="width:${left * 100}%"></i></div>` : ''}
        <div class="bc-main">${body(game, d)}</div></div>`;
    },
  };
})();
