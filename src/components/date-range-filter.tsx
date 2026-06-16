"use client";

import { CalendarDays, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type DateRangeValue = "" | "yesterday" | "7days" | "30days" | "custom";

const options: { value: DateRangeValue; label: string }[] = [
  { value: "", label: "全部时间" },
  { value: "yesterday", label: "昨天" },
  { value: "7days", label: "近 7 天" },
  { value: "30days", label: "近 30 天" },
  { value: "custom", label: "自定义时间" },
];

export function matchesDateRange(dateTime: string, range: DateRangeValue, customStart: string, customEnd: string, today = "2026-06-15") {
  if (!range) return true;
  const date = dateTime.slice(0, 10);
  if (range === "custom") return (!customStart || date >= customStart) && (!customEnd || date <= customEnd);
  const todayDate = new Date(`${today}T00:00:00`);
  const start = new Date(todayDate);
  const offset = range === "yesterday" ? 1 : range === "7days" ? 6 : 29;
  start.setDate(start.getDate() - offset);
  const startText = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
  if (range === "yesterday") return date === startText;
  return date >= startText && date <= today;
}

export function DateRangeFilter({
  value,
  customStart,
  customEnd,
  onChange,
  onCustomStartChange,
  onCustomEndChange,
}: {
  value: DateRangeValue;
  customStart: string;
  customEnd: string;
  onChange: (value: DateRangeValue) => void;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const label = value === "custom" && customStart && customEnd ? `${customStart} 至 ${customEnd}` : options.find((item) => item.value === value)?.label || "全部时间";

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button onClick={() => setOpen((current) => !current)} className={cn("flex h-[42px] min-w-40 items-center gap-2 rounded-lg border bg-white px-3 text-sm transition", open ? "border-brand ring-2 ring-brand/10" : "border-line hover:border-brand/50")}>
        <CalendarDays size={15} className="shrink-0 text-brand" />
        <span className={cn("max-w-48 flex-1 truncate text-left", value ? "font-semibold text-ink" : "text-muted")}>{label}</span>
        {value ? <span role="button" tabIndex={0} aria-label="清除时间筛选" onClick={(event) => { event.stopPropagation(); onChange(""); setOpen(false); }} className="grid size-5 place-items-center rounded-full text-muted hover:bg-slate-100 hover:text-ink"><X size={13} /></span> : <ChevronDown size={14} className="text-muted" />}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-72 rounded-xl border border-line bg-white p-2 shadow-xl">
          <div className="grid grid-cols-2 gap-1">
            {options.map((option) => <button key={option.label} onClick={() => { onChange(option.value); if (option.value !== "custom") setOpen(false); }} className={cn("rounded-lg px-3 py-2 text-left text-xs font-semibold transition hover:bg-[#f4f8f6]", value === option.value && "bg-brand-pale text-brand")}>{option.label}</button>)}
          </div>
          {value === "custom" && <div className="mt-2 border-t border-line pt-3"><p className="mb-2 text-xs font-semibold text-muted">选择发布时间范围</p><div className="flex items-center gap-2"><input type="date" value={customStart} onChange={(event) => onCustomStartChange(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-line px-2 py-2 text-xs outline-none focus:border-brand" /><span className="text-xs text-muted">至</span><input type="date" value={customEnd} onChange={(event) => onCustomEndChange(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-line px-2 py-2 text-xs outline-none focus:border-brand" /></div></div>}
        </div>
      )}
    </div>
  );
}
