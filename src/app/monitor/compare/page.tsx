import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHeader, SectionTitle, StatusBadge } from "@/components/ui";
import { queries } from "@/mocks/data";
import { ActionButton } from "@/components/action-button";

export default function ComparePage() {
  return (
    <>
      <PageHeader eyebrow="监测中心 / 批次对比" title="发布前后表现对比" description="使用相同 Query 集与模型配置，观察优化前后的品牌表现变化。" />
      <div className="panel mb-5 flex items-center gap-5 p-5"><select className="field"><option>6 月基线评测 · 2026-06-01</option></select><ArrowRight className="shrink-0 text-muted" /><select className="field"><option>6 月品牌表现复测 · 2026-06-15</option></select><ActionButton message="对比结果已更新" description="已使用选定批次重新计算指标" toastType="success" className="btn-primary shrink-0">更新对比</ActionButton></div>
      <div className="grid grid-cols-3 gap-4">{[["品牌提及率", "44%", "52%", "+8%"], ["品牌推荐率", "25%", "31%", "+6%"], ["品牌答案份额", "26.8%", "31%", "+4.2%"]].map(([label, before, after, delta]) => <div className="panel p-5" key={label}><p className="text-sm font-semibold text-muted">{label}</p><div className="mt-5 flex items-center gap-3"><span className="text-xl text-muted">{before}</span><ArrowRight size={17} className="text-muted" /><strong className="text-3xl">{after}</strong><span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{delta}</span></div></div>)}</div>
      <div className="mt-7"><SectionTitle title="发生变化的 Query" description="以下变化均可下钻至对应 Query 集" /><div className="table-wrap"><table className="w-full text-sm"><thead className="table-head"><tr><th className="px-5 py-3.5">Query</th><th>基线结果</th><th>复测结果</th><th>变化</th><th className="pr-5 text-right">证据</th></tr></thead><tbody className="divide-y divide-line">{queries.slice(0,4).map((query, i) => <tr key={query.id}><td className="px-5 py-4 font-semibold">{query.text}</td><td className="text-muted">{i % 2 ? "已提及，未推荐" : "品牌缺席"}</td><td>{i % 2 ? "已提及，已推荐" : "已提及，未推荐"}</td><td><StatusBadge status={i % 2 ? "推荐改善" : "新增提及"} /></td><td className="pr-5 text-right"><Link href={`/monitor/queries/${query.querySetId}`} className="font-semibold text-brand">查看 Query 集</Link></td></tr>)}</tbody></table></div></div>
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"><CheckCircle2 size={18} className="mt-0.5 shrink-0" />本页展示的是评测结果变化。内容发布可能与变化相关，但不能据此认定确定因果关系。</div>
    </>
  );
}
