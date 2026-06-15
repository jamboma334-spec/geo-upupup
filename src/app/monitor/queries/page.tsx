"use client";

import Link from "next/link";
import { Download, Plus, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader, StatusBadge } from "@/components/ui";
import { queries } from "@/mocks/data";
import { ActionButton } from "@/components/action-button";
import { Pagination } from "@/components/pagination";

export default function QueriesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pagedQueries = queries.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <PageHeader
        eyebrow="监测中心 / Query 管理"
        title="Query 资产"
        description="维护用户真实会向 AI 提出的问题，使用固定版本保证不同评测批次可比较。"
        action={<div className="flex gap-2"><ActionButton message="已打开批量导入" description="Mock 版本暂不读取真实文件" className="btn-secondary"><Download size={16} />批量导入</ActionButton><ActionButton message="已准备新建 Query" description="Mock 版本暂未接入编辑表单" className="btn-primary"><Plus size={16} />新建 Query</ActionButton></div>}
      />
      <div className="panel mb-4 flex items-center gap-3 p-4">
        <label className="relative max-w-md flex-1"><Search size={16} className="absolute left-3 top-3 text-muted" /><input className="field pl-9" placeholder="搜索 Query 内容、标签或 Query 集" /></label>
        <select className="field max-w-36"><option>全部分类</option><option>推荐</option><option>比较</option><option>评价</option></select>
        <select className="field max-w-36"><option>全部优先级</option><option>高</option><option>中</option><option>低</option></select>
      </div>
      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="px-5 py-3.5">Query</th><th>分类</th><th>优先级</th><th>最近表现</th><th>Query 集</th><th className="pr-5 text-right">操作</th></tr></thead>
          <tbody className="divide-y divide-line">
            {pagedQueries.map((query) => (
              <tr key={query.id} className="hover:bg-[#fbfcfb]">
                <td className="max-w-xl px-5 py-4"><p className="font-semibold">{query.text}</p><div className="mt-2 flex gap-1.5">{query.tags.map((tag) => <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-[11px] text-muted">{tag}</span>)}</div></td>
                <td>{query.category}</td><td><StatusBadge status={query.priority} /></td>
                <td><span className={query.mentioned ? "text-emerald-700" : "text-rose-700"}>{query.mentioned ? "已提及" : "品牌缺席"}</span></td>
                <td className="text-muted">{query.querySet}</td>
                <td className="pr-5 text-right"><Link href={`/monitor/queries/${query.id}`} className="font-semibold text-brand">查看详情</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} pageSize={pageSize} total={queries.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </div>
    </>
  );
}
