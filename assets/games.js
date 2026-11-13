/* 手機小遊戲：MiniGames.play(code, {seed, variant, title}) → Promise<分數>
   分數單位跟 GAME.games 的 unit 一致；沒完成給最差分數 */
(function () {
  const G = window.GAME;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const now = () => performance.now();
  const r1 = (v) => Math.round(v * 10) / 10;
  const r2 = (v) => Math.round(v * 100) / 100;

  function rng(seed) {
    let a = (seed >>> 0) || 1;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const css = `
  .mg { position: fixed; inset: 0; z-index: 100; background: var(--cream); display: flex; flex-direction: column; padding: 16px; padding-top: calc(16px + env(safe-area-inset-top)); user-select: none; -webkit-user-select: none; touch-action: manipulation; }
  .mg.hidden { display: none; }
  .mg-head { text-align: center; }
  .mg-head h2 { margin: 0; font-size: 26px; font-weight: 900; }
  .mg-head p { margin: 4px 0 0; font-weight: 700; color: var(--muted); }
  .mg-count { flex: 1; display: grid; place-items: center; font-size: 140px; font-weight: 900; color: var(--red); -webkit-text-stroke: 6px var(--ink); paint-order: stroke fill; }
  .mg-bar { height: 12px; border: 2px solid var(--ink); border-radius: 99px; background: #fff; margin: 12px 0; overflow: hidden; }
  .mg-bar i { display: block; height: 100%; background: var(--red); transition: width .1s linear; }
  .mg-body { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; min-height: 0; }
  .mg-big { font-size: 40px; font-weight: 900; text-align: center; }
  .mg-done { flex: 1; display: grid; place-items: center; text-align: center; font-size: 28px; font-weight: 900; }
  .sw { display: flex; gap: 12px; width: 100%; }
  .sw div { flex: 1; height: 120px; border: 3px solid var(--ink); border-radius: 14px; display: grid; place-items: end center; padding-bottom: 6px; font-weight: 900; font-size: 13px; color: #fff; text-shadow: 0 1px 2px #000; }
  .mg input[type=range] { width: 100%; height: 36px; }
  .mg label.sl { width: 100%; font-weight: 900; }
  .kp { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 100%; max-width: 360px; }
  .kp button { font-size: 28px; font-weight: 900; padding: 14px 0; border: 3px solid var(--ink); border-radius: 12px; background: #fff; box-shadow: 0 3px 0 var(--ink); }
  .kp button:active { transform: translateY(3px); box-shadow: none; }
  .kp .ok { background: var(--green); color: #fff; }
  .ans { font-size: 36px; font-weight: 900; min-height: 48px; border-bottom: 3px solid var(--ink); min-width: 140px; text-align: center; }
  .grid-find { display: grid; gap: 2px; width: 100%; max-width: 420px; }
  .grid-find button { aspect-ratio: 1; border: 0; background: #fff; font-size: 22px; font-weight: 700; font-family: 'Noto Sans TC', monospace; border-radius: 4px; padding: 0; }
  .grid-find button.bad { background: #f6a596; }
  .tapbtn { width: 230px; height: 230px; border-radius: 50%; border: 4px solid var(--ink); background: var(--red); color: #fff; font-size: 40px; font-weight: 900; box-shadow: 0 8px 0 var(--ink); }
  .tapbtn:active { transform: translateY(6px); box-shadow: 0 2px 0 var(--ink); }
  .react { flex: 1; width: 100%; border: 4px solid var(--ink); border-radius: 20px; display: grid; place-items: center; font-size: 34px; font-weight: 900; color: #fff; text-align: center; }
  .align-area { position: relative; width: min(86vw, 360px); aspect-ratio: 1; background: #fff; border: 3px solid var(--ink); border-radius: 12px; touch-action: none; }
  .align-target { position: absolute; border: 3px dashed var(--red); border-radius: 6px; }
  .align-box { position: absolute; background: var(--navy); border: 3px solid var(--ink); border-radius: 6px; display: grid; place-items: center; color: #fff; font-weight: 900; touch-action: none; }
  .mem { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: min(86vw, 330px); }
  .mem button { aspect-ratio: 1; font-size: 44px; border: 3px solid var(--ink); border-radius: 14px; background: #fff; }
  .mem button.ok { background: var(--mint); } .mem button.no { background: #f6a596; }
  .crowd { position: relative; width: min(90vw, 380px); aspect-ratio: 1; background: #fff; border: 3px solid var(--ink); border-radius: 12px; overflow: hidden; }
  .crowd span { position: absolute; font-size: 18px; transform: translate(-50%, -50%); }
  .mg textarea { width: 100%; font: inherit; font-size: 24px; font-weight: 700; padding: 10px; border: 3px solid var(--ink); border-radius: 12px; }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  let ov = null;
  function overlay() {
    if (!ov) { ov = document.createElement('div'); ov.className = 'mg'; document.body.appendChild(ov); }
    ov.classList.remove('hidden');
    return ov;
  }
  function close() { if (ov) { ov.classList.add('hidden'); ov.innerHTML = ''; } }
  function head(title, desc) { return `<div class="mg-head"><h2>${title}</h2><p>${desc}</p></div>`; }
  async function countdown(title, desc) {
    const o = overlay();
    for (let i = 3; i > 0; i--) {
      o.innerHTML = head(title, desc) + `<div class="mg-count">${i}</div>`;
      try { navigator.vibrate && navigator.vibrate(30); } catch (e) {}
      await wait(750);
    }
  }
  function timer(o, ms, onEnd) {
    const bar = o.querySelector('.mg-bar i');
    const t0 = now();
    const iv = setInterval(() => {
      const left = Math.max(0, ms - (now() - t0));
      if (bar) bar.style.width = (left / ms * 100) + '%';
      if (left <= 0) { clearInterval(iv); onEnd(); }
    }, 50);
    return () => clearInterval(iv);
  }
  async function showDone(text) {
    const o = overlay();
    o.innerHTML = `<div class="mg-done"><div>${text}<div style="font-size:16px;color:var(--muted);margin-top:8px">請看大螢幕</div></div></div>`;
    await wait(1800);
  }
  function keypad(o, onKey) {
    o.querySelectorAll('.kp button').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); onKey(b.dataset.k); }));
  }
  const KP = `<div class="kp">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-k="${n}">${n}</button>`).join('')}<button data-k="del">⌫</button><button data-k="0">0</button><button data-k="ok" class="ok">✓</button></div>`;

  /* ---------- 色彩 ---------- */
  function hsl2rgb(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0) * 255, f(8) * 255, f(4) * 255];
  }
  function rgb2lab([r, g, b]) {
    const c = (v) => { v /= 255; return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92; };
    r = c(r); g = c(g); b = c(b);
    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047, y = r * 0.2126 + g * 0.7152 + b * 0.0722, z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    const f = (t) => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
    x = f(x); y = f(y); z = f(z);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  }

  const GAMES = {
    // 色卡對色：分數 = 相似度 %
    async M1(R) {
      const th = Math.floor(R() * 360), ts = 45 + Math.floor(R() * 45), tl = 35 + Math.floor(R() * 30);
      let h = (th + 120 + Math.floor(R() * 120)) % 360, s = 50, l = 55;
      const o = overlay();
      o.innerHTML = head('🎨 色卡對色', '調出跟左邊一樣的顏色，按「完成」') + `<div class="mg-bar"><i></i></div><div class="mg-body">
        <div class="sw"><div style="background:hsl(${th},${ts}%,${tl}%)">目標</div><div id="mine">你的</div></div>
        <label class="sl">色相<input type="range" id="h" min="0" max="359" value="${h}"></label>
        <label class="sl">彩度<input type="range" id="s" min="0" max="100" value="${s}"></label>
        <label class="sl">明度<input type="range" id="l" min="0" max="100" value="${l}"></label>
        <button class="btn green" id="done" style="width:100%;font-size:24px">完成！</button></div>`;
      const paint = () => { o.querySelector('#mine').style.background = `hsl(${h},${s}%,${l}%)`; };
      paint();
      ['h', 's', 'l'].forEach((k) => o.querySelector('#' + k).addEventListener('input', (e) => { if (k === 'h') h = +e.target.value; if (k === 's') s = +e.target.value; if (k === 'l') l = +e.target.value; paint(); }));
      return new Promise((res) => {
        let done = false;
        const finish = () => {
          if (done) return; done = true; stop();
          const a = rgb2lab(hsl2rgb(th, ts, tl)), b = rgb2lab(hsl2rgb(h, s, l));
          const dE = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
          res(r1(Math.max(0, 100 - dE)));
        };
        const stop = timer(o, 25000, finish);
        o.querySelector('#done').onclick = finish;
      });
    },

    // 速算：分數 = 答對題數
    async M2(R) {
      const q = () => {
        const t = R();
        if (t < 0.4) { const a = 10 + Math.floor(R() * 80), b = 10 + Math.floor(R() * 80); return [`${a} + ${b}`, a + b]; }
        if (t < 0.75) { const a = 30 + Math.floor(R() * 70), b = 10 + Math.floor(R() * (a - 10)); return [`${a} − ${b}`, a - b]; }
        const a = 2 + Math.floor(R() * 8), b = 2 + Math.floor(R() * 8); return [`${a} × ${b}`, a * b];
      };
      const o = overlay();
      let cur = q(), input = '', score = 0;
      o.innerHTML = head('🧮 速算', '20 秒內答對越多越好') + `<div class="mg-bar"><i></i></div><div class="mg-body">
        <div style="font-weight:900">答對 <span id="sc">0</span> 題</div><div class="mg-big" id="q"></div><div class="ans" id="ans"></div>${KP}</div>`;
      const draw = () => { o.querySelector('#q').textContent = cur[0] + ' = ?'; o.querySelector('#ans').textContent = input; o.querySelector('#sc').textContent = score; };
      draw();
      return new Promise((res) => {
        let done = false;
        const stop = timer(o, 20000, () => { done = true; res(score); });
        keypad(o, (k) => {
          if (done) return;
          if (k === 'del') input = input.slice(0, -1);
          else if (k === 'ok') {
            if (+input === cur[1] && input !== '') { score++; cur = q(); }
            else { o.querySelector('#ans').animate([{ transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'none' }], 200); }
            input = '';
          } else if (input.length < 4) {
            input += k;
            if (+input === cur[1] && String(cur[1]).length === input.length) { score++; cur = q(); input = ''; }
          }
          draw();
        });
      });
    },

    // 找 Bug／找錯字：分數 = 秒數（越少越好）
    async M3(R, variant) {
      const pairs = variant === 'typo' ? G.typoPairs : G.bugPairs;
      const o = overlay();
      let total = 0;
      for (let round = 0; round < 3; round++) {
        const [norm, odd] = pairs[Math.floor(R() * pairs.length)];
        const cols = 8, rows = 11, n = cols * rows, oi = Math.floor(R() * n);
        o.innerHTML = head(variant === 'typo' ? '🔍 找錯字' : '🐞 找 Bug', `第 ${round + 1}/3 關：找出唯一的「${odd}」`) + `<div class="mg-body">
          <div class="grid-find" style="grid-template-columns:repeat(${cols},1fr)">${Array.from({ length: n }, (_, i) => `<button data-i="${i}">${i === oi ? odd : norm}</button>`).join('')}</div></div>`;
        const t0 = now();
        let pen = 0;
        const res = await new Promise((r) => {
          const to = setTimeout(() => r(false), 20000);
          o.querySelectorAll('.grid-find button').forEach((b) => b.addEventListener('pointerdown', () => {
            if (+b.dataset.i === oi) { clearTimeout(to); r(true); }
            else { pen += 2; b.classList.add('bad'); try { navigator.vibrate && navigator.vibrate(80); } catch (e) {} }
          }));
        });
        if (!res) return 99;
        total += (now() - t0) / 1000 + pen;
      }
      return r1(total);
    },

    // 打字：分數 = 秒數
    async M4(R) {
      const phrase = G.typingPhrases[Math.floor(R() * G.typingPhrases.length)];
      const o = overlay();
      o.innerHTML = head('⌨️ 打字', '一字不差打出下面這句，打對自動完成') + `<div class="mg-bar"><i></i></div><div class="mg-body" style="justify-content:flex-start">
        <div class="mg-big" style="font-size:28px">${phrase}</div><textarea id="tx" rows="2" autocomplete="off" autocorrect="off" spellcheck="false"></textarea></div>`;
      const tx = o.querySelector('#tx');
      setTimeout(() => tx.focus(), 50);
      const t0 = now();
      return new Promise((res) => {
        let done = false;
        const check = () => { if (!done && tx.value.replace(/\s/g, '') === phrase.replace(/\s/g, '')) { done = true; stop(); tx.blur(); res(r1((now() - t0) / 1000)); } };
        const stop = timer(o, 40000, () => { if (!done) { done = true; tx.blur(); res(99); } });
        tx.addEventListener('input', check); tx.addEventListener('compositionend', check);
      });
    },

    // 狂點：分數 = 次數
    async M5() {
      const o = overlay();
      let n = 0;
      o.innerHTML = head('👆 狂點', '10 秒內越多下越好！') + `<div class="mg-bar"><i></i></div><div class="mg-body"><div class="mg-big" id="n">0</div><button class="tapbtn" id="tap">點！</button></div>`;
      return new Promise((res) => {
        let done = false;
        o.querySelector('#tap').addEventListener('pointerdown', (e) => { e.preventDefault(); if (done) return; n++; o.querySelector('#n').textContent = n; });
        timer(o, 10000, () => { done = true; res(n); });
      });
    },

    // 反應力：分數 = 平均秒數
    async M6(R) {
      const o = overlay();
      const times = [];
      for (let i = 0; i < 3; i++) {
        o.innerHTML = head('⚡ 反應力', `第 ${i + 1}/3 次：變綠就按！`) + `<div class="mg-body"><div class="react" id="rx" style="background:var(--red)">等一下…</div></div>`;
        const rx = o.querySelector('#rx');
        const delay = 1000 + R() * 2200;
        const t = await new Promise((res) => {
          let green = false, t0 = 0;
          const to = setTimeout(() => { green = true; t0 = now(); rx.style.background = 'var(--green)'; rx.textContent = '按！'; }, delay);
          const miss = setTimeout(() => res(1.5), delay + 1500);
          rx.addEventListener('pointerdown', () => {
            clearTimeout(miss);
            if (!green) { clearTimeout(to); rx.textContent = '太早了！'; res(1.2); }
            else res((now() - t0) / 1000);
          }, { once: true });
        });
        times.push(t);
        rx.textContent = t >= 1.2 ? '太早或太慢 😵' : t.toFixed(3) + ' 秒';
        await wait(900);
      }
      return r2(times.reduce((a, b) => a + b, 0) / 3);
    },

    // 精準計時：分數 = 誤差秒數
    async M7() {
      const o = overlay();
      o.innerHTML = head('⏱️ 精準計時', '按開始後，在心裡數到剛好 5.00 秒按停') + `<div class="mg-body"><button class="tapbtn" id="b" style="background:var(--green)">開始</button><div class="mg-big" id="t"></div></div>`;
      const b = o.querySelector('#b');
      await new Promise((r) => b.addEventListener('pointerdown', r, { once: true }));
      const t0 = now();
      b.textContent = '停！'; b.style.background = 'var(--red)';
      o.querySelector('#t').textContent = '計時中…';
      const el = await new Promise((r) => {
        const to = setTimeout(() => r(15), 15000);
        setTimeout(() => b.addEventListener('pointerdown', () => { clearTimeout(to); r((now() - t0) / 1000); }, { once: true }), 150);
      });
      o.querySelector('#t').textContent = el.toFixed(2) + ' 秒';
      await wait(1300);
      return r2(Math.abs(el - 5));
    },

    // 對齊：分數 = 誤差 %
    async M8(R) {
      const o = overlay();
      o.innerHTML = head('📐 對齊', '把藍色方塊拖到紅框正中間，按「完成」') + `<div class="mg-bar"><i></i></div><div class="mg-body">
        <div class="align-area" id="ar"><div class="align-target" id="tg"></div><div class="align-box" id="bx">印</div></div>
        <button class="btn green" id="done" style="width:100%;font-size:24px">完成！</button></div>`;
      const ar = o.querySelector('#ar'), tg = o.querySelector('#tg'), bx = o.querySelector('#bx');
      const W = ar.clientWidth, S = W * 0.26;
      const tx = W * 0.1 + R() * (W * 0.8 - S), ty = W * 0.1 + R() * (W * 0.8 - S);
      Object.assign(tg.style, { left: tx + 'px', top: ty + 'px', width: S + 'px', height: S + 'px' });
      let bxp = R() < 0.5 ? 4 : W - S - 4, byp = R() < 0.5 ? 4 : W - S - 4;
      if (Math.abs(bxp - tx) < S && Math.abs(byp - ty) < S) { bxp = W - S - 4 - bxp; }
      const place = () => Object.assign(bx.style, { left: bxp + 'px', top: byp + 'px', width: S + 'px', height: S + 'px' });
      place();
      let drag = null;
      bx.addEventListener('pointerdown', (e) => { drag = { x: e.clientX - bxp, y: e.clientY - byp }; bx.setPointerCapture(e.pointerId); });
      bx.addEventListener('pointermove', (e) => { if (!drag) return; bxp = Math.max(0, Math.min(W - S, e.clientX - drag.x)); byp = Math.max(0, Math.min(W - S, e.clientY - drag.y)); place(); });
      bx.addEventListener('pointerup', () => drag = null);
      return new Promise((res) => {
        let done = false;
        const finish = () => { if (done) return; done = true; stop(); res(r1(Math.hypot(bxp - tx, byp - ty) / W * 100)); };
        const stop = timer(o, 20000, finish);
        o.querySelector('#done').onclick = finish;
      });
    },

    // 記憶：分數 = 答對件數（+ 速度小數加分）
    async M9(R) {
      const icons = ['🖼️', '🗿', '🏺', '🎨'];
      const cells = [...Array(9).keys()].sort(() => R() - 0.5).slice(0, 4);
      const o = overlay();
      const grid = (show) => `<div class="mem">${Array.from({ length: 9 }, (_, i) => `<button data-i="${i}">${show && cells.includes(i) ? icons[cells.indexOf(i)] : ''}</button>`).join('')}</div>`;
      o.innerHTML = head('🧠 記憶', '記住每件作品的位置！') + `<div class="mg-body">${grid(true)}<div class="mg-big" id="cd">3</div></div>`;
      for (let i = 3; i > 0; i--) { o.querySelector('#cd').textContent = i; await wait(1000); }
      let correct = 0;
      const t0 = now();
      for (let k = 0; k < 4; k++) {
        o.innerHTML = head('🧠 記憶', '剛剛它在哪一格？') + `<div class="mg-body"><div class="mg-big">${icons[k]}</div>${grid(false)}</div>`;
        const i = await new Promise((r) => {
          const to = setTimeout(() => r(-1), 10000);
          o.querySelectorAll('.mem button').forEach((b) => b.addEventListener('pointerdown', () => { clearTimeout(to); r(+b.dataset.i); }, { once: true }));
        });
        const ok = i === cells[k];
        if (ok) correct++;
        const btn = o.querySelector(`.mem button[data-i="${i}"]`);
        if (btn) { btn.classList.add(ok ? 'ok' : 'no'); btn.textContent = icons[k]; }
        await wait(400);
      }
      const t = Math.min(30, (now() - t0) / 1000);
      return r2(correct + (1 - t / 30) * 0.99);
    },

    // 人流估算：分數 = 誤差 %
    async M10(R) {
      const n = 40 + Math.floor(R() * 110);
      const o = overlay();
      const dots = Array.from({ length: n }, () => `<span style="left:${4 + R() * 92}%;top:${4 + R() * 92}%">🙂</span>`).join('');
      o.innerHTML = head('👥 人流估算', '記住大概有幾個人！') + `<div class="mg-body"><div class="crowd">${dots}</div></div>`;
      await wait(2500);
      let input = '';
      o.innerHTML = head('👥 人流估算', '剛剛有幾個人？') + `<div class="mg-body"><div class="ans" id="ans"></div>${KP}</div>`;
      return new Promise((res) => {
        const to = setTimeout(() => res(100), 20000);
        keypad(o, (k) => {
          if (k === 'del') input = input.slice(0, -1);
          else if (k === 'ok') { if (input) { clearTimeout(to); res(r1(Math.abs(+input - n) / n * 100)); } return; }
          else if (input.length < 3) input += k;
          o.querySelector('#ans').textContent = input;
        });
      }).then(async (v) => { o.innerHTML = `<div class="mg-done">答案是 ${n} 人</div>`; await wait(1200); return v; });
    },
  };

  window.MiniGames = {
    async play(code, opts = {}) {
      const def = G.games[code];
      const R = rng(opts.seed || 1);
      await countdown(`${def.icon} ${def.name}`, opts.title || def.desc);
      let score;
      try { score = await GAMES[code](R, opts.variant); }
      catch (e) { console.error(e); score = def.better === 'high' ? 0 : 99; }
      const shown = code === 'M9' ? Math.floor(score) : score;
      await showDone(`${def.icon} 你的成績<br><span style="font-size:44px">${shown}${def.unit}</span>`);
      close();
      return score;
    },
    // 全場搶按：回傳反應毫秒（太早按 = 99999）
    async rush(label, seed) {
      const o = overlay();
      const R = rng(seed);
      o.innerHTML = `<div class="mg-head"><h2>${label}</h2><p>畫面變綠就按！太早按算最後一名</p></div><div class="mg-body"><div class="react" id="rx" style="background:var(--red)">準備…</div></div>`;
      const rx = o.querySelector('#rx');
      const delay = 1500 + R() * 2500;
      const ms = await new Promise((res) => {
        let green = false, t0 = 0;
        const to = setTimeout(() => { green = true; t0 = now(); rx.style.background = 'var(--green)'; rx.textContent = '搶！'; try { navigator.vibrate && navigator.vibrate(60); } catch (e) {} }, delay);
        const miss = setTimeout(() => res(9000), delay + 6000);
        rx.addEventListener('pointerdown', () => {
          clearTimeout(miss);
          if (!green) { clearTimeout(to); res(99999); } else res(Math.round(now() - t0));
        }, { once: true });
      });
      rx.textContent = ms >= 99999 ? '太早了 😵' : ms >= 9000 ? '太慢了…' : `${(ms / 1000).toFixed(3)} 秒`;
      await wait(1300);
      close();
      return ms;
    },
    close,
  };
})();
