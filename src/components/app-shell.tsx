"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Bot,
  Building2,
  Check,
  ChevronDown,
  CircleGauge,
  FileQuestion,
  Library,
  Menu,
  PanelLeftClose,
  Send,
  Settings,
  Settings2,
  Tags,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/components/organization-provider";
import { useToast } from "@/components/toast-provider";

const navGroups = [
  {
    label: "监测中心",
    items: [
      { label: "数据看板", href: "/monitor/dashboard", icon: CircleGauge },
      { label: "Query 管理", href: "/monitor/queries", icon: FileQuestion },
      { label: "品牌 / 产品", href: "/monitor/brands", icon: Tags },
      { label: "任务管理", href: "/monitor/tasks", icon: Bot },
    ],
  },
  {
    label: "内容中心",
    items: [
      { label: "内容数据", href: "/content/library", icon: Library },
      { label: "内容发布", href: "/content/publish", icon: Send },
      { label: "平台授权", href: "/content/accounts", icon: Settings2 },
    ],
  },
  {
    label: "系统管理",
    items: [
      { label: "设置", href: "/settings", icon: Settings },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [scenario, setScenario] = useState("正常数据");
  const [organizationOpen, setOrganizationOpen] = useState(false);
  const { organizations, currentOrganization, setCurrentOrganizationId } = useOrganization();
  const { toast } = useToast();

  const switchOrganization = (id: string) => {
    const organization = organizations.find((item) => item.id === id);
    if (!organization || organization.id === currentOrganization.id) {
      setOrganizationOpen(false);
      return;
    }
    setCurrentOrganizationId(id);
    setOrganizationOpen(false);
    toast("企业切换成功", { description: `当前企业已切换为 ${organization.name}` });
  };

  return (
    <div className="min-h-screen">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-white/10 bg-[#10271f] text-white transition-all",
          collapsed ? "w-[76px]" : "w-[240px]",
        )}
      >
        <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-5">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#3ddd9e] text-[#0b281e]">
            <BarChart3 size={20} strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div>
              <p className="text-base font-bold tracking-wide">GEO Pulse</p>
              <p className="text-[11px] text-white/50">品牌增长双中心</p>
            </div>
          )}
        </div>
        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{group.label}</p>}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                        active ? "bg-white text-[#123b2b] shadow-sm" : "text-white/65 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Icon size={18} />
                      {!collapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <button onClick={() => setCollapsed(!collapsed)} className="m-3 flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-white/55 hover:bg-white/10 hover:text-white">
          {collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && "收起菜单"}
        </button>
      </aside>
      <div className={cn("transition-all", collapsed ? "ml-[76px]" : "ml-[240px]")}>
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-line bg-white/90 px-7 backdrop-blur">
          <div className="relative">
            <button onClick={() => setOrganizationOpen((open) => !open)} className="flex min-w-44 items-center gap-2 rounded-lg border border-line bg-[#f8faf9] px-3 py-2 text-sm font-semibold transition hover:border-brand/40">
              <span className="grid size-6 place-items-center rounded-md bg-brand text-xs text-white">{currentOrganization.shortName}</span>
              <span className="max-w-36 truncate">{currentOrganization.name}</span>
              <ChevronDown size={14} className={cn("ml-auto text-muted transition", organizationOpen && "rotate-180")} />
            </button>
            {organizationOpen && (
              <div className="absolute left-0 top-12 z-30 w-72 overflow-hidden rounded-xl border border-line bg-white shadow-xl">
                <div className="border-b border-line px-4 py-3"><p className="text-xs font-bold text-muted">切换企业</p></div>
                <div className="max-h-72 overflow-y-auto p-2">
                  {organizations.filter((item) => item.status === "正常").map((organization) => (
                    <button key={organization.id} onClick={() => switchOrganization(organization.id)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[#f4f8f6]", organization.id === currentOrganization.id && "bg-brand-pale")}>
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#d8ece3] text-xs font-bold text-brand-dark">{organization.shortName}</span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{organization.name}</span><span className="mt-0.5 block text-[11px] text-muted">{organization.memberCount} 位成员 · {organization.brandCount} 个品牌</span></span>
                      {organization.id === currentOrganization.id && <Check size={16} className="text-brand" />}
                    </button>
                  ))}
                </div>
                <Link href="/settings" onClick={() => setOrganizationOpen(false)} className="flex items-center gap-2 border-t border-line px-4 py-3 text-xs font-semibold text-brand hover:bg-brand-pale"><Building2 size={14} />管理企业</Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-xs text-muted xl:flex">
              <span className="size-2 rounded-full bg-emerald-500" />
              数据更新于 10 分钟前
            </div>
            <select value={scenario} onChange={(event) => setScenario(event.target.value)} className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-muted outline-none">
              <option>正常数据</option>
              <option>部分任务失败</option>
              <option>平台授权过期</option>
              <option>数据暂未同步</option>
            </select>
            <button className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:text-brand"><Bell size={17} /></button>
            <div className="grid size-9 place-items-center rounded-full bg-[#d8ece3] text-sm font-bold text-brand-dark">MJ</div>
          </div>
        </header>
        <main className="mx-auto max-w-[1560px] px-7 py-7">{children}</main>
      </div>
    </div>
  );
}
