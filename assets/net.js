/* 連線層：透過公開 MQTT（WebSocket）中繼，主畫面與手機不用在同一個 Wi-Fi */
window.BROKERS = [
  { name: 'EMQX', url: 'wss://broker.emqx.io:8084/mqtt' },
  { name: 'HiveMQ', url: 'wss://broker.hivemq.com:8884/mqtt' },
];

window.netConnect = function ({ room, broker = 0, role, onMsg, onStatus }) {
  const b = BROKERS[broker] || BROKERS[0];
  const base = 'artogo-wy26/' + room;
  const isHost = role === 'host';
  const client = mqtt.connect(b.url, {
    clientId: 'wy26_' + role + '_' + Math.random().toString(16).slice(2, 10),
    reconnectPeriod: 2000,
    connectTimeout: 8000,
    keepalive: 20,
    clean: true,
  });
  const status = (s) => onStatus && onStatus(s);
  client.on('connect', () => {
    client.subscribe(isHost ? base + '/u' : base + '/s', { qos: 1 });
    status('online');
  });
  client.on('reconnect', () => status('reconnecting'));
  client.on('offline', () => status('offline'));
  client.on('close', () => status('offline'));
  client.on('error', () => status('error'));
  client.on('message', (_t, buf) => {
    try { onMsg(JSON.parse(buf.toString())); } catch (e) { console.warn(e); }
  });
  return {
    client,
    send(obj, opts) {
      client.publish(isHost ? base + '/s' : base + '/u', JSON.stringify(obj), Object.assign({ qos: 1 }, opts || {}));
    },
    clear() { client.publish(base + '/s', '', { retain: true, qos: 1 }); },
  };
};

window.makeCode = function (n) {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < n; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
};
