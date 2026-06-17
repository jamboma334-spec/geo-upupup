export const brandProfiles = [
  { name: "远途汽车", role: "目标品牌", site: "yuantu-auto.example.com", aliases: ["远途", "远途 Auto", "Yuantu", "远途新能源"], products: 5, status: "正常" },
  { name: "智行汽车", role: "核心竞品", site: "zhixing.example.com", aliases: ["智行", "智行 Auto", "Zhixing"], products: 6, status: "正常" },
  { name: "跃界汽车", role: "核心竞品", site: "yuejie.example.com", aliases: ["跃界", "跃界 Auto"], products: 4, status: "正常" },
];

export const productProfiles = [
  { name: "远途 X7", brand: "远途汽车", segment: "中型纯电 SUV", price: "22.8-28.6 万", aliases: ["X7", "远途纯电 SUV"], status: "正常", focus: "城市通勤、家庭空间、真实续航" },
  { name: "远途 M5", brand: "远途汽车", segment: "紧凑型纯电 SUV", price: "16.9-21.8 万", aliases: ["M5", "远途入门 SUV"], status: "正常", focus: "入门预算、补能效率、智能座舱" },
  { name: "远途 S9", brand: "远途汽车", segment: "中大型轿车", price: "25.8-33.8 万", aliases: ["S9", "远途行政轿车"], status: "正常", focus: "商务通勤、舒适配置、长途续航" },
  { name: "智行 S6", brand: "智行汽车", segment: "中型纯电 SUV", price: "21.9-29.9 万", aliases: ["S6", "智行纯电 SUV"], status: "正常", focus: "智能驾驶、城区能耗、品牌声量" },
];

export const competitorProfiles = [
  { brand: "智行汽车", relation: "直接竞品", overlap: "新能源 SUV / 家庭用户", strength: "AI 回答中推荐频次高，城市通勤内容丰富", monitor: "高" },
  { brand: "跃界汽车", relation: "场景竞品", overlap: "25 万级纯电 SUV", strength: "价格带表达清晰，车型对比内容多", monitor: "中" },
  { brand: "星途新能源", relation: "潜在竞品", overlap: "长续航纯电车型", strength: "引用来源少，但在续航类 Query 中开始出现", monitor: "低" },
];

export const knowledgeFacts = [
  { title: "远途 X7 城市通勤续航", type: "产品事实", source: "远途 X7 官方技术白皮书", updatedAt: "2026-06-10", status: "正常", summary: "CLTC 续航 650km，城区通勤实测平均能耗 13.8kWh/100km。" },
  { title: "远途汽车售后政策", type: "品牌事实", source: "远途汽车服务权益页", updatedAt: "2026-06-08", status: "正常", summary: "核心城市提供 24 小时道路救援，三电系统质保 8 年或 16 万公里。" },
  { title: "2024 款旧补能政策", type: "过期说法", source: "历史官网活动页", updatedAt: "2025-12-31", status: "已过期", summary: "该权益已在 2026 年 1 月更新，AI 回答引用时需要标记为过期。" },
  { title: "家庭用户空间卖点", type: "差异化表达", source: "品牌产品资料", updatedAt: "2026-06-12", status: "正常", summary: "二排腿部空间、后备箱容积和儿童座椅安装便利性是家庭用车核心表达。" },
];
