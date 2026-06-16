"use client";

import Link from "next/link";
import { CheckCircle2, CircleX, Plus, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { publishTasks } from "@/mocks/data";
import { Pagination } from "@/components/pagination";
import { FilterSelect } from "@/components/filter-select";
import { DateRangeFilter, matchesDateRange, type DateRangeValue } from "@/components/date-range-filter";

export default function PublishTasksPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue>("");
  const [customStart, setCustomStart] = useState("2026-06-01");
  const [customEnd, setCustomEnd] = useState("2026-06-15");
  const publisherOptions = [...new Set(publishTasks.map((task) => task.publisher))];
  const filteredTasks = publishTasks.filter((task) => task.title.includes(keyword) && (!statusFilter || task.status === statusFilter) && (!publisherFilter || task.publisher === publisherFilter) && matchesDateRange(task.date, dateRange, customStart, customEnd));
  const pagedTasks = filteredTasks.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <PageHeader
        eyebrow="内容中心 / 内容发布"
        title="内容发布"
        description="将已准备好的内容发布至多个平台账号，并统一处理失败与重试。"
        action={<Link href="/content/publish/new" className="btn-primary"><Plus size={16} />新建内容发布</Link>}
      />
      <div className="panel mb-4 flex flex-wrap items-center gap-3 p-4">
        <label className="relative w-64 shrink-0"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} className="field pl-9" placeholder="搜索发布内容名称" /></label>
        <FilterSelect value={statusFilter} options={["成功", "失败", "进行中", "等待中"]} placeholder="全部发布状态" onChange={(value) => { setStatusFilter(value); setPage(1); }} />
        <FilterSelect value={publisherFilter} options={publisherOptions} placeholder="全部发布人" onChange={(value) => { setPublisherFilter(value); setPage(1); }} />
        <DateRangeFilter value={dateRange} customStart={customStart} customEnd={customEnd} onChange={(value) => { setDateRange(value); setPage(1); }} onCustomStartChange={(value) => { setCustomStart(value); setPage(1); }} onCustomEndChange={(value) => { setCustomEnd(value); setPage(1); }} />
        <span className="ml-auto text-xs text-muted">共 {filteredTasks.length} 条发布任务</span>
      </div>
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
        {filteredTasks.length > 0 ? <Pagination page={page} pageSize={pageSize} total={filteredTasks.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /> : <div className="grid min-h-56 place-items-center text-center"><div><p className="font-bold">没有找到符合条件的发布任务</p><p className="mt-2 text-xs text-muted">尝试清除筛选条件或修改发布内容名称</p></div></div>}
      </div>
    </>
  );
}
