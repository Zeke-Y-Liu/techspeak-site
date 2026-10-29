/* ============================================================
 * TechSpeak 数据层：文章库 / AI-Infra 术语库 / 句型库 / 句段库
 * 文章内容摘录并节选自各公司官方博客，仅作英语学习用途，
 * 版权归原机构所有，原文地址见 url 字段。
 * ============================================================ */

const ARTICLES = [
  {
    id: 'claude-35-sonnet',
    title: 'Claude 3.5 Sonnet',
    source: 'Anthropic',
    sourceClass: 'anthropic',
    date: '2024-06-21',
    url: 'https://www.anthropic.com/news/claude-3-5-sonnet',
    difficulty: 'Intermediate',
    level: 2,
    tags: ['AI 模型', '产品发布', '基准测试'],
    desc: 'Claude 3.5 Sonnet 发布公告——在智能、速度与成本之间取得新平衡，适合练习产品发布类演讲的措辞与节奏。',
    paragraphs: [
      {
        title: '发布开场',
        text: "Today, we're launching Claude 3.5 Sonnet — our first release in the forthcoming Claude 3.5 model family. Claude 3.5 Sonnet raises the industry bar for intelligence, outperforming competitor models and Claude 3 Opus on a wide range of evaluations, with the speed and cost of our mid-tier model, Claude 3 Sonnet."
      },
      {
        title: '前沿基准',
        text: "Claude 3.5 Sonnet sets new industry benchmarks for graduate-level reasoning, undergraduate-level knowledge, and coding proficiency. It shows marked improvement in grasping nuance, humor, and complex instructions, and is exceptional at writing high-quality content with a natural, relatable tone."
      },
      {
        title: '速度与成本',
        text: "Claude 3.5 Sonnet operates at twice the speed of Claude 3 Opus. This performance boost, combined with cost-effective pricing, makes Claude 3.5 Sonnet ideal for complex tasks such as context-sensitive customer support and orchestrating multi-step workflows."
      },
      {
        title: '视觉能力',
        text: "Claude 3.5 Sonnet is our strongest vision model yet, surpassing Claude 3 Opus on standard vision benchmarks. These step-change improvements are most noticeable for tasks that require visual reasoning, like interpreting charts and graphs."
      },
      {
        title: 'Artifacts 新功能',
        text: "When a user asks Claude to generate content like code snippets, text documents, or website designs, these Artifacts appear in a dedicated window alongside their conversation. This creates a dynamic workspace where they can see, edit, and build upon Claude's creations in real time."
      },
      {
        title: '安全与隐私',
        text: "Our models are subjected to rigorous testing and have been trained to reduce misuse. One of the core constitutional principles that guides our AI model development is privacy. We do not train our generative models on user-submitted data unless a user gives us explicit permission to do so."
      }
    ]
  },
  {
    id: 'sima-2',
    title: 'SIMA 2: An Agent that Plays, Reasons, and Learns With You',
    source: 'Google DeepMind',
    sourceClass: 'deepmind',
    date: '2025-11-13',
    url: 'https://deepmind.google/blog/sima-2-an-agent-that-plays-reasons-and-learns-with-you-in-virtual-3d-worlds/',
    difficulty: 'Advanced',
    level: 3,
    tags: ['智能体', '研究进展', '具身智能'],
    desc: 'SIMA 2 从"指令执行者"进化为"会推理的游戏伙伴"——研究叙事类文章的范文，练习高级表达与复杂句式。',
    paragraphs: [
      {
        title: '背景回顾',
        text: "Last year, we introduced SIMA, a generalist AI that could follow basic instructions across a wide range of virtual environments. SIMA was a crucial first step in teaching AI to translate language into meaningful action in rich, 3D worlds."
      },
      {
        title: 'SIMA 2 登场',
        text: "Today we're introducing SIMA 2, the next milestone in our research creating general and helpful AI agents. By integrating the advanced capabilities of our Gemini models, SIMA is evolving from an instruction-follower into an interactive gaming companion."
      },
      {
        title: '第一代的能力',
        text: "The first version of SIMA learned to perform over 600 language-following skills, like turn left, climb the ladder, and open the map, across a diverse set of commercial video games. It operated in these environments as a person might, by looking at the screen and using a virtual keyboard and mouse to navigate, without access to the underlying game mechanics."
      },
      {
        title: '推理能力',
        text: "SIMA 2's new architecture integrates Gemini's powerful reasoning abilities to help it understand a user's high-level goal, perform complex reasoning in pursuit, and skillfully execute goal-oriented actions within games."
      },
      {
        title: '泛化与迁移',
        text: "Moreover, its capacity to transfer learned concepts — for instance, taking its understanding of mining in one game and applying it to harvesting in another — is foundational to achieving the kind of broad generalization seen in human cognition."
      }
    ]
  },
  {
    id: 'ironwood-tpu',
    title: '3 Things to Know About Ironwood, Our Latest TPU',
    source: 'Google Cloud',
    sourceClass: 'google',
    date: '2025-11-25',
    url: 'https://blog.google/products/google-cloud/ironwood-google-tpu-things-to-know/',
    difficulty: 'Intermediate',
    level: 2,
    tags: ['基础设施', '定制芯片', '推理时代'],
    desc: '第七代 TPU Ironwood 详解——基础设施与硬件类表达的绝佳素材，大量数字、单位与技术术语读法练习。',
    paragraphs: [
      {
        title: '为什么需要新硬件',
        text: "Today's most advanced AI models, like those powering complex thinking and calculations, need speed and efficiency from the hardware that powers them. That's why at Cloud Next in April, we unveiled Ironwood, our seventh-generation Tensor Processing Unit."
      },
      {
        title: '并行处理突破',
        text: "By acting as a hugely efficient parallel processor, Ironwood excels at managing massive calculations and significantly minimizes the internal time required for data to shuttle across the chip. This breakthrough dramatically speeds up complex AI, making models run significantly faster and smoother across our cloud."
      },
      {
        title: '为推理而生',
        text: "As the industry's focus shifts from training frontier models to powering useful, responsive interactions with them, Ironwood provides the essential hardware. It's custom built for high-volume, low-latency AI inference and model serving."
      },
      {
        title: '超级 Pod 网络',
        text: "The system groups individual TPUs into interconnected units called pods. With Ironwood, we can scale up to 9,216 chips in a superpod. These chips are linked via a breakthrough Inter-Chip Interconnect network operating at 9.6 terabits per second."
      },
      {
        title: '共享内存规模',
        text: "This massive connectivity allows thousands of chips to rapidly communicate and access a staggering 1.77 petabytes of shared High Bandwidth Memory, overcoming data bottlenecks for even the most demanding models."
      },
      {
        title: 'AI 设计 AI 芯片',
        text: "Ironwood is the result of a continuous loop at Google where researchers influence hardware design, and hardware accelerates research. Our researchers even use AI to design the next chip generation — a method called AlphaChip — which has used reinforcement learning to generate superior layouts for the last three TPU generations."
      }
    ]
  }
];

/* ============ AI / Infra 术语库 ============ */
const GLOSSARY = [
  // --- AI / ML ---
  { term: 'transformer', ipa: '/trænsˈfɔːrmər/', cat: 'AI/ML', zh: 'Transformer 架构：基于自注意力机制的神经网络架构，是现代大模型的基础', def: 'A neural network architecture based on self-attention, the foundation of modern large models.', example: 'Virtually all frontier models today are built on the transformer architecture.' },
  { term: 'inference', ipa: '/ˈɪnfərəns/', cat: 'AI/ML', zh: '推理：训练好的模型根据新输入生成输出的过程', def: 'The process of running a trained model to generate outputs from new inputs.', example: 'Ironwood is custom built for high-volume, low-latency AI inference and model serving.' },
  { term: 'training', ipa: '/ˈtreɪnɪŋ/', cat: 'AI/ML', zh: '训练：通过数据优化模型参数的过程', def: 'The process of optimizing model parameters on data.', example: 'Training frontier models requires thousands of accelerators working in parallel.' },
  { term: 'fine-tuning', ipa: '/ˌfaɪnˈtuːnɪŋ/', cat: 'AI/ML', zh: '微调：在预训练模型基础上用特定数据进一步训练', def: 'Further training a pretrained model on task-specific data.', example: 'Fine-tuning allows enterprises to adapt a general model to their own domain.' },
  { term: 'token', ipa: '/ˈtoʊkən/', cat: 'AI/ML', zh: '词元：模型处理文本的基本单位，约 0.75 个英文单词', def: 'The basic unit of text that a model processes; roughly 0.75 English words.', example: 'The model costs three dollars per million input tokens.' },
  { term: 'context window', ipa: '/ˈkɑːntekst ˈwɪndoʊ/', cat: 'AI/ML', zh: '上下文窗口：模型一次能处理的 token 上限', def: 'The maximum number of tokens a model can process at once.', example: 'With a 200K token context window, Claude can process entire codebases.' },
  { term: 'embedding', ipa: '/ɪmˈbedɪŋ/', cat: 'AI/ML', zh: '嵌入：把文本等数据映射为稠密向量的表示', def: 'A dense vector representation of text or other data.', example: 'Semantic search works by comparing embeddings of the query and the documents.' },
  { term: 'reinforcement learning', ipa: '/rɪˌɪnfˈɔːrsmənt ˈlɜːrnɪŋ/', cat: 'AI/ML', zh: '强化学习：智能体通过与环境交互获得奖励来学习', def: 'Learning where an agent improves by receiving rewards from its environment.', example: 'AlphaChip used reinforcement learning to generate superior chip layouts.' },
  { term: 'benchmark', ipa: '/ˈbentʃmɑːrk/', cat: 'AI/ML', zh: '基准测试：用于量化比较模型能力的标准化评测', def: 'A standardized evaluation used to compare model capabilities quantitatively.', example: 'Claude 3.5 Sonnet sets new industry benchmarks for graduate-level reasoning.' },
  { term: 'multimodal', ipa: '/ˌmʌltiˈmoʊdəl/', cat: 'AI/ML', zh: '多模态：能同时处理文本、图像、音频等多种输入', def: 'Able to process multiple input types such as text, images, and audio.', example: 'SIMA 2 understands multimodal prompts, including sketches drawn on screen.' },
  { term: 'agentic', ipa: '/eɪˈdʒentɪk/', cat: 'AI/ML', zh: '智能体式的：能自主规划、使用工具、多步执行的 AI 行为方式', def: 'Describing AI that autonomously plans, uses tools, and executes multi-step tasks.', example: 'Agentic workflows are driving the shift toward the age of inference.' },
  { term: 'reasoning', ipa: '/ˈriːzənɪŋ/', cat: 'AI/ML', zh: '推理能力：模型分步骤思考、解决问题的能力', def: 'The ability of a model to think through problems step by step.', example: 'SIMA 2 integrates Gemini\u2019s powerful reasoning abilities to pursue high-level goals.' },
  { term: 'alignment', ipa: '/əˈlaɪnmənt/', cat: 'AI/ML', zh: '对齐：让模型行为符合人类意图与价值观', def: 'Making model behavior conform to human intent and values.', example: 'Alignment research aims to make frontier models safe and helpful.' },
  { term: 'hallucination', ipa: '/həˌluːsɪˈneɪʃən/', cat: 'AI/ML', zh: '幻觉：模型生成看似合理但事实错误的内容', def: 'When a model generates plausible but factually wrong content.', example: 'Grounding the model in retrieved documents reduces hallucination.' },
  { term: 'evaluation', ipa: '/ɪˌvæljuˈeɪʃən/', cat: 'AI/ML', zh: '评测（evals）：系统性测试模型能力与安全性的流程', def: 'Systematic testing of model capabilities and safety; often shortened to evals.', example: 'In an internal agentic coding evaluation, the model solved 64% of problems.' },
  { term: 'pretraining', ipa: '/ˌpriːˈtreɪnɪŋ/', cat: 'AI/ML', zh: '预训练：在大规模数据上进行的第一阶段训练', def: 'The first training stage on massive datasets.', example: 'Pretraining consumes the majority of the compute in a model\u2019s lifecycle.' },
  { term: 'parameters', ipa: '/pəˈræmɪtərz/', cat: 'AI/ML', zh: '参数：模型中可学习的权重数量，衡量模型规模', def: 'The learnable weights in a model; a measure of model scale.', example: 'Larger models have more parameters and typically perform better on reasoning tasks.' },
  { term: 'distillation', ipa: '/ˌdɪstɪˈleɪʃən/', cat: 'AI/ML', zh: '蒸馏：用大模型输出训练小模型以降低成本', def: 'Training a smaller model on a larger model\u2019s outputs to cut costs.', example: 'Distillation lets us offer near-frontier quality at a fraction of the cost.' },
  { term: 'generalization', ipa: '/ˌdʒenrələˈzeɪʃən/', cat: 'AI/ML', zh: '泛化：将学到的能力迁移到未见任务或环境', def: 'Transferring learned abilities to unseen tasks or environments.', example: 'Broad generalization seen in human cognition remains the north star for agents.' },
  { term: 'red teaming', ipa: '/ˈred ˌtiːmɪŋ/', cat: 'AI/ML', zh: '红队测试：主动攻击模型以发现安全漏洞', def: 'Deliberately attacking a model to surface safety weaknesses.', example: 'Our red teaming assessments concluded that the model remains at ASL-2.' },
  // --- Infrastructure / Systems ---
  { term: 'workload', ipa: '/ˈwɜːrkoʊd/', cat: 'Infra/Systems', zh: '负载/工作负载：运行在基础设施上的计算任务', def: 'A computing job that runs on infrastructure.', example: 'Ironwood offers more than 4X better performance per chip for both training and inference workloads.' },
  { term: 'latency', ipa: '/ˈleɪtənsi/', cat: 'Infra/Systems', zh: '延迟：请求从发出到收到响应的时间', def: 'The time from sending a request to receiving a response.', example: 'Users expect low-latency responses from interactive AI products.' },
  { term: 'throughput', ipa: '/ˈθruːpʊt/', cat: 'Infra/Systems', zh: '吞吐量：系统单位时间内处理的请求数或数据量', def: 'The number of requests or amount of data processed per unit of time.', example: 'We optimized the pipeline to maximize throughput without sacrificing latency.' },
  { term: 'orchestration', ipa: '/ˌɔːrkɪˈstreɪʃən/', cat: 'Infra/Systems', zh: '编排：自动调度和管理多个服务或任务的执行', def: 'Automatically scheduling and coordinating services or tasks.', example: 'This model is ideal for orchestrating multi-step workflows.' },
  { term: 'kubernetes', ipa: '/ˌkuːbərˈnetiːz/', cat: 'Infra/Systems', zh: 'Kubernetes：容器编排系统，常缩写为 K8s', def: 'An open-source container orchestration system; often abbreviated K8s.', example: 'Our platform runs on Kubernetes clusters across three regions.' },
  { term: 'container', ipa: '/kənˈteɪnər/', cat: 'Infra/Systems', zh: '容器：轻量级、可移植的软件运行环境隔离技术', def: 'A lightweight, portable isolated environment for running software.', example: 'Each microservice is packaged as a container with its dependencies.' },
  { term: 'autoscaling', ipa: '/ˈɔːtoʊskeɪlɪŋ/', cat: 'Infra/Systems', zh: '自动扩缩容：根据负载自动增减计算资源', def: 'Automatically adding or removing compute resources based on load.', example: 'Autoscaling kept the service responsive during the traffic spike.' },
  { term: 'load balancing', ipa: '/loʊd ˈbælənsɪŋ/', cat: 'Infra/Systems', zh: '负载均衡：把请求分发到多台机器避免单点过载', def: 'Distributing requests across machines to avoid overloading any single one.', example: 'The load balancer routes requests to the nearest healthy instance.' },
  { term: 'fault tolerance', ipa: '/fɔːlt ˈtɑːlərəns/', cat: 'Infra/Systems', zh: '容错：部分组件失效时系统仍能继续工作', def: 'The ability of a system to keep working when components fail.', example: 'Fault tolerance is non-negotiable for planet-scale infrastructure.' },
  { term: 'high availability', ipa: '/haɪ əˌveɪləˈbɪləti/', cat: 'Infra/Systems', zh: '高可用：系统长时间持续可服务的能力，常以几个 9 衡量', def: 'A system\u2019s ability to stay continuously serviceable; measured in nines.', example: 'We designed the cluster for 99.99% high availability.' },
  { term: 'distributed systems', ipa: '/dɪˈstrɪbjuːtɪd ˈsɪstəmz/', cat: 'Infra/Systems', zh: '分布式系统：多机协作组成的整体计算系统', def: 'A computing system made of many machines cooperating as a whole.', example: 'Coordinating state across a distributed systems is where most bugs live.' },
  { term: 'caching', ipa: '/ˈkæʃɪŋ/', cat: 'Infra/Systems', zh: '缓存：把热数据存在更快的存储层以加速访问', def: 'Storing hot data in a faster storage layer to speed up access.', example: 'Caching embeddings at the edge cut our p99 latency in half.' },
  { term: 'bandwidth', ipa: '/ˈbændwɪdθ/', cat: 'Infra/Systems', zh: '带宽：链路单位时间可传输的数据量', def: 'The amount of data a link can transfer per unit of time.', example: 'The chips access a staggering amount of shared High Bandwidth Memory.' },
  { term: 'interconnect', ipa: '/ˌɪntərkəˈnekt/', cat: 'Infra/Systems', zh: '互连（网络）：芯片/节点之间的高速连接', def: 'The high-speed links between chips or nodes.', example: 'The chips are linked via a breakthrough Inter-Chip Interconnect network.' },
  { term: 'accelerator', ipa: '/əkˈseləreɪtər/', cat: 'Infra/Systems', zh: '加速器：GPU/TPU 等专用 AI 计算芯片', def: 'Specialized AI compute chips such as GPUs and TPUs.', example: 'Training runs on thousands of accelerators working in parallel.' },
  { term: 'custom silicon', ipa: '/ˈkʌstəm ˈsɪlɪkən/', cat: 'Infra/Systems', zh: '定制芯片：为公司自身工作负载专门设计的芯片', def: 'Chips designed in-house for a company\u2019s own workloads.', example: 'Ironwood is our most powerful and energy-efficient custom silicon to date.' },
  { term: 'datacenter', ipa: '/ˈdeɪtəsentər/', cat: 'Infra/Systems', zh: '数据中心', def: 'A facility housing compute and storage infrastructure.', example: 'We are expanding datacenter capacity ahead of the inference wave.' },
  { term: 'cluster', ipa: '/ˈklʌstər/', cat: 'Infra/Systems', zh: '集群：一组协同工作的机器', def: 'A group of machines working together.', example: 'The job was scheduled on a cluster of 512 accelerators.' },
  { term: 'energy efficiency', ipa: '/ˈenərdʒi ɪˈfɪʃənsi/', cat: 'Infra/Systems', zh: '能效：单位计算所消耗的能源', def: 'The energy consumed per unit of computation.', example: 'Compared to our first TPU, Ironwood achieves 3,600 times better performance and is 29 times more energy efficient.' },
  { term: 'observability', ipa: '/əbˌzɜːrvəˈbɪləti/', cat: 'Infra/Systems', zh: '可观测性：通过指标/日志/追踪洞察系统内部状态', def: 'Insight into system internals via metrics, logs, and traces.', example: 'Observability tooling helped us trace the latency regression to a single microservice.' },
  { term: 'bottleneck', ipa: '/ˈbɑːtəlnek/', cat: 'Infra/Systems', zh: '瓶颈：限制整体性能的最慢环节', def: 'The slowest stage that limits overall performance.', example: 'This architecture overcomes data bottlenecks for even the most demanding models.' },
  // --- Business ---
  { term: 'go-to-market', ipa: '/ɡoʊ tə ˈmɑːrkɪt/', cat: 'Business', zh: '上市策略（GTM）：产品进入市场并触达客户的策略', def: 'The strategy for launching a product and reaching customers.', example: 'Our go-to-market for the new API focuses on developer-first adoption.' },
  { term: 'total cost of ownership', ipa: '/ˈtoʊtəl kɔːst əv oʊnərʃɪp/', cat: 'Business', zh: '总拥有成本（TCO）：采购+运维的全生命周期成本', def: 'The full lifecycle cost of buying and operating something.', example: 'Custom silicon lowers the total cost of ownership at scale.' },
  { term: 'return on investment', ipa: '/rɪˈtɜːrn ɑːn ɪnˈvestmənt/', cat: 'Business', zh: '投资回报率（ROI）', def: 'The gain generated relative to the money invested.', example: 'The migration paid for itself; the ROI was evident within two quarters.' },
  { term: 'unit economics', ipa: '/ˈjuːnɪt ˌiːkəˈnɑːmɪks/', cat: 'Business', zh: '单位经济学：每单/每请求粒度的收入与成本结构', def: 'Revenue and cost structure at a per-unit level.', example: 'Inference cost per token is the key number in our unit economics.' },
  { term: 'stakeholder', ipa: '/ˈsteɪkhoʊldər/', cat: 'Business', zh: '利益相关方：项目或决策涉及的各方角色', def: 'Anyone with a stake in a project or decision.', example: 'We gathered feedback from stakeholders across engineering and sales.' },
  { term: 'roadmap', ipa: '/ˈroʊdmæp/', cat: 'Business', zh: '路线图：产品/技术演进的阶段规划', def: 'A staged plan for how a product or technology will evolve.', example: 'Here is our infrastructure roadmap for the next eighteen months.' },
  { term: 'value proposition', ipa: '/ˈvæljuː ˌprɑːpəˈzɪʃən/', cat: 'Business', zh: '价值主张：产品为客户创造的核心价值概括', def: 'A summary of the core value a product creates for customers.', example: 'Our value proposition is simple: frontier intelligence at mid-tier cost.' },
  { term: 'competitive advantage', ipa: '/kəmˈpetətɪv ədˈvæntɪdʒ/', cat: 'Business', zh: '竞争优势', def: 'What allows you to outperform competitors.', example: 'Designing our own chips is a durable competitive advantage.' },
  { term: 'monetization', ipa: '/ˌmɑːnətaɪˈzeɪʃən/', cat: 'Business', zh: '变现/商业化：把产品或流量转化为收入', def: 'Converting a product or traffic into revenue.', example: 'Usage-based monetization aligns pricing with the value customers receive.' },
  { term: 'enterprise', ipa: '/ˈentərpraɪz/', cat: 'Business', zh: '企业级（客户/市场）', def: 'Large organizations as a customer segment.', example: 'Enterprise customers demand strict data residency and audit logs.' },
  { term: 'adoption', ipa: '/əˈdɑːpʃən/', cat: 'Business', zh: '采用率：用户开始使用产品的程度与速度', def: 'The degree and speed at which users start using a product.', example: 'API adoption doubled after we cut prices by 60%.' },
  { term: 'pricing model', ipa: '/ˈpraɪsɪŋ ˈmɑːdəl/', cat: 'Business', zh: '定价模式', def: 'How a product is priced.', example: 'The pricing model is three dollars per million input tokens.' },
  { term: 'churn', ipa: '/tʃɜːrn/', cat: 'Business', zh: '流失（率）：客户停止使用/订阅的比例', def: 'The rate at which customers stop using or subscribing.', example: 'Usage-based billing reduced churn among small teams.' },
  { term: 'scale', ipa: '/skeɪl/', cat: 'Business', zh: '规模：at scale 指大规模运行', def: 'Size of operation; "at scale" means running at large size.', example: 'Serving a billion users means thinking about efficiency at scale.' },
  { term: 'tradeoff', ipa: '/ˈtreɪdɔːf/', cat: 'Business', zh: '权衡：为获得一方好处而牺牲另一方', def: 'Giving up one thing to gain another.', example: 'Our aim is to improve the tradeoff curve between intelligence, speed, and cost.' },
  { term: 'state of the art', ipa: '/ˌsteɪt əv ðə ˈɑːrt/', cat: 'Business', zh: '最先进的（当前最佳水平），作形容词时加连字符', def: 'The current best level of performance; hyphenated when used as an adjective.', example: 'This is our state-of-the-art vision model.' },
  { term: 'moat', ipa: '/moʊt/', cat: 'Business', zh: '护城河：保护业务的持久结构性优势', def: 'A durable structural advantage that protects a business.', example: 'Owning the full stack from silicon to models is a deep moat.' }
];

/* ============ 演讲句型库 ============ */
const PATTERNS = [
  {
    category: '开场与议程',
    items: [
      { name: '总览式开场', template: "Today, I'm going to walk you through {整体内容}.", note: 'walk sb through 比 introduce 更有"手把手讲解"的画面感，是技术演讲最常用的开场动词。',
        examples: [
          { en: "Today, I'm going to walk you through the architecture of our new inference platform.", zh: '今天，我将带大家了解我们新推理平台的架构。' },
          { en: "I'm going to walk you through three key improvements in this release.", zh: '我将带大家了解本次发布的三个关键改进。' }
        ] },
      { name: '背景铺垫', template: "Let me start by giving you some context on {背景话题}.", note: '先给 context 再讲方案，是技术分享的经典节奏，避免听众迷失在细节里。',
        examples: [
          { en: "Let me start by giving you some context on why we built a custom chip in the first place.", zh: '首先介绍一下背景：我们为什么要自己做芯片。' },
          { en: "Before diving into the details, let me give you some context on our scale.", zh: '在深入细节之前，先说说我们的规模背景。' }
        ] },
      { name: '议程预告', template: "Here's what we'll cover in the next {时长}: {要点列表}.", note: '明确告知议程，让听众有预期；口语中 cover 比 discuss 更自然。',
        examples: [
          { en: "Here's what we'll cover in the next twenty minutes: the problem, our approach, and the results.", zh: '接下来二十分钟我们会讲三部分：问题、方法和结果。' }
        ] }
    ]
  },
  {
    category: '发布与宣布',
    items: [
      { name: '旗舰发布句', template: "Today, we're launching {产品} — our most {形容词} {品类} to date.", note: '"our most … to date" 是发布会宣告"史上最强"的标准句式，注意 to date 连读。',
        examples: [
          { en: "Today, we're launching Claude 3.5 Sonnet — our most intelligent model to date.", zh: '今天我们发布 Claude 3.5 Sonnet——迄今为止我们最智能的模型。' },
          { en: "I'm excited to announce that Ironwood is now generally available to Cloud customers.", zh: '我很高兴地宣布 Ironwood 现已向云客户正式开放。' }
        ] },
      { name: '提升门槛', template: "{产品} raises the bar for {领域}.", note: 'raise the bar 提高行业标准，发布会和 benchmark 讨论都高频出现。',
        examples: [
          { en: "Claude 3.5 Sonnet raises the industry bar for intelligence.", zh: 'Claude 3.5 Sonnet 提升了行业智能的标准。' },
          { en: "This release raises the bar for open-source models everywhere.", zh: '这次发布为整个开源模型领域树立了新标杆。' }
        ] },
      { name: '里程碑叙述', template: "This marks {a/the} {里程碑描述} in {领域}.", note: 'marks a milestone / marks our evolution from A to B，用于叙事转折点。',
        examples: [
          { en: "This marks a significant step toward artificial general intelligence.", zh: '这是迈向通用人工智能的重要一步。' },
          { en: "This preview feature marks Claude's evolution from a conversational AI to a collaborative work environment.", zh: '这一预览功能标志着 Claude 从对话式 AI 向协作式工作环境的进化。' }
        ] }
    ]
  },
  {
    category: '描述架构',
    items: [
      { name: '核心构成', template: "At its core, the system consists of {组成部分}.", note: 'At its core 引出最关键部分；consists of 注意重音在第二音节 -SISTS。',
        examples: [
          { en: "At its core, the system consists of a scheduler, a fleet of workers, and a shared metadata store.", zh: '系统核心由调度器、一组工作节点和共享元数据存储组成。' },
          { en: "The AI Hypercomputer is composed of compute, networking, storage, and software layers.", zh: 'AI 超级计算机由计算、网络、存储和软件四层组成。' }
        ] },
      { name: '分层/构建于', template: "{A} is built on top of {B}, which allows us to {能力}.", note: '"built on top of" 是描述技术栈叠层的万能句；which 从句顺势引出好处。',
        examples: [
          { en: "The agent is built on top of Gemini, which allows it to reason about high-level goals.", zh: '该智能体构建于 Gemini 之上，因此能围绕高层目标进行推理。' },
          { en: "Our serving stack is built on top of Kubernetes, which allows us to autoscale with traffic.", zh: '我们的服务栈构建在 Kubernetes 之上，从而能随流量自动扩缩容。' }
        ] },
      { name: '数据流描述', template: "Data flows from {A} through {B} into {C}.", note: '讲架构图时的导览句式：flows / passes / gets piped through，配合手势指向图。',
        examples: [
          { en: "Requests flow from the edge through the load balancer into our inference fleet.", zh: '请求从边缘节点经过负载均衡器进入我们的推理集群。' }
        ] }
    ]
  },
  {
    category: '性能与指标',
    items: [
      { name: '倍数提升', template: "It delivers a {倍数/%} improvement in {指标} over {基准}.", note: '数字是英文演讲的重灾区：2x 读 two times / twofold，4X 读 four x，注意 9,216 读 nine thousand two hundred sixteen。',
        examples: [
          { en: "It offers more than 4X better performance per chip compared to our last generation.", zh: '与上一代相比，单芯片性能提升超过 4 倍。' },
          { en: "We measured a 2x reduction in latency under production workloads.", zh: '在生产负载下我们测得延迟降低了一半。' }
        ] },
      { name: '对比参照', template: "To put that in perspective, {通俗对比}.", note: '甩出大数字后用这句给听众一个"锚"，是高级演讲技巧。',
        examples: [
          { en: "To put that in perspective, that's like shrinking a two-hour flight to sixty seconds.", zh: '打个比方，这相当于把两小时的飞行缩短到六十秒。' },
          { en: "To put that in perspective, a single pod delivers 42.5 exaflops of compute.", zh: '直观一点说，单个 pod 就能提供 42.5 exaflops 的算力。' }
        ] },
      { name: '设立基准', template: "{产品} sets a new benchmark for {能力维度}.", note: 'sets a new benchmark / sets new industry benchmarks，发布与评测场景通用。',
        examples: [
          { en: "Claude 3.5 Sonnet sets new industry benchmarks for graduate-level reasoning.", zh: 'Claude 3.5 Sonnet 在研究生级推理上创造了新的行业基准。' }
        ] }
    ]
  },
  {
    category: '对比与权衡',
    items: [
      { name: '核心权衡', template: "The key tradeoff here is between {A} and {B}.", note: '技术决策的灵魂句式；between A and B 注意 and 弱读 /ən/。',
        examples: [
          { en: "The key tradeoff here is between latency and throughput.", zh: '这里的核心权衡是延迟与吞吐量。' },
          { en: "The key tradeoff is between intelligence, speed, and cost.", zh: '关键在于智能、速度与成本之间的权衡。' }
        ] },
      { name: '让步转折', template: "While {A} excels at {场景}, it comes at the cost of {代价}.", note: 'While 引导让步从句注意不要降调太早，整句重心落在主句。',
        examples: [
          { en: "While batching boosts throughput, it comes at the cost of tail latency.", zh: '批处理虽然提升吞吐，但代价是尾延迟上升。' },
          { en: "While larger models excel at reasoning, they come at the cost of serving efficiency.", zh: '更大的模型推理更强，但牺牲了服务效率。' }
        ] },
      { name: '代际对比', template: "Compared to the previous generation, {产品} offers {改进点}.", note: 'compared to 连读 /kəmˈpeərd tə/，重音在 -PARED。',
        examples: [
          { en: "Compared to the previous generation, Ironwood is our most energy-efficient custom silicon to date.", zh: '与上一代相比，Ironwood 是我们迄今能效最高的定制芯片。' }
        ] }
    ]
  },
  {
    category: '方法与原理',
    items: [
      { name: '一句话原理', template: "The idea behind {方案} is simple: {核心思想}.", note: '"The idea is simple" 后接冒号停顿，再慢速讲核心思想——节奏感极强。',
        examples: [
          { en: "The idea behind speculative decoding is simple: let a small model draft, and a large model verify.", zh: '投机解码的思想很简单：小模型起草，大模型验证。' },
          { en: "The idea behind our approach is simple: co-design the model and the chip together.", zh: '我们方法的思路很简单：模型与芯片协同设计。' }
        ] },
      { name: '实现路径', template: "We achieved this by {做法}.", note: 'by + 动名词讲手段；achieved 注意 /əˈtʃiːvd/ 中 -chieved 的长元音。',
        examples: [
          { en: "We achieved this by combining human demonstrations with model-generated labels.", zh: '我们通过将人类示范与模型生成的标注相结合实现了这一点。' },
          { en: "We achieved this by grouping TPUs into tightly interconnected pods.", zh: '我们通过将 TPU 组成紧密互连的 pod 实现了这一点。' }
        ] },
      { name: '反常规选择', template: "Instead of {常规做法}, we chose to {我们的做法}.", note: '讲创新点必备：先说别人怎么做，再亮出自己的不同选择。',
        examples: [
          { en: "Instead of relying on external vendors, we chose to design our own silicon.", zh: '我们没有依赖外部供应商，而是选择自己设计芯片。' },
          { en: "Instead of scaling the model, we chose to scale the system around it.", zh: '我们选择的不是扩大模型，而是扩大围绕模型的系统。' }
        ] }
    ]
  },
  {
    category: '谈论规模',
    items: [
      { name: '规模放大效应', template: "At our scale, even a {小数字} improvement translates to {大影响}.", note: 'translates to 表示"转化为（收益）"，商业演讲高频。',
        examples: [
          { en: "At our scale, even a 1% improvement in efficiency translates to millions of dollars in savings.", zh: '在我们的规模下，能效哪怕提升 1%，就意味着数百万美元的节省。' },
          { en: "At Google's scale, small architectural wins compound into massive savings.", zh: '在谷歌的规模下，小的架构优化会复利式地累积成巨大收益。' }
        ] },
      { name: '量级陈述', template: "We process {量级} every day, which means {推论}.", note: 'billions of requests / petabytes of data，注意 -s 复数不能吞掉。',
        examples: [
          { en: "We process billions of requests every day, which means reliability is a feature, not an afterthought.", zh: '我们每天处理数十亿请求，这意味着可靠性本身就是功能，而非事后补充。' }
        ] }
    ]
  },
  {
    category: '商业价值',
    items: [
      { name: '价值转化', template: "This translates into {具体收益} for our customers.", note: '技术 → 商业价值的翻译句，对商业听众尤其重要。',
        examples: [
          { en: "This translates into significant cost savings for our customers.", zh: '这为我们的客户带来了可观的成本节省。' },
          { en: "This performance boost translates into faster response times and lower serving costs.", zh: '性能提升带来了更快的响应速度和更低的服务成本。' }
        ] },
      { name: '三段式影响', template: "The business impact is threefold: first, {A}; second, {B}; and third, {C}.", note: 'threefold 读 /ˈθriːfoʊld/；用 first/second/third 显式编号，听众跟得上。',
        examples: [
          { en: "The business impact is threefold: faster time-to-market, lower costs, and happier customers.", zh: '商业影响有三点：更快上市、更低成本、更满意的客户。' }
        ] },
      { name: '客户视角', template: "What this means for our customers is {一句话结论}.", note: '把技术细节收束成一句客户听得懂的话，是技术转商业表达的关键动作。',
        examples: [
          { en: "What this means for our customers is simple: frontier intelligence at mid-tier cost.", zh: '对我们的客户来说，这意味着：前沿智能、中端成本。' }
        ] }
    ]
  },
  {
    category: '展望与收尾',
    items: [
      { name: '展望规划', template: "Looking ahead, we plan to {下一步}.", note: 'Looking ahead 是收尾转展望的标准过渡语，注意 looking 的 -ing 不要吞音。',
        examples: [
          { en: "Looking ahead, we plan to complete the model family later this year.", zh: '展望未来，我们计划在今年晚些时候补齐全系列模型。' },
          { en: "Looking ahead, we'll focus on agentic workloads and multimodal experiences.", zh: '接下来，我们将聚焦智能体负载与多模态体验。' }
        ] },
      { name: '愿景收束', template: "This is just the beginning of {更大的方向}.", note: '发布会结尾金句；just 弱读，beginning 双写 n 重音在第二音节。',
        examples: [
          { en: "This is just the beginning of a broader vision for collaborative AI.", zh: '这只是协作式 AI 更大愿景的开始。' },
          { en: "This is just the beginning of the age of inference.", zh: '这只是推理时代的开端。' }
        ] },
      { name: '金句收尾', template: "Let me leave you with one thought: {核心观点}.", note: '演讲结尾留一句值得回味的话；说之前放慢语速、目光扫视全场。',
        examples: [
          { en: "Let me leave you with one thought: the best infrastructure is the one you never have to think about.", zh: '最后送给大家一句话：最好的基础设施，是你永远无需为之操心的基础设施。' }
        ] }
    ]
  },
  {
    category: 'Q&A 应对',
    items: [
      { name: '接住问题', template: "That's a great question — let me address it in two parts.", note: '先肯定问题再拆分回答，为自己争取思考时间；两段式回答显专业。',
        examples: [
          { en: "That's a great question — let me address it in two parts: the short answer, and the nuances.", zh: '这个问题很好——我分两部分回答：简短版和细节版。' }
        ] },
      { name: '极简解释', template: "To put it simply, {一句话解释}.", note: '被问到复杂技术时，先给一句话版本再问是否展开，避免听众掉线。',
        examples: [
          { en: "To put it simply, we let the chip and the model grow up together.", zh: '简单说，我们让芯片和模型一起"长大"。' },
          { en: "To put it simply, the TPU is a calculator built for exactly one kind of math.", zh: '简单说，TPU 就是为一种数学量身定制的计算器。' }
        ] },
      { name: '诚实边界', template: "That's outside my area of expertise, but my understanding is {所知部分}.", note: '不懂就承认 + 给出部分所知，比硬编可靠得多，也是英文 Q&A 的礼貌惯例。',
        examples: [
          { en: "That's outside my area of expertise, but my understanding is that the next generation is already in the pipeline.", zh: '这超出我的专业范围，但据我所知下一代已经在规划中了。' }
        ] }
    ]
  }
];

/* ============ 句段库（整段朗读素材） ============ */
const PARAGRAPHS = [
  {
    id: 'launch-open',
    theme: '产品发布开场',
    difficulty: 'Intermediate',
    wpmTarget: 130,
    sourceNote: '节选自 Anthropic · Claude 3.5 Sonnet',
    focus: "重音落在 launching / intelligence / evaluations；'3.5' 读 three point five；注意 we're 弱读为 /wɪr/。",
    text: "Today, we're launching Claude 3.5 Sonnet — our first release in the forthcoming Claude 3.5 model family. Claude 3.5 Sonnet raises the industry bar for intelligence, outperforming competitor models on a wide range of evaluations."
  },
  {
    id: 'benchmarks',
    theme: '性能基准陈述',
    difficulty: 'Intermediate',
    wpmTarget: 135,
    sourceNote: '节选自 Anthropic · Claude 3.5 Sonnet',
    focus: 'benchmark / reasoning / proficiency 三连术语要清晰断开；marked improvement 中 marked 读 /ˈmɑːrkɪd/。',
    text: "Claude 3.5 Sonnet sets new industry benchmarks for graduate-level reasoning, undergraduate-level knowledge, and coding proficiency. It shows marked improvement in grasping nuance, humor, and complex instructions."
  },
  {
    id: 'tpu-scale',
    theme: '基础设施规模',
    difficulty: 'Advanced',
    wpmTarget: 125,
    sourceNote: '节选自 Google Cloud · Ironwood TPU',
    focus: "数字读法是本段核心：9,216 = nine thousand, two hundred sixteen；9.6 Tb/s = nine point six terabits per second；1.77 PB = one point seven seven petabytes。",
    text: "With Ironwood, we can scale up to 9,216 chips in a superpod. These chips are linked via a breakthrough Inter-Chip Interconnect network operating at 9.6 terabits per second, and they can access 1.77 petabytes of shared High Bandwidth Memory."
  },
  {
    id: 'parallel-processor',
    theme: '硬件原理解释',
    difficulty: 'Advanced',
    wpmTarget: 120,
    sourceNote: '节选自 Google Cloud · Ironwood TPU',
    focus: '长句换气点：processor 后、chip 后各停一次；hugely efficient 连读；significantly 出现两次，保持一致重音 /sɪɡˈnɪfɪkəntli/。',
    text: "By acting as a hugely efficient parallel processor, Ironwood excels at managing massive calculations and significantly minimizes the internal time required for data to shuttle across the chip. This breakthrough dramatically speeds up complex AI."
  },
  {
    id: 'safety-privacy',
    theme: '安全与责任',
    difficulty: 'Intermediate',
    wpmTarget: 128,
    sourceNote: '节选自 Anthropic · Claude 3.5 Sonnet',
    focus: 'rigorous 读 /ˈrɪɡərəs/ 三音节；constitutional principles 两个多音节词连读注意清晰度；privacy /ˈpraɪvəsi/ 重音在第一音节。',
    text: "Our models are subjected to rigorous testing and have been trained to reduce misuse. One of the core constitutional principles that guides our AI model development is privacy. We do not train our generative models on user-submitted data unless a user gives us explicit permission to do so."
  },
  {
    id: 'agent-evolution',
    theme: '智能体演进叙事',
    difficulty: 'Advanced',
    wpmTarget: 128,
    sourceNote: '节选自 Google DeepMind · SIMA 2',
    focus: 'evolving from A into B 的 into 要连读；instruction-follower 复合词中间停顿极短；gaming companion 是"游戏伙伴"。',
    text: "By integrating the advanced capabilities of our Gemini models, SIMA is evolving from an instruction-follower into an interactive gaming companion. Not only can it follow human-language instructions in virtual worlds, it can now also think about its goals and improve itself over time."
  },
  {
    id: 'generalization',
    theme: '研究洞察',
    difficulty: 'Advanced',
    wpmTarget: 122,
    sourceNote: '节选自 Google DeepMind · SIMA 2',
    focus: '破折号插入语 — for instance — 前后要有明显停顿；foundational to 的 to 弱读；human cognition 结尾降调收束。',
    text: "Its capacity to transfer learned concepts — for instance, taking its understanding of mining in one game and applying it to harvesting in another — is foundational to achieving the kind of broad generalization seen in human cognition."
  },
  {
    id: 'business-pricing',
    theme: '商业与定价',
    difficulty: 'Intermediate',
    wpmTarget: 132,
    sourceNote: '改写自 Anthropic · Claude 3.5 Sonnet 定价信息',
    focus: "$3 per million 读 three dollars per million；combined with 连读；ideal for 后接复数任务时语速可稍加快。",
    text: "This model operates at twice the speed of our largest model. This performance boost, combined with cost-effective pricing, makes it ideal for complex tasks such as context-sensitive customer support and orchestrating multi-step workflows. The model costs three dollars per million input tokens."
  },
  {
    id: 'ai-with-ai',
    theme: '研究闭环故事',
    difficulty: 'Advanced',
    wpmTarget: 126,
    sourceNote: '节选自 Google Cloud · Ironwood TPU',
    focus: 'continuous loop 讲"闭环"时的核心搭配；a method called AlphaChip 用同位语节奏；reinforcement learning 重音在 -FORCE- 和 -LEARN-。',
    text: "Ironwood is the result of a continuous loop at Google where researchers influence hardware design, and hardware accelerates research. Our researchers even use AI to design the next chip generation — a method called AlphaChip — which has used reinforcement learning to generate superior layouts for the last three TPU generations."
  },
  {
    id: 'closing-cta',
    theme: '收尾与呼吁',
    difficulty: 'Basic',
    wpmTarget: 130,
    sourceNote: '根据演讲惯例撰写的通用收尾',
    focus: '收尾段要刻意放慢；Let me leave you with one thought 之后停顿一拍再讲金句；beginning 重音在第二音节。',
    text: "Looking ahead, we'll keep pushing the frontier of what these systems can do. This is just the beginning. Let me leave you with one thought: the best technology is the one that disappears into your workflow. Thank you."
  }
];

/* 术语快速索引 */
const GLOSSARY_MAP = {};
GLOSSARY.forEach(g => { GLOSSARY_MAP[g.term.toLowerCase()] = g; });
