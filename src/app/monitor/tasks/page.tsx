"use client";

import Link from "next/link";
import { Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { PageHeader, StatusBadge } from "@/components/ui";
import { evaluationTasks } from "@/mocks/data";
import { ActionButton } from "@/components/action-button";
import { Pagination } from "@/components/pagination";

export default function TasksPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pagedTasks = evaluationTasks.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <PageHeader eyebrow="监测中心 / 任务管理" title="评测任务" description="管理多模型批量评测，保存任务配置、原始回答和结构化结果。" action={<ActionButton message="评测任务创建成功" description="任务已进入等待队列" toastType="success" className="btn-primary"><Plus size={16} />创建评测任务</ActionButton>} />
      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="px-5 py-3.5">任务名称</th><th>Query 集</th><th>AI 平台</th><th>执行进度</th><th>状态</th><th>执行时间</th><th className="pr-5 text-right">操作</th></tr></thead>
          <tbody className="divide-y divide-line">
            {pagedTasks.map((task) => (
              <tr key={task.id}>
                <td className="px-5 py-5 font-semibold">{task.name}</td><td className="text-muted">{task.querySet}</td><td className="text-muted">{task.models.join("、")}</td>
                <td><div className="w-36"><div className="mb-1 flex justify-between text-xs text-muted"><span>{task.progress}%</span><span>{task.success}/{task.success + task.failed}</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-brand" style={{ width: `${task.progress}%` }} /></div></div></td>
                <td><StatusBadge status={task.status} /></td><td className="text-muted">{task.date}</td>
                <td className="pr-5 text-right"><div className="flex justify-end gap-3">{task.failed > 0 && <ActionButton message="失败任务已重新提交" description={`正在重试 ${task.failed} 条失败 Query`} toastType="success" className="text-rose-700" title="重试失败任务"><RotateCcw size={15} /></ActionButton>}<Link href={`/monitor/tasks/${task.id}`} className="font-semibold text-brand">查看详情</Link></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} pageSize={pageSize} total={evaluationTasks.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </div>
    </>
  );
}
