"use client";

import Link from "next/link";
import { CheckCircle2, CircleX, Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { publishTasks } from "@/mocks/data";
import { Pagination } from "@/components/pagination";

export default function PublishTasksPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pagedTasks = publishTasks.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <PageHeader
        eyebrow="内容中心 / 内容发布"
        title="内容发布"
        description="将已准备好的内容发布至多个平台账号，并统一处理失败与重试。"
        action={<Link href="/content/publish/new" className="btn-primary"><Plus size={16} />新建内容发布</Link>}
      />
      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-5 py-3.5">发布内容</th>
              <th>目标账号</th>
              <th>发布状态</th>
              <th>发布时间</th>
              <th>发布人</th>
              <th className="pr-5 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pagedTasks.map((task) => {
              const success = task.records.filter((record) => record.status === "成功").length;
              const failed = task.records.filter((record) => record.status === "失败").length;
              const platforms = [...new Set(task.records.map((record) => record.platform))];
              return (
                <tr key={task.id} className="hover:bg-[#fbfcfb]">
                  <td className="px-5 py-5 font-semibold">{task.title}</td>
                  <td><div className="flex items-center gap-3"><strong className="text-lg">{task.records.length}</strong><div className="flex -space-x-2">{platforms.map((platform) => <span key={platform} className="grid size-8 place-items-center rounded-full border-2 border-white bg-brand-pale text-[11px] font-bold text-brand" title={platform}>{platform.slice(0, 1)}</span>)}</div></div></td>
                  <td><div className="flex items-center gap-4"><span className="flex items-center gap-1.5 font-semibold text-emerald-700"><CheckCircle2 size={16} />成功 {success}</span><span className="flex items-center gap-1.5 font-semibold text-rose-700"><CircleX size={16} />失败 {failed}</span></div></td>
                  <td className="font-mono text-xs text-muted">{task.date}</td>
                  <td><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#d6eee3] to-[#abd8c4] text-xs font-bold text-brand-dark">{task.publisher.slice(0, 1)}</span><span className="font-semibold">{task.publisher}</span></div></td>
                  <td className="pr-5 text-right"><Link href={`/content/publish/${task.id}`} className="font-semibold text-brand hover:text-brand-dark">查看详情</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination page={page} pageSize={pageSize} total={publishTasks.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </div>
    </>
  );
}
