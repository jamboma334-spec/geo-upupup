import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw, Send, Sparkles } from "lucide-react";
import { PageHeader, SectionTitle, StatusBadge } from "@/components/ui";
import { modelAnswers, queries } from "@/mocks/data";

export default async function QueryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const query = queries.find((item) => item.id === id) || queries[0];
  return (
    <>
      <Link href="/monitor/queries" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-brand"><ArrowLeft size={15} />返回 Query 管理</Link>
      <PageHeader
        eyebrow={`${query.querySet} / ${query.category}`}
        title={query.text}
        description={query.opportunity}
        action={<div className="flex gap-2"><Link href="/monitor/tasks" className="btn-secondary"><RefreshCw size={15} />创建复测</Link><Link href={`/content/publish/new?query=${query.id}`} className="btn-primary"><Send size={15} />准备发布内容</Link></div>}
      />
      <div className="grid grid-cols-4 gap-4">
        {[["业务优先级", query.priority], ["品牌提及", query.mentioned ? "已提及" : "品牌缺席"], ["明确推荐", query.recommended ? "已推荐" : "未推荐"], ["主要竞品", query.competitor]].map(([label, value]) => (
          <div className="panel p-5" key={label}><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-3 text-lg font-bold">{value}</p></div>
        ))}
      </div>
      <div className="mt-7 grid grid-cols-[1.55fr_0.8fr] gap-5">
        <section>
          <SectionTitle title="模型回答证据" description="结构化判断必须可以回溯至完整原始回答" />
          <div className="space-y-4">
            {modelAnswers.map((answer) => (
              <article key={answer.model} className="panel p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-brand-pale text-brand"><Sparkles size={17} /></div><div><h3 className="font-bold">{answer.model}</h3><p className="text-xs text-muted">2026-06-15 · 标准采样</p></div></div>
                  <div className="flex gap-2"><StatusBadge status={answer.mentioned ? "已提及" : "品牌缺席"} /><StatusBadge status={answer.recommended ? "已推荐" : "未推荐"} /></div>
                </div>
                <p className="mt-5 rounded-xl bg-[#f8faf9] p-4 text-sm leading-7 text-[#34483e]">{answer.answer}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted"><span>引用来源：</span>{answer.sources.map((source) => <span key={source} className="rounded-md border border-line px-2 py-1">{source}</span>)}</div>
              </article>
            ))}
          </div>
        </section>
        <aside>
          <SectionTitle title="优化建议" description="基于当前回答证据整理" />
          <div className="panel p-5">
            <p className="text-sm font-bold">建议优先补充城市通勤场景内容</p>
            <p className="mt-3 text-sm leading-6 text-muted">三个模型均优先引用竞品的城市能耗和通勤体验内容。建议发布可追溯的真实能耗、停车便利性和城区辅助驾驶体验。</p>
            <Link href={`/content/publish/new?query=${query.id}`} className="btn-primary mt-5 w-full"><Send size={15} />准备发布内容</Link>
          </div>
          <div className="panel mt-4 p-5">
            <h3 className="text-sm font-bold">主要引用来源</h3>
            <div className="mt-4 space-y-3">
              {["汽车之家车型库", "智行汽车官网", "懂车帝车型页"].map((source, i) => <div key={source} className="flex items-center justify-between text-sm"><span>{source}</span><span className="flex items-center gap-1 text-xs text-muted">{4 - i} 次<ExternalLink size={12} /></span></div>)}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
