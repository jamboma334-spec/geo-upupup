export type Status = "成功" | "进行中" | "失败" | "等待中" | "已过期" | "正常" | "即将过期";

export interface QueryItem {
  id: string;
  text: string;
  category: string;
  priority: "高" | "中" | "低";
  tags: string[];
  querySet: string;
  mentioned: boolean;
  recommended: boolean;
  competitor: string;
  opportunity: string;
}

export interface EvaluationTask {
  id: string;
  name: string;
  querySet: string;
  models: string[];
  date: string;
  status: Status;
  progress: number;
  success: number;
  failed: number;
}

export interface PublishRecord {
  platform: string;
  account: string;
  status: Status;
  reason?: string;
  link?: string;
}

export interface PublishTask {
  id: string;
  title: string;
  queryId: string;
  date: string;
  publisher: string;
  status: Status;
  records: PublishRecord[];
}
