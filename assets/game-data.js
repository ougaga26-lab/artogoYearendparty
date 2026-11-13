window.APP_VER = '20261113q'; // 每次更新程式都改這個版本號，手機會自動要求重新整理

/* =========================================================
   藝觸即發 — 遊戲內容設定檔
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
  title: '藝觸即發',
  subtitle: 'ARTOGO 2026 尾牙禮物爭奪戰',
  tagline: '一年份的怨氣，今晚一次發洩',
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
  // 示範獎品（測試用）：正式活動前請在大廳「🎁 禮物設定」改成真的禮物
  defaultGifts: [
    { tier: 1, name: 'iPhone 17 Pro', public: true, icon: '📱' },
    { tier: 2, name: 'Dyson 吹風機', public: false, icon: '💨' },
    { tier: 2, name: 'Switch 2 遊戲機', public: false, icon: '🎮' },
    { tier: 3, name: 'AirPods 4', public: false, icon: '🎧' },
    { tier: 3, name: '星巴克隨行卡 3,000 元', public: false, icon: '☕' },
    { tier: 4, name: '全聯禮券 500 元', public: false, icon: '🛒' },
    { tier: 4, name: '辦公室按摩枕', public: false, icon: '💆' },
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
      { title: '電鑽聲入鏡', text: '配音老師正錄到最感人的那句，隔壁裝潢「滋——」一聲電鑽入鏡。老師的眼神已經死了，整段重錄', effect: { coins: -30 }, bad: true, rescue: 'M6', rescueText: '電鑽一停就馬上按錄音' },
      { title: 'AI 語音失控', text: 'AI 把「莫內《睡蓮》」唸成「沒內睡臉」，還用很專業的語氣解說了三分鐘', effect: { coins: -40 }, bad: true, rescue: 'M3', variant: 'typo', rescueText: '把唸錯的字抓出來' },
      { title: '機器人腔', text: 'AI 導覽突然變成捷運廣播腔：「下一幅作品，梵谷。Next painting…」觀眾以為自己要下車了', effect: { coins: -30 }, bad: true, rescue: 'M7', rescueText: '把語速節奏調回來' },
      { title: '一次 OK', text: '配音老師一次 OK，提早兩小時收工！剩下的錄音室時間，你偷偷錄了一首歌', effect: { drawChance: true } },
      { title: '8 國語言', text: 'AI 一口氣生出 8 國語言的導覽，客戶連問三次：「這真的是今天做的嗎？」', effect: { coins: 60 } },
      { title: '聲音好好聽', text: '觀眾留言：「導覽的聲音好好聽，可以出 Podcast 嗎？」配音老師截圖傳到了家族群組', effect: { coins: 40 } },
    ] },
    web: { name: '官網・伺服器', icon: '💻', color: 'sky', events: [
      { title: '官網有 Bug', text: '官網「關於我們」一點下去，跳出 404 和一隻在跳舞的貓。工程師說他也不知道貓是哪來的', effect: { coins: -40 }, bad: true, rescue: 'M3', rescueText: '把 Bug 找出來' },
      { title: '表單壞了', text: '聯絡表單壞了三天都沒人發現，直到客戶打電話來問：「你們是不是不想接案？」', effect: { coins: -40 }, bad: true, rescue: 'M3', rescueText: '把 Bug 找出來' },
      { title: '伺服器當機', text: '開幕當天伺服器當機，全公司圍著一台電腦，緊張得像在看世足 PK 賽', effect: { coins: -50 }, bad: true, rescue: 'M10', rescueText: '估算湧進來的人數，開對主機數量就免罰' },
      { title: '帳單爆表', text: '雲端主機帳單寄來，後面多了一個零。原來有台測試機開了半年忘記關', effect: { coins: -50 }, bad: true, rescue: 'M2', rescueText: '算清楚帳單就免罰' },
      { title: '官網改版', text: '官網改版上線，詢問信多到信箱快爆了。業務第一次覺得收信是一種幸福', effect: { coins: 50 } },
      { title: '流量爆表', text: '線上展覽上了新聞，流量直接衝上天。伺服器居然撐住了！工程師感動到想哭', effect: { coins: 60 } },
      { title: 'SEO 第一頁', text: 'Google「虛擬展間」，我們竟然在第一頁！快截圖，搞不好明天就掉了', effect: { drawChance: true } },
    ] },
    biz: { name: '事業開發', icon: '🤝', color: 'mint', events: [
      { title: '有人來投資', text: '投資人看完 Demo 只問了一個問題：「請問匯款帳號是多少？」', effect: { coins: 100 } },
      { title: '得標 200 萬', text: '200 萬的標案得標了！評審說簡報「很有誠意」，只有你知道那是前一晚通宵改到第 12 版', effect: { coins: 100 } },
      { title: '客戶介紹客戶', text: '老客戶逢人就說「找藝途就對了」，新客戶自己上門！選一位幫忙顧好客戶的同事，兩人各 +30', effect: { together: 30 } },
      { title: '美術館採用', text: '大型美術館決定採用我們的虛擬展間，館長還說要請大家喝咖啡（到現在還沒請）', effect: { coins: 70 } },
      { title: '比稿！', text: '比稿撞到熟面孔！選一位同事跟你搶同一個案子，用色卡對色一決勝負', effect: { pk: { game: 'M1', stake: 50 } } },
      { title: '現場 Demo', text: '老闆臨時說：「你現在 Demo 給董事會看一下」。台下的董事們，請拿出手機投票！', effect: { vote: [{ label: '超喜歡', coins: 60 }, { label: '普通', coins: 10 }] } },
      { title: '預算砍半', text: '談了三個月的案子，客戶說：「預算可以砍一半嗎？規格不變喔。」', effect: { coins: -40 }, bad: true, rescue: 'M2', rescueText: '重算報價就免罰' },
      { title: '簡報打不開', text: '提案前五分鐘，簡報檔跳出「檔案已損毀」。客戶已經坐在對面微笑了', effect: { coins: -30 }, bad: true, rescue: 'M9', rescueText: '憑記憶把簡報排回來' },
    ] },
    proj: { name: '專案執行', icon: '📋', color: 'lilac', events: [
      { title: '第 8 版', text: '客戶：「我們覺得第一版最好，但可以把第七版的顏色加進去嗎？」恭喜，這是第 8 版', effect: { coins: -40 }, bad: true, rescue: 'M1', rescueText: '設計重做，對準顏色就免罰' },
      { title: '明天就要上線', text: '週五晚上六點，客戶來電：「那個……明天早上可以上線嗎？」', effect: { coins: -40 }, bad: true, rescue: 'M7', rescueText: '抓準 Deadline' },
      { title: '展間破圖', text: '驗收當天，虛擬展間的一面牆突然消失，觀眾直接走進了外太空', effect: { coins: -40 }, bad: true, rescue: 'M3', rescueText: '把 Bug 找出來' },
      { title: '規格書打架', text: '規格書第 3 版說要藍色，第 5 版說要「不是那種藍的藍」', effect: { coins: -30 }, bad: true, rescue: 'S1', rescueText: '在兩版需求之間保持平衡：單腳站撐 30 秒就免罰' },
      { title: '一次驗收通過', text: '專案一次驗收通過，客戶只說了兩個字：「完美。」你決定把這兩個字裱起來', effect: { item: 'lock', alt: { coins: 40 } } },
      { title: '感謝信', text: '客戶寫了一封超長的感謝信給老闆，老闆轉寄全公司，主旨只有三個驚嘆號', effect: { coins: 50 } },
    ] },
    expo: { name: '展覽', icon: '🖼️', color: 'yellow', events: [
      { title: '門票賣爆', text: '開幕首日門票賣爆，人龍排到隔壁超商，店員還以為在發免費咖啡', effect: { coins: 60 } },
      { title: '印刷色差', text: '開幕前一晚，主視覺印出來從「夕陽橘」變成「過期鮭魚色」', effect: { coins: -40 }, bad: true, rescue: 'M1', rescueText: '校色成功就免罰' },
      { title: '作品擺錯', text: '佈展完才發現，每件作品都跟說明牌對不上，而藝術家正朝這邊走過來', effect: { coins: -30 }, bad: true, rescue: 'M9', rescueText: '記住位置擺回去' },
      { title: '人數破紀錄', text: '參觀人數破紀錄！老闆問你今天大概來了多少人，猜得準有獎金', effect: { solo: { game: 'M10', pass: { coins: 80 }, fail: { coins: 20 } } } },
      { title: '開幕酒會', text: '開幕酒會你脫口而出「今天我請！」說完才發現大家都點最貴的那杯。付給每位玩家 5 幣', effect: { payAll: 5 } },
      { title: '藝術家點名感謝', text: '藝術家致詞時說：「最想感謝的是……你！」全場鼓掌，每位玩家付你 5 幣當紅包', effect: { collectAll: 5 } },
    ] },
    admin: { name: '行政', icon: '📮', color: 'red', events: [
      { title: '跑郵局', text: '老闆要寄 200 封邀請函，你在郵局待到連號碼牌的叫號聲都會唱了', effect: { coins: -40 }, bad: true, rescue: 'S1', rescueText: '排隊排到腳痠：單腳站撐 30 秒就免罰' },
      { title: '採購螢幕', text: '老闆說要買新螢幕：「要大、要好、要便宜。」你比價比到懷疑人生', effect: { coins: -50 }, bad: true, rescue: 'M4', rescueText: '把螢幕型號一字不差打進採購單就免罰' },
      { title: '公文漏蓋章', text: '補助公文送出去才發現漏蓋一個章，承辦人很溫柔地說：「麻煩再跑一趟喔～」', effect: { coins: -20 }, bad: true, rescue: 'M8', rescueText: '印章蓋正就免罰' },
      { title: '郵局阿姨', text: '郵局阿姨已經認得你了，一看到你就說「又是你喔～」順手幫你先處理', effect: { drawChance: true } },
      { title: '政府補助', text: '申請了半年的政府補助終於核准！你把核准公文看了五遍，確定不是詐騙', effect: { coins: 80 } },
    ] },
    dainy: { name: 'DAINY', icon: '🤖', color: 'sky', events: [
      { title: 'DAINY 洗版', text: '你 tag DAINY 問「明天幾點開會」，它在群組連發 12 則回覆，還附上歷年會議紀錄。都是你 tag 的！付每位玩家 10 幣', effect: { payAll: 10 } },
      { title: '只聽管理員的', text: '你請 DAINY 幫忙，它已讀不回；管理員一下指令，它秒回「好的！」只好付 30 幣拜託管理員', effect: { payPick: 30 }, bad: true, rescue: 'M4', rescueText: '指令一字不差打對，它就聽話了' },
      { title: '提案很鳥', text: '請 DAINY 寫提案，它交出一份非常有自信、但完全看不懂在說什麼的東西。被老闆退件', effect: { coins: -40 }, bad: true, rescue: 'M8', rescueText: '自己重新排版' },
      { title: 'DAINY 神救援', text: '老闆急著找三年前的合約，DAINY 一秒撈出來，還附上重點摘要。今天的 DAINY 是神', effect: { coins: 60 } },
    ] },
    fin: { name: '財務・報帳', icon: '🧾', color: 'mint', events: [
      { title: '發票遺失', text: '報帳時發票不見了，最後在外套口袋找到……一張洗過的發票', effect: { coins: -30 }, bad: true, rescue: 'M9', rescueText: '回想發票塞在哪：記住位置就免罰' },
      { title: '年中紅利', text: '會計說：「這個月有加發紅利喔。」你以為聽錯，請她再說一次', effect: { coins: 50 } },
      { title: '報稅季', text: '報稅季到了，國稅局溫柔地提醒你：請繳身上 10% 的稅', effect: { taxPct: 10 }, bad: true, rescue: 'M2', rescueText: '自己算稅就免繳' },
      { title: '退稅', text: '會計發現你之前多繳了錢，退款入帳的簡訊比任何情書都動人', effect: { coins: 40 } },
    ] },
    social: { name: '社群行銷', icon: '📈', color: 'peach', events: [
      { title: '貼文爆紅', text: '小編隨手發的幕後花絮爆紅，留言區都在問：「請問你們還有在徵人嗎？」', effect: { coins: 50 } },
      { title: '小編發錯圖', text: '展覽貼文配錯圖，發成同事的午餐便當照，還拿到三百個讚', effect: { coins: -30 }, bad: true, rescue: 'M8', rescueText: '重新排版' },
      { title: '網紅來打卡', text: '網紅來看展拍了限動，還標記一位同事。選一位被標記的同事，你們各 +20', effect: { together: 20 } },
      { title: '觸及掉光', text: '演算法又改了，貼文觸及只剩 12 人，其中 8 個是同事', effect: { coins: -40 }, bad: true, rescue: 'S2', rescueText: '全身搖手機衝觸及：60 秒搖滿 350 下就免罰' },
    ] },
    tea: { name: '茶水間', icon: '☕', color: 'lilac', events: [
      { title: '咖啡機罷工', text: '咖啡機罷工，只剩最後一杯！全場搶按：最快 3 人 +20，最慢 3 人 −10', effect: { rush: { label: '搶最後一杯咖啡！', top: 3, topCoins: 20, bottom: 3, bottomCoins: -10 } } },
      { title: '伴手禮', text: '同事出國回來帶伴手禮，只有一盒！全場搶按，最快的 3 人 +20', effect: { rush: { label: '搶伴手禮！', top: 3, topCoins: 20, bottom: 0, bottomCoins: 0 } } },
      { title: '最後一塊蛋糕', text: '冰箱裡最後一塊蛋糕沒寫名字。選一個人比腕力，贏的拿 30 幣（和蛋糕）', effect: { pk: { game: 'R1', stake: 30 } } },
      { title: '最後一瓶飲料', text: '冰箱最底層卡著最後一瓶飲料。選一個人比柔軟度，誰摸得比較低誰拿', effect: { pk: { game: 'R2', stake: 30 } } },
    ] },
    boss: { name: '老闆辦公室', icon: '👔', color: 'navy', events: [
      { title: '進辦公室', text: '老闆說：「你等一下來我辦公室一下。」擲骰決定命運：4～6 加薪（點數 × 15），1～3 被念（扣點數 × 10）', effect: { boss: true } },
      { title: '算明年預算', text: '老闆在走廊攔住你：「明年預算你心算一下大概多少？」答得好有獎金', effect: { solo: { game: 'M2', pass: { coins: 60 }, fail: { coins: -20 } } } },
      { title: '老闆送金牌', text: '老闆心情很好，路過你座位說「最近辛苦了」，還送你一面免死金牌', effect: { item: 'shield' } },
      { title: '禮拜五前要好', text: '老闆週四下午路過：「那個……禮拜五前要好喔。」今天就是禮拜四', effect: { coins: -40 }, bad: true, rescue: 'M7', rescueText: '抓準 Deadline' },
    ] },
    party: { name: '尾牙', icon: '🧧', color: 'yellow', events: [
      { title: '今天你是老闆', text: '今天換你當老闆發獎金！付每位玩家 10 幣，或上台唱一首歌抵掉', effect: { orSing: { payAll: 10 } } },
      { title: '尾牙表演', text: '你被抽中尾牙表演！上台唱一段，唱完 +20，董事會聽得開心還會打賞', effect: { perform: { coins: 20 } } },
      { title: '老闆加碼', text: '老闆喝了兩杯後宣布：「今天排名最後 3 名，每人加 50！」', effect: { bottomBonus: { count: 3, coins: 50 } } },
      { title: '摸到大獎', text: '尾牙摸彩摸到大獎！你的手在發抖，主持人叫了三次你才上台', effect: { coins: 80 } },
    ] },
  },

  /* ---------- 棋盤 28 格（從右下角起點順時針） ---------- */
  tiles: [
    { type: 'start' },
    { type: 'event', cat: 'voice' }, { type: 'event', cat: 'biz' }, { type: 'gift' },
    { type: 'pk' }, { type: 'fate' }, { type: 'event', cat: 'expo' },
    { type: 'event', cat: 'admin', corner: true },
    { type: 'event', cat: 'dainy' }, { type: 'pk' }, { type: 'event', cat: 'fin' },
    { type: 'chance' }, { type: 'peek' }, { type: 'event', cat: 'tea' },
    { type: 'event', cat: 'boss', corner: true },
    { type: 'pk' }, { type: 'gift' }, { type: 'event', cat: 'web' },
    { type: 'fate' }, { type: 'event', cat: 'expo' }, { type: 'pk' },
    { type: 'event', cat: 'party', corner: true },
    { type: 'event', cat: 'social' }, { type: 'event', cat: 'proj' }, { type: 'pk' },
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
    { title: '免死金牌', text: '遇到壞事時亮出來，直接抵銷一次。老闆親簽，效力等同請假條', effect: { item: 'shield' } },
    { title: '禮物防盜鎖', text: '下次有人要搶你的禮物，自動擋下來。比公司門禁還可靠', effect: { item: 'lock', alt: { coins: 40 } } },
    { title: '偷看券', text: '隨時可以在手機上偷看一份禮物。看完記得裝沒事', effect: { item: 'peek' } },
    { title: '代打卡', text: 'PK 時可以請任何人（同事或外賓都行）替你上場。比腕力打不過？找個壯的！', effect: { item: 'sub' } },
    { title: '神秘交換券', text: '免費跟任一人交換禮物。對方會不會恨你，不在這張卡的保固範圍', effect: { swapPick: true, alt: { coins: 50 } } },
    { title: '年終獎金提前發', text: '會計手滑，年終獎金提前發了！+80（先別問會不會收回）', effect: { coins: 80 } },
    { title: '主管請客', text: '主管請下午茶，你負責點餐，順手幫自己點了大杯。+30', effect: { coins: 30 } },
    { title: '專案獎金', text: '拖了好久的專案終於結案，獎金入帳！+50', effect: { coins: 50 } },
    { title: '手氣正旺', text: '今天手氣好到不行，整副牌只有這一張：再擲一次！', effect: { extraRoll: true } },
    { title: '抓 Bug 英雄', text: '上線前一小時抓到致命 Bug，救了全公司。每位玩家付你 5 幣當謝禮', effect: { collectAll: 5 } },
    { title: '同事神救援', text: '你忘了交東西，同事默默幫你補上。選一位救命恩人，兩人各 +20', effect: { together: 20 } },
    { title: '商業間諜', text: '你在茶水間「不小心」聽到同事的獎金數字。選一位玩家，偷走他 30 幣', effect: { steal: 30 } },
    { title: '羅賓漢', text: '劫富濟貧！從首富手上拿 40 幣給最窮的人，你抽 10 幣手續費', effect: { robin: 40 } },
  ],

  /* ---------- 命運卡（由外賓從 3 張蓋著的牌挑一張） ---------- */
  fate: [
    { title: '尾牙主揪', text: '你自告奮勇當尾牙主揪，結果手搖飲要自己先墊。付給每位玩家 5 幣', effect: { payAll: 5 } },
    { title: '電腦藍屏', text: '做了一整天的檔案還沒存，電腦突然藍屏，畫面只剩一張哭臉。−40', effect: { coins: -40 }, bad: true, rescue: 'M5', rescueText: '狂按 Ctrl+S 搶救' },
    { title: '客戶尾款入帳', text: '拖了半年的尾款終於入帳！會計開心到請你喝飲料。+60', effect: { coins: 60 } },
    { title: '硬碟掛了', text: '外接硬碟發出「喀、喀」兩聲，然後就再也沒醒來。−50', effect: { coins: -50 }, bad: true, rescue: 'S2', rescueText: '把硬碟搖醒：60 秒搖滿 350 下就免罰' },
    { title: '颱風假', text: '宣布放颱風假！你在家耍廢一整天，還領到 20 補助', effect: { coins: 20 } },
    { title: '開會開到天荒地老', text: '「十分鐘就好」的會開了三小時，午餐沒了只好叫外送。−30', effect: { coins: -30 }, bad: true, rescue: 'M6', rescueText: '趁空檔溜出會議室' },
    { title: '找到神隊友', text: '你在茶水間結交了一位神隊友，他說 PK 時可以幫你上場。得到代打卡', effect: { item: 'sub' } },
    { title: '老闆心情好', text: '老闆今天心情特別好，看到你就說「不錯喔！」順手塞了個紅包。+40', effect: { coins: 40 } },
    { title: 'Deadline 提前', text: '客戶：「上線日可以提前一週嗎？我們老闆想先看。」−40', effect: { coins: -40 }, bad: true, rescue: 'M5', rescueText: '狂點加速趕工' },
    { title: '被派去寄包裹', text: '被派去寄包裹，郵資自己先墊，收據就這樣消失在抽屜裡了。−20', effect: { coins: -20 } },
    { title: '本月最佳員工', text: '你當選本月最佳員工！每位玩家付你 10 幣當賀禮', effect: { collectAll: 10 } },
    { title: '董事會指定交換', text: '命運交給董事會！翻牌的外賓決定你要跟誰交換禮物', effect: { fateSwap: true, alt: { coins: -30 } } },
  ],

  /* ---------- 小遊戲 ---------- */
  // better: high = 數字越大越好；low = 越小越好。pass = 單人救援過關門檻
  games: {
    M1: { name: '色卡對色', icon: '🎨', desc: '用三條滑桿調出跟目標一樣的顏色', better: 'high', pass: 85, unit: '% 相似' },
    M2: { name: '速算', icon: '🧮', desc: '20 秒內答對越多題越好，答錯直接跳下一題', better: 'high', pass: 5, unit: ' 題' },
    M3: { name: '找 Bug', icon: '🐞', desc: '找出唯一不一樣的那個字，3 關越來越大（5×5、8×8、10×10）', better: 'low', pass: 20, unit: ' 秒' },
    M4: { name: '打字', icon: '⌨️', desc: '照著畫面一字不差打出來', better: 'low', pass: 25, unit: ' 秒' },
    M5: { name: '狂點', icon: '👆', desc: '10 秒內瘋狂點按鈕', better: 'high', pass: 70, unit: ' 下' },
    M6: { name: '反應力', icon: '⚡', desc: 'DAINY 出現的瞬間按下去，老闆出現不能按，共 3 次', better: 'low', pass: 0.42, unit: ' 秒' },
    M7: { name: '精準計時', icon: '⏱️', desc: '憑感覺在剛好 5.00 秒時按停', better: 'low', pass: 1, unit: ' 秒誤差' },
    M8: { name: '對齊', icon: '📐', desc: '5 秒內把方塊拖到框框的正中間', better: 'low', pass: 3, unit: '% 誤差' },
    M9: { name: '記憶', icon: '🧠', desc: '記住作品的位置再點出來，一關比一關多，點錯就結束', better: 'high', pass: 3, unit: ' 關' },
    M10: { name: '人流估算', icon: '👥', desc: '畫面出現一群人 4 秒，從 4 個數字選出正確人數', better: 'low', pass: 15, unit: '% 誤差' },
    S1: { name: '金雞獨立', icon: '🦩', desc: '手機握在胸前單腳站，手機晃太大就出局，最多 60 秒', better: 'high', pass: 30, unit: ' 秒', body: true },
    S2: { name: '搖手機耐力賽', icon: '📱', desc: '60 秒用力搖手機，搖越多下越好', better: 'high', pass: 350, unit: ' 下', body: true },
    R1: { name: '比腕力', icon: '💪', desc: '兩人現場比腕力', real: true, body: true },
    R2: { name: '柔軟度', icon: '🤸', desc: '站姿體前彎，誰的手摸得比較低', real: true, body: true },
  },
  // PK 格抽遊戲：數字是權重，動身體的（真人、手機感應）比較常出現
  pkGames: { M1: 1, M2: 1, M3: 1, M6: 1, M7: 1, M9: 1, R1: 3, R2: 3, S1: 3, S2: 3 },
  pkStakes: [50, 100],   // PK 可以選的賭金
  pkSwapCost: 20,        // 被挑戰的人換項目要付的錢（付給發起的人）
  // 打字句子：大約 16～18 個字，夾一點英文和數字，切換輸入法會更手忙腳亂
  typingPhrases: ['DAINY請幫我整理上週三的會議紀錄', '客戶說第一版最好但要加第七版的顏色', '老闆說這個禮拜五之前一定要上線喔', '請在週五下班前把12張發票交給會計', '開幕前一晚記得再校一次主視覺的顏色', '官網的404頁面為什麼有一隻跳舞的貓'],
  typoPairs: [['己', '已'], ['未', '末'], ['天', '夭'], ['王', '玉'], ['日', '曰'], ['人', '入'], ['大', '太'], ['土', '士']],
  bugPairs: [['0', 'O'], ['1', 'l'], ['5', 'S'], ['8', 'B']],

  items: {
    shield: { name: '免死金牌', icon: '🛡️' },
    lock: { name: '防盜鎖', icon: '🔒' },
    peek: { name: '偷看券', icon: '👀' },
    sub: { name: '代打卡', icon: '🦸' },
  },
  roles: {
    staff: { name: '正式員工', tag: '' },
    probation: { name: '試用期', tag: '紅包' },
    guest: { name: '外賓', tag: '董事' },
  },

  avatars: ['🐯', '🐼', '🐸', '🐙', '🦊', '🐧', '🐨', '🐵', '🐷', '🐰', '🐻', '🦁', '🐮', '🐶', '🐱', '🐔', '🦄', '🐳', '🦖', '🐝'],
  colors: ['#e5483a', '#3f6f93', '#f7a531', '#5aa469', '#9b6bd3', '#e46aa2', '#2fa7a0', '#c7772f', '#5468d4', '#8a9a2b', '#d1495b', '#00798c', '#edae49', '#6c4f8b', '#66a182', '#b5651d', '#4a90d9', '#c06c84', '#355c7d', '#99b898'],
};
