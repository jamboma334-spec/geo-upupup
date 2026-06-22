import Link from "next/link";
import { BookOpenText, Package, Swords, Tags } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "品牌档案", href: "/monitor/brands", icon: Tags },
  { label: "产品 / 服务档案", href: "/monitor/brands/products", icon: Package },
  { label: "竞品配置", href: "/monitor/brands/competitors", icon: Swords },
  { label: "品牌事实 / 资料库", href: "/monitor/brands/knowledge", icon: BookOpenText },
];

export function BrandProductNav({ active }: { active: string }) {
  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1 rounded-lg border border-line bg-white p-0.5 shadow-panel">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition",
              isActive ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-[#f4f8f6] hover:text-ink",
            )}
          >
            <Icon size={14} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

export function BrandProductHeader({
  active,
  title,
  description,
  action,
}: {
  active: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">监测中心 / 品牌与产品服务</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <h1 className="text-[28px] font-bold tracking-tight text-ink">{title}</h1>
          <BrandProductNav active={active} />
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
