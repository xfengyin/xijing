// 本兮歌曲数据
export const songs = [
  {
    id: 1,
    title: "小三你好贱",
    album: "本兮单曲",
    year: "2011",
    duration: "3:32",
    themeColor: "#ff6b9d",
    emotion: "rebellious",
    description: "本兮早期代表作，以直接的歌词表达对感情的态度",
    story: "这首歌写于2011年，是本兮在网络走红时期的代表作之一。歌词直白犀利，表达了对感情中第三者的不屑与批判，展现了她叛逆、不羁的音乐风格。",
    mood: "叛逆"
  },
  {
    id: 2,
    title: "你在看孤独的风景",
    album: "本兮单曲",
    year: "2011",
    duration: "4:15",
    themeColor: "#4ecdc4",
    emotion: "melancholy",
    description: "忧伤抒情的代表作，唱出孤独与思念",
    story: "这首抒情慢歌展现了本兮温柔细腻的一面。歌词描绘了一个人看着窗外的风景，思念着远方的人，成为许多粉丝心中的经典情歌。",
    mood: "忧伤"
  },
  {
    id: 3,
    title: "无语",
    album: "本兮单曲",
    year: "2011",
    duration: "3:28",
    themeColor: "#ff69b4",
    emotion: "rebellious",
    description: "面对感情背叛时的无奈与坚强",
    story: "《无语》讲述了一段感情结束后的成长。从最初的无语、心痛，到最后学会放手、做回自己，是本兮用音乐记录的青春成长日记。",
    mood: "叛逆"
  },
  {
    id: 4,
    title: "未成年",
    album: "《未成年》",
    year: "2012",
    duration: "3:45",
    themeColor: "#ffe66d",
    emotion: "rebellious",
    description: "为所有未成年发声，追求自由与梦想",
    story: "这首歌是本兮为所有未成年人创作的。她用自己的经历告诉大家，未成年不代表幼稚，我们也有自己的想法和追求，青春应该由自己做主。",
    mood: "青春"
  },
  {
    id: 5,
    title: "怎么办我爱你",
    album: "本兮单曲",
    year: "2010",
    duration: "3:15",
    themeColor: "#ffb6c1",
    emotion: "romantic",
    description: "初恋的甜蜜与忐忑，本兮第一首原创作品",
    story: "这是本兮在网络发布的第一首原创歌曲，当时她才16岁。歌曲记录了初恋的美好与忐忑，清新的嗓音和真实的情感迅速引起关注，开启了她的音乐之路。",
    mood: "温柔"
  },
  {
    id: 6,
    title: "奇怪，我不懂得爱",
    album: "本兮单曲",
    year: "2011",
    duration: "3:56",
    themeColor: "#dda0dd",
    emotion: "melancholy",
    description: "从不懂爱到懂得爱的成长历程",
    story: "这首歌记录了本兮对爱情的理解变化。从最初的"奇怪，我不懂得爱"，到最后"不再奇怪，我懂得了爱"，是一首关于成长的音乐日记。",
    mood: "迷茫"
  },
  {
    id: 7,
    title: "海海海",
    album: "本兮单曲",
    year: "2015",
    duration: "4:02",
    themeColor: "#4169e1",
    emotion: "nostalgic",
    description: "用大海寄托思念与梦想",
    story: "《海海海》是本兮后期的作品，展现了她更加成熟的音乐风格。歌词用大海作为意象，寄托了对过去的怀念和对未来的期望。",
    mood: "思念"
  },
  {
    id: 8,
    title: "我梦见我梦见我",
    album: "本兮单曲",
    year: "2016",
    duration: "3:48",
    themeColor: "#9370db",
    emotion: "melancholy",
    description: "梦境与现实的交织，勇敢做自己的宣言",
    story: "这是本兮最后发布的歌曲之一。歌词探讨了梦境与现实、理想与自我，表达了即使面对现实的不易，也要勇敢追梦的决心。",
    mood: "思念"
  }
]

// 歌曲情感映射
export const emotionMap = {
  joyful: { name: "欢快", color: "#FFD700", emoji: "😊" },
  melancholy: { name: "忧伤", color: "#4A90E2", emoji: "😢" },
  rebellious: { name: "叛逆", color: "#FF1493", emoji: "😈" },
  nostalgic: { name: "怀旧", color: "#DEB887", emoji: "📷" },
  romantic: { name: "浪漫", color: "#FFB6C1", emoji: "💕" },
  neutral: { name: "平静", color: "#87CEEB", emoji: "😌" }
}

// 获取歌曲情感信息
export function getSongEmotion(song) {
  return emotionMap[song.emotion] || emotionMap.neutral
}

// 获取歌曲主题配置
export function getMoodConfig(mood) {
  const configs = {
    叛逆: { bg: "#1a1a2e", particle: "#ff6b9d", light: 0xff6b9d },
    忧伤: { bg: "#16213e", particle: "#4ecdc4", light: 0x4ecdc4 },
    青春: { bg: "#1a1a2e", particle: "#ffe66d", light: 0xffe66d },
    温柔: { bg: "#0f3460", particle: "#a8e6cf", light: 0xa8e6cf },
    思念: { bg: "#16213e", particle: "#c7ceea", light: 0xc7ceea },
    活力: { bg: "#1a1a2e", particle: "#ff8b94", light: 0xff8b94 },
    迷茫: { bg: "#0f3460", particle: "#ffd3b6", light: 0xffd3b6 },
    俏皮: { bg: "#1a1a2e", particle: "#ffaaa5", light: 0xffaaa5 }
  }
  return configs[mood] || configs.青春
}