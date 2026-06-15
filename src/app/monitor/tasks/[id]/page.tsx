import Link from "next/link";
import { ArrowLeft, GitCompareArrows, RefreshCw } from "lucide-react";
import { PageHeader, SectionTitle, StatusBadge } from "@/components/ui";
import { evaluationTasks, queries } from "@/mocks/data";
import { ActionButton } from "@/components/action-button";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = evaluationTasks.find((item) => item.id === id) || evaluationTasks[0];
  return (
    <>
      <Link href="/monitor/tasks" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-muted"><ArrowLeft size={15} />返回任务管理</Link>
      <PageHeader eyebrow="评测任务详情" title={task.name} description={`配置快照：${task.querySet} · ${task.models.join("、")} · 每条 Query 采样 1 次`} action={<div className="flex gap-2"><Link href="/monitor/compare" className="btn-secondary"><GitCompareArrows size={15} />批次对比</Link><ActionButton message="复测任务创建成功" description="已继承当前 Query 集与模型配置" toastType="success" className="btn-primary"><RefreshCw size={15} />创建复测</ActionButton></div>} />
      <div className="panel mb-7 p-5">
        <div className="flex items-end justify-between"><div><p className="text-sm font-semibold text-muted">整体执行进度</p><p className="mt-2 text-3xl font-bold">{task.progress}%</p></div><div className="flex gap-8 text-center"><div><p className="text-2xl font-bold text-emerald-700">{task.success}</p><p className="text-xs text-muted">成功</p></div><div><p className="text-2xl font-bold text-rose-700">{task.failed}</p><p className="text-xs text-muted">失败</p></div></div></div>
        <div className="mt-5 h-2.5 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-brand" style={{ width: `${task.progress}%` }} /></div>
      </div>
      <SectionTitle title="Query 执行明细" description="点击 Query 可查看原始回答与引用证据" />
      <div className="table-wrap"><table className="w-full text-sm"><thead className="table-head"><tr><th className="px-5 py-3.5">Query</th><th>品牌提及</th><th>明确推荐</th><th>主要竞品</th><th>状态</th><th className="pr-5 text-right">操作</th></tr></thead><tbody className="divide-y divide-line">{queries.map((query, index) => <tr key={query.id}><td className="px-5 py-4 font-semibold">{query.text}</td><td>{query.mentioned ? "是" : "否"}</td><td>{query.recommended ? "是" : "否"}</td><td className="text-muted">{query.competitor}</td><td><StatusBadge status={task.failed && index === 3 ? "失败" : "成功"} /></td><td className="pr-5 text-right"><Link className="font-semibold text-brand" href={`/monitor/queries/${query.id}`}>查看回答</Link></td></tr>)}</tbody></table></div>
    </>
  );
}
