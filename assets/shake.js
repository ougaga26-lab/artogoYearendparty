// 搖手機偵測（開場典禮、測試場共用）
// 做法：抓「甩動方向反轉」來計數，像計步器。手往上甩、往下甩各算一下。
// 舊版要等加速度完全靜止才算下一下，連續大力搖時幾乎不會靜止，所以只算到 1 下。
(function () {
  const TH = 7;        // 門檻（m/s²，已扣掉重力）：走路約 2～4，用力搖通常 15 以上
  const GAP = 80;      // 兩下之間至少隔幾毫秒，避免一下被算兩次
  const QUIET = 300;   // 安靜這麼久就重置方向，下次同方向再甩也會算
  let cb = null, lastDir = 0, lastT = 0, lastStrong = 0, grav = null;

  const Shake = {
    seen: false,       // 有沒有收到過感應器資料（iPhone 沒允許時會是 false）
    level: 0,          // 目前晃動強度，給測試畫面顯示
    on(fn) { cb = fn; lastDir = 0; },
    off() { cb = null; },
    // 要在使用者點擊時呼叫：iPhone 要先同意動作感應
    ask() {
      try {
        if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
          return DeviceMotionEvent.requestPermission().catch(() => 'denied');
        }
      } catch (e) {}
      return Promise.resolve('granted');
    },
  };

  window.addEventListener('devicemotion', (e) => {
    let v = null;
    const a = e.acceleration;
    if (a && a.x != null && (a.x || a.y || a.z)) v = [a.x, a.y, a.z];
    else {
      const g = e.accelerationIncludingGravity;
      if (!g || g.x == null) return;
      const r = [g.x, g.y, g.z];
      grav = grav ? grav.map((x, i) => x * 0.85 + r[i] * 0.15) : r.slice(); // 慢慢跟上的平均值＝重力
      v = r.map((x, i) => x - grav[i]);
    }
    Shake.seen = true;
    Shake.level = Math.hypot(v[0], v[1], v[2]);
    if (!cb) return;
    let ax = 0;
    for (let i = 1; i < 3; i++) if (Math.abs(v[i]) > Math.abs(v[ax])) ax = i;
    const val = v[ax];
    const now = Date.now();
    if (Math.abs(val) < TH) { if (now - lastStrong > QUIET) lastDir = 0; return; }
    lastStrong = now;
    const dir = val > 0 ? 1 : -1;
    if (dir !== lastDir && now - lastT > GAP) { lastT = now; lastDir = dir; cb(); }
    else if (dir !== lastDir) lastDir = dir;
  });

  window.Shake = Shake;
})();
