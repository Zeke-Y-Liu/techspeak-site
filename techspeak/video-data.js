/* ============================================================
 * TechSpeak 视频练习素材（由 scripts/build-video-data.cjs 生成，勿手改）
 * 来源：scripts/video-imports/*.json（import-video.py 产出）
 * 版权归原视频作者所有，仅作英语学习用途，原视频地址见 sourceUrl。
 * ============================================================ */
const VIDEOS = [
  {
    "id": "hinton-godel-lecture-2026",
    "title": "维也纳哥德尔讲座 2026：AI 和我们相似吗？（节选）",
    "speaker": "杰弗里·辛顿 Geoffrey Hinton",
    "platform": "bilibili",
    "sourceUrl": "https://www.bilibili.com/video/BV1spHA66EJ9",
    "published": "2026-10-23",
    "type": "keynote",
    "level": 3,
    "tags": [
      "Geoffrey Hinton",
      "人工智能",
      "诺奖得主"
    ],
    "desc": "诺贝尔物理学奖得主、\"AI 教父\"杰弗里·辛顿在维也纳工业大学 2026 年度哥德尔讲座（Vienna Gödel Lecture）节选：以个人视角梳理 AI 发展史的两种范式，并直观展示大模型理解句子时的内部过程。",
    "focus": "跟读学术讲座语流：Hinton 英式口音的 \"a very brief and very biased history of AI\" 开场、logic-inspired 与 learning-inspired 两种范式的论证节奏，以及面向公众的类比讲解语气。",
    "wpmTarget": 210,
    "durationSec": 414.5,
    "audio": "media/hinton-godel-lecture-2026.mp3",
    "sentences": [
      {
        "text": "Okay, thank you for the introduction and thank you for inviting me.",
        "start": 0,
        "end": 3.38
      },
      {
        "text": "I'm going to give you a very brief and very biased history of AI.",
        "start": 4.03,
        "end": 7.53
      },
      {
        "text": "So since the beginning of AI, there were two paradigms.",
        "start": 8.84,
        "end": 11.72
      },
      {
        "text": "There was the logic-inspired approach, which thought the essence of intelligence was reasoning, and reasoning was going to be done by using symbolic rules to manipulate symbolic expressions.",
        "start": 12.06,
        "end": 23.72
      },
      {
        "text": "Just as it's done in logic, and that things like learning can wait until we understand how we do reasoning and how we represent knowledge.",
        "start": 23.72,
        "end": 31.84
      },
      {
        "text": "First, we have to figure out what is this symbolic language in which knowledge is represented, how do we do reasoning, and then we can worry about learning later.",
        "start": 32.1,
        "end": 38.78
      },
      {
        "text": "That was their approach, and they were dominant during the last century and the early part of this century.",
        "start": 39.36,
        "end": 44.76
      },
      {
        "text": "Then there was a biologically inspired approach where the idea was the essence of intelligence is actually learning the strengths of connections in a neural network.",
        "start": 45.83,
        "end": 54.37
      },
      {
        "text": "Reasoning can wait until later.",
        "start": 56.56,
        "end": 57.96
      },
      {
        "text": "First, we have to understand how learning works, and then we'll understand other things later.",
        "start": 57.96,
        "end": 62.1
      },
      {
        "text": "This was based on the idea that things like pigeons are quite smart in their own way.",
        "start": 63.02,
        "end": 69.16
      },
      {
        "text": "They're good at things like perception, they're good at things like flying through forests.",
        "start": 69.16,
        "end": 72.52
      },
      {
        "text": "And they don't do reasoning, or as far as we know, they don't do much reasoning, and they probably don't use logic.",
        "start": 74.98,
        "end": 80.02
      },
      {
        "text": "So really from a biological perspective, reasoning comes very late, and it's sort of silly to base your model of intelligence on that.",
        "start": 81.14,
        "end": 87.84
      },
      {
        "text": "Now, one thing I should say before I go on is there were two people from the 1950s who actually believed in the neural network approach.",
        "start": 91.83,
        "end": 100.69
      },
      {
        "text": "They were both very good logicians.",
        "start": 101.19,
        "end": 102.93
      },
      {
        "text": "It was John von Neumann and Alan Turing.",
        "start": 102.93,
        "end": 105.63
      },
      {
        "text": "So you couldn't really accuse them of not understanding logic like me.",
        "start": 105.99,
        "end": 109.51
      },
      {
        "text": "They unfortunately both died young, and I think if they had survived, the whole history of AI might have been very different.",
        "start": 111.3,
        "end": 117.12
      },
      {
        "text": "Turing was sort of studying how you could learn neural networks using reinforcement learning.",
        "start": 117.82,
        "end": 122.84
      },
      {
        "text": "So I'll start by talking about the meaning of a word.",
        "start": 129.4,
        "end": 135.04
      },
      {
        "text": "So within the symbolic AI paradigm, the idea was that the meaning of a word comes from how it interacts with other words in propositions or in sentences.",
        "start": 135.6,
        "end": 145.14
      },
      {
        "text": "So the meaning isn't a sort of thing you could put your hands on.",
        "start": 145.58,
        "end": 148.62
      },
      {
        "text": "It's implicit in how it co-occurs with other words.",
        "start": 148.62,
        "end": 152.5
      },
      {
        "text": "And probably to capture meaning, you'd need something like a relational graph.",
        "start": 152.9,
        "end": 156.32
      },
      {
        "text": "So that was a symbolic view.",
        "start": 158.04,
        "end": 159.42
      },
      {
        "text": "There was a view in psychology in the 1930s, which was very different, which was that the meaning of a word is just a big set of semantic and maybe syntactic features.",
        "start": 159.86,
        "end": 169.14
      },
      {
        "text": "So you have a large set of features. You activate a subset of them to capture the meaning of a word.",
        "start": 169.58,
        "end": 174.94
      },
      {
        "text": "So for the word cat, you'd activate features that say it's a predator, it's a pet, it's aloof, it's got whiskers, it's about the size of a breadbox, things like that.",
        "start": 174.94,
        "end": 186.49
      },
      {
        "text": "To represent a dog, you'd activate a fairly similar bunch of features, but obviously different in some respects.",
        "start": 186.77,
        "end": 192.35
      },
      {
        "text": "That theory was very good at capturing similarities of meaning.",
        "start": 193.9,
        "end": 197.12
      },
      {
        "text": "So cat and dog would have fairly similar feature vectors.",
        "start": 197.54,
        "end": 200.04
      },
      {
        "text": "It was also quite good at capturing analogies.",
        "start": 200.62,
        "end": 203.06
      },
      {
        "text": "So for example, for most men in our culture, not necessarily for women, it turns out.",
        "start": 203.06,
        "end": 210.72
      },
      {
        "text": "The feature vector that you use for cat is more similar to the feature vector you use for woman than the feature vector you use for man.",
        "start": 211.72,
        "end": 219.62
      },
      {
        "text": "And vice versa, the feature vector for dog is more similar to the feature vector for man than it is for woman.",
        "start": 219.9,
        "end": 225.2
      },
      {
        "text": "Now, being a man, I thought that was obvious.",
        "start": 225.62,
        "end": 227.68
      },
      {
        "text": "That's obvious to everybody. Turns out it's not.",
        "start": 227.68,
        "end": 229.58
      },
      {
        "text": "Quite a few women don't see that as obvious at all.",
        "start": 230.14,
        "end": 232.4
      },
      {
        "text": "That was a revelation to me.",
        "start": 233.99,
        "end": 235.63
      },
      {
        "text": "But that makes these feature vectors very good at doing analogies.",
        "start": 235.89,
        "end": 238.99
      },
      {
        "text": "Back in 1985, it occurred to me that these two different theories of meaning, one that is implicit in how it co-occurs occur with other words and the other that is just a big bunch of activations of features.",
        "start": 244.13,
        "end": 256.55
      },
      {
        "text": "They're not necessarily incompatible.",
        "start": 257.17,
        "end": 259.65
      },
      {
        "text": "They may be just two different sides of the same coin and with the back propagation learning algorithm, which I'm not going to explain, you could actually convert between these two representations.",
        "start": 259.91,
        "end": 270.89
      },
      {
        "text": "So what you would do is you train up a neural net on strings of words and you train the neural net to convert each word into a set of features.",
        "start": 273.58,
        "end": 285.33
      },
      {
        "text": "And then to make those features interact and for those interactions to predict the features of the next word.",
        "start": 285.89,
        "end": 292.85
      },
      {
        "text": "And once you know the features of the next word, you can make guesses about what the next word might be.",
        "start": 292.85,
        "end": 296.77
      },
      {
        "text": "So you can train a neural net and as it's learning, it learns what all these features should be.",
        "start": 297.75,
        "end": 303.15
      },
      {
        "text": "It had always been a problem for psychologists to explain where all these features came from.",
        "start": 303.43,
        "end": 307.29
      },
      {
        "text": "But with back propagation, you can take a string of words, you can try and predict the next word.",
        "start": 308.42,
        "end": 312.58
      },
      {
        "text": "And I took very simple sets of words, just three word strings and predicting the third word, and showed that actually back propagation could do this.",
        "start": 312.58,
        "end": 323.4
      },
      {
        "text": "It could convert words into features.",
        "start": 323.4,
        "end": 325.1
      },
      {
        "text": "So it could also convert features into words in the sense that you could generate new strings of words by just progressively predicting the next word.",
        "start": 327.93,
        "end": 338.28
      },
      {
        "text": "You start with one or two words, you predict the next word, okay, you accept that, then you predict the word after that.",
        "start": 338.52,
        "end": 344.18
      },
      {
        "text": "So you can get back from these features to strings of words again.",
        "start": 344.18,
        "end": 347.8
      },
      {
        "text": "So with these neural nets, you can convert both ways.",
        "start": 348.55,
        "end": 351.17
      },
      {
        "text": "You convert strings of words into feature vectors for words and you can convert feature vectors for words back into strings of words.",
        "start": 351.17,
        "end": 357.68
      },
      {
        "text": "And that meant that the relational knowledge you have doesn't reside in a relational graph, as symbolic people thought.",
        "start": 358.46,
        "end": 366.64
      },
      {
        "text": "It resides in the way all these features interact.",
        "start": 367.08,
        "end": 370.16
      },
      {
        "text": "You don't have static stored propositions.",
        "start": 370.66,
        "end": 372.82
      },
      {
        "text": "There are no propositions in your head when you want one, when you generate one.",
        "start": 372.82,
        "end": 376.04
      },
      {
        "text": "What you've got in your head is knowledge about how to convert words into features and knowledge about how two features should interact.",
        "start": 376.36,
        "end": 382.18
      },
      {
        "text": "So over the next 30 years, that was in 1985, about 10 years later, Yoshua Bengio, computers were faster.",
        "start": 385.68,
        "end": 392.68
      },
      {
        "text": "And Yoshua Bengio in Montreal showed that instead of just taking a toy example like I'd taken, you could take real natural language and predict the next word.",
        "start": 392.68,
        "end": 402.76
      },
      {
        "text": "And you could predict it about as well as the best existing models.",
        "start": 402.76,
        "end": 406.24
      },
      {
        "text": "The best existing models used huge tables of phrases and counted how often different phrases occurred.",
        "start": 406.64,
        "end": 412.52
      }
    ]
  },
  {
    "id": "jensen-gtc-berlin-2026",
    "title": "GTC 柏林 2026 主题演讲（开场节选）",
    "speaker": "黄仁勋 Jensen Huang",
    "platform": "bilibili",
    "sourceUrl": "https://www.bilibili.com/video/BV1Von26VErZ/",
    "published": "2026-10-21",
    "type": "keynote",
    "level": 3,
    "tags": [
      "NVIDIA",
      "GTC",
      "主题演讲",
      "AI"
    ],
    "desc": "NVIDIA CEO 黄仁勋在 GTC 柏林 2026 大会上的主题演讲开场节选，讲述加速计算与生成式 AI 的产业变革。",
    "focus": "跟读 CEO 级演讲的开场节奏：重音、停顿与关键术语（accelerated computing / generative AI）的发音。",
    "wpmTarget": 135,
    "durationSec": 420,
    "audio": "media/jensen-gtc-berlin-2026.mp3",
    "sentences": [
      {
        "text": "Portia, Nestle, and HSBC have in common.",
        "start": 0.02,
        "end": 4.82
      },
      {
        "text": "Well, they're all European companies, and they're all working with NVIDIA on AI.",
        "start": 7.25,
        "end": 12.83
      },
      {
        "text": "Everybody here is all activated on the AI ecosystem and working towards the AI economy.",
        "start": 14.52,
        "end": 24.49
      },
      {
        "text": "We've been working here in Europe now for 33 years.",
        "start": 25.05,
        "end": 28.31
      },
      {
        "text": "You probably don't realize that NV1, NVIDIA's first chip, NV2 and NV3, which became Reva 128, the chip that saved our company really and launched our company, were all built in Europe.",
        "start": 28.48,
        "end": 45.44
      },
      {
        "text": "Our first partner was SGS Thompson.",
        "start": 46.45,
        "end": 48.61
      },
      {
        "text": "We manufactured a chip in Coral, France, assembled it in Malta, and shipped it around the world.",
        "start": 49.11,
        "end": 55.21
      },
      {
        "text": "Our first largest customer, the largest customer of GeForce Days in the beginning, was a company called MediaMark.",
        "start": 56.15,
        "end": 66.29
      },
      {
        "text": "Do you know them?",
        "start": 66.55,
        "end": 67.37
      },
      {
        "text": "MediaMark had a spectacular idea about building PCs, as you remember, and they were our largest customer.",
        "start": 71.82,
        "end": 79.52
      },
      {
        "text": "It was ELSA, a German company that brought NVidia into the workstation industry in the year 2000.",
        "start": 80.04,
        "end": 86.26
      },
      {
        "text": "Now, NVidia is in every single workstation, all over Europe, designing cars.",
        "start": 86.92,
        "end": 92.97
      },
      {
        "text": "Everything from styling, design, engineering, simulation, all the way through to even inside the car, which a European company brought us into, Audi, in the year 2005.",
        "start": 93.45,
        "end": 106.75
      },
      {
        "text": "Then in year 2020, we started working on autonomous vehicles with Mercedes.",
        "start": 107.95,
        "end": 113.11
      },
      {
        "text": "As you could see, NVidia's life journey, the entire 33 years, I spent a lot of time in Germany.",
        "start": 113.85,
        "end": 120.93
      },
      {
        "text": "So I'm delighted to be back.",
        "start": 122.01,
        "end": 123.53
      },
      {
        "text": "Thank you.",
        "start": 123.65,
        "end": 124.17
      },
      {
        "text": "I'm delighted to do GTC here.",
        "start": 128.5,
        "end": 130.92
      },
      {
        "text": "This year, this last year, we started the new journey to building a new industry here in Europe, the beginnings of the AI economy.",
        "start": 131.7,
        "end": 141.38
      },
      {
        "text": "In the last year alone, we've invested nearly $10 billion in Europe, across startups, big partnerships, small partnerships, all over Europe.",
        "start": 141.98,
        "end": 153.54
      },
      {
        "text": "This last week alone, as I journeyed from France and UK to Sweden and now here in Berlin, we announced the investments of 14 startup companies.",
        "start": 153.98,
        "end": 166.48
      },
      {
        "text": "Overall, since the beginning, we now have 12,000 plus partnerships across Europe.",
        "start": 167.04,
        "end": 174.59
      },
      {
        "text": "And we're all working towards one goal now.",
        "start": 174.91,
        "end": 177.63
      },
      {
        "text": "After decades, after decades of advancement in the computer industry, we are now at the beginnings of a new industrial revolution.",
        "start": 179.19,
        "end": 189.29
      },
      {
        "text": "This image was generated by a computer.",
        "start": 189.93,
        "end": 192.35
      },
      {
        "text": "It was prompted by me.",
        "start": 192.61,
        "end": 193.79
      },
      {
        "text": "Nice, simple prompt about AI powering a new industrial revolution generated this.",
        "start": 194.63,
        "end": 201.33
      },
      {
        "text": "I gave it a few partners that I wanted to highlight, companies that we're working with, and this is an extraordinary thing.",
        "start": 201.69,
        "end": 208.27
      },
      {
        "text": "In the mind of the AI, this is what it means to build a new industry, generation of tokens, the production of intelligence, which integrates into every single industry powering a new industrial revolution.",
        "start": 208.29,
        "end": 225.48
      },
      {
        "text": "A new industrial revolution happens when the new technology affects how we build something and what we can build.",
        "start": 225.78,
        "end": 238.63
      },
      {
        "text": "How we build something and what we can build.",
        "start": 239.57,
        "end": 242.27
      },
      {
        "text": "I think in every single way, artificial intelligence will affect everything we build and in fact enable us to build new things.",
        "start": 242.77,
        "end": 250.77
      },
      {
        "text": "In this way, because everyone will use it, every company will be powered by it because it's digital intelligence, the foundation of everything.",
        "start": 251.23,
        "end": 261.21
      },
      {
        "text": "Every single person will use it, every company will be powered by it, every industry will be transformed, and new ones will be created.",
        "start": 261.88,
        "end": 269.48
      },
      {
        "text": "In this way, like the electricity, it is a new industrial revolution and we're at the very beginnings of that.",
        "start": 270.28,
        "end": 278.22
      },
      {
        "text": "The question is, what is AI?",
        "start": 279.74,
        "end": 282.71
      },
      {
        "text": "And this is a big deal.",
        "start": 283.79,
        "end": 285.11
      },
      {
        "text": "If you wanna be part of creating this future, understanding what is AI is vitally important.",
        "start": 286.11,
        "end": 293.13
      },
      {
        "text": "And this is really a simple framework.",
        "start": 293.74,
        "end": 296.26
      },
      {
        "text": "We were early to observe that in fact, AI is a manufacturing industry.",
        "start": 296.94,
        "end": 301.42
      },
      {
        "text": "AI is not just software technology.",
        "start": 302.02,
        "end": 304.86
      },
      {
        "text": "It is software technology, but not just.",
        "start": 304.94,
        "end": 306.98
      },
      {
        "text": "AI, of course, runs on a computer.",
        "start": 307.62,
        "end": 310.54
      },
      {
        "text": "But the way that that computer operates is fundamentally different.",
        "start": 310.94,
        "end": 314.32
      },
      {
        "text": "Rather than a tool that's used by us, it is now part of a machinery and infrastructure factories that are producing intelligence that are integrated into every single industry and application.",
        "start": 314.72,
        "end": 330.44
      },
      {
        "text": "A simple model is to think of AI as a five layer cake.",
        "start": 331.39,
        "end": 335.23
      },
      {
        "text": "Energy powers advanced computers that are part of an AI factory that generates tokens, digital intelligence, from the models that run on it that are integrated into every application.",
        "start": 335.79,
        "end": 350.45
      },
      {
        "text": "A five layer cake.",
        "start": 350.77,
        "end": 352.45
      },
      {
        "text": "To be part of this AI economy, you don't wanna just be consuming the AI, you want to be producing the AI.",
        "start": 352.91,
        "end": 361.47
      },
      {
        "text": "We could do all of that here in Europe.",
        "start": 362.21,
        "end": 364.27
      },
      {
        "text": "And in fact, we've already started.",
        "start": 364.73,
        "end": 366.33
      },
      {
        "text": "Europe is building its AI economy and its five layer cake represented here.",
        "start": 366.92,
        "end": 373.51
      },
      {
        "text": "We've got great partnerships and when you look across this five layer cake, you can recognize that in fact, it is a new industry because there's growth at every single layer.",
        "start": 373.89,
        "end": 384.51
      },
      {
        "text": "We're creating jobs, creating growth at extraordinary rate.",
        "start": 384.91,
        "end": 389.03
      },
      {
        "text": "Companies here in Europe, Schneider, Siemens Electric, Siemens Energy, doing incredibly well around the world.",
        "start": 389.49,
        "end": 398.09
      },
      {
        "text": "We're the computing layer.",
        "start": 398.67,
        "end": 399.91
      },
      {
        "text": "We integrate into AI factories that are now flourishing all over Europe.",
        "start": 400.35,
        "end": 405.15
      },
      {
        "text": "Startup companies like Nebius doing incredibly well.",
        "start": 405.78,
        "end": 409.04
      },
      {
        "text": "A new company called Firebird, which is setting up a new cloud in the Central Asia region and even Kassava in Africa.",
        "start": 409.11,
        "end": 419.44
      }
    ]
  },
  {
    "id": "kaiming-neurips-2025",
    "title": "NeurIPS 2025 Test of Time 颁奖演讲：目标检测简史（节选）",
    "speaker": "何恺明 Kaiming He",
    "platform": "bilibili",
    "sourceUrl": "https://www.bilibili.com/video/BV1XL2VBkEdo",
    "published": "2025-12-03",
    "type": "talk",
    "level": 2,
    "tags": [
      "Kaiming He",
      "计算机视觉",
      "目标检测"
    ],
    "desc": "\"Faster R-CNN\" 获 NeurIPS 2025 时间考验奖（Test of Time Award），唯一到场的合著者何恺明代四位作者登台，以《目标检测简史》为题回望技术演进：从 1996 年他读过的第一篇计算机视觉论文（用神经网络做人脸检测），到 SIFT、HOG、DPM 手工特征时代的巅峰，直至深度学习复兴前夜。",
    "focus": "跟读学者开场与学术叙事语流：Kaiming He 清晰沉稳的口语（语速适中易跟读），\"Welcome to the talk, everyone\" 开场与自我介绍句式，\"test of time\"、\"object detection\"、\"bounding box\"、\"handcrafted\" 等计算机视觉高频术语，以及 \"Surprisingly…\" 排比叙事节奏。",
    "wpmTarget": 170,
    "durationSec": 418,
    "audio": "media/kaiming-neurips-2025.mp3",
    "sentences": [
      {
        "text": "Welcome to the talk, everyone.",
        "start": 0.26,
        "end": 1.92
      },
      {
        "text": "My name is Kaiming He, and I'm doing this presentation on behalf of my dear friends and co-authors.",
        "start": 2.72,
        "end": 9.54
      },
      {
        "text": "Shaoqing Ren, Ross Girshick, and Jian Sun.",
        "start": 10.24,
        "end": 14.04
      },
      {
        "text": "I'm doing this presentation just partially because I'm the only person who can make it here.",
        "start": 15.72,
        "end": 21.14
      },
      {
        "text": "Okay, so this is the title of today's presentation, A Brief History of Visual Object Detection.",
        "start": 23.38,
        "end": 28.3
      },
      {
        "text": "So why I decided to take this title?",
        "start": 29.09,
        "end": 33.03
      },
      {
        "text": "Because I feel it is difficult to talk about a work that is 10 years ago.",
        "start": 35,
        "end": 38.42
      },
      {
        "text": "I need to set up a context correctly. And then when I started to think about the context, I need to talk about the context of the context and so forth, so and so forth.",
        "start": 38.56,
        "end": 49.03
      },
      {
        "text": "And then I decided to talk about the history of object detection, not just the paper in itself.",
        "start": 49.13,
        "end": 55.12
      },
      {
        "text": "Let's see how it goes.",
        "start": 56.08,
        "end": 57.04
      },
      {
        "text": "So first of all, what is object detection?",
        "start": 57.04,
        "end": 60.24
      },
      {
        "text": "Or what is object detection in computer vision?",
        "start": 60.3,
        "end": 61.72
      },
      {
        "text": "So conceptually, it's a very simple task for human beings.",
        "start": 62.79,
        "end": 67.07
      },
      {
        "text": "But it has been very challenging in computer vision for many decades.",
        "start": 68.3,
        "end": 73.06
      },
      {
        "text": "So the task is about recognizing the objects and localizing them simultaneously.",
        "start": 74.1,
        "end": 79.2
      },
      {
        "text": "So usually, their localization is represented by a bounding box.",
        "start": 80.06,
        "end": 84
      },
      {
        "text": "And the recognition is represented by some confidence of a class category.",
        "start": 84.42,
        "end": 89.08
      },
      {
        "text": "So it's difficult to talk about history while we need to stop somewhere.",
        "start": 92.15,
        "end": 96.82
      },
      {
        "text": "So I decided to set the stop sign 30 years ago.",
        "start": 97.36,
        "end": 101.76
      },
      {
        "text": "So I will start from this paper.",
        "start": 103.05,
        "end": 104.61
      },
      {
        "text": "Interestingly, this is the first computer vision paper I have ever read.",
        "start": 104.99,
        "end": 109.91
      },
      {
        "text": "Surprisingly, this paper was published in CVPR 1996.",
        "start": 110.78,
        "end": 114.28
      },
      {
        "text": "Surprisingly, this paper used neural networks, which is not popular at that time.",
        "start": 116.39,
        "end": 121.87
      },
      {
        "text": "And also surprisingly, it looks like it works pretty good.",
        "start": 122.7,
        "end": 126.3
      },
      {
        "text": "And again, surprisingly, it won a test of time award ten years after that.",
        "start": 127.02,
        "end": 130.88
      },
      {
        "text": "So I read this paper in 2007 when I was an undergrad.",
        "start": 132.35,
        "end": 136.55
      },
      {
        "text": "I spent my entire semester trying to reproduce it.",
        "start": 137.94,
        "end": 142.38
      },
      {
        "text": "Then I got stuck because I realized that I spent the entire summer just reproducing how backpropagation was done with the tanh activation function.",
        "start": 143.93,
        "end": 155.87
      },
      {
        "text": "I just want to give you some idea of how difficult things were at that time.",
        "start": 157.7,
        "end": 161.74
      },
      {
        "text": "Interestingly, even though that paper has some promising signal of using neural networks at that time, the community of computer vision deviates from the direction of using neural networks.",
        "start": 165.44,
        "end": 178.22
      },
      {
        "text": "So surprisingly, at that time, some other methods are more popular.",
        "start": 178.22,
        "end": 185.36
      },
      {
        "text": "For example, just one year after the previous paper.",
        "start": 185.92,
        "end": 189.7
      },
      {
        "text": "People started to use support vector machines or SVM for the same face detection task.",
        "start": 190.24,
        "end": 195.62
      },
      {
        "text": "Well, at that time, support vector machines are very popular.",
        "start": 198.1,
        "end": 201.9
      },
      {
        "text": "They are kind of the most powerful machine learning tools that we can use in computer vision.",
        "start": 201.92,
        "end": 206.32
      },
      {
        "text": "Interestingly, this paper won another test-of-time award 10 years later.",
        "start": 208.98,
        "end": 213.64
      },
      {
        "text": "Then the computer vision community started to look at their hand-engineering features for the usage of any machine learning classifier, such as an SVM or a boosting classifier.",
        "start": 216.67,
        "end": 232.51
      },
      {
        "text": "At that time, one of the most successful framework is called the Viola Jones algorithm.",
        "start": 233.28,
        "end": 238.64
      },
      {
        "text": "And in today's world, this is kind of a convolutional kernel with handcrafted weights.",
        "start": 239.2,
        "end": 246.62
      },
      {
        "text": "The weights are very simple. Half of them are black and the other half of them are white.",
        "start": 247.24,
        "end": 252.38
      },
      {
        "text": "The kernels may have different resolutions and so on and so forth.",
        "start": 253.06,
        "end": 256.88
      },
      {
        "text": "While this feature looks very simple, it turns out that this method works very well in computer vision.",
        "start": 258.96,
        "end": 264.16
      },
      {
        "text": "It has been kind of a golden baseline for many years in face detection and many other tasks.",
        "start": 265.32,
        "end": 271.42
      },
      {
        "text": "Then the computer vision, at almost the same time, started to look deeper into the design of handcrafted features.",
        "start": 273.51,
        "end": 280.51
      },
      {
        "text": "And these are two of the most successful and most widely used features in the vision community.",
        "start": 281.29,
        "end": 286.31
      },
      {
        "text": "So on the left, it is SIFT, which is short for Scale Invariant Feature Transform.",
        "start": 286.93,
        "end": 291.57
      },
      {
        "text": "And on the right, it is HOG, which is short for Histogram of Gradients.",
        "start": 292.45,
        "end": 299.24
      },
      {
        "text": "Conceptually, these two features are kind of orientation gradients.",
        "start": 299.92,
        "end": 303.9
      },
      {
        "text": "They would be slightly higher level than some other features at that time, such as Edges or their Viola Jones features.",
        "start": 303.96,
        "end": 316.47
      },
      {
        "text": "So very quickly in computer vision, these features became very popular and very powerful.",
        "start": 317.17,
        "end": 321.55
      },
      {
        "text": "Then people start to build more powerful classifier on top of these features.",
        "start": 321.55,
        "end": 328.14
      },
      {
        "text": "And surprisingly, some of the simplest classifier works the best.",
        "start": 328.72,
        "end": 331.84
      },
      {
        "text": "So this is a work from 2003.",
        "start": 332.86,
        "end": 336.4
      },
      {
        "text": "Interestingly, the paper title is called Video Google.",
        "start": 337.12,
        "end": 340.08
      },
      {
        "text": "But conceptually, the core idea is actually a bag of words, or bag of visual words.",
        "start": 340.7,
        "end": 347.22
      },
      {
        "text": "So in today's terminology, you can understand this as kind of global pooling or average pooling.",
        "start": 347.74,
        "end": 354.7
      },
      {
        "text": "That's what our community can do at that time.",
        "start": 356.52,
        "end": 359.94
      },
      {
        "text": "Then people started to get a little bit further after that.",
        "start": 362.22,
        "end": 366.46
      },
      {
        "text": "So instead of using a global or a very large pooling window.",
        "start": 367.02,
        "end": 371.66
      },
      {
        "text": "People started to look at something that is called pyramids in computer vision, which is kind of multi-scale representation.",
        "start": 372.16,
        "end": 379.46
      },
      {
        "text": "So there are two very related and very powerful methods published at that time.",
        "start": 379.46,
        "end": 386.04
      },
      {
        "text": "So one is called Pyramid Match Kernel, and the other is called Spatial Pyramid Matching.",
        "start": 386.66,
        "end": 392.32
      },
      {
        "text": "Interestingly, these works all won some Test of Time awards 10 years after they were published.",
        "start": 393.32,
        "end": 398.26
      },
      {
        "text": "And then the visual community started to build some higher-level, slightly higher-level representations than these handcrafted representations.",
        "start": 400.98,
        "end": 410.82
      },
      {
        "text": "So one of the most powerful methods at that time is called Deformable Parts Models or DPM in short.",
        "start": 411.78,
        "end": 417.84
      }
    ]
  },
  {
    "id": "musk-roadster-event-2026",
    "title": "特斯拉 Roadster 发布会演讲（技术讲解节选）",
    "speaker": "埃隆·马斯克 Elon Musk",
    "platform": "bilibili",
    "sourceUrl": "https://www.bilibili.com/video/BV17zn66hEga/",
    "published": "2026-10-15",
    "type": "press",
    "level": 3,
    "tags": [
      "Tesla",
      "SpaceX",
      "Roadster",
      "发布会"
    ],
    "desc": "特斯拉 CEO 埃隆·马斯克与设计团队在得州 SpaceX 麦格雷戈试验基地举行的全新 Roadster 发布会节选：飞行演示后的现场技术讲解，涵盖吸地风扇、冷气推进与直线加速。",
    "focus": "跟读发布会现场对话：Peter Thiel \"flying cars\" 金句的语气、技术参数表达（600 liters / 10 nozzles / 2 Gs）与现场即兴幽默的节奏。",
    "wpmTarget": 150,
    "durationSec": 420,
    "audio": "media/musk-roadster-event-2026.mp3",
    "sentences": [
      {
        "text": "Yeah, well, you know, friend of mine, Peter Thiel, once said that the future promised us flying cars, but instead we got 140 characters.",
        "start": 0.02,
        "end": 7.5
      },
      {
        "text": "Well, not anymore.",
        "start": 7.64,
        "end": 8.64
      },
      {
        "text": "Exactly.",
        "start": 9.24,
        "end": 9.88
      },
      {
        "text": "That's not the last thing you'll see, by the way.",
        "start": 16.1,
        "end": 17.96
      },
      {
        "text": "To do that, we have a suction, a fan suction system on the bottom of the car that can pull up to two Gs in order to make the car go upside down.",
        "start": 21.85,
        "end": 31.61
      },
      {
        "text": "And then we borrowed some technology from SpaceX to do the rest.",
        "start": 32.03,
        "end": 35.23
      },
      {
        "text": "Yeah, I mean, this car really sucks.",
        "start": 35.61,
        "end": 37.71
      },
      {
        "text": "Okay, this car could suck the chrome off a trailer hitch.",
        "start": 38.11,
        "end": 41.89
      },
      {
        "text": "It could suck a tennis ball through a hose pipe.",
        "start": 42.85,
        "end": 45.21
      },
      {
        "text": "So, and it could stick upside down.",
        "start": 46.87,
        "end": 48.89
      },
      {
        "text": "Now, you might say, like, how often do you want to stick upside down in a car?",
        "start": 48.91,
        "end": 52.77
      },
      {
        "text": "Maybe not that often, but it actually has an actual benefit on the track or just driving, where the downforce of the car means you can corner incredibly well.",
        "start": 53.09,
        "end": 68.2
      },
      {
        "text": "Like you can corner like it looks like you're breaking physics because the car sticks to the ground so hard.",
        "start": 68.58,
        "end": 74.44
      },
      {
        "text": "So acceleration, cornering, it's going to crush every track record that has ever existed.",
        "start": 75.19,
        "end": 80.87
      },
      {
        "text": "So, yeah, I think the last time we put Roadster with SpaceX, we had Starman in it.",
        "start": 87.21,
        "end": 94.75
      },
      {
        "text": "And maybe we should check, did we put anyone in the car?",
        "start": 95.37,
        "end": 99.33
      },
      {
        "text": "Yeah, I think Starman is going to make an appearance.",
        "start": 99.73,
        "end": 102.21
      },
      {
        "text": "I think he went for a little ride.",
        "start": 104.25,
        "end": 105.55
      },
      {
        "text": "Any minute now.",
        "start": 107.09,
        "end": 107.89
      },
      {
        "text": "Yeah, so, yeah.",
        "start": 107.95,
        "end": 110.23
      },
      {
        "text": "Here he is.",
        "start": 110.39,
        "end": 110.87
      },
      {
        "text": "No?",
        "start": 113.84,
        "end": 114.18
      },
      {
        "text": "The anticipation.",
        "start": 117.77,
        "end": 118.37
      },
      {
        "text": "Hey, buddy.",
        "start": 119.01,
        "end": 119.81
      },
      {
        "text": "Hi.",
        "start": 120.03,
        "end": 121.86
      },
      {
        "text": "He's being coy.",
        "start": 121.88,
        "end": 122.9
      },
      {
        "text": "Just to be clear, that is not a real human.",
        "start": 126.76,
        "end": 128.96
      },
      {
        "text": "Yeah, so, the car has, obviously, attitude control thrusters and main thrusters in the rear, so it can basically fly like a rocket.",
        "start": 129.52,
        "end": 141.19
      },
      {
        "text": "And it could do rolls.",
        "start": 142.55,
        "end": 145.76
      },
      {
        "text": "It could do like crazy gymnastics.",
        "start": 145.78,
        "end": 148.46
      },
      {
        "text": "Whatever you want, really.",
        "start": 150.1,
        "end": 151.5
      },
      {
        "text": "Now, I should say that this is not necessarily a safety optimized car, but it takes the fun meter to 11 out of 10.",
        "start": 152.46,
        "end": 165.5
      },
      {
        "text": "But speaking of fun meter, you want to try one?",
        "start": 166.51,
        "end": 169.31
      },
      {
        "text": "Let's try something else.",
        "start": 169.37,
        "end": 171.13
      },
      {
        "text": "Yeah, I mean, that was just a little flight.",
        "start": 171.27,
        "end": 174.93
      },
      {
        "text": "Let's do a longer flight.",
        "start": 174.95,
        "end": 176.65
      },
      {
        "text": "All right.",
        "start": 179.32,
        "end": 180.14
      },
      {
        "text": "Let's see who gets it up.",
        "start": 181.23,
        "end": 182.29
      },
      {
        "text": "I mean, I've seen a lot of things, but I've never seen that before.",
        "start": 218.97,
        "end": 222.01
      },
      {
        "text": "Tony Hawk would be proud.",
        "start": 224.04,
        "end": 225.32
      },
      {
        "text": "We call that the kickflip.",
        "start": 225.34,
        "end": 226.3
      },
      {
        "text": "Yeah, I think we're going to clear it more than our whole fleet.",
        "start": 226.54,
        "end": 230.79
      },
      {
        "text": "Yeah.",
        "start": 230.81,
        "end": 231.09
      },
      {
        "text": "Yeah, we can go further.",
        "start": 232.27,
        "end": 233.63
      },
      {
        "text": "Like, this will be an actual car that's on the roads.",
        "start": 236.65,
        "end": 239.65
      },
      {
        "text": "Yeah.",
        "start": 239.81,
        "end": 240.21
      },
      {
        "text": "Yeah, I'm not sure it's necessarily legal in all jurisdictions, but like, there will be such a car that someone can own.",
        "start": 240.23,
        "end": 249.71
      },
      {
        "text": "So, it's going to be pretty, pretty wild that you can have a rocket car.",
        "start": 250.66,
        "end": 254.34
      },
      {
        "text": "Yeah, I agree.",
        "start": 254.95,
        "end": 255.37
      },
      {
        "text": "I think that's what we borrowed from SpaceX technology.",
        "start": 255.79,
        "end": 258.71
      },
      {
        "text": "You talked about the carbon overwrap pressure vessels.",
        "start": 258.83,
        "end": 260.81
      },
      {
        "text": "I just want to tell everyone, because I'm a spec guy, there's two of them in the car.",
        "start": 260.99,
        "end": 264.95
      },
      {
        "text": "They are a total of 600 liters.",
        "start": 265.21,
        "end": 266.75
      },
      {
        "text": "There's about 250 kilos of air.",
        "start": 267.01,
        "end": 268.77
      },
      {
        "text": "And we have 10 nozzles to do all that work.",
        "start": 269.15,
        "end": 271.81
      },
      {
        "text": "Yeah, and it's using an advanced ultra-high pressure air tank.",
        "start": 272.95,
        "end": 279.95
      },
      {
        "text": "So, the car can recharge its air tank.",
        "start": 280.09,
        "end": 283.21
      },
      {
        "text": "So, it's not like you need special propellant or anything like that.",
        "start": 283.31,
        "end": 287.15
      },
      {
        "text": "It literally is just going to puff itself up and be able to do these maneuvers whenever you'd like.",
        "start": 287.17,
        "end": 294.31
      },
      {
        "text": "Well, why don't we show them the car?",
        "start": 295.67,
        "end": 297.79
      },
      {
        "text": "To bring it out?",
        "start": 298.57,
        "end": 299.09
      },
      {
        "text": "Since we knew the car was going to fly, we looked for some inspiration about flying and we thought we would lean into the most badass stuff out there, SR-71, cars that transform.",
        "start": 299.53,
        "end": 310.89
      },
      {
        "text": "And that led us to the new Roadster.",
        "start": 311.67,
        "end": 316.39
      },
      {
        "text": "So, now you get an up-close look at the new Roadster.",
        "start": 356.26,
        "end": 359.46
      },
      {
        "text": "Thank you, Andy and Lamar.",
        "start": 359.48,
        "end": 360.52
      },
      {
        "text": "Those guys are kicking ass on our engineering team making this all happen.",
        "start": 360.54,
        "end": 363.86
      },
      {
        "text": "We can see the car.",
        "start": 365.06,
        "end": 366.38
      },
      {
        "text": "Very clean.",
        "start": 366.4,
        "end": 368.22
      },
      {
        "text": "It's a nice clean aesthetic.",
        "start": 368.44,
        "end": 369.94
      },
      {
        "text": "Like I said, we leaned into a little bit of some of the aerospace aesthetics.",
        "start": 370.12,
        "end": 374.22
      },
      {
        "text": "It's a two-seater.",
        "start": 376.7,
        "end": 377.34
      },
      {
        "text": "I'll open it up.",
        "start": 377.36,
        "end": 377.98
      },
      {
        "text": "As you can see, two guys got out of it.",
        "start": 379.37,
        "end": 380.95
      },
      {
        "text": "We leaned into lightweight as well, so the seats are molded into the chassis.",
        "start": 382.15,
        "end": 386.59
      },
      {
        "text": "It's a steer-by-wire system.",
        "start": 387.03,
        "end": 388.69
      },
      {
        "text": "So we have a steer-by-wire yoke, steer-by-wire brake, steer-by-wire throttle.",
        "start": 389.25,
        "end": 393.35
      },
      {
        "text": "And as we get to the rear of the car, this is where a lot of the action, you can't see it but online, in the diffuser areas where the thrusters are, the fans are, and this is kind of the business end of the car.",
        "start": 394.65,
        "end": 410.05
      },
      {
        "text": "But the car can transform because we wanted to make a pretty car but also a car that could deliver amazing downforce.",
        "start": 410.07,
        "end": 418.36
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) module.exports = { VIDEOS };
