"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function FilterSelect({
  value,
  options,
  placeholder,
  onChange,
  className,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const filteredOptions = useMemo(() => options.filter((option) => option.toLowerCase().includes(keyword.trim().toLowerCase())), [keyword, options]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const select = (option: string) => {
    onChange(option);
    setKeyword("");
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative w-44 shrink-0", className)}>
      <button type="button" onClick={() => setOpen((current) => !current)} className={cn("flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-left text-sm transition", open ? "border-brand ring-2 ring-brand/10" : "border-line hover:border-brand/50")}>
        <span className={cn("min-w-0 flex-1 truncate", value ? "font-semibold text-ink" : "text-muted")}>{value || placeholder}</span>
        {value ? (
          <span
            role="button"
            tabIndex={0}
            aria-label={`清除${placeholder}`}
            onClick={(event) => { event.stopPropagation(); onChange(""); setKeyword(""); setOpen(false); }}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); onChange(""); setOpen(false); } }}
            className="grid size-5 shrink-0 place-items-center rounded-full text-muted transition hover:bg-slate-100 hover:text-ink"
          >
            <X size={13} />
          </span>
        ) : <ChevronDown size={14} className={cn("shrink-0 text-muted transition", open && "rotate-180")} />}
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-40 w-full min-w-48 overflow-hidden rounded-xl border border-line bg-white shadow-xl">
          <div className="border-b border-line p-2">
            <label className="relative block"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" /><input autoFocus value={keyword} onChange={(event) => setKeyword(event.target.value)} className="w-full rounded-lg border border-line py-2 pl-8 pr-2 text-xs outline-none focus:border-brand" placeholder="搜索选项" /></label>
          </div>
          <div className="max-h-56 overflow-y-auto p-1.5">
            <button type="button" onClick={() => select("")} className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition hover:bg-[#f4f8f6]", !value && "bg-brand-pale font-semibold text-brand")}><span className="flex-1">{placeholder}</span>{!value && <Check size={14} />}</button>
            {filteredOptions.map((option) => <button type="button" key={option} onClick={() => select(option)} className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition hover:bg-[#f4f8f6]", value === option && "bg-brand-pale font-semibold text-brand")}><span className="min-w-0 flex-1 truncate">{option}</span>{value === option && <Check size={14} />}</button>)}
            {filteredOptions.length === 0 && <p className="px-3 py-5 text-center text-xs text-muted">没有匹配选项</p>}
          </div>
        </div>
      )}
    </div>
  );
}
