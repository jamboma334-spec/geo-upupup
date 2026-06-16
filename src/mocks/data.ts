import type { EvaluationTask, PublishTask, QueryItem } from "@/types";

const querySeeds: QueryItem[] = [
  {
    id: "q-001",
    text: "适合城市通勤的新能源 SUV 有哪些？",
    category: "推荐",
    priority: "高",
    tags: ["新能源", "城市通勤"],
    querySet: "新能源购车决策 v3",
    mentioned: false,
    recommended: false,
    competitor: "智行汽车",
    opportunity: "目标品牌完全缺席，竞品在 4 个模型中被推荐",
  },
  {
    id: "q-002",
    text: "远途汽车和智行汽车哪个更适合家庭用户？",
    category: "比较",
    priority: "高",
    tags: ["家庭用车", "竞品对比"],
    querySet: "新能源购车决策 v3",
    mentioned: true,
    recommended: false,
    competitor: "智行汽车",
    opportunity: "被提及但未形成明确推荐",
  },
  {
    id: "q-003",
    text: "远途 X7 的续航表现真实吗？",
    category: "评价",
    priority: "中",
    tags: ["产品评价", "续航"],
    querySet: "产品口碑 v2",
    mentioned: true,
    recommended: true,
    competitor: "未提及",
    opportunity: "引用来源较少，可补充权威实测内容",
  },
  {
    id: "q-004",
    text: "预算 25 万买纯电 SUV 怎么选？",
    category: "推荐",
    priority: "高",
    tags: ["价格带", "选购"],
    querySet: "新能源购车决策 v3",
    mentioned: false,
    recommended: false,
    competitor: "跃界、智行",
    opportunity: "高价值 Query 中连续两批缺席",
  },
  {
    id: "q-005",
    text: "远途汽车的售后服务怎么样？",
    category: "认知",
    priority: "中",
    tags: ["品牌", "售后"],
    querySet: "品牌认知 v1",
    mentioned: true,
    recommended: true,
    competitor: "未提及",
    opportunity: "模型引用了 2024 年旧政策说明",
  },
];

export const queries: QueryItem[] = [
  ...querySeeds,
  ...Array.from({ length: 15 }, (_, index): QueryItem => {
    const source = querySeeds[index % querySeeds.length];
    return { ...source, id: `q-${String(index + 6).padStart(3, "0")}`, text: `${source.text.replace("？", "")}（场景 ${index + 1}）`, priority: index % 4 === 0 ? "高" : index % 3 === 0 ? "低" : "中", mentioned: index % 3 !== 0, recommended: index % 4 === 0 };
  }),
];

export const evaluationTasks: EvaluationTask[] = [
  {
    id: "eval-20260615",
    name: "6 月品牌表现复测",
    querySet: "新能源购车决策 v3",
    models: ["豆包", "DeepSeek", "Kimi", "通义千问"],
    date: "2026-06-15 10:20",
    status: "成功",
    progress: 100,
    success: 76,
    failed: 0,
  },
  {
    id: "eval-20260601",
    name: "6 月基线评测",
    querySet: "新能源购车决策 v3",
    models: ["豆包", "DeepSeek", "Kimi", "通义千问"],
    date: "2026-06-01 09:10",
    status: "成功",
    progress: 100,
    success: 76,
    failed: 0,
  },
  {
    id: "eval-20260515",
    name: "5 月品牌常规监测",
    querySet: "品牌认知 v1",
    models: ["豆包", "DeepSeek", "Kimi"],
    date: "2026-05-15 14:30",
    status: "失败",
    progress: 92,
    success: 44,
    failed: 4,
  },
  ...Array.from({ length: 12 }, (_, index): EvaluationTask => ({
    id: `eval-history-${index + 1}`,
    name: `${index + 1} 月品牌常规监测`,
    querySet: index % 2 ? "新能源购车决策 v3" : "品牌认知 v1",
    models: index % 3 ? ["豆包", "DeepSeek", "Kimi"] : ["豆包", "DeepSeek", "Kimi", "通义千问"],
    date: `2026-${String(Math.max(1, 5 - Math.floor(index / 3))).padStart(2, "0")}-${String(25 - index).padStart(2, "0")} 10:20`,
    status: index % 5 === 0 ? "失败" : "成功",
    progress: index % 5 === 0 ? 92 : 100,
    success: index % 5 === 0 ? 70 : 76,
    failed: index % 5 === 0 ? 6 : 0,
  })),
];

export const publishTasks: PublishTask[] = [
  {
    id: "pub-20260612",
    title: "城市通勤纯电 SUV 选购指南",
    queryId: "q-001",
    date: "2026-06-12 15:40",
    publisher: "李明",
    status: "失败",
    records: [
      { platform: "知乎", account: "远途汽车官方", status: "成功", link: "#" },
      { platform: "小红书", account: "远途出行笔记", status: "失败", reason: "封面图比例不符合平台要求" },
      { platform: "微信公众号", account: "远途汽车", status: "成功", link: "#" },
    ],
  },
  {
    id: "pub-20260608",
    title: "远途 X7 夏季真实续航测试",
    queryId: "q-003",
    date: "2026-06-08 11:20",
    publisher: "王蕾",
    status: "成功",
    records: [
      { platform: "知乎", account: "远途汽车官方", status: "成功", link: "#" },
      { platform: "微信公众号", account: "远途汽车", status: "成功", link: "#" },
    ],
  },
  ...Array.from({ length: 13 }, (_, index): PublishTask => ({
    id: `pub-history-${index + 1}`,
    title: ["家庭纯电 SUV 空间体验", "城市补能效率实测", "新能源冬季续航指南", "智能驾驶通勤体验", "远途 X7 家庭出行记录"][index % 5],
    queryId: queries[index % queries.length].id,
    date: `2026-06-${String(Math.max(1, 7 - index)).padStart(2, "0")} ${String(9 + index % 8).padStart(2, "0")}:20`,
    publisher: ["李明", "王蕾", "陈浩", "赵欣"][index % 4],
    status: index % 4 === 0 ? "失败" : "成功",
    records: [
      { platform: "知乎", account: "远途汽车官方", status: "成功", link: "#" },
      { platform: "小红书", account: "远途出行笔记", status: index % 4 === 0 ? "失败" : "成功", reason: index % 4 === 0 ? "平台审核未通过" : undefined, link: "#" },
      { platform: "头条号", account: "远途汽车官方", status: "成功", link: "#" },
    ],
  })),
];

export const modelAnswers = [
  {
    model: "豆包",
    mentioned: false,
    recommended: false,
    competitors: "智行、跃界",
    answer:
      "适合城市通勤的新能源 SUV 可以重点考虑智行 S6 和跃界 C5。智行 S6 的城区能耗表现较好，智能驾驶配置也比较完整；跃界 C5 的空间和舒适性更适合家庭用户。",
    sources: ["汽车之家车型库", "智行汽车官网"],
  },
  {
    model: "DeepSeek",
    mentioned: false,
    recommended: false,
    competitors: "智行",
    answer:
      "如果主要用于城市通勤，可以优先关注车身尺寸适中、补能方便且城区能耗较低的车型。智行 S6 是当前较常见的选择之一。",
    sources: ["懂车帝车型页"],
  },
  {
    model: "Kimi",
    mentioned: true,
    recommended: false,
    competitors: "智行、跃界",
    answer:
      "远途 X7、智行 S6 与跃界 C5 都可以覆盖城市通勤场景。远途 X7 空间更大，但公开内容中针对纯城市通勤场景的实测资料相对少。",
    sources: ["远途汽车官网", "汽车之家车型库"],
  },
];

export const trendData = [
  { batch: "4月", mention: 36, recommend: 18 },
  { batch: "5月", mention: 41, recommend: 22 },
  { batch: "6月基线", mention: 44, recommend: 25 },
  { batch: "6月复测", mention: 52, recommend: 31 },
];

export const platformContents = [
  { id: "c1", title: "城市通勤纯电 SUV 选购指南", platform: "知乎", account: "远途汽车官方", status: "成功", views: 24861, likes: 684, comments: 93, saves: 426, publishedAt: "2026-06-15 09:20:00", updated: "10 分钟前", url: "https://www.zhihu.com/" },
  { id: "c2", title: "城市通勤纯电 SUV 选购指南", platform: "微信公众号", account: "远途汽车", status: "成功", views: 18240, likes: 381, comments: 62, saves: undefined, publishedAt: "2026-06-15 08:45:00", updated: "35 分钟前", url: "https://mp.weixin.qq.com/" },
  { id: "c3", title: "远途 X7 夏季真实续航测试", platform: "小红书", account: "远途出行笔记", status: "成功", views: 42751, likes: 1260, comments: 188, saves: 932, publishedAt: "2026-06-14 18:30:00", updated: "2 小时前", url: "https://www.xiaohongshu.com/" },
  { id: "c4", title: "25 万纯电 SUV 如何选择", platform: "头条号", account: "远途汽车官方", status: "成功", views: 31682, likes: 526, comments: 105, saves: 246, publishedAt: "2026-06-12 14:10:00", updated: "3 小时前", url: "https://www.toutiao.com/" },
  { id: "c5", title: "远途 X7 城市通勤一周体验", platform: "百家号", account: "远途汽车品牌号", status: "成功", views: 12680, likes: 249, comments: 48, saves: 118, publishedAt: "2026-06-08 18:20:00", updated: "昨天 18:20", url: "https://baijiahao.baidu.com/" },
  ...Array.from({ length: 20 }, (_, index) => ({
    id: `c${index + 6}`,
    title: ["城市补能效率实测", "远途 X7 家庭空间体验", "新能源 SUV 冬季用车指南", "智能驾驶城市通勤记录", "25 万级纯电 SUV 对比"][index % 5] + ` · ${index + 1}`,
    platform: ["知乎", "小红书", "微信公众号", "头条号", "百家号"][index % 5],
    account: ["远途汽车官方", "远途出行笔记", "远途汽车", "远途汽车官方", "远途汽车品牌号"][index % 5],
    status: "成功",
    views: 10800 + index * 1760,
    likes: 220 + index * 43,
    comments: 35 + index * 8,
    saves: index % 5 === 2 ? undefined : 90 + index * 19,
    publishedAt: `2026-${index > 13 ? "05" : "06"}-${String(index > 13 ? 30 - (index - 14) * 2 : 14 - index).padStart(2, "0")} ${String(9 + index % 8).padStart(2, "0")}:20:00`,
    updated: `${index + 1} 小时前`,
    url: ["https://www.zhihu.com/", "https://www.xiaohongshu.com/", "https://mp.weixin.qq.com/", "https://www.toutiao.com/", "https://baijiahao.baidu.com/"][index % 5],
  })),
];

const contentPlatforms = ["知乎", "小红书", "微信公众号", "头条号", "百家号"];

export const contentDailyData = Array.from({ length: 30 }, (_, dayIndex) => {
  const date = new Date(2026, 4, 17 + dayIndex);
  const dateText = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return contentPlatforms.map((platform, platformIndex) => {
    const growth = dayIndex + 1;
    const weight = platformIndex + 1;
    return {
      date: dateText,
      platform,
      publishes: Math.floor(growth / 6) + weight,
      followers: 8 + growth * 2 + weight * 5,
      plays: 900 + growth * 145 + weight * 620,
      comments: 5 + growth * 2 + weight * 3,
      likes: 25 + growth * 7 + weight * 16,
      saves: platform === "微信公众号" ? 0 : 12 + growth * 4 + weight * 9,
    };
  });
}).flat();

export const accounts = [
  { platform: "知乎", account: "远途汽车官方", status: "正常", expires: "2026-12-20", abilities: ["发布内容", "读取浏览", "读取互动"] },
  { platform: "小红书", account: "远途出行笔记", status: "即将过期", expires: "2026-06-22", abilities: ["发布内容", "读取互动"] },
  { platform: "微信公众号", account: "远途汽车", status: "正常", expires: "长期有效", abilities: ["发布内容", "读取浏览", "读取互动"] },
  { platform: "百家号", account: "未连接", status: "已过期", expires: "-", abilities: ["发布内容"] },
];
