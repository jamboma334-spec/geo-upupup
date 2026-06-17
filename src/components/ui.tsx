import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Status } from "@/types";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>}
        <h1 className="text-[28px] font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: Status | string }) {
  const styles: Record<string, string> = {
    成功: "bg-emerald-50 text-emerald-700",
    正常: "bg-emerald-50 text-emerald-700",
    进行中: "bg-blue-50 text-blue-700",
    等待中: "bg-slate-100 text-slate-600",
    失败: "bg-rose-50 text-rose-700",
    已过期: "bg-rose-50 text-rose-700",
    即将过期: "bg-amber-50 text-amber-700",
    登录失效: "bg-rose-50 text-rose-700",
    草稿: "bg-blue-50 text-blue-700",
    已冻结: "bg-emerald-50 text-emerald-700",
    已归档: "bg-slate-100 text-slate-600",
    高: "bg-rose-50 text-rose-700",
    中: "bg-amber-50 text-amber-700",
    低: "bg-slate-100 text-slate-600",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", styles[status] || "bg-slate-100 text-slate-600")}>{status}</span>;
}

export function MetricCard({
  label,
  value,
  change,
  note,
}: {
  label: string;
  value: string;
  change: string;
  note: string;
}) {
  return (
    <div className="panel group p-5 transition hover:-translate-y-0.5 hover:border-brand/30">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <ArrowUpRight size={16} className="text-slate-300 transition group-hover:text-brand" />
      </div>
      <div className="mt-5 flex items-end gap-3">
        <strong className="text-3xl tracking-tight">{value}</strong>
        <span className="mb-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{change}</span>
      </div>
      <p className="mt-4 border-t border-line pt-3 text-xs text-muted">{note}</p>
    </div>
  );
}

export function SectionTitle({ title, description, href, linkLabel = "查看全部" }: { title: string; description?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="mt-1 text-xs text-muted">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark">
          {linkLabel}<ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="panel grid min-h-72 place-items-center p-8 text-center">
      <div>
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-brand-pale text-xl text-brand">+</div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}
