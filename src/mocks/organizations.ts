export type OrganizationStatus = "正常" | "已停用";
export type MemberStatus = "正常" | "待邀请" | "已停用";

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  industry: string;
  memberCount: number;
  brandCount: number;
  createdAt: string;
  status: OrganizationStatus;
}

export interface MemberAccount {
  id: string;
  organizationId: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: "超级管理员" | "管理员" | "运营人员" | "查看者";
  status: MemberStatus;
  lastLogin: string;
}

const organizationNames = [
  ["远途汽车", "远", "汽车制造"],
  ["远途新能源", "新", "新能源汽车"],
  ["远途出行服务", "行", "出行服务"],
  ["远途智能科技", "智", "智能驾驶"],
  ["远途国际业务", "国", "汽车贸易"],
  ["星澜汽车", "星", "汽车制造"],
  ["远途售后服务", "服", "汽车服务"],
  ["远途金融科技", "金", "汽车金融"],
  ["远途用户运营", "用", "用户服务"],
  ["远途品牌中心", "品", "品牌营销"],
  ["远途渠道中心", "渠", "渠道运营"],
  ["远途研究院", "研", "技术研发"],
] as const;

export const organizations: Organization[] = organizationNames.map((item, index) => ({
  id: `org-${index + 1}`,
  name: item[0],
  shortName: item[1],
  industry: item[2],
  memberCount: 8 + ((index * 7) % 31),
  brandCount: 1 + (index % 5),
  createdAt: `202${2 + (index % 4)}-${String((index % 9) + 1).padStart(2, "0")}-${String((index % 18) + 3).padStart(2, "0")} 10:20:00`,
  status: index === 10 ? "已停用" : "正常",
}));

const memberNames = ["马嘉博", "陈晓雨", "李明轩", "周悦", "王子涵", "赵云帆", "孙可欣", "刘一鸣", "徐佳宁", "杨思远", "高文静", "林子墨", "何嘉欣", "胡浩然", "唐婉清", "宋宇航", "邓心怡", "许泽凯", "冯书雅", "曹俊杰", "罗诗琪", "梁天宇", "谢雨桐", "韩嘉豪"];
const roles: MemberAccount["role"][] = ["超级管理员", "管理员", "运营人员", "查看者"];

export const memberAccounts: MemberAccount[] = memberNames.map((name, index) => ({
  id: `member-${index + 1}`,
  organizationId: index < 14 ? "org-1" : `org-${2 + (index % 4)}`,
  name,
  avatar: name.slice(-1),
  email: `member${index + 1}@yuantu-auto.cn`,
  phone: `138****${String(3821 + index * 73).slice(-4)}`,
  role: roles[index % roles.length],
  status: index % 11 === 8 ? "待邀请" : index % 13 === 9 ? "已停用" : "正常",
  lastLogin: index % 11 === 8 ? "-" : `2026-06-${String(15 - Math.floor(index / 5)).padStart(2, "0")} ${String(9 + (index % 9)).padStart(2, "0")}:32:18`,
}));
