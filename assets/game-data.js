/* =========================================================
   藝途發財夢 — 遊戲內容設定檔
   想改格子、卡片、挑戰內容，只要改這個檔案就好。

   效果 (effect) 寫法：
     {coins: 50}         加/扣錢（負數為扣）
     {move: -3}          前進/後退幾步（會觸發落腳格）
     {goto: 0}           直接傳送到第幾格
     {skip: 1}           暫停幾回合
     {everyone: -10}     所有玩家加/扣錢
     {payAll: 5}         你付給每位玩家
     {collectAll: 5}     每位玩家付給你
     {steal: 30}         選一位玩家偷錢
     {gift: 20}          選一位玩家，你們兩人都加錢
     {robin: 40}         從首富拿錢給最窮的人（你抽 10 手續費）
     {taxPct: 10}        繳交身上 % 數的稅
     {item: 'shield'}    獲得道具：shield 免死金牌 / sing 點唱券 / double 雙骰卡
     {extraRoll: true}   再擲一次
     {challenge: {reward: 40, penalty: 10}}   真人挑戰（主持人判定）
     {duo: 40}           找一位外賓一起挑戰，成功兩人都加錢
     {boss: true}        老闆辦公室擲骰
     可以用陣列串起多個效果，例如 [{skip:1},{coins:-20}]
   bad: true 代表壞事 → 玩家可以用道具或「現場救援」解除
   ========================================================= */

window.GAME = {
  title: '藝途發財夢',
  subtitle: 'ARTOGO 2026 尾牙大富翁',
  currency: '藝途幣',
  startCoins: 200,
  salary: 50,          // 經過起點領的薪水
  maxItems: 3,
  defaultRounds: 5,

  // 24 格，從右下角「起點」開始，順時針走
  tiles: [
    { name: '起點・發薪日', icon: '💰', type: 'start', color: 'sun', desc: '停在這裡再加發 50 獎金！', effect: { coins: 50 } },
    { name: '錄音室', icon: '🎙️', type: 'event', color: 'peach', desc: '錄音室炸毀了！專案進度落後，退後 3 步', effect: { move: -3 }, bad: true },
    { name: '命運', icon: '🔮', type: 'fate', color: 'lilac' },
    { name: '官網', icon: '💻', type: 'event', color: 'sky', desc: '官網出現 Bug，緊急修復！下回合不能擲骰子', effect: { skip: 1 }, bad: true },
    { name: '投資人來訪', icon: '🤝', type: 'event', color: 'mint', desc: '有人來投資了！賺進 100 藝途幣', effect: { coins: 100 } },
    { name: '機會', icon: '❓', type: 'chance', color: 'yellow' },

    { name: '郵局', icon: '📮', type: 'event', color: 'red', corner: true, desc: '老闆說要寄 200 封信，請一趟一趟跑郵局：暫停 1 回合、郵資 -20', effect: [{ skip: 1 }, { coins: -20 }], bad: true },
    { name: '展覽開幕', icon: '🖼️', type: 'event', color: 'mint', desc: '展覽開幕大成功，門票賣到爆！+60', effect: { coins: 60 } },
    { name: '挑戰', icon: '🔥', type: 'challenge', color: 'red' },
    { name: '客戶改稿', icon: '✏️', type: 'event', color: 'peach', desc: '客戶：「可以再改一版嗎？」第 8 版了… -40', effect: { coins: -40 }, bad: true },
    { name: '命運', icon: '🔮', type: 'fate', color: 'lilac' },
    { name: '茶水間', icon: '☕', type: 'event', color: 'sky', desc: '咖啡機罷工！全公司士氣低落，所有人 -10', effect: { everyone: -10 } },

    { name: '點唱機', icon: '🎤', type: 'ktv', color: 'yellow', corner: true, desc: '高歌一曲！唱一段副歌，主持人判定通過 +60', effect: { challenge: { reward: 60, penalty: 0, text: '到點唱機前高歌一曲（至少唱完一段副歌）' } } },
    { name: '算圖農場', icon: '🖥️', type: 'event', color: 'peach', desc: '3D 算圖跑了一整晚，電費爆表 -30', effect: { coins: -30 }, bad: true },
    { name: '機會', icon: '❓', type: 'chance', color: 'yellow' },
    { name: '拿下標案', icon: '🏆', type: 'event', color: 'mint', desc: '拿下大型標案！全公司歡呼 +80', effect: { coins: 80 } },
    { name: '貴賓交流', icon: '🥂', type: 'duo', color: 'sky', desc: '找一位外賓一起完成雙人挑戰，成功兩人各 +40', effect: { duo: 40 } },
    { name: '伺服器當機', icon: '🧯', type: 'event', color: 'peach', desc: '伺服器當機，全員救火！退後 2 步', effect: { move: -2 }, bad: true },

    { name: '老闆辦公室', icon: '👔', type: 'boss', color: 'navy', corner: true, desc: '老闆叫你進辦公室…擲骰決定：4～6 加薪（點數 × 15），1～3 被念到暫停 1 回合', effect: { boss: true } },
    { name: '員工旅遊', icon: '🏝️', type: 'event', color: 'mint', desc: '員工旅遊出發！前進 3 步', effect: { move: 3 } },
    { name: '機會', icon: '❓', type: 'chance', color: 'yellow' },
    { name: '報帳', icon: '🧾', type: 'event', color: 'peach', desc: '發票遺失，報帳卡關 -30', effect: { coins: -30 }, bad: true },
    { name: '挑戰', icon: '🔥', type: 'challenge', color: 'red' },
    { name: '社群爆紅', icon: '📈', type: 'event', color: 'mint', desc: '貼文爆紅，業主排隊上門！+50', effect: { coins: 50 } },
  ],

  // 機會卡：大多是好事 + 可以留著的救援道具
  chance: [
    { title: '尾牙到了！', text: '老闆要發錢嘍：所有人 +20', effect: { everyone: 20 } },
    { title: '免死金牌', text: '收進口袋，遇到壞事時可以直接抵銷一次', effect: { item: 'shield' } },
    { title: '解救機會：點唱券', text: '高歌一曲，呼隆過去！遇到壞事時，到點唱機前唱一首歌就能解除', effect: { item: 'sing' } },
    { title: '雙骰卡', text: '下次擲骰時可以一次擲兩顆骰子', effect: { item: 'double' } },
    { title: '年終獎金提前發', text: '+80', effect: { coins: 80 } },
    { title: '主管請客', text: '主管請大家吃下午茶，你最會點餐 +30', effect: { coins: 30 } },
    { title: '專案提前結案', text: '前進 3 步', effect: { move: 3 } },
    { title: '傳送門', text: '直接傳送回起點領薪水', effect: { goto: 0 } },
    { title: '手氣正旺', text: '再擲一次骰子！', effect: { extraRoll: true } },
    { title: '業主追加預算', text: '+50', effect: { coins: 50 } },
    { title: '抓 Bug 英雄', text: '你抓到上線前的大 Bug，每位玩家付你 5 幣', effect: { collectAll: 5 } },
    { title: '同事神救援', text: '選一位同事，謝謝他幫你 cover，你們兩人各 +20', effect: { gift: 20 } },
    { title: '商業間諜', text: '選一位玩家，偷走他 30 幣', effect: { steal: 30 } },
    { title: '羅賓漢', text: '從首富手上拿 40 幣給最窮的人，你抽 10 幣手續費', effect: { robin: 40 } },
    { title: '免死金牌', text: '收進口袋，遇到壞事時可以直接抵銷一次', effect: { item: 'shield' } },
    { title: '解救機會：點唱券', text: '高歌一曲，呼隆過去！', effect: { item: 'sing' } },
  ],

  // 命運卡：好壞參半
  fate: [
    { title: '尾牙主揪', text: '你被抽中當主揪，請所有人喝飲料：付給每位玩家 5 幣', effect: { payAll: 5 } },
    { title: '電腦藍屏', text: '作品沒存檔… -40', effect: { coins: -40 }, bad: true },
    { title: '客戶尾款入帳', text: '+60', effect: { coins: 60 } },
    { title: '尾牙表演抽中你', text: '現場表演 30 秒才藝，主持人判定通過 +50', effect: { challenge: { reward: 50, penalty: 0, text: '現場表演 30 秒才藝（唱、跳、模仿都可以）' } } },
    { title: '硬碟掛了', text: '檔案全部重做，退後 3 步', effect: { move: -3 }, bad: true },
    { title: '颱風假', text: '在家休息一回合，順便領 20 補助', effect: [{ skip: 1 }, { coins: 20 }] },
    { title: '開會開到天荒地老', text: '被叫去開 3 小時的會，暫停 1 回合', effect: { skip: 1 }, bad: true },
    { title: '報稅季', text: '繳交身上 10% 的稅', effect: { taxPct: 10 }, bad: true },
    { title: '中了發票', text: '+20', effect: { coins: 20 } },
    { title: '老闆心情好', text: '加薪！+40', effect: { coins: 40 } },
    { title: 'Deadline 提前', text: '退後 2 步', effect: { move: -2 }, bad: true },
    { title: '被派去寄包裹', text: '直接前往郵局', effect: { goto: 6 } },
    { title: '本月最佳員工', text: '每位玩家付你 10 幣', effect: { collectAll: 10 } },
    { title: '停車被拖吊', text: '-30', effect: { coins: -30 }, bad: true },
    { title: '作品被大咖分享', text: '前進 4 步', effect: { move: 4 } },
    { title: 'Wi-Fi 斷線', text: '什麼都做不了，暫停 1 回合', effect: { skip: 1 }, bad: true },
  ],

  // 挑戰格的真人挑戰（成功 +reward，失敗 -penalty）
  challengeReward: 40,
  challengePenalty: 10,
  challenges: [
    '原地轉 5 圈，再直線走到主持人面前',
    '模仿老闆的一句口頭禪，要讓大家猜到',
    '30 秒內說出 8 位在場的人的名字',
    '用三個詞形容你今年的工作，要讓台下拍手',
    '跟一位外賓猜拳，三戰兩勝',
    '用 15 秒向外賓介紹我們公司在做什麼',
    '用一個動作表演「專案上線前一晚」，讓大家猜',
    '跟主持人互瞪 10 秒，不准笑',
    '一口氣說「藝途發財夢」十次，不能吃螺絲',
    '對在場一位同事說一句真心的感謝',
    '學一種動物叫聲，讓大家猜是什麼動物',
    '用台語說一句吉祥話',
  ],

  // 貴賓交流格的雙人挑戰
  duoChallenges: [
    '和外賓一起比出愛心自拍，展示給全場看',
    '和外賓背對背，同時比出 1～5 的數字，數字相同就成功（三次機會）',
    '和外賓一起合唱一句歌',
    '請外賓用三個詞形容你，你要猜對他想到的其中一個',
    '和外賓用手機比賽誰先找到一張貓咪照片',
  ],

  // 遇到壞事時的「現場救援」挑戰（失敗懲罰加倍！）
  rescues: [
    '在地上滾 5 圈（或伏地挺身 5 下）',
    '高歌一曲，呼隆過去：到點唱機前唱一段',
    '深蹲 10 下，邊蹲邊喊「藝途發財」',
    '對老闆說一句真心話',
    '跳一段 10 秒的舞',
    '用一個 Pose 讓全場拍照',
  ],

  items: {
    shield: { name: '免死金牌', icon: '🛡️' },
    sing: { name: '點唱券', icon: '🎤' },
    double: { name: '雙骰卡', icon: '🎲' },
  },

  avatars: ['🐯', '🐼', '🐸', '🐙', '🦊', '🐧', '🐨', '🐵', '🐷', '🐰', '🐻', '🦁', '🐮', '🐶', '🐱', '🐔', '🦄', '🐳', '🦖', '🐝'],
  colors: ['#e5483a', '#3f6f93', '#f7a531', '#5aa469', '#9b6bd3', '#e46aa2', '#2fa7a0', '#c7772f', '#5468d4', '#8a9a2b', '#d1495b', '#00798c', '#edae49', '#6c4f8b', '#66a182', '#b5651d', '#4a90d9', '#c06c84', '#355c7d', '#99b898'],
};
