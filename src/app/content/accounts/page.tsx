"use client";

import {
  Check,
  CheckCircle2,
  LoaderCircle,
  LogIn,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { Pagination } from "@/components/pagination";

type AccountStatus = "正常" | "即将过期" | "登录失效";

interface PlatformAccount {
  id: string;
  platform: string;
  username: string;
  avatar: string;
  status: AccountStatus;
  lastTested: string;
}

const supportedPlatforms = [
  { name: "百家号", mark: "百", color: "bg-blue-600" },
  { name: "抖音", mark: "抖", color: "bg-slate-900" },
  { name: "小红书", mark: "红", color: "bg-red-500" },
  { name: "网易号", mark: "易", color: "bg-red-700" },
  { name: "头条号", mark: "头", color: "bg-red-500" },
  { name: "搜狐号", mark: "狐", color: "bg-amber-500" },
];

const accountSeeds: PlatformAccount[] = [
  { id: "account-1", platform: "小红书", username: "远途出行笔记", avatar: "行", status: "正常", lastTested: "2026-06-15 19:32:18" },
  { id: "account-2", platform: "头条号", username: "远途汽车官方", avatar: "远", status: "正常", lastTested: "2026-06-15 17:41:06" },
  { id: "account-3", platform: "百家号", username: "远途汽车品牌号", avatar: "途", status: "即将过期", lastTested: "2026-06-14 16:30:25" },
];
const initialAccounts: PlatformAccount[] = [...accountSeeds, ...Array.from({ length: 12 }, (_, index): PlatformAccount => ({ id: `account-${index + 4}`, platform: supportedPlatforms[index % supportedPlatforms.length].name, username: `远途汽车运营账号 ${index + 1}`, avatar: ["远", "途", "运", "营"][index % 4], status: index % 5 === 0 ? "即将过期" : "正常", lastTested: `2026-06-${String(14 - Math.floor(index / 4)).padStart(2, "0")} ${String(9 + index % 9).padStart(2, "0")}:20:18` }))];

const qrPattern = [
  1,1,1,1,1,0,1,0,1,1,1,1,1, 1,0,0,0,1,0,0,1,1,0,0,0,1, 1,0,1,0,1,1,1,0,1,0,1,0,1,
  1,0,0,0,1,0,1,1,1,0,0,0,1, 1,1,1,1,1,0,1,0,1,1,1,1,1, 0,0,0,0,0,0,0,1,0,0,0,0,0,
  1,1,0,1,1,1,0,1,1,0,1,0,1, 0,1,1,0,0,1,1,0,1,1,0,1,0, 1,0,1,1,1,0,1,1,0,1,1,0,1,
  0,1,0,0,1,1,0,0,1,0,0,1,0, 1,1,1,1,1,0,1,1,1,0,1,0,1, 1,0,0,0,1,1,0,1,0,1,0,1,0,
  1,1,1,1,1,0,1,0,1,1,1,0,1,
];

function formatDateTime(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [modalStep, setModalStep] = useState<"select" | "qr">("select");
  const [gettingCode, setGettingCode] = useState(false);
  const [testingId, setTestingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<PlatformAccount | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { toast } = useToast();

  const selected = useMemo(() => supportedPlatforms.find((platform) => platform.name === selectedPlatform), [selectedPlatform]);
  const pagedAccounts = accounts.slice((page - 1) * pageSize, page * pageSize);

  const openAddModal = () => {
    setSelectedPlatform("");
    setModalStep("select");
    setGettingCode(false);
    setModalOpen(true);
  };

  const getLoginCode = () => {
    if (!selectedPlatform) return;
    setGettingCode(true);
    window.setTimeout(() => {
      setGettingCode(false);
      setModalStep("qr");
      toast("登录码获取成功", { description: `请使用 ${selectedPlatform} App 扫码登录` });
    }, 700);
  };

  const completeScan = () => {
    if (!selected) return;
    const newAccount: PlatformAccount = {
      id: `account-${Date.now()}`,
      platform: selected.name,
      username: `远途汽车${selected.name}账号`,
      avatar: "远",
      status: "正常",
      lastTested: formatDateTime(),
    };
    setAccounts((items) => [newAccount, ...items]);
    setModalOpen(false);
    toast("平台账号添加成功", { description: `${newAccount.platform} · ${newAccount.username}` });
  };

  const testLogin = (id: string) => {
    setTestingId(id);
    window.setTimeout(() => {
      const account = accounts.find((item) => item.id === id);
      setAccounts((items) => items.map((item) => item.id === id ? { ...item, status: "正常", lastTested: formatDateTime() } : item));
      setTestingId("");
      toast("登录状态测试通过", { description: `${account?.platform || "平台"}账号可以正常使用` });
    }, 900);
  };

  const removeAccount = () => {
    if (!deleteTarget) return;
    setAccounts((items) => items.filter((item) => item.id !== deleteTarget.id));
    toast("平台账号已删除", { description: `${deleteTarget.platform} · ${deleteTarget.username}` });
    setDeleteTarget(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="内容中心 / 平台授权"
        title="平台与账号"
        description="通过平台扫码登录添加账号，统一测试登录状态并管理发布权限。"
        action={<button onClick={openAddModal} className="btn-primary"><Plus size={16} />添加平台账号</button>}
      />

      <div className="mb-5 grid grid-cols-3 gap-4">
        <div className="panel p-5"><p className="text-xs font-semibold text-muted">已添加账号</p><p className="mt-3 text-3xl font-bold">{accounts.length}</p><p className="mt-2 text-xs text-muted">支持同平台添加多个账号</p></div>
        <div className="panel p-5"><p className="text-xs font-semibold text-muted">登录状态正常</p><p className="mt-3 text-3xl font-bold text-emerald-700">{accounts.filter((item) => item.status === "正常").length}</p><p className="mt-2 text-xs text-muted">可正常发布与同步数据</p></div>
        <div className="panel p-5"><p className="text-xs font-semibold text-muted">需要处理</p><p className="mt-3 text-3xl font-bold text-amber-700">{accounts.filter((item) => item.status !== "正常").length}</p><p className="mt-2 text-xs text-muted">建议重新扫码登录</p></div>
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="px-5 py-3.5">平台</th><th>用户信息</th><th>登录状态</th><th>最近测试时间</th><th className="pr-5 text-right">操作</th></tr></thead>
          <tbody className="divide-y divide-line">
            {pagedAccounts.map((account) => {
              const platform = supportedPlatforms.find((item) => item.name === account.platform);
              return (
                <tr key={account.id} className="hover:bg-[#fbfcfb]">
                  <td className="px-5 py-5"><div className="flex items-center gap-3"><div className={`grid size-11 place-items-center rounded-xl font-bold text-white ${platform?.color || "bg-brand"}`}>{platform?.mark || account.platform.slice(0, 1)}</div><p className="font-bold">{account.platform}</p></div></td>
                  <td><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#d6eee3] to-[#abd8c4] text-sm font-bold text-brand-dark">{account.avatar}</div><span className="font-semibold">{account.username}</span></div></td>
                  <td><StatusBadge status={account.status} /></td>
                  <td className="font-mono text-xs text-muted">{account.lastTested}</td>
                  <td className="pr-5"><div className="flex justify-end gap-2"><button onClick={() => testLogin(account.id)} disabled={testingId === account.id} className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-brand/30 hover:bg-brand-pale hover:text-brand disabled:cursor-wait" title={testingId === account.id ? "正在测试登录状态" : "测试登录状态"}>{testingId === account.id ? <LoaderCircle size={15} className="animate-spin" /> : <ShieldCheck size={15} />}</button><button onClick={() => setDeleteTarget(account)} className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" title="删除账号"><Trash2 size={15} /></button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {accounts.length > 0 && <Pagination page={page} pageSize={pageSize} total={accounts.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />}
        {accounts.length === 0 && <div className="grid min-h-64 place-items-center text-center"><div><p className="font-bold">还没有添加平台账号</p><p className="mt-2 text-sm text-muted">添加账号后即可进行多平台内容发布</p><button onClick={openAddModal} className="btn-primary mt-5"><Plus size={15} />添加平台账号</button></div></div>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#091c14]/55 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setModalOpen(false); }}>
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-line px-6 py-5">
              <div><h2 className="text-lg font-bold">{modalStep === "select" ? "添加平台账号" : `扫码登录 ${selectedPlatform}`}</h2><p className="mt-1 text-xs text-muted">{modalStep === "select" ? "选择需要添加的平台，获取该平台的登录码" : "请使用对应平台 App 扫描登录码"}</p></div>
              <button onClick={() => setModalOpen(false)} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-slate-100"><X size={18} /></button>
            </div>

            {modalStep === "select" && (
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3">
                  {supportedPlatforms.map((platform) => {
                    const active = selectedPlatform === platform.name;
                    return <button key={platform.name} onClick={() => setSelectedPlatform(platform.name)} className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition ${active ? "border-brand bg-brand-pale ring-2 ring-brand/10" : "border-line hover:border-brand/40"}`}><div className={`grid size-10 place-items-center rounded-xl font-bold text-white ${platform.color}`}>{platform.mark}</div><div><p className="text-sm font-bold">{platform.name}</p><p className="mt-1 text-[11px] text-muted">扫码登录</p></div>{active && <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-brand text-white"><Check size={12} /></span>}</button>;
                  })}
                </div>
                <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f8faf9] p-4"><div className="flex items-start gap-3"><LogIn size={18} className="mt-0.5 text-brand" /><div><p className="text-sm font-semibold">使用平台官方扫码登录</p><p className="mt-1 text-xs text-muted">系统仅保存登录授权状态，不保存账号明文密码。</p></div></div><button disabled={!selectedPlatform || gettingCode} onClick={getLoginCode} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">{gettingCode ? <LoaderCircle size={15} className="animate-spin" /> : <RefreshCw size={15} />}{gettingCode ? "获取中..." : "获取登录码"}</button></div>
              </div>
            )}

            {modalStep === "qr" && (
              <div className="px-6 py-8 text-center">
                <div className={`mx-auto mb-4 grid size-12 place-items-center rounded-xl font-bold text-white ${selected?.color}`}>{selected?.mark}</div>
                <p className="font-bold">使用 {selectedPlatform} App 扫码登录</p>
                <p className="mt-1 text-xs text-muted">登录码将在 4 分 58 秒后失效</p>
                <div className="mx-auto mt-6 grid size-52 grid-cols-[repeat(13,minmax(0,1fr))] gap-[2px] rounded-xl border-8 border-white bg-white p-2 shadow-[0_0_0_1px_#e4ebe7]">
                  {qrPattern.map((cell, index) => <span key={index} className={cell ? "bg-[#11251c]" : "bg-white"} />)}
                </div>
                <p className="mt-5 text-xs text-muted">Mock 演示：点击下方按钮模拟扫码授权成功</p>
                <div className="mt-6 flex justify-center gap-3"><button onClick={() => setModalStep("select")} className="btn-secondary">返回选择平台</button><button onClick={completeScan} className="btn-primary"><CheckCircle2 size={16} />模拟扫码成功</button></div>
              </div>
            )}
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/45 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setDeleteTarget(null); }}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-700"><Trash2 size={18} /></div>
              <div><h2 className="font-bold">删除平台账号？</h2><p className="mt-2 text-sm leading-6 text-muted">确定删除 <strong className="text-ink">{deleteTarget.platform} · {deleteTarget.username}</strong> 吗？删除后将不能继续发布和同步数据。</p></div>
            </div>
            <div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeleteTarget(null)} className="btn-secondary !py-2">取消</button><button onClick={removeAccount} className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"><Trash2 size={14} />确认删除</button></div>
          </div>
        </div>
      )}
    </>
  );
}
