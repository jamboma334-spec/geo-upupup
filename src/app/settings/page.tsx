"use client";

import {
  Building2,
  Check,
  ChevronRight,
  CircleUserRound,
  MailPlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  UserRoundCog,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useOrganization } from "@/components/organization-provider";
import { Pagination } from "@/components/pagination";
import { useToast } from "@/components/toast-provider";
import { StatusBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { memberAccounts as memberSeeds, type MemberAccount } from "@/mocks/organizations";

type SettingTab = "organizations" | "members";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>("organizations");
  const [organizationKeyword, setOrganizationKeyword] = useState("");
  const [organizationPage, setOrganizationPage] = useState(1);
  const [organizationPageSize, setOrganizationPageSize] = useState(10);
  const [members, setMembers] = useState(memberSeeds);
  const [memberKeyword, setMemberKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("全部角色");
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [memberPage, setMemberPage] = useState(1);
  const [memberPageSize, setMemberPageSize] = useState(10);
  const { organizations, currentOrganization, setCurrentOrganizationId } = useOrganization();
  const { toast } = useToast();

  const filteredOrganizations = useMemo(
    () => organizations.filter((item) => item.name.includes(organizationKeyword) || item.industry.includes(organizationKeyword)),
    [organizationKeyword, organizations],
  );
  const pagedOrganizations = filteredOrganizations.slice((organizationPage - 1) * organizationPageSize, organizationPage * organizationPageSize);

  const filteredMembers = useMemo(
    () => members.filter((item) => (
      item.organizationId === currentOrganization.id
      && (item.name.includes(memberKeyword) || item.email.includes(memberKeyword) || item.phone.includes(memberKeyword))
      && (roleFilter === "全部角色" || item.role === roleFilter)
      && (statusFilter === "全部状态" || item.status === statusFilter)
    )),
    [currentOrganization.id, memberKeyword, members, roleFilter, statusFilter],
  );
  const pagedMembers = filteredMembers.slice((memberPage - 1) * memberPageSize, memberPage * memberPageSize);

  const switchOrganization = (id: string) => {
    const target = organizations.find((item) => item.id === id);
    if (!target || target.id === currentOrganization.id) return;
    setCurrentOrganizationId(id);
    setMemberPage(1);
    toast("企业切换成功", { description: `当前企业已切换为 ${target.name}` });
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">系统管理</p>
            <h1 className="mt-1 text-[28px] font-bold tracking-tight text-ink">设置</h1>
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1 shadow-panel">
            <TabButton active={activeTab === "organizations"} icon={Building2} label="企业管理" onClick={() => setActiveTab("organizations")} />
            <TabButton active={activeTab === "members"} icon={Users} label="账号管理" onClick={() => setActiveTab("members")} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-xs text-muted lg:flex">
            <span>当前企业</span>
            <span className="font-bold text-ink">{currentOrganization.name}</span>
          </div>
          {activeTab === "organizations"
            ? <button onClick={() => toast("新建企业入口已打开", { description: "Mock 演示暂不提交真实企业信息" })} className="btn-primary"><Plus size={16} />新建企业</button>
            : <button onClick={() => toast("邀请已发送", { description: `邀请成员加入 ${currentOrganization.name}` })} className="btn-primary"><MailPlus size={16} />邀请成员</button>}
        </div>
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
                    <td><div className="flex gap-4 text-xs"><span><strong className="text-ink">{organization.memberCount}</strong> 成员</span><span><strong className="text-ink">{organization.brandCount}</strong> 品牌</span></div></td>
                    <td className="font-mono text-xs text-muted">{organization.createdAt}</td>
                    <td><StatusBadge status={organization.status} /></td>
                    <td className="pr-5"><div className="flex justify-end gap-2">{organization.status === "正常" && organization.id !== currentOrganization.id && <button onClick={() => switchOrganization(organization.id)} className="btn-secondary !px-3 !py-2 text-xs">切换至该企业<ChevronRight size={14} /></button>}<button onClick={() => toast("企业信息编辑入口已打开", { description: organization.name })} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="编辑企业"><Pencil size={15} /></button></div></td>
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
            <SummaryCard icon={Users} label="企业成员" value={filteredMembers.length.toString()} note={`当前企业：${currentOrganization.name}`} />
            <SummaryCard icon={ShieldCheck} label="管理员" value={filteredMembers.filter((item) => item.role.includes("管理员")).length.toString()} note="含超级管理员与管理员" />
            <SummaryCard icon={CircleUserRound} label="待处理账号" value={filteredMembers.filter((item) => item.status !== "正常").length.toString()} note="待邀请或已停用账号" />
          </div>

          <div className="panel mb-4 flex flex-wrap items-center gap-3 p-4">
            <div className="relative min-w-64 flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={memberKeyword} onChange={(event) => { setMemberKeyword(event.target.value); setMemberPage(1); }} className="field pl-9" placeholder="搜索姓名、邮箱、手机号" /></div>
            <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setMemberPage(1); }} className="field !w-40"><option>全部角色</option><option>超级管理员</option><option>管理员</option><option>运营人员</option><option>查看者</option></select>
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setMemberPage(1); }} className="field !w-36"><option>全部状态</option><option>正常</option><option>待邀请</option><option>已停用</option></select>
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
  );
}

function TabButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Building2; label: string; onClick: () => void }) {
  return <button onClick={onClick} className={cn("flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition", active ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-[#f4f8f6] hover:text-ink")}><Icon size={16} />{label}{active && <Check size={13} />}</button>;
}

function SummaryCard({ icon: Icon, label, value, note }: { icon: typeof Users; label: string; value: string; note: string }) {
  return <div className="panel flex items-center gap-4 p-5"><span className="grid size-11 place-items-center rounded-xl bg-brand-pale text-brand"><Icon size={20} /></span><div><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-muted">{note}</p></div></div>;
}
