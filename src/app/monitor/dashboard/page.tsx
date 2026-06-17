import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, FileSearch, Sparkles } from "lucide-react";
import { MetricCard, PageHeader, SectionTitle, StatusBadge } from "@/components/ui";
import { ShareChart, TrendChart } from "@/components/dashboard-charts";
import { evaluationTasks, publishTasks, queries } from "@/mocks/data";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="监测中心"
        title="品牌表现总览"
        description="发现品牌在 AI 回答中的缺席、错误与机会，并持续验证内容发布后的变化。"
        action={<Link href="/monitor/tasks" className="btn-primary"><Sparkles size={16} />创建复测</Link>}
      />
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="品牌提及率" value="52%" change="+8.0%" note="有效回答中出现远途汽车的比例" />
        <MetricCard label="品牌推荐率" value="31%" change="+6.0%" note="回答中明确推荐远途汽车的比例" />
        <MetricCard label="品牌答案份额" value="31%" change="+4.2%" note="目标品牌与主要竞品的提及份额" />
        <MetricCard label="有效引用来源" value="38" change="+7" note="本批次回答中可追溯的来源数量" />
      </div>

      <div className="mt-7 grid grid-cols-[1.45fr_1fr] gap-5">
        <section className="panel p-5">
          <SectionTitle title="批次趋势" description="相同 Query 集在最近四次评测中的表现" href="/monitor/compare" linkLabel="进入批次对比" />
          <TrendChart />
        </section>
        <section className="panel p-5">
          <SectionTitle title="竞品答案份额" description="本批次各品牌被提及的相对份额" />
          <ShareChart />
        </section>
      </div>

      <div className="mt-7 grid grid-cols-[1.45fr_1fr] gap-5">
        <section>
          <SectionTitle title="优先优化机会" description="综合业务优先级与最近评测结果排序" href="/monitor/queries" />
          <div className="space-y-3">
            {queries.slice(0, 4).map((query, index) => (
              <div key={query.id} className="panel flex items-center gap-4 p-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
                  {index === 0 ? <AlertTriangle size={19} /> : <FileSearch size={19} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={query.priority} />
                    <p className="truncate text-sm font-bold">{query.text}</p>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">{query.opportunity}</p>
                </div>
                <Link href={`/monitor/queries/${query.querySetId}`} className="btn-secondary !px-3 !py-2">查看 Query 集<ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionTitle title="最近行动" description="发布与评测任务的最新进展" />
          <div className="panel divide-y divide-line px-5">
            {[
              { title: publishTasks[0].title, meta: "发布任务 · 3 个平台", status: publishTasks[0].status, href: `/content/publish/${publishTasks[0].id}` },
              { title: evaluationTasks[0].name, meta: "评测任务 · 76 个回答", status: evaluationTasks[0].status, href: `/monitor/tasks/${evaluationTasks[0].id}` },
              { title: publishTasks[1].title, meta: "发布任务 · 2 个平台", status: publishTasks[1].status, href: `/content/publish/${publishTasks[1].id}` },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="flex items-center gap-3 py-4">
                <CheckCircle2 size={18} className="text-brand" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-muted">{item.meta}</p>
                </div>
                <StatusBadge status={item.status} />
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
            指标变化仅表示相关性，不代表内容发布与 AI 回答变化之间存在确定因果。
          </div>
        </section>
      </div>
    </>
  );
}
