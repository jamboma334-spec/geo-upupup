"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ChevronRight, Image as ImageIcon, Send } from "lucide-react";
import { Suspense, useState } from "react";
import { PageHeader } from "@/components/ui";
import { queries } from "@/mocks/data";

const accounts = ["知乎 · 远途汽车官方", "小红书 · 远途出行笔记", "微信公众号 · 远途汽车"];

function NewPublishContent() {
  const queryId = useSearchParams().get("query") || "q-001";
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(accounts);
  const [title, setTitle] = useState("城市通勤纯电 SUV 选购指南：真正影响每天体验的 5 个细节");
  const query = queries.find((item) => item.id === queryId) || queries[0];

  return (
    <>
      <PageHeader eyebrow="内容中心 / 新建发布任务" title="准备多平台发布" description={`关联优化机会：${query.text}`} />
      <div className="mb-6 flex items-center rounded-2xl border border-line bg-white p-3 shadow-panel">
        {["填写内容", "选择账号", "平台预览", "确认发布"].map((label, index) => <div key={label} className="flex flex-1 items-center"><button onClick={() => setStep(index + 1)} className={`flex items-center gap-2 text-sm font-semibold ${step >= index + 1 ? "text-brand" : "text-muted"}`}><span className={`grid size-7 place-items-center rounded-full ${step > index + 1 ? "bg-brand text-white" : step === index + 1 ? "bg-brand-pale text-brand" : "bg-slate-100 text-muted"}`}>{step > index + 1 ? <Check size={14} /> : index + 1}</span>{label}</button>{index < 3 && <ChevronRight size={16} className="ml-auto text-slate-300" />}</div>)}
      </div>
      <div className="panel p-6">
        {step === 1 && <div className="mx-auto max-w-3xl space-y-5"><div><label className="mb-2 block text-sm font-semibold">内容标题</label><input className="field" value={title} onChange={(e) => setTitle(e.target.value)} /></div><div><label className="mb-2 block text-sm font-semibold">正文内容</label><textarea className="field min-h-64 resize-none leading-7" defaultValue={"城市通勤看似简单，真正影响日常体验的却不只是续航数字。\n\n我们结合真实通勤路线，从城区能耗、停车便利性、补能效率、乘坐舒适度与智能辅助五个维度，记录远途 X7 的日常表现……"} /></div><div><label className="mb-2 block text-sm font-semibold">封面素材</label><div className="grid h-36 place-items-center rounded-xl border border-dashed border-line bg-[#fafcfb] text-center text-muted"><div><ImageIcon className="mx-auto mb-2" size={24} /><p className="text-sm">点击上传封面图</p><p className="mt-1 text-xs">Mock 模式仅展示占位图</p></div></div></div></div>}
        {step === 2 && <div className="mx-auto max-w-3xl"><h2 className="text-lg font-bold">选择发布账号</h2><p className="mt-1 text-sm text-muted">同一内容将发布至选中的平台账号。</p><div className="mt-5 space-y-3">{accounts.map((account) => <label key={account} className="flex items-center gap-4 rounded-xl border border-line p-4 hover:border-brand"><input type="checkbox" checked={selected.includes(account)} onChange={() => setSelected(selected.includes(account) ? selected.filter((item) => item !== account) : [...selected, account])} className="size-4 accent-brand" /><div className="grid size-10 place-items-center rounded-lg bg-brand-pale text-sm font-bold text-brand">{account.slice(0, 1)}</div><div><p className="font-semibold">{account}</p><p className="mt-1 text-xs text-muted">授权正常 · 支持发布和数据读取</p></div></label>)}</div></div>}
        {step === 3 && <div className="grid grid-cols-3 gap-4">{selected.map((account) => <div key={account} className="rounded-2xl border border-line p-4"><div className="flex items-center gap-2 border-b border-line pb-3"><div className="grid size-8 place-items-center rounded-lg bg-brand-pale font-bold text-brand">{account.slice(0,1)}</div><p className="text-sm font-bold">{account}</p></div><h3 className="mt-4 font-bold leading-6">{title}</h3><div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-[#d7f3e7] to-[#9bdcbe]" /><p className="mt-3 line-clamp-4 text-xs leading-5 text-muted">城市通勤看似简单，真正影响日常体验的却不只是续航数字。我们结合真实通勤路线，从城区能耗、停车便利性……</p></div>)}</div>}
        {step === 4 && <div className="mx-auto max-w-2xl text-center"><div className="mx-auto grid size-14 place-items-center rounded-full bg-brand-pale text-brand"><Send size={22} /></div><h2 className="mt-5 text-xl font-bold">确认创建发布任务</h2><p className="mt-2 text-sm text-muted">内容将立即模拟发布至 {selected.length} 个平台账号。</p><div className="mt-6 rounded-xl bg-[#f8faf9] p-5 text-left text-sm"><p className="font-bold">{title}</p><p className="mt-2 text-muted">关联 Query：{query.text}</p><p className="mt-2 text-muted">目标账号：{selected.join("、")}</p></div><Link href="/content/publish/pub-20260612" className="btn-primary mt-6"><Send size={16} />确认发布</Link></div>}
        <div className="mt-7 flex justify-between border-t border-line pt-5"><button disabled={step === 1} onClick={() => setStep(Math.max(1, step - 1))} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40">上一步</button>{step < 4 && <button onClick={() => setStep(Math.min(4, step + 1))} className="btn-primary">下一步<ChevronRight size={16} /></button>}</div>
      </div>
    </>
  );
}

export default function NewPublishPage() {
  return (
    <Suspense fallback={<div className="panel min-h-96 animate-pulse bg-white" />}>
      <NewPublishContent />
    </Suspense>
  );
}
