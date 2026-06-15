"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between border-t border-line bg-white px-5 py-4">
      <div className="flex items-center gap-3"><p className="text-xs text-muted">共 {total} 条，当前显示 {start}-{end} 条</p><label className="flex items-center gap-2 text-xs text-muted">每页<select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))} className="rounded-lg border border-line bg-white px-2 py-1.5 text-xs font-semibold text-ink outline-none focus:border-brand"><option value={10}>10 条</option><option value={20}>20 条</option><option value={50}>50 条</option></select></label></div>
      <div className="flex items-center gap-1">
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={15} /></button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <button key={item} onClick={() => onPageChange(item)} className={cn("grid size-8 place-items-center rounded-lg border text-xs font-semibold transition", item === page ? "border-brand bg-brand text-white" : "border-line text-muted hover:border-brand hover:text-brand")}>{item}</button>)}
        <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}
