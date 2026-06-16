"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageTab<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
}

export function PageTabs<T extends string>({ tabs, value, onChange }: { tabs: PageTab<T>[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1 shadow-panel">
      {tabs.map((tab) => {
        const active = tab.value === value;
        const Icon = tab.icon;
        return (
          <button key={tab.value} onClick={() => onChange(tab.value)} className={cn("flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition", active ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-[#f4f8f6] hover:text-ink")}>
            {Icon && <Icon size={16} />}
            {tab.label}
            {tab.badge !== undefined && <span className={cn("rounded-full px-2 py-0.5 text-[11px]", active ? "bg-white/20 text-white" : "bg-slate-100 text-muted")}>{tab.badge}</span>}
            {active && tab.badge === undefined && <Check size={13} />}
          </button>
        );
      })}
    </div>
  );
}

export function TabbedPageHeader<T extends string>({
  eyebrow,
  title,
  description,
  tabs,
  value,
  onChange,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tabs: PageTab<T>[];
  value: T;
  onChange: (value: T) => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-ink">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-sm leading-5 text-muted">{description}</p>}
        </div>
        <PageTabs tabs={tabs} value={value} onChange={onChange} />
      </div>
      {action}
    </div>
  );
}
