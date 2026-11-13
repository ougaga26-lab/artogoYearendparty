window.APP_VER = '20261113e'; // 每次更新程式都改這個版本號，手機會自動要求重新整理

/* =========================================================
   藝途發財夢 v2 — 遊戲內容設定檔
   想改格子、事件、卡片、小遊戲難度，只要改這個檔案。

   效果 (effect) 寫法：
     {coins: 50}                 自己加／扣錢
     {payAll: 5}                 你付給每位玩家
     {collectAll: 5}             每位玩家付給你
     {payPick: 30}               選一位玩家，付他錢
     {together: 20}              選一位玩家，你們兩人都加錢
     {steal: 30}                 選一位玩家偷錢
     {robin: 40}                 首富給最窮的人，你抽 10
     {taxPct: 10}                繳身上 % 數的稅
     {item: 'shield'}            道具：shield 免死金牌／lock 防盜鎖／peek 偷看券
     {drawChance: true}          抽一張機會卡
     {extraRoll: true}           再擲一次
     {swapPick: true}            免費和任一人交換禮物
     {fateSwap: true}            翻牌的外賓決定你跟誰交換禮物
     {rush: {...}}               全場手機搶按
     {bottomBonus: {count, coins}}  目前最後幾名加錢
     {solo: {game, pass, fail}}  小遊戲，過關／沒過各有效果
     {vote: [{label, coins}, ...]}  外賓董事會投票
     {boss: true}                老闆辦公室擲骰
     {orSing: {payAll: 10}}      付錢，或改唱一首歌
     {perform: {coins: 20}}      上台表演，做完加錢＋外賓打賞
     {pk: {game, stake}}         選一人 PK，贏的人從輸的人拿錢
     alt: {...}                  紅包玩家（試用期）改用這個效果
   bad: true → 壞事，玩家可以用免死金牌或挑戰 rescue 指定的小遊戲解除
   ========================================================= */

window.GAME = {
  title: '藝途發財夢',
  subtitle: 'ARTOGO 2026 尾牙大富翁',
  currency: '藝途幣',
  startCoins: 200,
  salary: 50,
  maxItems: 3,
  defaultRounds: 5,

  /* ---------- 禮物 ---------- */
  tiers: {
    1: { name: '頭獎', price: 150 },
    2: { name: '二獎', price: 100 },
    3: { name: '三獎', price: 60 },
    4: { name: '普獎', price: 30 },
  },
  lockAfter: 2,        // 禮物被搶幾次後鎖定
  brokerFee: 30,       // 紅包玩家當禮物仲介的抽成
  pkCoins: 50,         // PK 有紅包玩家參與時，贏的人拿的錢
  privilegeTop: 3,     // 結算前首富特權的名額
  defaultGifts: [
    { tier: 1, name: '頭獎禮物', public: true },
    { tier: 2, name: '二獎禮物 A', public: false },
    { tier: 2, name: '二獎禮物 B', public: false },
    { tier: 3, name: '三獎禮物 A', public: false },
    { tier: 3, name: '三獎禮物 B', public: false },
    { tier: 4, name: '普獎禮物 A', public: false },
    { tier: 4, name: '普獎禮物 B', public: false },
  ],
  // 試用期紅包：依最終名次（全部玩家一起排）
  redPacket: [
    { upTo: 3, amount: 1000 },
    { upTo: 6, amount: 800 },
    { upTo: 99, amount: 500 },
  ],

  /* ---------- 事件類別（棋盤上只顯示類別） ---------- */
  categories: {
    voice: { name: '語音導覽', icon: '🎧', color: 'peach', events: [
      { title: '電鑽聲入鏡', text: '真人錄音錄到一半，隔壁裝潢電鑽聲入鏡，整段重錄', effect: { coins: -30 }, bad: true, rescue: 'M7', rescueText: '抓準空檔重錄' },
      { title: 'AI 語音失控', text: 'AI 語音把作品名唸成奇怪的諧音，還一本正經地解說', effect: { coins: -40 }, bad: true, rescue: 'M3', variant: 'typo', rescueText: '把唸錯的字抓出來' },
      { title: '機器人腔', text: 'AI 語音突然變成機器人腔，導覽聽起來像在報捷運站', effect: { coins: -30 }, bad: true, rescue: 'M7', rescueText: '把語速節奏調回來' },
      { title: '一次 OK', text: '配音員一次 OK，提早收工', effect: { drawChance: true } },
      { title: '8 國語言', text: 'AI 一次生成 8 國語言的導覽，客戶驚呆', effect: { coins: 60 } },
      { title: '聲音好好聽', text: '觀眾留言：「導覽的聲音好好聽」', effect: { coins: 40 } },
    ] },
    web: { name: '官網・伺服器', icon: '💻', color: 'sky', events: [
      { title: '官網有 Bug', text: '官網出現 Bug，緊急修復', effect: { coins: -40 }, bad: true, rescue: 'M3', rescueText: '把 Bug 找出來' },
      { title: '表單壞了', text: '聯絡表單壞了三天，漏接客戶', effect: { coins: -40 }, bad: true, rescue: 'M3', rescueText: '把 Bug 找出來' },
      { title: '伺服器當機', text: '伺服器當機，全員救火', effect: { coins: -50 }, bad: true, rescue: 'M6', rescueText: '救火要快' },
      { title: '帳單爆表', text: '雲端主機帳單爆表', effect: { coins: -50 }, bad: true, rescue: 'M2', rescueText: '算清楚帳單就免罰' },
      { title: '官網改版', text: '官網改版上線，詢問信暴增', effect: { coins: 50 } },
      { title: '流量爆表', text: '展覽上線，大量民眾湧入，流量爆表大成功', effect: { coins: 60 } },
      { title: 'SEO 第一頁', text: 'SEO 衝上搜尋第一頁', effect: { drawChance: true } },
    ] },
    biz: { name: '事業開發', icon: '🤝', color: 'mint', events: [
      { title: '有人來投資', text: '有人來投資了！', effect: { coins: 100 } },
      { title: '國外藝廊來詢問', text: '國外藝廊看到虛擬展間，主動來詢問', effect: { coins: 80 } },
      { title: '客戶介紹客戶', text: '老客戶介紹新客戶，謝謝牽線的同事', effect: { together: 30 } },
      { title: '美術館採用', text: '虛擬展間被大型美術館採用', effect: { coins: 70 } },
      { title: '比稿！', text: '選一位玩家跟你搶同一個案子，用色卡對色決勝負', effect: { pk: { game: 'M1', stake: 50 } } },
      { title: '現場 Demo', text: '現場 Demo 虛擬展間給外賓看，董事會投票', effect: { vote: [{ label: '超喜歡', coins: 60 }, { label: '普通', coins: 10 }] } },
      { title: '預算砍半', text: '談好的案子，預算突然被砍一半', effect: { coins: -40 }, bad: true, rescue: 'M2', rescueText: '重算報價就免罰' },
      { title: '簡報打不開', text: '提案前一刻簡報檔打不開', effect: { coins: -30 }, bad: true, rescue: 'M9', rescueText: '憑記憶把簡報排回來' },
    ] },
    proj: { name: '專案執行', icon: '📋', color: 'lilac', events: [
      { title: '第 8 版', text: '客戶：「可以再改一版嗎？」第 8 版', effect: { coins: -40 }, bad: true, rescue: 'M1', rescueText: '設計重做，對準顏色就免罰' },
      { title: '明天就要上線', text: '客戶臨時要求明天就要上線', effect: { coins: -40 }, bad: true, rescue: 'M7', rescueText: '抓準 Deadline' },
      { title: '展間破圖', text: '虛擬展間模型破圖，牆壁不見了', effect: { coins: -40 }, bad: true, rescue: 'M3', rescueText: '把 Bug 找出來' },
      { title: '規格書打架', text: '規格書第 3 版跟第 5 版互相打架', effect: { coins: -30 }, bad: true, rescue: 'M8', rescueText: '把需求對齊' },
      { title: '一次驗收通過', text: '專案一次驗收通過，客戶超滿意', effect: { item: 'lock', alt: { coins: 40 } } },
      { title: '感謝信', text: '客戶寫感謝信給老闆', effect: { coins: 50 } },
    ] },
    expo: { name: '展覽', icon: '🖼️', color: 'yellow', events: [
      { title: '門票賣爆', text: '開幕大成功，門票賣爆', effect: { coins: 60 } },
      { title: '印刷色差', text: '開幕前一晚發現印刷品色差', effect: { coins: -40 }, bad: true, rescue: 'M1', rescueText: '校色成功就免罰' },
      { title: '作品擺錯', text: '佈展時作品位置全部擺錯', effect: { coins: -30 }, bad: true, rescue: 'M9', rescueText: '記住位置擺回去' },
      { title: '人數破紀錄', text: '參觀人數破紀錄！猜猜今天來了多少人', effect: { solo: { game: 'M10', pass: { coins: 80 }, fail: { coins: 20 } } } },
      { title: '開幕酒會', text: '開幕酒會，你負責請大家喝飲料', effect: { payAll: 5 } },
      { title: '藝術家點名感謝', text: '藝術家在開幕致詞點名感謝你', effect: { collectAll: 5 } },
    ] },
    admin: { name: '行政', icon: '📮', color: 'red', events: [
      { title: '跑郵局', text: '老闆說要寄 200 封信，一趟一趟跑郵局', effect: { coins: -40 }, bad: true, rescue: 'M4', rescueText: '把地址打對' },
      { title: '採購螢幕', text: '老闆說要採購新螢幕，你負責比價下單', effect: { coins: -50 }, bad: true, rescue: 'M2', rescueText: '比價算對就免罰' },
      { title: '公文漏蓋章', text: '公文用印漏蓋一份，要重送', effect: { coins: -20 }, bad: true, rescue: 'M8', rescueText: '印章蓋正就免罰' },
      { title: '郵局阿姨', text: '郵局阿姨認得你，直接幫你插隊', effect: { drawChance: true } },
      { title: '政府補助', text: '申請到政府補助', effect: { coins: 80 } },
    ] },
    dainy: { name: 'DAINY', icon: '🤖', color: 'sky', events: [
      { title: 'DAINY 洗版', text: '你 tag DAINY 問一個小問題，它在討論串連發 12 則回覆，全公司被洗版。都是你 tag 的！', effect: { payAll: 10 } },
      { title: '只聽管理員的', text: '你請 DAINY 做事它都沒反應，只好拜託管理員幫你下指令', effect: { payPick: 30 }, bad: true, rescue: 'M4', rescueText: '指令一字不差打對，它就聽話了' },
      { title: '提案很鳥', text: '請 DAINY 生一份提案，結果很鳥，被老闆退件', effect: { coins: -40 }, bad: true, rescue: 'M8', rescueText: '自己重新排版' },
      { title: 'DAINY 神救援', text: 'DAINY 一秒撈出三年前的合約', effect: { coins: 60 } },
    ] },
    fin: { name: '財務・報帳', icon: '🧾', color: 'mint', events: [
      { title: '發票遺失', text: '發票遺失，報帳卡關', effect: { coins: -30 }, bad: true, rescue: 'M2', rescueText: '算對就免罰' },
      { title: '年中紅利', text: '年中加碼紅利', effect: { coins: 50 } },
      { title: '報稅季', text: '報稅季到了，繳身上 10% 的稅', effect: { taxPct: 10 }, bad: true, rescue: 'M2', rescueText: '自己算稅就免繳' },
      { title: '退稅', text: '會計發現你之前多繳了，退錢給你', effect: { coins: 40 } },
    ] },
    social: { name: '社群行銷', icon: '📈', color: 'peach', events: [
      { title: '貼文爆紅', text: '貼文爆紅，業主排隊上門', effect: { coins: 50 } },
      { title: '小編發錯圖', text: '小編發錯圖，排版整個跑掉', effect: { coins: -30 }, bad: true, rescue: 'M8', rescueText: '重新排版' },
      { title: '網紅來打卡', text: '網紅來打卡，順便標記一位同事', effect: { together: 20 } },
      { title: '觸及掉光', text: '演算法改版，觸及掉光', effect: { coins: -40 }, bad: true, rescue: 'M5', rescueText: '狂按讚衝觸及' },
    ] },
    tea: { name: '茶水間', icon: '☕', color: 'lilac', events: [
      { title: '咖啡機罷工', text: '咖啡機罷工！全場搶最後一杯咖啡', effect: { rush: { label: '搶最後一杯咖啡！', top: 3, topCoins: 20, bottom: 3, bottomCoins: -10 } } },
      { title: '伴手禮', text: '有人帶伴手禮回來！全場搶', effect: { rush: { label: '搶伴手禮！', top: 3, topCoins: 20, bottom: 0, bottomCoins: 0 } } },
      { title: '最後一塊蛋糕', text: '最後一塊蛋糕爭奪戰！選一個人比腕力', effect: { pk: { game: 'R1', stake: 30 } } },
      { title: '最後一瓶飲料', text: '冰箱最底層剩最後一瓶飲料！選一個人比柔軟度，誰摸得低誰拿', effect: { pk: { game: 'R2', stake: 30 } } },
    ] },
    boss: { name: '老闆辦公室', icon: '👔', color: 'navy', events: [
      { title: '進辦公室', text: '老闆叫你進辦公室…擲骰決定：4～6 加薪（點數 × 15），1～3 被念（扣點數 × 10）', effect: { boss: true } },
      { title: '算明年預算', text: '老闆要你當場算明年預算', effect: { solo: { game: 'M2', pass: { coins: 60 }, fail: { coins: -20 } } } },
      { title: '老闆送金牌', text: '老闆心情好，送你一面免死金牌', effect: { item: 'shield' } },
      { title: '禮拜五前要好', text: '老闆說：「這個禮拜五前要好喔」', effect: { coins: -40 }, bad: true, rescue: 'M7', rescueText: '抓準 Deadline' },
    ] },
    party: { name: '尾牙', icon: '🧧', color: 'yellow', events: [
      { title: '今天你是老闆', text: '要發獎金給大家：付每位玩家 10 幣，或改唱一首歌代替', effect: { orSing: { payAll: 10 } } },
      { title: '尾牙表演', text: '抽中尾牙表演，上台唱一段！做完 +20，外賓打賞另外加', effect: { perform: { coins: 20 } } },
      { title: '老闆加碼', text: '老闆加碼！目前排行最後 3 名各 +50', effect: { bottomBonus: { count: 3, coins: 50 } } },
      { title: '摸到大獎', text: '摸彩摸到大獎', effect: { coins: 80 } },
    ] },
  },

  /* ---------- 棋盤 28 格（從右下角起點順時針） ---------- */
  tiles: [
    { type: 'start' },
    { type: 'event', cat: 'voice' }, { type: 'event', cat: 'biz' }, { type: 'gift' },
    { type: 'event', cat: 'web' }, { type: 'fate' }, { type: 'event', cat: 'expo' },
    { type: 'event', cat: 'admin', corner: true },
    { type: 'event', cat: 'dainy' }, { type: 'pk' }, { type: 'event', cat: 'fin' },
    { type: 'chance' }, { type: 'peek' }, { type: 'event', cat: 'tea' },
    { type: 'event', cat: 'boss', corner: true },
    { type: 'event', cat: 'proj' }, { type: 'gift' }, { type: 'event', cat: 'web' },
    { type: 'fate' }, { type: 'event', cat: 'expo' }, { type: 'pk' },
    { type: 'event', cat: 'party', corner: true },
    { type: 'event', cat: 'social' }, { type: 'event', cat: 'proj' }, { type: 'peek' },
    { type: 'event', cat: 'biz' }, { type: 'chance' }, { type: 'gift' },
  ],
  special: {
    start: { name: '起點・發薪日', icon: '💰', color: 'sun' },
    gift: { name: '搶禮物', icon: '🎁', color: 'red' },
    pk: { name: 'PK', icon: '⚔️', color: 'navy' },
    peek: { name: '偷看', icon: '👀', color: 'sun' },
    chance: { name: '機會', icon: '❓', color: 'yellow' },
    fate: { name: '命運', icon: '🔮', color: 'lilac' },
  },

  /* ---------- 機會卡 ---------- */
  chance: [
    { title: '免死金牌', text: '遇到壞事時直接抵銷一次', effect: { item: 'shield' } },
    { title: '禮物防盜鎖', text: '下一次有人要搶你的禮物時自動擋下來', effect: { item: 'lock', alt: { coins: 40 } } },
    { title: '偷看券', text: '隨時可以在手機上偷看任一份禮物', effect: { item: 'peek' } },
    { title: '神秘交換券', text: '免費和任一人交換禮物', effect: { swapPick: true, alt: { coins: 50 } } },
    { title: '年終獎金提前發', text: '+80', effect: { coins: 80 } },
    { title: '主管請客', text: '主管請下午茶，你最會點 +30', effect: { coins: 30 } },
    { title: '專案獎金', text: '+50', effect: { coins: 50 } },
    { title: '手氣正旺', text: '整副牌只有這張：再擲一次！', effect: { extraRoll: true } },
    { title: '抓 Bug 英雄', text: '上線前抓到大 Bug，每位玩家付你 5 幣', effect: { collectAll: 5 } },
    { title: '同事神救援', text: '選一位幫你 cover 的同事，你們兩人各 +20', effect: { together: 20 } },
    { title: '商業間諜', text: '選一位玩家，偷走他 30 幣', effect: { steal: 30 } },
    { title: '羅賓漢', text: '從首富手上拿 40 幣給最窮的人，你抽 10 幣', effect: { robin: 40 } },
  ],

  /* ---------- 命運卡（由外賓從 3 張蓋著的牌挑一張） ---------- */
  fate: [
    { title: '尾牙主揪', text: '請所有人喝飲料：付給每位玩家 5 幣', effect: { payAll: 5 } },
    { title: '電腦藍屏', text: '作品沒存檔… -40', effect: { coins: -40 }, bad: true, rescue: 'M5', rescueText: '狂按 Ctrl+S 搶救' },
    { title: '客戶尾款入帳', text: '+60', effect: { coins: 60 } },
    { title: '硬碟掛了', text: '檔案全部要重做 -50', effect: { coins: -50 }, bad: true, rescue: 'M9', rescueText: '憑記憶重建' },
    { title: '颱風假', text: '在家休息，順便領 20 補助', effect: { coins: 20 } },
    { title: '開會開到天荒地老', text: '錯過午餐，只好自己叫外送 -30', effect: { coins: -30 }, bad: true, rescue: 'M6', rescueText: '趁空檔溜出會議室' },
    { title: '中了發票', text: '+20', effect: { coins: 20 } },
    { title: '老闆心情好', text: '+40', effect: { coins: 40 } },
    { title: 'Deadline 提前', text: '-40', effect: { coins: -40 }, bad: true, rescue: 'M7', rescueText: '抓準 Deadline' },
    { title: '被派去寄包裹', text: '郵資自己先墊 -20', effect: { coins: -20 } },
    { title: '本月最佳員工', text: '每位玩家付你 10 幣', effect: { collectAll: 10 } },
    { title: '董事會指定交換', text: '翻牌的外賓決定你要跟誰交換禮物！', effect: { fateSwap: true, alt: { coins: -30 } } },
  ],

  /* ---------- 小遊戲 ---------- */
  // better: high = 數字越大越好；low = 越小越好。pass = 單人救援過關門檻
  games: {
    M1: { name: '色卡對色', icon: '🎨', desc: '用三條滑桿調出跟目標一樣的顏色', better: 'high', pass: 85, unit: '% 相似' },
    M2: { name: '速算', icon: '🧮', desc: '20 秒內答對越多題越好', better: 'high', pass: 5, unit: ' 題' },
    M3: { name: '找 Bug', icon: '🐞', desc: '在一整片字裡找出唯一不一樣的那個，共 3 關', better: 'low', pass: 15, unit: ' 秒' },
    M4: { name: '打字', icon: '⌨️', desc: '照著畫面一字不差打出來', better: 'low', pass: 25, unit: ' 秒' },
    M5: { name: '狂點', icon: '👆', desc: '10 秒內瘋狂點按鈕', better: 'high', pass: 60, unit: ' 下' },
    M6: { name: '反應力', icon: '⚡', desc: '畫面變綠的瞬間按下去，共 3 次', better: 'low', pass: 0.45, unit: ' 秒' },
    M7: { name: '精準計時', icon: '⏱️', desc: '憑感覺在剛好 5.00 秒時按停', better: 'low', pass: 0.3, unit: ' 秒誤差' },
    M8: { name: '對齊', icon: '📐', desc: '把方塊拖到框框的正中間', better: 'low', pass: 3, unit: '% 誤差' },
    M9: { name: '記憶', icon: '🧠', desc: '記住 4 件作品的位置，再擺回去', better: 'high', pass: 4, unit: ' 件' },
    M10: { name: '人流估算', icon: '👥', desc: '畫面閃過一群人，猜有幾個', better: 'low', pass: 15, unit: '% 誤差' },
    R1: { name: '比腕力', icon: '💪', desc: '兩人現場比腕力', real: true },
    R2: { name: '柔軟度', icon: '🤸', desc: '站姿體前彎，誰的手摸得比較低', real: true },
    R3: { name: '單腳站立', icon: '🦩', desc: '單腳站立，先放下腳的人輸', real: true },
    R4: { name: '不眨眼', icon: '👀', desc: '互瞪，先眨眼或先笑的人輸', real: true },
    R5: { name: '猜拳', icon: '✊', desc: '三戰兩勝', real: true },
  },
  pkGames: ['M1', 'M2', 'M3', 'M5', 'M6', 'M7', 'M8', 'M9', 'R1', 'R2', 'R3', 'R4', 'R5'],
  typingPhrases: ['台北市藝途路二百號', '尾牙快樂大家發大財', 'DAINY請整理會議記錄', '請在週五前回覆確認', '展覽開幕記得帶名牌'],
  typoPairs: [['己', '已'], ['未', '末'], ['天', '夭'], ['王', '玉'], ['日', '曰'], ['人', '入'], ['大', '太'], ['土', '士']],
  bugPairs: [['0', 'O'], ['1', 'l'], ['5', 'S'], ['8', 'B']],

  items: {
    shield: { name: '免死金牌', icon: '🛡️' },
    lock: { name: '防盜鎖', icon: '🔒' },
    peek: { name: '偷看券', icon: '👀' },
  },
  roles: {
    staff: { name: '正式員工', tag: '' },
    probation: { name: '試用期', tag: '紅包' },
    guest: { name: '外賓', tag: '董事' },
  },

  avatars: ['🐯', '🐼', '🐸', '🐙', '🦊', '🐧', '🐨', '🐵', '🐷', '🐰', '🐻', '🦁', '🐮', '🐶', '🐱', '🐔', '🦄', '🐳', '🦖', '🐝'],
  colors: ['#e5483a', '#3f6f93', '#f7a531', '#5aa469', '#9b6bd3', '#e46aa2', '#2fa7a0', '#c7772f', '#5468d4', '#8a9a2b', '#d1495b', '#00798c', '#edae49', '#6c4f8b', '#66a182', '#b5651d', '#4a90d9', '#c06c84', '#355c7d', '#99b898'],
};
