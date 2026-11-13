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
  .grid-find button { aspect-ratio: 1; border: 0; background: #fff; font-size: inherit; font-weight: 700; font-family: 'Noto Sans TC', monospace; border-radius: 4px; padding: 0; }
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

  /* ---------- 即時進度回傳（給大螢幕轉播） ---------- */
  let state = {}, emit = null, lastSent = 0, sendTimer = null;
  function flush() { clearTimeout(sendTimer); sendTimer = null; lastSent = Date.now(); if (emit) try { emit(Object.assign({}, state)); } catch (e) {} }
  function report(patch) {
    Object.assign(state, patch);
    if (!emit) return;
    const gap = Date.now() - lastSent;
    if (gap >= 180) flush(); else if (!sendTimer) sendTimer = setTimeout(flush, 180 - gap);
  }
  function head(title, desc) { return `<div class="mg-head"><h2>${title}</h2><p>${desc}</p></div>`; }
  async function countdown(title, desc) {
    const o = overlay();
    for (let i = 3; i > 0; i--) {
      o.innerHTML = head(title, desc) + `<div class="mg-count">${i}</div>`;
      report({ stage: 'ready', count: i });
      try { navigator.vibrate && navigator.vibrate(30); } catch (e) {}
      await wait(750);
    }
  }
  function timer(o, ms, onEnd) {
    const bar = o.querySelector('.mg-bar i');
    const t0 = now();
    let lr = 0;
    const iv = setInterval(() => {
      const left = Math.max(0, ms - (now() - t0));
      if (bar) bar.style.width = (left / ms * 100) + '%';
      if (now() - lr > 450) { lr = now(); report({ left: left / ms }); }
      if (left <= 0) { clearInterval(iv); onEnd(); }
    }, 50);
    return () => clearInterval(iv);
  }
  async function showDone(text) {
    const o = overlay();
    o.innerHTML = `<div class="mg-done"><div>${text}<div style="font-size:16px;color:var(--muted);margin-top:8px">${window.MG_DONE_HINT || '請看大螢幕'}</div></div></div>`;
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
      const simOf = () => { const a = rgb2lab(hsl2rgb(th, ts, tl)), b = rgb2lab(hsl2rgb(h, s, l)); return r1(Math.max(0, 100 - Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]))); };
      const paint = () => { o.querySelector('#mine').style.background = `hsl(${h},${s}%,${l}%)`; report({ stage: 'play', target: [th, ts, tl], cur: [h, s, l], sim: simOf() }); };
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
        const stop = timer(o, 15000, finish);
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
      let cur = q(), input = '', score = 0, wrong = 0, lock = false;
      o.innerHTML = head('🧮 速算', '20 秒內答對越多越好，答錯直接跳下一題') + `<div class="mg-bar"><i></i></div><div class="mg-body">
        <div style="font-weight:900">答對 <span id="sc">0</span> 題・答錯 <span id="wr">0</span> 題</div><div class="mg-big" id="q"></div><div class="ans" id="ans"></div>${KP}</div>`;
      const draw = () => { o.querySelector('#q').textContent = cur[0] + ' = ?'; const an = o.querySelector('#ans'); an.textContent = input; an.style.color = ''; o.querySelector('#sc').textContent = score; o.querySelector('#wr').textContent = wrong; report({ stage: 'play', q: cur[0], input, score, wrong }); };
      draw();
      return new Promise((res) => {
        let done = false;
        const stop = timer(o, 20000, () => { done = true; res(score); });
        // 答錯：紅字閃一下正確答案，0.5 秒後換下一題
        const miss = () => {
          wrong++; lock = true;
          const an = o.querySelector('#ans');
          an.textContent = `✗ ${cur[1]}`; an.style.color = 'var(--red)';
          an.animate([{ transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'none' }], 200);
          try { navigator.vibrate && navigator.vibrate(120); } catch (e) {}
          setTimeout(() => { lock = false; if (done) return; cur = q(); input = ''; draw(); }, 500);
        };
        keypad(o, (k) => {
          if (done || lock) return;
          if (k === 'del') input = input.slice(0, -1);
          else if (k === 'ok') {
            if (input === '') return;
            if (+input === cur[1]) { score++; cur = q(); input = ''; } else return miss();
          } else if (input.length < 4) {
            input += k;
            if (+input === cur[1] && String(cur[1]).length === input.length) { score++; cur = q(); input = ''; }
            else if (input.length >= String(cur[1]).length) return miss(); // 位數打滿還不對 → 算錯
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
        const cols = [5, 8, 10][round], rows = cols, n = cols * rows, oi = Math.floor(R() * n); // 一關比一關大
        o.innerHTML = head(variant === 'typo' ? '🔍 找錯字' : '🐞 找 Bug', `第 ${round + 1}/3 關：找出唯一的「${odd}」`) + `<div class="mg-body">
          <div class="grid-find" style="grid-template-columns:repeat(${cols},1fr);font-size:${[30, 20, 16][round]}px">${Array.from({ length: n }, (_, i) => `<button data-i="${i}">${i === oi ? odd : norm}</button>`).join('')}</div></div>`;
        const t0 = now();
        let pen = 0;
        report({ stage: 'play', round: round + 1, wrong: 0, total: r1(total) });
        const res = await new Promise((r) => {
          const to = setTimeout(() => r(false), 20000);
          o.querySelectorAll('.grid-find button').forEach((b) => b.addEventListener('pointerdown', () => {
            if (+b.dataset.i === oi) { clearTimeout(to); r(true); }
            else { pen += 2; report({ wrong: pen / 2 }); b.classList.add('bad'); try { navigator.vibrate && navigator.vibrate(80); } catch (e) {} }
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
        <div class="mg-big" style="font-size:24px;line-height:1.4">${phrase}</div><textarea id="tx" rows="2" autocomplete="off" autocorrect="off" spellcheck="false"></textarea></div>`;
      const tx = o.querySelector('#tx');
      setTimeout(() => tx.focus(), 50);
      const t0 = now();
      report({ stage: 'play', phrase, typed: '' });
      tx.addEventListener('input', () => report({ typed: tx.value }));
      return new Promise((res) => {
        let done = false;
        const check = () => { if (!done && tx.value.replace(/\s/g, '') === phrase.replace(/\s/g, '')) { done = true; stop(); tx.blur(); res(r1((now() - t0) / 1000)); } };
        const stop = timer(o, 45000, () => { if (!done) { done = true; tx.blur(); res(99); } });
        tx.addEventListener('input', check); tx.addEventListener('compositionend', check);
      });
    },

    // 狂點：分數 = 次數
    async M5() {
      const o = overlay();
      let n = 0;
      o.innerHTML = head('👆 狂點', '10 秒內越多下越好！') + `<div class="mg-bar"><i></i></div><div class="mg-body"><div class="mg-big" id="n">0</div><button class="tapbtn" id="tap">點！</button></div>`;
      report({ stage: 'play', n: 0 });
      return new Promise((res) => {
        let done = false;
        o.querySelector('#tap').addEventListener('pointerdown', (e) => { e.preventDefault(); if (done) return; n++; o.querySelector('#n').textContent = n; report({ stage: 'play', n }); });
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
        report({ stage: 'play', trial: i + 1, light: 'red', times: times.slice() });
        // 假動作：先跑出老闆（不能按），DAINY 出現才能按
        const delay = 1400 + R() * 2400;
        const decoy = R() < 0.6 ? 500 + R() * (delay - 1100) : -1;
        const t = await new Promise((res) => {
          let green = false, t0 = 0;
          const tos = [];
          const set = (bg, txt, light) => { rx.style.background = bg; rx.textContent = txt; report({ light }); };
          if (decoy > 0) {
            tos.push(setTimeout(() => set('var(--yellow)', '👔 老闆來了！別按！', 'decoy'), decoy));
            tos.push(setTimeout(() => set('var(--red)', '等一下…', 'red'), decoy + 650));
          }
          tos.push(setTimeout(() => { green = true; t0 = now(); set('var(--green)', '🤖 DAINY！按！', 'green'); }, delay));
          const miss = setTimeout(() => res(1.5), delay + 1500);
          rx.addEventListener('pointerdown', () => {
            clearTimeout(miss);
            if (!green) { tos.forEach(clearTimeout); rx.style.background = 'var(--red)'; rx.textContent = '太早了！'; res(1.2); }
            else res((now() - t0) / 1000);
          }, { once: true });
        });
        times.push(t);
        report({ light: 'result', times: times.slice() });
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
      report({ stage: 'play', timing: 'idle' });
      await new Promise((r) => b.addEventListener('pointerdown', r, { once: true }));
      report({ timing: 'running' });
      const t0 = now();
      b.textContent = '停！'; b.style.background = 'var(--red)';
      o.querySelector('#t').textContent = '計時中…';
      const el = await new Promise((r) => {
        const to = setTimeout(() => r(15), 15000);
        setTimeout(() => b.addEventListener('pointerdown', () => { clearTimeout(to); r((now() - t0) / 1000); }, { once: true }), 150);
      });
      o.querySelector('#t').textContent = el.toFixed(2) + ' 秒';
      report({ timing: 'done', elapsed: r2(el) });
      await wait(1300);
      return r2(Math.abs(el - 5));
    },

    // 對齊：分數 = 誤差 %
    async M8(R) {
      const o = overlay();
      o.innerHTML = head('📐 對齊', '5 秒內把藍色方塊拖到紅框正中間！') + `<div class="mg-bar"><i></i></div><div class="mg-body">
        <div class="align-area" id="ar"><div class="align-target" id="tg"></div><div class="align-box" id="bx">印</div></div>
        <button class="btn green" id="done" style="width:100%;font-size:24px">完成！</button></div>`;
      const ar = o.querySelector('#ar'), tg = o.querySelector('#tg'), bx = o.querySelector('#bx');
      const W = ar.clientWidth, S = W * 0.26;
      const tx = W * 0.1 + R() * (W * 0.8 - S), ty = W * 0.1 + R() * (W * 0.8 - S);
      Object.assign(tg.style, { left: tx + 'px', top: ty + 'px', width: S + 'px', height: S + 'px' });
      let bxp = R() < 0.5 ? 4 : W - S - 4, byp = R() < 0.5 ? 4 : W - S - 4;
      if (Math.abs(bxp - tx) < S && Math.abs(byp - ty) < S) { bxp = W - S - 4 - bxp; }
      const place = () => { Object.assign(bx.style, { left: bxp + 'px', top: byp + 'px', width: S + 'px', height: S + 'px' }); report({ stage: 'play', box: [bxp / W, byp / W], target: [tx / W, ty / W], size: S / W }); };
      place();
      let drag = null;
      bx.addEventListener('pointerdown', (e) => { drag = { x: e.clientX - bxp, y: e.clientY - byp }; bx.setPointerCapture(e.pointerId); });
      bx.addEventListener('pointermove', (e) => { if (!drag) return; bxp = Math.max(0, Math.min(W - S, e.clientX - drag.x)); byp = Math.max(0, Math.min(W - S, e.clientY - drag.y)); place(); });
      bx.addEventListener('pointerup', () => drag = null);
      return new Promise((res) => {
        let done = false;
        const finish = () => { if (done) return; done = true; stop(); res(r1(Math.hypot(bxp - tx, byp - ty) / W * 100)); };
        const stop = timer(o, 5000, finish); // 時間到就用當下的位置計分
        o.querySelector('#done').onclick = finish;
      });
    },

    // 記憶：一關比一關多件作品，點出剛剛有作品的格子，點錯就結束
    // 分數 = 過了幾關 + 失敗那關答對的比例（例如 2.5 = 過 2 關，第 3 關對一半）
    async M9(R) {
      const LV = [[3, 3, 3], [4, 3, 3], [5, 4, 4], [6, 4, 4], [7, 5, 4], [8, 5, 5], [9, 5, 5]]; // [件數, 欄, 列]
      const ART = ['🖼️', '🗿', '🏺', '🎨', '🪞', '🎭', '📜', '🕯️', '🪆'];
      const o = overlay();
      const t0 = now(), LIMIT = 60000;
      let score = 0;
      for (let lv = 0; lv < LV.length; lv++) {
        if (now() - t0 > LIMIT) break;
        const [n, cols, rows] = LV[lv];
        const cnt = cols * rows;
        const cells = [...Array(cnt).keys()].sort(() => R() - 0.5).slice(0, n);
        const fs = cols >= 5 ? 28 : cols === 4 ? 34 : 44;
        const grid = (show) => `<div class="mem" style="grid-template-columns:repeat(${cols},1fr)">${Array.from({ length: cnt }, (_, i) => `<button data-i="${i}" style="font-size:${fs}px">${show && cells.includes(i) ? ART[cells.indexOf(i)] : ''}</button>`).join('')}</div>`;
        const showMs = 1500 + n * 450;
        o.innerHTML = head('🧠 記憶', `第 ${lv + 1} 關：記住 ${n} 件作品的位置！`) + `<div class="mg-body">${grid(true)}<div class="mg-big" id="cd"></div></div>`;
        report({ stage: 'play', mem: 'show', level: lv + 1, n, found: 0 });
        const tShow = now();
        while (now() - tShow < showMs) { o.querySelector('#cd').textContent = Math.ceil((showMs - (now() - tShow)) / 1000); await wait(100); }
        o.innerHTML = head('🧠 記憶', `第 ${lv + 1} 關：點出剛剛有作品的 ${n} 格`) + `<div class="mg-body">${grid(false)}<div class="mg-big" id="cd">0 / ${n}</div></div>`;
        report({ mem: 'place', level: lv + 1, n, found: 0 });
        const found = await new Promise((r) => {
          let k = 0, over = false;
          const to = setTimeout(() => { over = true; r(k); }, Math.max(1000, LIMIT - (now() - t0)) + 8000);
          o.querySelectorAll('.mem button').forEach((b) => b.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            if (over || b.classList.contains('ok')) return;
            const i = +b.dataset.i;
            if (cells.includes(i)) {
              b.classList.add('ok'); b.textContent = ART[cells.indexOf(i)]; k++;
              o.querySelector('#cd').textContent = `${k} / ${n}`;
              report({ found: k });
              if (k === n) { over = true; clearTimeout(to); r(k); }
            } else {
              b.classList.add('no'); over = true; clearTimeout(to);
              try { navigator.vibrate && navigator.vibrate(150); } catch (e) {}
              o.querySelectorAll('.mem button').forEach((x) => { const j = +x.dataset.i; if (cells.includes(j) && !x.classList.contains('ok')) x.textContent = ART[cells.indexOf(j)]; });
              setTimeout(() => r(k), 900);
            }
          }));
        });
        if (found < n) { score = lv + found / n; break; }
        score = lv + 1;
        o.querySelector('#cd').textContent = '過關！';
        await wait(600);
      }
      return r2(score);
    },

    // 人流估算：分數 = 誤差 %
    async M10(R) {
      const n = 15 + Math.floor(R() * 46);
      const o = overlay();
      const dots = Array.from({ length: n }, () => `<span style="left:${5 + R() * 90}%;top:${5 + R() * 90}%">🙂</span>`).join('');
      o.innerHTML = head('👥 人流估算', '記住大概有幾個人！') + `<div class="mg-body"><div class="crowd">${dots}</div></div>`;
      report({ stage: 'play', crowd: 'show', guess: '' });
      await wait(4000);
      // 4 選 1：正確答案 + 3 個差 20%～45% 的干擾選項
      const opts = [n];
      while (opts.length < 4) {
        const k = Math.round(n * (1 + (R() < 0.5 ? -1 : 1) * (0.2 + R() * 0.25)));
        if (k > 3 && opts.every((x) => Math.abs(x - k) >= Math.max(3, n * 0.12))) opts.push(k);
      }
      opts.sort(() => R() - 0.5);
      o.innerHTML = head('👥 人流估算', '剛剛有幾個人？選一個！') + `<div class="mg-body"><div class="kp" style="grid-template-columns:1fr 1fr">${opts.map((v) => `<button data-v="${v}" style="font-size:34px;padding:22px 0">${v}</button>`).join('')}</div></div>`;
      report({ crowd: 'guess', guess: '', opts });
      const v = await new Promise((res) => {
        const to = setTimeout(() => res(100), 15000);
        o.querySelectorAll('[data-v]').forEach((b) => b.addEventListener('pointerdown', (e) => {
          e.preventDefault(); clearTimeout(to);
          const g = +b.dataset.v;
          report({ guess: String(g) });
          b.style.background = g === n ? 'var(--green)' : '#f6a596';
          res(r1(Math.abs(g - n) / n * 100));
        }, { once: true }));
      });
      report({ answer: n });
      await wait(500);
      o.innerHTML = `<div class="mg-done">答案是 ${n} 人</div>`;
      await wait(1200);
      return v;
    },

    // 手機感應 PK 共用：先按一下（iPhone 要允許動作感應、打開聲音），最多等 20 秒
    async S_ready(o, title, desc) {
      o.innerHTML = head(title, desc) + `<div class="mg-body"><button class="tapbtn" id="go" style="background:var(--green);font-size:30px">我準備好了</button><p style="font-weight:700;color:var(--muted);text-align:center">按下去後倒數 3 秒開始<br>iPhone 跳出「動作與方向」請按允許</p></div>`;
      report({ stage: 'play', sensor: 'wait' });
      await new Promise((res) => { const to = setTimeout(res, 20000); o.querySelector('#go').onclick = () => { clearTimeout(to); beepOn(); window.Shake && Shake.ask(); res(); }; });
      for (const k of [3, 2, 1]) { o.innerHTML = head(title, desc) + `<div class="mg-count">${k}</div>`; report({ sensor: 'count', count: k }); beep(660, 0.15); vib(80); await wait(1000); }
      beep(1320, 0.3); vib(200);
    },

    // 金雞獨立：手機握在胸前單腳站，晃太大就出局。分數 = 撐住的秒數（撐滿 60 秒再比誰晃得少）
    async S1(R, variant, goal) {
      const o = overlay();
      await GAMES.S_ready(o, '🦩 金雞獨立', '手機握在胸前，單腳站好，手機晃太大就出局！');
      const STEPS = [[0, '單腳站好！', '🦩'], [15, '閉上眼睛！', '🙈'], [30, '另一隻手摸鼻子！', '👃'], [45, '踮腳尖！', '🩰']];
      const LIMIT = goal || 60, TH = 3.2, GRACE = 2.5; // 單人救援：撐到過關秒數就結束
      o.innerHTML = head('🦩 金雞獨立', '手機晃太大就出局') + `<div class="mg-bar"><i></i></div><div class="mg-body">
        <div style="font-size:70px;line-height:1" id="s1i">🦩</div><div class="mg-big" id="s1s">單腳站好！</div>
        <div class="mg-count" style="flex:none;font-size:90px" id="s1t">0.0</div>
        <div style="width:100%;font-weight:900;font-size:14px">晃動量（超過紅線就出局）</div>
        <div style="position:relative;width:100%;height:26px;border:3px solid var(--ink);border-radius:99px;background:#fff;overflow:hidden"><i id="s1m" style="display:block;height:100%;width:0;background:var(--green)"></i><span style="position:absolute;top:0;bottom:0;left:80%;width:4px;background:var(--red)"></span></div>
        <button class="btn paper" id="s1d" style="width:100%">我腳落地了 😵</button></div>`;
      const noSensor = !(window.Shake && Shake.seen);
      if (noSensor) o.querySelector('#s1s').insertAdjacentHTML('afterend', '<div style="font-weight:700;color:var(--red);font-size:13px">這支手機偵測不到晃動，請誠實按「腳落地了」</div>');
      const t0 = now();
      let ema = 0, sum = 0, n = 0, step = 0, graceUntil = t0 + GRACE * 1000, out = false;
      return new Promise((res) => {
        const end = (why) => {
          if (out) return; out = true; clearInterval(iv);
          const t = Math.min(LIMIT, (now() - t0) / 1000);
          const avg = n ? sum / n : 0;
          const score = t >= LIMIT ? (goal ? goal : r2(LIMIT + Math.max(0, 5 - avg) / 10)) : r1(t);
          report({ s1: why, t: r1(t), wob: ema });
          if (why === 'out') { vib([300, 100, 300]); beep(220, 0.5, 'sawtooth'); }
          o.querySelector('#s1s').textContent = why === 'full' ? (goal ? `撐滿 ${goal} 秒，過關！` : '撐滿 60 秒！太強了') : why === 'out' ? '晃太大，出局！' : '落地了！';
          setTimeout(() => res(score), 1200);
        };
        o.querySelector('#s1d').onclick = () => end('down');
        const iv = setInterval(() => {
          const t = (now() - t0) / 1000;
          const lv = window.Shake ? Shake.level : 0;
          ema = ema * 0.7 + lv * 0.3;
          const graced = now() < graceUntil;
          if (!graced) { sum += ema; n++; }
          const nx = STEPS.findIndex((s, i) => i > step && t >= s[0]);
          if (nx > step) { step = nx; graceUntil = now() + GRACE * 1000; o.querySelector('#s1i').textContent = STEPS[step][2]; o.querySelector('#s1s').textContent = STEPS[step][1]; beep(880, 0.2); beep(1175, 0.25, 'square', 0.08, 0.15); vib([150, 80, 150]); }
          o.querySelector('#s1t').textContent = t.toFixed(1);
          const pct = Math.min(100, ema / TH * 80);
          const m = o.querySelector('#s1m'); m.style.width = pct + '%'; m.style.background = pct > 60 ? 'var(--red)' : pct > 35 ? 'var(--yellow)' : 'var(--green)';
          o.querySelector('.mg-bar i').style.width = Math.max(0, 100 - t / LIMIT * 100) + '%';
          report({ s1: 'play', t: r1(t), wob: r2(ema), th: TH, step, inst: STEPS[step][1], graced });
          if (t >= LIMIT) end('full');
          else if (!graced && !noSensor && ema > TH) end('out');
        }, 80);
      });
    },

    // 搖手機耐力賽：60 秒，搖越多下越好
    async S2(R, variant, goal) {
      const o = overlay();
      await GAMES.S_ready(o, '📱 搖手機耐力賽', '60 秒用力搖，搖到手痠也不能停！');
      const LIMIT = 60000;
      o.innerHTML = head('📱 搖手機耐力賽', '不要停！') + `<div class="mg-bar"><i></i></div><div class="mg-body">
        <div class="mg-big" id="s2h">用力搖！</div><div class="mg-count" style="flex:none" id="s2n">0</div><div style="font-weight:900;font-size:20px" id="s2l">還剩 60 秒</div></div>`;
      let cnt = 0, tap = false, t0 = now();
      const bump = () => {
        if (now() - t0 > LIMIT) return;
        cnt++;
        const el = o.querySelector('#s2n'); if (el) el.textContent = cnt;
        beep(330 + (cnt % 40) * 15, 0.04); vib(12);
        report({ n: cnt });
      };
      const enableTap = () => { if (tap) return; tap = true; o.querySelector('#s2h').textContent = '偵測不到搖晃，改成狂點螢幕！'; o.onpointerdown = (e) => { e.preventDefault(); bump(); }; };
      if (window.Shake) Shake.on(bump);
      if (!(window.Shake && Shake.seen)) enableTap();
      return new Promise((res) => {
        const iv = setInterval(() => {
          const el = now() - t0, left = Math.max(0, LIMIT - el);
          if (!tap && cnt === 0 && el > 2500) enableTap();
          o.querySelector('#s2l').textContent = `還剩 ${Math.ceil(left / 1000)} 秒`;
          o.querySelector('.mg-bar i').style.width = (left / LIMIT * 100) + '%';
          if (left <= 10000 && left > 0 && Math.ceil(left / 1000) !== Math.ceil((left + 100) / 1000)) beep(990, 0.08);
          report({ n: cnt, left: left / LIMIT, last10: left <= 10000 });
          if (goal && cnt >= goal) { clearInterval(iv); if (window.Shake) Shake.off(); o.onpointerdown = null; o.querySelector('#s2h').textContent = `搖滿 ${goal} 下，過關！`; vib([200, 80, 200]); setTimeout(() => res(cnt), 900); return; } // 單人救援：搖到門檻就結束
          if (left <= 0) { clearInterval(iv); if (window.Shake) Shake.off(); o.onpointerdown = null; vib([200, 80, 200]); res(cnt); }
        }, 100);
      });
    },
  };

  // 小遊戲裡的音效（手機要先點過一次畫面才有聲音）
  let actx = null;
  function beepOn() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) {} }
  function beep(f, d = 0.06, type = 'square', vol = 0.08, delay = 0) {
    if (!actx) return;
    try { const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d); } catch (e) {}
  }
  const vib = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };

  window.MiniGames = {
    async play(code, opts = {}) {
      const def = G.games[code];
      const R = rng(opts.seed || 1);
      state = { game: code }; emit = opts.onProgress || null; lastSent = 0;
      if (!/^S/.test(code)) await countdown(`${def.icon} ${def.name}`, opts.title || def.desc); // 感應遊戲自己有準備畫面
      let score;
      try { score = await GAMES[code](R, opts.variant, opts.goal); }
      catch (e) { console.error(e); score = def.better === 'high' ? 0 : 99; }
      report({ stage: 'done', score }); flush();
      const shown = code === 'M9' ? Math.floor(score) : score;
      await showDone(`${def.icon} 你的成績<br><span style="font-size:44px">${shown}${def.unit}</span>`);
      close();
      emit = null;
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
