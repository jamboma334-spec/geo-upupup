"use client";

import {
  Building2,
  CircleUserRound,
  MailPlus,
  MoreHorizontal,
  Network,
  Pencil,
  Power,
  PowerOff,
  Plus,
  Search,
  ServerCog,
  ShieldCheck,
  UserRoundCog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useOrganization } from "@/components/organization-provider";
import { Pagination } from "@/components/pagination";
import { FilterSelect } from "@/components/filter-select";
import { useToast } from "@/components/toast-provider";
import { PageHeader, StatusBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { memberAccounts as memberSeeds, type MemberAccount } from "@/mocks/organizations";
import { PageTabs } from "@/components/page-tabs";

type SettingMenu = "enterprise-members" | "proxy";
type SettingTab = "organizations" | "members";

const proxyConfigs = [
  { id: "proxy-1", name: "内容发布代理", scene: "平台发布 / 授权登录", endpoint: "https://proxy-prod.geo-pulse.cn/publish", status: "正常", owner: "平台运营组", updatedAt: "2026-06-16 09:40:18" },
  { id: "proxy-2", name: "数据同步代理", scene: "作品数据 / 互动数据同步", endpoint: "https://proxy-prod.geo-pulse.cn/sync", status: "正常", owner: "数据增长组", updatedAt: "2026-06-15 18:22:09" },
  { id: "proxy-3", name: "备用出口代理", scene: "异常重试 / 容灾切换", endpoint: "https://proxy-backup.geo-pulse.cn/gateway", status: "已停用", owner: "系统管理员", updatedAt: "2026-06-12 11:08:36" },
];

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState<SettingMenu>("enterprise-members");
  const [activeTab, setActiveTab] = useState<SettingTab>("organizations");
  const [organizationKeyword, setOrganizationKeyword] = useState("");
  const [organizationPage, setOrganizationPage] = useState(1);
  const [organizationPageSize, setOrganizationPageSize] = useState(10);
  const [members, setMembers] = useState(memberSeeds);
  const [memberKeyword, setMemberKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [memberOrganizationId, setMemberOrganizationId] = useState("org-1");
  const [memberPage, setMemberPage] = useState(1);
  const [memberPageSize, setMemberPageSize] = useState(10);
  const { organizations, currentOrganization, setOrganizationStatus } = useOrganization();
  const { toast } = useToast();
  const memberOrganization = organizations.find((item) => item.id === memberOrganizationId);

  const filteredOrganizations = useMemo(
    () => organizations.filter((item) => item.name.includes(organizationKeyword) || item.industry.includes(organizationKeyword)),
    [organizationKeyword, organizations],
  );
  const pagedOrganizations = filteredOrganizations.slice((organizationPage - 1) * organizationPageSize, organizationPage * organizationPageSize);

  const filteredMembers = useMemo(
    () => members.filter((item) => (
      (!memberOrganizationId || item.organizationId === memberOrganizationId)
      && (item.name.includes(memberKeyword) || item.email.includes(memberKeyword) || item.phone.includes(memberKeyword))
      && (!roleFilter || item.role === roleFilter)
      && (!statusFilter || item.status === statusFilter)
    )),
    [memberOrganizationId, memberKeyword, members, roleFilter, statusFilter],
  );
  const pagedMembers = filteredMembers.slice((memberPage - 1) * memberPageSize, memberPage * memberPageSize);

  const openMembers = (id: string) => {
    setActiveMenu("enterprise-members");
    setMemberOrganizationId(id);
    setMemberKeyword("");
    setRoleFilter("");
    setStatusFilter("");
    setMemberPage(1);
    setActiveTab("members");
  };

  const toggleOrganization = (id: string) => {
    const target = organizations.find((item) => item.id === id);
    if (!target) return;
    const status = target.status === "正常" ? "已停用" : "正常";
    setOrganizationStatus(id, status);
    toast(status === "正常" ? "企业已启用" : "企业已停用", { description: target.name });
  };

  const updateRole = (member: MemberAccount, role: MemberAccount["role"]) => {
    setMembers((items) => items.map((item) => item.id === member.id ? { ...item, role } : item));
    toast("成员角色已更新", { description: `${member.name} 已设置为${role}` });
  };

  const toggleMember = (member: MemberAccount) => {
    const status = member.status === "已停用" ? "正常" : "已停用";
    setMembers((items) => items.map((item) => item.id === member.id ? { ...item, status } : item));
    toast(status === "正常" ? "成员账号已启用" : "成员账号已停用", { description: member.name });
  };

  return (
    <>
      <PageHeader
        eyebrow="系统管理"
        title="设置"
        description="集中管理企业空间、成员账号与系统代理配置。"
        action={
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-xs text-muted lg:flex">
              <span>当前企业</span>
              <span className="font-bold text-ink">{currentOrganization.name}</span>
            </div>
            {activeMenu === "enterprise-members" && activeTab === "organizations" && <button onClick={() => toast("新建企业入口已打开", { description: "Mock 演示暂不提交真实企业信息" })} className="btn-primary"><Plus size={16} />新建企业</button>}
            {activeMenu === "enterprise-members" && activeTab === "members" && <button onClick={() => toast("邀请已发送", { description: `邀请成员加入 ${memberOrganization?.name || currentOrganization.name}` })} className="btn-primary"><MailPlus size={16} />邀请成员</button>}
            {activeMenu === "proxy" && <button onClick={() => toast("新增代理入口已打开", { description: "当前为 Mock 配置展示" })} className="btn-primary"><Plus size={16} />新增代理</button>}
          </div>
        }
      />

      <div className="grid items-start gap-5 lg:grid-cols-[236px_minmax(0,1fr)]">
        <aside className="panel sticky top-[92px] space-y-2 p-2">
          <SettingMenuItem active={activeMenu === "enterprise-members"} icon={Building2} title="企业与成员管理" description="企业空间、成员账号" onClick={() => setActiveMenu("enterprise-members")} />
          <SettingMenuItem active={activeMenu === "proxy"} icon={Network} title="代理配置" description="代理出口、同步通道" onClick={() => setActiveMenu("proxy")} />
        </aside>

        <section className="min-w-0">
          {activeMenu === "enterprise-members" && (
            <>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">企业与成员管理</h2>
                  <p className="mt-1 text-sm text-muted">管理企业空间、成员权限和账号状态。</p>
                </div>
                <PageTabs
                  tabs={[{ value: "organizations", label: "企业管理", icon: Building2 }, { value: "members", label: "成员管理", icon: Users }]}
                  value={activeTab}
                  onChange={setActiveTab}
                />
              </div>

              {activeTab === "organizations" && (
                <>
          <div className="panel mb-5 flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-xl bg-brand text-lg font-bold text-white">{currentOrganization.shortName}</div>
              <div><p className="text-xs font-semibold text-muted">当前企业空间</p><h2 className="mt-1 text-lg font-bold">{currentOrganization.name}</h2><p className="mt-1 text-xs text-muted">{currentOrganization.industry} · {currentOrganization.memberCount} 位成员 · {currentOrganization.brandCount} 个品牌</p></div>
            </div>
            <button onClick={() => toast("企业信息编辑入口已打开", { description: currentOrganization.name })} className="btn-secondary"><Pencil size={15} />编辑企业信息</button>
          </div>

          <div className="panel mb-4 flex items-center justify-between gap-4 p-4">
            <div className="relative w-full max-w-sm"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={organizationKeyword} onChange={(event) => { setOrganizationKeyword(event.target.value); setOrganizationPage(1); }} className="field pl-9" placeholder="搜索企业名称、所属行业" /></div>
            <p className="text-xs text-muted">共管理 {organizations.length} 个企业空间</p>
          </div>

          <div className="table-wrap">
            <table className="w-full text-sm">
              <thead className="table-head"><tr><th className="px-5 py-3.5">企业</th><th>所属行业</th><th>成员 / 品牌</th><th>创建时间</th><th>状态</th><th className="pr-5 text-right">操作</th></tr></thead>
              <tbody className="divide-y divide-line">
                {pagedOrganizations.map((organization) => (
                  <tr key={organization.id} className="hover:bg-[#fbfcfb]">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#d8ece3] font-bold text-brand-dark">{organization.shortName}</span><div><p className="font-bold">{organization.name}</p>{organization.id === currentOrganization.id && <p className="mt-1 text-[11px] font-semibold text-brand">当前企业</p>}</div></div></td>
                    <td className="text-muted">{organization.industry}</td>
                    <td><div className="flex gap-4 text-xs"><button onClick={() => openMembers(organization.id)} className="font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"><strong>{members.filter((member) => member.organizationId === organization.id).length}</strong> 成员</button><span><strong className="text-ink">{organization.brandCount}</strong> 品牌</span></div></td>
                    <td className="font-mono text-xs text-muted">{organization.createdAt}</td>
                    <td><StatusBadge status={organization.status} /></td>
                    <td className="pr-5"><div className="flex justify-end gap-2"><button onClick={() => toggleOrganization(organization.id)} className={cn("btn-secondary !px-3 !py-2 text-xs", organization.status === "正常" && "!border-rose-100 !text-rose-700 hover:!border-rose-300")}>{organization.status === "正常" ? <PowerOff size={14} /> : <Power size={14} />}{organization.status === "正常" ? "停用" : "启用"}</button><button onClick={() => toast("企业信息编辑入口已打开", { description: organization.name })} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="编辑企业"><Pencil size={15} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={organizationPage} pageSize={organizationPageSize} total={filteredOrganizations.length} onPageChange={setOrganizationPage} onPageSizeChange={(size) => { setOrganizationPageSize(size); setOrganizationPage(1); }} />
          </div>
                </>
              )}

              {activeTab === "members" && (
                <>
          <div className="mb-5 grid grid-cols-3 gap-4">
            <SummaryCard icon={Users} label="企业成员" value={filteredMembers.length.toString()} note={memberOrganization ? `筛选企业：${memberOrganization.name}` : "全部企业成员"} />
            <SummaryCard icon={ShieldCheck} label="管理员" value={filteredMembers.filter((item) => item.role.includes("管理员")).length.toString()} note="含超级管理员与管理员" />
            <SummaryCard icon={CircleUserRound} label="待处理账号" value={filteredMembers.filter((item) => item.status !== "正常").length.toString()} note="待邀请或已停用账号" />
          </div>

          <div className="panel mb-4 flex flex-wrap items-center gap-3 p-4">
            <div className="relative min-w-64 flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={memberKeyword} onChange={(event) => { setMemberKeyword(event.target.value); setMemberPage(1); }} className="field pl-9" placeholder="搜索姓名、邮箱、手机号" /></div>
            <FilterSelect value={memberOrganization?.name || ""} options={organizations.map((item) => item.name)} placeholder="全部企业" onChange={(value) => { const target = organizations.find((item) => item.name === value); setMemberOrganizationId(target?.id || ""); setMemberPage(1); }} />
            <FilterSelect value={roleFilter} options={["超级管理员", "管理员", "运营人员", "查看者"]} placeholder="全部角色" onChange={(value) => { setRoleFilter(value); setMemberPage(1); }} />
            <FilterSelect value={statusFilter} options={["正常", "待邀请", "已停用"]} placeholder="全部状态" onChange={(value) => { setStatusFilter(value); setMemberPage(1); }} />
          </div>

          <div className="table-wrap">
            <table className="w-full text-sm">
              <thead className="table-head"><tr><th className="px-5 py-3.5">成员</th><th>联系方式</th><th>角色</th><th>状态</th><th>最近登录时间</th><th className="pr-5 text-right">操作</th></tr></thead>
              <tbody className="divide-y divide-line">
                {pagedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#fbfcfb]">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#d6eee3] to-[#abd8c4] font-bold text-brand-dark">{member.avatar}</span><p className="font-bold">{member.name}</p></div></td>
                    <td><p className="text-xs font-semibold">{member.email}</p><p className="mt-1 text-xs text-muted">{member.phone}</p></td>
                    <td><select value={member.role} onChange={(event) => updateRole(member, event.target.value as MemberAccount["role"])} className="rounded-lg border border-line bg-white px-2.5 py-2 text-xs font-semibold outline-none focus:border-brand"><option>超级管理员</option><option>管理员</option><option>运营人员</option><option>查看者</option></select></td>
                    <td><StatusBadge status={member.status} /></td>
                    <td className="font-mono text-xs text-muted">{member.lastLogin}</td>
                    <td className="pr-5"><div className="flex justify-end gap-2">{member.status === "待邀请" && <button onClick={() => toast("邀请已重新发送", { description: member.email })} className="btn-secondary !px-3 !py-2 text-xs">重新邀请</button>}<button onClick={() => toggleMember(member)} className={cn("btn-secondary !px-3 !py-2 text-xs", member.status !== "已停用" && "!border-rose-100 !text-rose-700 hover:!border-rose-300")}>{member.status === "已停用" ? "启用" : "停用"}</button><button onClick={() => toast("成员操作菜单已打开", { description: member.name })} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="更多操作"><MoreHorizontal size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMembers.length > 0 ? <Pagination page={memberPage} pageSize={memberPageSize} total={filteredMembers.length} onPageChange={setMemberPage} onPageSizeChange={(size) => { setMemberPageSize(size); setMemberPage(1); }} /> : <div className="grid min-h-56 place-items-center text-center"><div><UserRoundCog size={28} className="mx-auto text-muted" /><p className="mt-3 font-bold">没有找到符合条件的成员</p><p className="mt-1 text-xs text-muted">尝试调整搜索或筛选条件</p></div></div>}
          </div>
                </>
              )}
            </>
          )}

          {activeMenu === "proxy" && (
            <>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">代理配置</h2>
                  <p className="mt-1 text-sm text-muted">用于配置平台授权、内容发布和数据同步的代理通道。</p>
                </div>
              </div>

              <div className="mb-5 grid gap-4 md:grid-cols-3">
                <SummaryCard icon={ServerCog} label="代理配置数" value={proxyConfigs.length.toString()} note="含生产与备用通道" />
                <SummaryCard icon={Network} label="启用中" value={proxyConfigs.filter((item) => item.status === "正常").length.toString()} note="当前可用于任务调度" />
                <SummaryCard icon={ShieldCheck} label="最近检查" value="10 分钟前" note="Mock 展示代理可用性" />
              </div>

              <div className="table-wrap">
                <table className="w-full text-sm">
                  <thead className="table-head"><tr><th className="px-5 py-3.5">代理名称</th><th>使用场景</th><th>代理地址</th><th>负责人</th><th>状态</th><th>更新时间</th><th className="pr-5 text-right">操作</th></tr></thead>
                  <tbody className="divide-y divide-line">
                    {proxyConfigs.map((proxy) => (
                      <tr key={proxy.id} className="hover:bg-[#fbfcfb]">
                        <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-pale text-brand"><ServerCog size={18} /></span><p className="font-bold">{proxy.name}</p></div></td>
                        <td className="text-muted">{proxy.scene}</td>
                        <td className="max-w-[320px] truncate font-mono text-xs text-muted" title={proxy.endpoint}>{proxy.endpoint}</td>
                        <td className="font-semibold">{proxy.owner}</td>
                        <td><StatusBadge status={proxy.status} /></td>
                        <td className="font-mono text-xs text-muted">{proxy.updatedAt}</td>
                        <td className="pr-5"><div className="flex justify-end gap-2"><button onClick={() => toast("代理连通性检测完成", { description: `${proxy.name} 当前状态：${proxy.status}` })} className="btn-secondary !px-3 !py-2 text-xs">测试</button><button onClick={() => toast("代理配置编辑入口已打开", { description: proxy.name })} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="编辑代理"><Pencil size={15} /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

function SettingMenuItem({ active, icon: Icon, title, description, onClick }: { active: boolean; icon: LucideIcon; title: string; description: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition", active ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-[#f4f8f6] hover:text-ink")}>
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", active ? "bg-white/20 text-white" : "bg-brand-pale text-brand")}><Icon size={18} /></span>
      <span className="min-w-0">
        <span className="block text-sm font-bold">{title}</span>
        <span className={cn("mt-0.5 block truncate text-xs", active ? "text-white/75" : "text-muted")}>{description}</span>
      </span>
    </button>
  );
}

function SummaryCard({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string; note: string }) {
  return <div className="panel flex items-center gap-4 p-5"><span className="grid size-11 place-items-center rounded-xl bg-brand-pale text-brand"><Icon size={20} /></span><div><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-muted">{note}</p></div></div>;
}
