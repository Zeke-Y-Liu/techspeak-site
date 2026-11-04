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
    "id": "jobs-stanford-2005",
    "title": "乔布斯斯坦福大学毕业演讲：求知若渴，虚怀若愚 Stay Hungry, Stay Foolish（2005 全篇）",
    "speaker": "Steve Jobs 史蒂夫·乔布斯（Apple 联合创始人）",
    "platform": "bilibili",
    "sourceUrl": "https://www.bilibili.com/video/BV1T2YLeYE3g",
    "published": "2005-06-12",
    "type": "keynote",
    "level": 2,
    "tags": [
      "Steve Jobs",
      "Stanford",
      "Stay Hungry Stay Foolish"
    ],
    "desc": "公众认知中乔布斯最著名的一次演讲：2005-06-12 斯坦福大学毕业典礼致辞，全篇以三个故事串起：connecting the dots（点滴串联：辍学与书法课如何塑造 Mac 字体）、love and loss（爱与失去：被逐出 Apple 与创办 NeXT/Pixar）、death（死亡：癌症确诊与向死而生），以 The Whole Earth Catalog 告别语 \"Stay Hungry, Stay Foolish\" 收尾，被视为毕业演讲史上的巅峰之作。",
    "focus": "跟读叙事节奏与金句重音：\"You can't connect the dots looking forward; you can only connect them looking backwards.\"、\"Your time is limited, so don't waste it living someone else's life.\"、结尾三连 \"Stay Hungry. Stay Foolish.\"；术语 connecting the dots / calligraphy / serif / typography / dogma / The Whole Earth Catalog / pancreatic cancer。",
    "wpmTarget": 170,
    "durationSec": 852,
    "audio": "media/jobs-stanford-2005.mp3",
    "sentences": [
      {
        "text": "Thank you.",
        "start": 0.03,
        "end": 0.97
      },
      {
        "text": "I'm honored to be with you today for your commencement from one of the finest universities in the world.",
        "start": 5.91,
        "end": 11.19
      },
      {
        "text": "Truth be told, I never graduated from college, and this is the closest I've ever gotten to a college graduation.",
        "start": 14.71,
        "end": 24.51
      },
      {
        "text": "Today I want to tell you three stories from my life.",
        "start": 26.9,
        "end": 29.9
      },
      {
        "text": "That's it. No big deal. Just three stories.",
        "start": 30.04,
        "end": 33.42
      },
      {
        "text": "The first story is about connecting the dots.",
        "start": 33.42,
        "end": 37.95
      },
      {
        "text": "I dropped out of Reed College after the first six months, but then stayed around as a drop-in for another 18 months or so before I really quit.",
        "start": 39.55,
        "end": 47.15
      },
      {
        "text": "So why did I drop out?",
        "start": 47.15,
        "end": 49.6
      },
      {
        "text": "It started before I was born.",
        "start": 51.35,
        "end": 52.89
      },
      {
        "text": "My biological mother was a young, unwed graduate student, and she decided to put me up for adoption.",
        "start": 52.89,
        "end": 60.15
      },
      {
        "text": "She felt very strongly that I should be adopted by college graduates.",
        "start": 60.97,
        "end": 64.87
      },
      {
        "text": "So everything was all set for me to be adopted at birth by a lawyer and his wife.",
        "start": 64.87,
        "end": 69.65
      },
      {
        "text": "Except that when I popped out they decided at the last minute that they really wanted a girl.",
        "start": 70.55,
        "end": 75.47
      },
      {
        "text": "So my parents, who were on a waiting list, got a call in the middle of the night asking, \"We've got an unexpected baby boy; do you want him?\"",
        "start": 75.47,
        "end": 85.44
      },
      {
        "text": "They said, \"Of course.\"",
        "start": 86.3,
        "end": 88
      },
      {
        "text": "My biological mother found out later that my mother had never graduated from college and that my father had never graduated from high school.",
        "start": 88,
        "end": 97.29
      },
      {
        "text": "She refused to sign the final adoption papers.",
        "start": 97.29,
        "end": 100.84
      },
      {
        "text": "She only relented a few months later when my parents promised that I would go to college.",
        "start": 102.02,
        "end": 107.38
      },
      {
        "text": "This was the start in my life, and 17 years later I did go to college.",
        "start": 107.96,
        "end": 115.74
      },
      {
        "text": "But I naively chose a college that was almost as expensive as Stanford, and all of my working class parents' savings were being spent on my college tuition.",
        "start": 115.74,
        "end": 125.48
      },
      {
        "text": "After six months, I couldn't see the value in it.",
        "start": 126.2,
        "end": 129.26
      },
      {
        "text": "I had no idea what I wanted to do with my life and no idea how college was going to help me figure it out.",
        "start": 129.26,
        "end": 135.24
      },
      {
        "text": "And here I was, spending all the money my parents had saved their entire life.",
        "start": 135.52,
        "end": 139.84
      },
      {
        "text": "So I decided to drop out and trust that it would all work out okay.",
        "start": 140.92,
        "end": 145.64
      },
      {
        "text": "It was pretty scary at the time, but looking back it was one of the best decisions I ever made.",
        "start": 146.23,
        "end": 151.31
      },
      {
        "text": "The minute I dropped out I could stop taking the required classes that didn't interest me, and begin dropping in on the ones that looked far more interesting.",
        "start": 152.69,
        "end": 162.33
      },
      {
        "text": "It wasn't all romantic.",
        "start": 162.33,
        "end": 164.98
      },
      {
        "text": "I didn't have a dorm room, so I slept on the floor in friends' rooms.",
        "start": 165.14,
        "end": 168.78
      },
      {
        "text": "I returned Coke bottles for the five cent deposits to buy food with, and I would walk the seven miles across town every Sunday night to get one good meal a week at the Hare Krishna temple.",
        "start": 168.78,
        "end": 180.08
      },
      {
        "text": "I loved it.",
        "start": 180.69,
        "end": 182.01
      },
      {
        "text": "And much of what I stumbled into by following my curiosity and intuition turned out to be priceless later on.",
        "start": 182.01,
        "end": 188.56
      },
      {
        "text": "Let me give you one example.",
        "start": 188.56,
        "end": 190.38
      },
      {
        "text": "Reed College at that time offered perhaps the best calligraphy instruction in the country.",
        "start": 190.38,
        "end": 196.73
      },
      {
        "text": "Throughout the campus, every poster, every label on every drawer was beautifully hand lettered.",
        "start": 197.09,
        "end": 203.23
      },
      {
        "text": "Because I had dropped out and didn't have to take the normal classes, I decided to take a calligraphy class to learn how to do this.",
        "start": 203.95,
        "end": 211.46
      },
      {
        "text": "I learned about serif and sans serif typefaces, about varying the amount of space between different letter combinations, about what makes great typography great.",
        "start": 211.46,
        "end": 221.14
      },
      {
        "text": "It was beautiful, historical, artistically subtle in a way that science can't capture, and I found it fascinating.",
        "start": 221.94,
        "end": 229.77
      },
      {
        "text": "None of this had even a hope of any practical application in my life.",
        "start": 230.74,
        "end": 235.24
      },
      {
        "text": "But ten years later, when we were designing the first Macintosh computer, it all came back to me.",
        "start": 235.24,
        "end": 242.01
      },
      {
        "text": "And we designed it all into the Mac.",
        "start": 242.01,
        "end": 244.63
      },
      {
        "text": "It was the first computer with beautiful typography.",
        "start": 244.63,
        "end": 247.57
      },
      {
        "text": "If I had never dropped in on that single course in college, the Mac would have never had multiple typefaces or proportionally spaced fonts, and since Windows just copied the Mac, it's likely that no personal computer would have them.",
        "start": 247.57,
        "end": 260.93
      },
      {
        "text": "If I had never dropped out, I would have never dropped in on this calligraphy class, and personal computers might not have the wonderful typography that they do.",
        "start": 268.56,
        "end": 276.57
      },
      {
        "text": "Of course it was impossible to connect the dots looking forward when I was in college.",
        "start": 276.57,
        "end": 281.39
      },
      {
        "text": "But it was very, very clear looking backwards ten years later.",
        "start": 281.39,
        "end": 285.29
      },
      {
        "text": "Again, you can't connect the dots looking forward; you can only connect them looking backwards.",
        "start": 285.75,
        "end": 291.11
      },
      {
        "text": "So you have to trust that the dots will somehow connect in your future.",
        "start": 291.11,
        "end": 295.11
      },
      {
        "text": "You have to trust in something: your gut, destiny, life, karma, whatever.",
        "start": 295.11,
        "end": 300.05
      },
      {
        "text": "Because believing that the dots will connect down the road will give you the confidence to follow your heart, even when it leads you off the well-worn path, and that will make all the difference.",
        "start": 300.43,
        "end": 311.19
      },
      {
        "text": "My second story is about love and loss.",
        "start": 317.19,
        "end": 320.89
      },
      {
        "text": "I was lucky.",
        "start": 322.4,
        "end": 323.56
      },
      {
        "text": "I found what I loved to do early in life.",
        "start": 324.02,
        "end": 326.6
      },
      {
        "text": "Woz and I started Apple in my parents' garage when I was 20.",
        "start": 326.6,
        "end": 330.12
      },
      {
        "text": "We worked hard, and in 10 years Apple had grown from just the two of us in a garage into a two billion dollar company with over 4,000 employees.",
        "start": 330.12,
        "end": 338.3
      },
      {
        "text": "We just released our finest creation, the Macintosh, a year earlier, and I just turned 30.",
        "start": 338.3,
        "end": 343.86
      },
      {
        "text": "And then I got fired.",
        "start": 343.86,
        "end": 346.2
      },
      {
        "text": "How can you get fired from a company you started?",
        "start": 346.2,
        "end": 349.98
      },
      {
        "text": "Well, as Apple grew we hired someone who I thought was very talented to run the company with me, and for the first year or so things went well.",
        "start": 351.48,
        "end": 359.54
      },
      {
        "text": "But then our visions of the future began to diverge, and eventually we had a falling out.",
        "start": 359.54,
        "end": 363.96
      },
      {
        "text": "When we did, our Board of Directors sided with him.",
        "start": 363.96,
        "end": 367.26
      },
      {
        "text": "And so at 30 I was out.",
        "start": 367.26,
        "end": 369.58
      },
      {
        "text": "And very publicly out.",
        "start": 369.58,
        "end": 371.4
      },
      {
        "text": "What had been the focus of my entire adult life was gone, and it was devastating.",
        "start": 371.79,
        "end": 376.09
      },
      {
        "text": "I really didn't know what to do for a few months.",
        "start": 376.9,
        "end": 379.16
      },
      {
        "text": "I felt that I had let the previous generation of entrepreneurs down, that I had dropped the baton as it was being passed to me.",
        "start": 379.56,
        "end": 386.12
      },
      {
        "text": "I met with David Packard and Bob Noyce and tried to apologize for screwing up so badly.",
        "start": 386.12,
        "end": 392.19
      },
      {
        "text": "I was a very public failure, and I even thought about running away from the valley.",
        "start": 392.82,
        "end": 396.62
      },
      {
        "text": "But something slowly began to dawn on me.",
        "start": 396.96,
        "end": 399.66
      },
      {
        "text": "I still loved what I did.",
        "start": 400.14,
        "end": 402.22
      },
      {
        "text": "The turn of events at Apple had not changed that one bit.",
        "start": 402.22,
        "end": 406.3
      },
      {
        "text": "I'd been rejected, but I was still in love.",
        "start": 406.82,
        "end": 409.52
      },
      {
        "text": "And so I decided to start over.",
        "start": 409.52,
        "end": 412.37
      },
      {
        "text": "I didn't see it then, but it turned out that getting fired from Apple was the best thing that could have ever happened to me.",
        "start": 413.28,
        "end": 418.96
      },
      {
        "text": "The heaviness of being successful was replaced by the lightness of being a beginner again, less sure about everything.",
        "start": 418.96,
        "end": 426.13
      },
      {
        "text": "It freed me to enter one of the most creative periods of my life.",
        "start": 426.13,
        "end": 429.58
      },
      {
        "text": "During the next five years, I started a company named NeXT, another company named Pixar, and fell in love with an amazing woman who would become my wife.",
        "start": 429.58,
        "end": 437.69
      },
      {
        "text": "Pixar went on to create the world's first computer animated feature film, Toy Story, and is now the most successful animation studio in the world.",
        "start": 438.23,
        "end": 446.35
      },
      {
        "text": "In a remarkable turn of events, Apple bought NeXT, I returned to Apple, and the technology we developed at NeXT is at the heart of Apple's current renaissance.",
        "start": 448.35,
        "end": 457.88
      },
      {
        "text": "And Laurene and I have a wonderful family together.",
        "start": 457.88,
        "end": 461.32
      },
      {
        "text": "I'm pretty sure none of this would have happened if I hadn't been fired from Apple.",
        "start": 461.32,
        "end": 466.27
      },
      {
        "text": "It was awful tasting medicine, but I guess the patient needed it.",
        "start": 466.49,
        "end": 470.07
      },
      {
        "text": "Sometimes life's going to hit you in the head with a brick.",
        "start": 471.84,
        "end": 474.34
      },
      {
        "text": "Don't lose faith.",
        "start": 474.93,
        "end": 475.95
      },
      {
        "text": "I'm convinced that the only thing that kept me going was that I loved what I did.",
        "start": 476.67,
        "end": 480.51
      },
      {
        "text": "You've got to find what you love.",
        "start": 480.81,
        "end": 482.95
      },
      {
        "text": "And that is as true for your work as it is for your lovers.",
        "start": 482.95,
        "end": 485.89
      },
      {
        "text": "Your work is gonna fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
        "start": 486.53,
        "end": 493.35
      },
      {
        "text": "And the only way to do great work is to love what you do.",
        "start": 493.35,
        "end": 497.23
      },
      {
        "text": "If you haven't found it yet, keep looking and don't settle.",
        "start": 497.23,
        "end": 501.65
      },
      {
        "text": "As with all matters of the heart, you'll know when you find it.",
        "start": 501.65,
        "end": 505.59
      },
      {
        "text": "And, like any great relationship, it just gets better and better as the years roll on.",
        "start": 505.59,
        "end": 510.51
      },
      {
        "text": "So keep looking. Don't settle.",
        "start": 510.51,
        "end": 513.25
      },
      {
        "text": "My third story is about death.",
        "start": 523.67,
        "end": 526.58
      },
      {
        "text": "When I was 17, I read a quote that went something like: \"If you live each day as if it was your last, someday you'll most certainly be right.\"",
        "start": 526.58,
        "end": 536.48
      },
      {
        "text": "It made an impression on me.",
        "start": 539.1,
        "end": 541.02
      },
      {
        "text": "And since then, for the past 33 years, I have looked in the mirror every morning and asked myself: \"If today were the last day of my life, would I want to do what I am about to do today?\"",
        "start": 541.02,
        "end": 552.06
      },
      {
        "text": "And whenever the answer has been \"No\" for too many days in a row, I know I need to change something.",
        "start": 552.06,
        "end": 558.03
      },
      {
        "text": "Remembering that I'll be dead soon is the most important tool I've ever encountered to help me make the big choices in life.",
        "start": 559.1,
        "end": 565.68
      },
      {
        "text": "Because almost everything, all external expectations, all pride, all fear of embarrassment or failure, these things just fall away in the face of death, leaving only what is truly important.",
        "start": 566.26,
        "end": 578.72
      },
      {
        "text": "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose.",
        "start": 579.36,
        "end": 586.1
      },
      {
        "text": "You are already naked.",
        "start": 586.1,
        "end": 588.08
      },
      {
        "text": "There is no reason not to follow your heart.",
        "start": 588.54,
        "end": 591.02
      },
      {
        "text": "About a year ago I was diagnosed with cancer.",
        "start": 592.22,
        "end": 595.62
      },
      {
        "text": "I had a scan at 7:30 in the morning, and it clearly showed a tumor on my pancreas.",
        "start": 595.62,
        "end": 601.42
      },
      {
        "text": "I didn't even know what a pancreas was.",
        "start": 601.62,
        "end": 603.84
      },
      {
        "text": "The doctors told me this was almost certainly a type of cancer that is incurable, and that I should expect to live no longer than three to six months.",
        "start": 604.4,
        "end": 613.28
      },
      {
        "text": "My doctor advised me to go home and get my affairs in order, which is doctor's code for prepare to die.",
        "start": 614.18,
        "end": 621.56
      },
      {
        "text": "It means to try and tell your kids everything you thought you'd have the next ten years to tell them in just a few months.",
        "start": 622.22,
        "end": 629.49
      },
      {
        "text": "It means to make sure everything is buttoned up so that it will be as easy as possible for your family.",
        "start": 630.26,
        "end": 635.4
      },
      {
        "text": "It means to say your goodbyes.",
        "start": 636.02,
        "end": 637.78
      },
      {
        "text": "I lived with that diagnosis all day.",
        "start": 639.83,
        "end": 641.85
      },
      {
        "text": "Later that evening I had a biopsy, where they stuck an endoscope down my throat, through my stomach and into my intestines, put a needle into my pancreas and got a few cells from the tumor.",
        "start": 642.3,
        "end": 653.04
      },
      {
        "text": "I was sedated, but my wife, who was there, told me that when they viewed the cells under a microscope the doctors started crying because it turned out to be a very rare form of pancreatic cancer that is curable with surgery.",
        "start": 653.81,
        "end": 666.71
      },
      {
        "text": "I had the surgery and, thankfully, I'm fine now.",
        "start": 667.25,
        "end": 670.79
      },
      {
        "text": "This was the closest I've been to facing death, and I hope it's the closest I get for a few more decades.",
        "start": 679.07,
        "end": 684.6
      },
      {
        "text": "Having lived through it, I can now say this to you with a bit more certainty than when death was a useful but purely intellectual concept.",
        "start": 684.98,
        "end": 692.82
      },
      {
        "text": "No one wants to die.",
        "start": 694.08,
        "end": 695.98
      },
      {
        "text": "Even people who want to go to heaven don't want to die to get there.",
        "start": 696.48,
        "end": 699.96
      },
      {
        "text": "And yet death is the destination we all share.",
        "start": 700.62,
        "end": 704.02
      },
      {
        "text": "No one has ever escaped it.",
        "start": 704.52,
        "end": 706.24
      },
      {
        "text": "And that is as it should be, because Death is very likely the single best invention of Life.",
        "start": 706.54,
        "end": 712.78
      },
      {
        "text": "It's Life's change agent.",
        "start": 713.4,
        "end": 714.96
      },
      {
        "text": "It clears out the old to make way for the new.",
        "start": 714.96,
        "end": 717.3
      },
      {
        "text": "Right now, the new is you.",
        "start": 718.13,
        "end": 720.17
      },
      {
        "text": "But someday not too long from now, you will gradually become the old and be cleared away.",
        "start": 720.82,
        "end": 725.9
      },
      {
        "text": "Sorry to be so dramatic, but it is quite true.",
        "start": 726.77,
        "end": 729.67
      },
      {
        "text": "Your time is limited, so don't waste it living someone else's life.",
        "start": 730.88,
        "end": 735.56
      },
      {
        "text": "Don't be trapped by dogma, which is living with the results of other people's thinking.",
        "start": 736.27,
        "end": 740.75
      },
      {
        "text": "Don't let the noise of others' opinions drown out your own inner voice.",
        "start": 741.2,
        "end": 745.14
      },
      {
        "text": "And most important, have the courage to follow your heart and intuition.",
        "start": 745.54,
        "end": 749.48
      },
      {
        "text": "They somehow already know what you truly want to become.",
        "start": 749.78,
        "end": 753.6
      },
      {
        "text": "Everything else is secondary.",
        "start": 754.12,
        "end": 756.26
      },
      {
        "text": "When I was young, there was an amazing publication called The Whole Earth Catalog, which was one of the bibles of my generation.",
        "start": 767.87,
        "end": 775.95
      },
      {
        "text": "It was created by a fellow named Stewart Brand not far from here in Menlo Park.",
        "start": 776.42,
        "end": 780.96
      },
      {
        "text": "And he brought it to life with his poetic touch.",
        "start": 781.32,
        "end": 783.66
      },
      {
        "text": "This was in the late 60s, before personal computers and desktop publishing.",
        "start": 784.42,
        "end": 788.34
      },
      {
        "text": "So it was all made with typewriters, scissors, and Polaroid cameras.",
        "start": 788.64,
        "end": 792.48
      },
      {
        "text": "It was sort of like Google in paperback form, 35 years before Google came along.",
        "start": 792.82,
        "end": 797.62
      },
      {
        "text": "It was idealistic, overflowing with neat tools and great notions.",
        "start": 798.08,
        "end": 802.66
      },
      {
        "text": "Stewart and his team put out several issues of The Whole Earth Catalog, and then when it had run its course, they put out a final issue.",
        "start": 803.62,
        "end": 811.18
      },
      {
        "text": "It was the mid 1970s, and I was your age.",
        "start": 811.53,
        "end": 815.2
      },
      {
        "text": "On the back cover of their final issue was a photograph of an early morning country road, the kind you might find yourself hitchhiking on if you were so adventurous.",
        "start": 816.76,
        "end": 826.23
      },
      {
        "text": "Beneath it were the words: \"Stay Hungry. Stay Foolish.\"",
        "start": 827.01,
        "end": 831.45
      },
      {
        "text": "It was their farewell message as they signed off.",
        "start": 831.45,
        "end": 834.71
      },
      {
        "text": "Stay Hungry. Stay Foolish.",
        "start": 835.24,
        "end": 837.71
      },
      {
        "text": "And I've always wished that for myself.",
        "start": 838.18,
        "end": 840.91
      },
      {
        "text": "And now, as you graduate to begin anew, I wish that for you.",
        "start": 841.69,
        "end": 846.72
      },
      {
        "text": "Stay Hungry. Stay Foolish.",
        "start": 847.16,
        "end": 849.41
      },
      {
        "text": "Thank you all very much.",
        "start": 849.99,
        "end": 851.4
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
  },
  {
    "id": "vogels-reinvent-2025",
    "title": "AWS re:Invent 2025 谢幕主题演讲：拥抱变化 If you evolve（开场节选）",
    "speaker": "Werner Vogels 维尔纳·沃格尔",
    "platform": "bilibili",
    "sourceUrl": "https://www.bilibili.com/video/BV16Dm2BDENF",
    "published": "2025-12-04",
    "type": "keynote",
    "level": 3,
    "tags": [
      "Werner Vogels",
      "AWS",
      "re:Invent"
    ],
    "desc": "公众认知中的 AWS CTO Werner Vogels 在 re:Invent 2025 闭幕日（2025-12-04）的最后一场主题演讲（谢幕之作），宣告 14 场 re:Invent keynote 收官，谈开发者如何面对 AI 变化（\"Will AI take my job? Maybe. I will transform\"），回顾编译器/结构化编程/C++ 历史，到 1998 年 Amazon 拆分单体架构的著名时刻。",
    "focus": "跟读谢幕演讲叙事节奏：排比句 \"tools evolve, architectures evolve, expectations evolve, and so do we\"、\"Will AI take my job?\" 问答、\"Absolutely not, if you evolve\" 重音，及 assembler/COBOL/Pascal/monolith/distributed systems 术语。",
    "wpmTarget": 125,
    "durationSec": 358.3,
    "audio": "media/vogels-reinvent-2025.mp3",
    "sentences": [
      {
        "text": "Good morning. Oh, no, it's not. Hello, guys.",
        "start": 0.03,
        "end": 3.62
      },
      {
        "text": "So the video showed you every generation of developers that face the new wave of change.",
        "start": 4.14,
        "end": 10.7
      },
      {
        "text": "You know, tools evolve, architectures evolve, expectations evolve, and so do we.",
        "start": 10.7,
        "end": 18.76
      },
      {
        "text": "But before we talk about that, let's talk about the elephant in the room.",
        "start": 18.76,
        "end": 29.08
      },
      {
        "text": "Yeah, I've been giving this keynote since 2012, and I've done all of them.",
        "start": 29.74,
        "end": 38.83
      },
      {
        "text": "That's a lot of t-shirts, by the way.",
        "start": 38.83,
        "end": 40.85
      },
      {
        "text": "Yeah, but today, this week ends.",
        "start": 40.85,
        "end": 45.95
      },
      {
        "text": "This is my final re:Invent keynote.",
        "start": 46.61,
        "end": 49.87
      },
      {
        "text": "I've still things to do. I'm not leaving Amazon or anything like that.",
        "start": 51.5,
        "end": 57.84
      },
      {
        "text": "But I think that after 14 of these events, you guys are owed young, fresh, new voices.",
        "start": 57.84,
        "end": 67.91
      },
      {
        "text": "There are so many amazing engineers at Amazon that have great stories to tell, to teach, to help you, to educate you.",
        "start": 68.61,
        "end": 80.54
      },
      {
        "text": "And I think it's time for those younger, different voices of AWS to be in front of you.",
        "start": 80.54,
        "end": 88.05
      },
      {
        "text": "But nobody forces me to do this.",
        "start": 88.05,
        "end": 90.5
      },
      {
        "text": "I'm not leaving Amazon or anything like this.",
        "start": 90.5,
        "end": 93.64
      },
      {
        "text": "This is my decision to make sure that you get to hear different voices than just mine.",
        "start": 93.64,
        "end": 101.8
      },
      {
        "text": "Now let's talk about the other elephants in the room.",
        "start": 103.11,
        "end": 108.17
      },
      {
        "text": "I visited AWS customers all over the world, and there is this, there is one question that keeps coming up in every country and in every city.",
        "start": 109.89,
        "end": 123.91
      },
      {
        "text": "Will AI take my job?",
        "start": 125.3,
        "end": 130.02
      },
      {
        "text": "Maybe.",
        "start": 133.71,
        "end": 134.5
      },
      {
        "text": "Yeah.",
        "start": 137.55,
        "end": 138.34
      },
      {
        "text": "I will transform.",
        "start": 138.56,
        "end": 140.06
      },
      {
        "text": "Some tasks will be automated.",
        "start": 140.95,
        "end": 142.9
      },
      {
        "text": "Some skills will become obsolete.",
        "start": 143.47,
        "end": 146.38
      },
      {
        "text": "New ones will emerge.",
        "start": 147.75,
        "end": 149.7
      },
      {
        "text": "So maybe we should rephrase and reframe this question.",
        "start": 150.68,
        "end": 157.21
      },
      {
        "text": "Yeah.",
        "start": 158.77,
        "end": 160.01
      },
      {
        "text": "Will AI make me obsolete?",
        "start": 160.85,
        "end": 164.78
      },
      {
        "text": "Absolutely not.",
        "start": 167.74,
        "end": 169.47
      },
      {
        "text": "Yeah.",
        "start": 170.91,
        "end": 171.63
      },
      {
        "text": "If you evolve.",
        "start": 174.54,
        "end": 176.06
      },
      {
        "text": "Yeah, and if I look at the past years at Amazon, where, you know, we've been using all these new tools.",
        "start": 176.88,
        "end": 185.78
      },
      {
        "text": "We've seen how you can evolve over time and still be a great engineer with just a new set of tools in your hands.",
        "start": 185.78,
        "end": 198.04
      },
      {
        "text": "Because we evolve as developers.",
        "start": 198.81,
        "end": 202.65
      },
      {
        "text": "Yeah, and so must our tools.",
        "start": 203.87,
        "end": 206.77
      },
      {
        "text": "And so change is constant.",
        "start": 208.33,
        "end": 212.39
      },
      {
        "text": "And this has always been the case. It's nothing new.",
        "start": 212.47,
        "end": 216.63
      },
      {
        "text": "Yeah, yeah, let's go back in time a little bit.",
        "start": 218.13,
        "end": 221.69
      },
      {
        "text": "Just for the heck.",
        "start": 222.48,
        "end": 223.64
      },
      {
        "text": "When I went to school, I was taught 68,000 assembler, COBOL, and Pascal.",
        "start": 223.64,
        "end": 230.39
      },
      {
        "text": "None of these languages are being used anymore.",
        "start": 231.61,
        "end": 234.03
      },
      {
        "text": "And in the 60s, we certainly got compilers, and it didn't really matter anymore what kind of assembly those compilers spit out.",
        "start": 236,
        "end": 245.92
      },
      {
        "text": "However, by learning assembly, I knew, I learned how that loop in Pascal actually translated into machine code.",
        "start": 246.41,
        "end": 257.15
      },
      {
        "text": "And so that was important to me.",
        "start": 257.15,
        "end": 261.25
      },
      {
        "text": "And over time, you know, compilers became the highest level of abstractions that most developers needed.",
        "start": 261.25,
        "end": 266.98
      },
      {
        "text": "In the 70s, suddenly, structured programming became popular, yeah?",
        "start": 268.44,
        "end": 274.7
      },
      {
        "text": "We're moving towards that.",
        "start": 275.28,
        "end": 276.56
      },
      {
        "text": "Compilers from Bell Labs and Berkeley, they supported this shift.",
        "start": 276.56,
        "end": 281.16
      },
      {
        "text": "They give developers a clearer control over flow and help them escape the chaos of unstructured code.",
        "start": 281.16,
        "end": 289.08
      },
      {
        "text": "And then a few years later, Bjarne Stroustrup started exploring how to model real-world concepts directly into coding, objects and classes.",
        "start": 289.08,
        "end": 301.67
      },
      {
        "text": "And that became C++ and helped shape object-oriented programming.",
        "start": 301.67,
        "end": 305.59
      },
      {
        "text": "In the late 1990s, Amazon was still running as a monolith.",
        "start": 305.59,
        "end": 314.1
      },
      {
        "text": "In 1998, and this is a famous moment, yeah, the growth accelerated to such a point that the team began breaking off pieces of this monolith into services.",
        "start": 314.1,
        "end": 328.3
      },
      {
        "text": "And each service had ownership of their servers, had their own interface, and they completely changed how developers worked.",
        "start": 328.82,
        "end": 337.34
      },
      {
        "text": "They moved faster, they became independent of other teams.",
        "start": 337.34,
        "end": 341.7
      },
      {
        "text": "They owned their systems end to end.",
        "start": 341.7,
        "end": 345.12
      },
      {
        "text": "And over time, the industry at large became adopting these kind of practices as a practical model for building and operating large-scale distributed systems.",
        "start": 345.87,
        "end": 358.17
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) module.exports = { VIDEOS };
