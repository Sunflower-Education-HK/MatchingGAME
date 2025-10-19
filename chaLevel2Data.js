const level2Sentences = [
  {
    fullSentence: "哥哥每天早上吃早餐",
    parts: [
      { text: "哥哥", isAnswer: false },
      { text: "每天", isAnswer: false },
      { text: "早上", isAnswer: false },
      { text: "吃早餐", isAnswer: true }
    ],
    possibleAnswers: ["哥哥", "每天", "早上", "吃早餐"],
    options: {
      "哥哥": ["哥哥", "媽媽", "弟弟", "爸爸"],
      "每天": ["每天", "每週", "每年", "每月"],
      "早上": ["早上", "中午", "晚上", "下午"],
      "吃早餐": ["吃早餐", "洗手", "看書", "玩玩具"]
    }
  },
  {
    fullSentence: "小狗最喜歡追蝴蝶",
    parts: [
      { text: "小狗", isAnswer: false },
      { text: "最", isAnswer: false },
      { text: "喜歡", isAnswer: false },
      { text: "追蝴蝶", isAnswer: true }
    ],
    possibleAnswers: ["小狗", "最", "喜歡", "追蝴蝶"],
    options: {
      "小狗": ["小狗", "小貓", "小鳥", "小魚"],
      "最": ["最", "很", "非常", "不太"],
      "喜歡": ["喜歡", "討厭", "害怕", "想要"],
      "追蝴蝶": ["追蝴蝶", "看電視", "吃蘋果", "寫字"]
    }
  },
  {
    fullSentence: "媽媽正在廚房煮飯",
    parts: [
      { text: "媽媽", isAnswer: false },
      { text: "正在", isAnswer: false },
      { text: "廚房", isAnswer: false },
      { text: "煮飯", isAnswer: true }
    ],
    possibleAnswers: ["媽媽", "正在", "廚房", "煮飯"],
    options: {
      "媽媽": ["媽媽", "爸爸", "哥哥", "姐姐"],
      "正在": ["正在", "已經", "將要", "剛剛"],
      "廚房": ["廚房", "客廳", "房間", "花園"],
      "煮飯": ["煮飯", "唱歌", "跳舞", "畫畫"]
    }
  }
];