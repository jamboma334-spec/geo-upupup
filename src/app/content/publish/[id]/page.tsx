"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarClock, CheckCircle2, ExternalLink, RefreshCw, UserRound } from "lucide-react";
import { useState } from "react";
import { PageHeader, SectionTitle, StatusBadge } from "@/components/ui";
import { publishTasks } from "@/mocks/data";
import type { PublishRecord } from "@/types";
import { useToast } from "@/components/toast-provider";

export default function PublishDetailPage() {
  const params = useParams<{ id: string }>();
  const task = publishTasks.find((item) => item.id === params.id) || publishTasks[0];
  const [records, setRecords] = useState<PublishRecord[]>(task.records);
  const [retrying, setRetrying] = useState("");
  const { toast } = useToast();
  const retry = (account: string) => {
    setRetrying(account);
    window.setTimeout(() => {
      setRecords((items) => items.map((item) => item.account === account ? { ...item, status: "成功", reason: undefined, link: "#" } : item));
      setRetrying("");
      toast("重新发布成功", { description: `${account} 已完成发布` });
    }, 900);
  };
  const success = records.filter((record) => record.status === "成功").length;
  return (
    <>
      <Link href="/content/publish" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-muted"><ArrowLeft size={15} />返回发布任务</Link>
      <PageHeader eyebrow="内容发布详情" title={task.title} description="查看各平台账号的发布进度、结果与失败原因。" />
      <div className="mb-5 flex flex-wrap items-center gap-5 rounded-xl border border-line bg-white px-4 py-3 text-sm shadow-panel">
        <span className="flex items-center gap-2 text-muted"><UserRound size={15} className="text-brand" />发布人：<strong className="text-ink">{task.publisher}</strong></span>
        <span className="h-4 w-px bg-line" />
        <span className="flex items-center gap-2 text-muted"><CalendarClock size={15} className="text-brand" />发布时间：<strong className="font-mono text-ink">{task.date}</strong></span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="panel p-5"><p className="text-xs font-semibold text-muted">发布进度</p><p className="mt-3 text-3xl font-bold">{success}/{records.length}</p><div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand transition-all" style={{ width: `${success / records.length * 100}%` }} /></div></div>
        <div className="panel p-5"><p className="text-xs font-semibold text-muted">成功账号</p><p className="mt-3 text-3xl font-bold text-emerald-700">{success}</p><p className="mt-3 text-xs text-muted">已生成平台发布记录</p></div>
        <div className="panel p-5"><p className="text-xs font-semibold text-muted">失败账号</p><p className="mt-3 text-3xl font-bold text-rose-700">{records.length - success}</p><p className="mt-3 text-xs text-muted">支持查看原因并单独重试</p></div>
      </div>
      <div className="mt-7"><SectionTitle title="平台发布结果" description="各平台数据口径和状态独立展示" /><div className="space-y-3">{records.map((record) => <div key={record.account} className="panel flex items-center gap-4 p-5"><div className="grid size-11 place-items-center rounded-xl bg-brand-pale font-bold text-brand">{record.platform.slice(0,1)}</div><div className="flex-1"><div className="flex items-center gap-2"><h3 className="font-bold">{record.platform}</h3><StatusBadge status={record.status} /></div><p className="mt-1 text-xs text-muted">{record.account}</p>{record.reason && <p className="mt-2 text-xs font-medium text-rose-700">失败原因：{record.reason}</p>}</div>{record.status === "失败" ? <button disabled={retrying === record.account} onClick={() => retry(record.account)} className="btn-secondary">{retrying === record.account ? "重试中..." : <><RefreshCw size={15} />单独重试</>}</button> : <a href="#" className="btn-secondary"><ExternalLink size={15} />平台链接</a>}</div>)}</div></div>
      {success === records.length && <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2 size={18} />所有目标账号发布成功。</div>}
    </>
  );
}
