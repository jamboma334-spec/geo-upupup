"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Bot, Check, Eye, FilePlus2, Plus, RefreshCw, Search, Send, Snowflake, Sparkles, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { FilterSelect } from "@/components/filter-select";
import { Pagination } from "@/components/pagination";
import { useToast } from "@/components/toast-provider";
import { PageHeader, SectionTitle, StatusBadge } from "@/components/ui";
import { queries, querySets } from "@/mocks/data";
import type { QueryItem } from "@/types";

const scenarioOptions = ["选购决策", "品牌认知", "口碑评价", "竞品比较", "价格预算", "售后服务", "使用场景"];

const recommendedQueries = [
  { text: "远途 X7 和智行 S6 哪个更适合每天通勤？", priority: "高" as const, opportunity: "围绕核心竞品补充通勤场景对比" },
  { text: "25 万预算买远途 X7 值得吗？", priority: "高" as const, opportunity: "覆盖价格带决策 Query" },
  { text: "远途汽车售后网点覆盖怎么样？", priority: "中" as const, opportunity: "补充服务权益和网点覆盖事实" },
  { text: "远途 X7 家庭用户真实空间体验如何？", priority: "中" as const, opportunity: "用于承接家庭用户内容素材" },
];

const responseBatches = [
  {
    id: "eval-20260615",
    name: "6 月品牌表现复测",
    date: "2026-06-15 10:20",
    models: [
      {
        model: "豆包",
        mentioned: true,
        recommended: false,
        answer: "如果关注日常通勤，可以把远途 X7、智行 S6 和跃界 C5 放在同一组比较。远途 X7 空间表现更充裕，但公开的城市能耗实测内容还不算多。",
        sources: ["远途汽车官网", "汽车之家车型库"],
      },
      {
        model: "DeepSeek",
        mentioned: false,
        recommended: false,
        answer: "25 万级纯电 SUV 可以重点关注补能便利性、城区能耗和智能辅助驾驶。智行 S6 在公开资料中较常被提到，适合优先对比。",
        sources: ["懂车帝车型页", "智行汽车官网"],
      },
      {
        model: "Kimi",
        mentioned: true,
        recommended: true,
        answer: "远途 X7 适合重视家庭空间和长途舒适性的用户。如果主要是城市通勤，建议结合真实能耗和停车便利性进一步比较。",
        sources: ["远途汽车官网", "汽车之家口碑"],
      },
      {
        model: "通义千问",
        mentioned: true,
        recommended: false,
        answer: "远途 X7 可以作为家庭空间需求较强的备选车型，但通勤场景下建议继续比较能耗、车身尺寸和停车便利性。",
        sources: ["远途汽车官网", "汽车之家车型库"],
      },
    ],
  },
  {
    id: "eval-20260601",
    name: "6 月基线评测",
    date: "2026-06-01 09:10",
    models: [
      {
        model: "豆包",
        mentioned: false,
        recommended: false,
        answer: "适合城市通勤的新能源 SUV 可以考虑智行 S6 和跃界 C5，它们在城区能耗、尺寸和智能驾驶配置上都有较多公开资料。",
        sources: ["汽车之家车型库", "智行汽车官网"],
      },
      {
        model: "DeepSeek",
        mentioned: false,
        recommended: false,
        answer: "预算 25 万左右可以优先看补能效率、车身尺寸和售后网点。当前公开内容里智行 S6 的通勤场景资料更充分。",
        sources: ["懂车帝车型页"],
      },
      {
        model: "Kimi",
        mentioned: true,
        recommended: false,
        answer: "远途 X7、智行 S6 和跃界 C5 都覆盖城市通勤场景。远途 X7 空间较大，但针对纯城市通勤的实测资料较少。",
        sources: ["远途汽车官网", "汽车之家车型库"],
      },
      {
        model: "通义千问",
        mentioned: false,
        recommended: false,
        answer: "城市通勤可以重点关注智行 S6、跃界 C5 等公开资料较多的车型，并结合续航达成率和售后网点做判断。",
        sources: ["汽车之家车型库", "懂车帝车型页"],
      },
    ],
  },
];

function getModelSignals(query: QueryItem) {
  const latestModels = responseBatches[0].models;
  const seed = [...query.id].reduce((total, char) => total + char.charCodeAt(0), 0);

  return latestModels.map((model, index) => {
    const mentioned = query.mentioned && (model.mentioned || (seed + index) % 3 !== 0);
    const recommended = mentioned && query.recommended && (model.recommended || (seed + index) % 2 === 0);
    return { model: model.model, mentioned, recommended };
  });
}

export default function QuerySetDetailPage() {
  const params = useParams<{ id: string }>();
  const querySet = querySets.find((item) => item.id === params.id) || querySets[0];
  const [items, setItems] = useState<QueryItem[]>(queries.filter((query) => query.querySetId === querySet.id));
  const [keyword, setKeyword] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newQueryText, setNewQueryText] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [recommendModalOpen, setRecommendModalOpen] = useState(false);
  const [responseQuery, setResponseQuery] = useState<QueryItem | null>(null);
  const [responseModelFilter, setResponseModelFilter] = useState("");
  const [responseBatchFilter, setResponseBatchFilter] = useState("");
  const [responseKeyword, setResponseKeyword] = useState("");
  const [recommendScene, setRecommendScene] = useState(querySet.scenario);
  const [recommendDirections, setRecommendDirections] = useState(["推荐", "比较"]);
  const { toast } = useToast();

  const filteredItems = items.filter((query) => (
    query.text.includes(keyword)
    && (!priorityFilter || query.priority === priorityFilter)
  ));
  const pagedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);
  const responseRecords = responseBatches.flatMap((batch) => batch.models.map((item) => ({
    ...item,
    batchId: batch.id,
    batchName: batch.name,
    batchDate: batch.date,
  })));
  const filteredResponseRecords = responseRecords.filter((record) => (
    (!responseModelFilter || record.model === responseModelFilter)
    && (!responseBatchFilter || record.batchName === responseBatchFilter)
    && (!responseKeyword || record.answer.includes(responseKeyword) || record.sources.some((source) => source.includes(responseKeyword)))
  ));

  const stats = useMemo(() => ({
    total: items.length,
    highPriority: items.filter((query) => query.priority === "高").length,
    missing: items.filter((query) => !query.mentioned).length,
    recommended: items.filter((query) => query.recommended).length,
  }), [items]);

  const addManualQuery = () => {
    const text = newQueryText.trim();
    if (!text) {
      toast("请输入 Query 内容", { description: "Query 内容不能为空" });
      return;
    }
    setItems((current) => [{
      id: `q-local-${Date.now()}`,
      text,
      priority: "中",
      querySetId: querySet.id,
      querySet: `${querySet.name} ${querySet.version}`,
      mentioned: false,
      recommended: false,
      competitor: "待评测",
      opportunity: "新添加 Query，等待下一次评测生成表现",
    }, ...current]);
    setNewQueryText("");
    setShowAddForm(false);
    setPage(1);
    toast("Query 已添加", { description: text, type: "success" });
  };

  const removeQuery = (id: string) => {
    setItems((current) => current.filter((query) => query.id !== id));
    setPage(1);
    toast("Query 已从当前集合移除", { type: "success" });
  };

  const toggleRecommendation = (text: string) => {
    setSelectedRecommendations((current) => current.includes(text) ? current.filter((item) => item !== text) : [...current, text]);
  };

  const toggleDirection = (direction: string) => {
    setRecommendDirections((current) => current.includes(direction) ? current.filter((item) => item !== direction) : [...current, direction]);
  };

  const addRecommendations = () => {
    const additions = recommendedQueries.filter((query) => selectedRecommendations.includes(query.text));
    if (additions.length === 0) {
      toast("请先选择推荐 Query", { description: "勾选后可以批量加入当前 Query 集" });
      return;
    }
    setItems((current) => [
      ...additions.map((query, index): QueryItem => ({
        id: `q-ai-${Date.now()}-${index}`,
        text: query.text,
        priority: query.priority,
        querySetId: querySet.id,
        querySet: `${querySet.name} ${querySet.version}`,
        mentioned: false,
        recommended: false,
        competitor: "待评测",
        opportunity: query.opportunity,
      })),
      ...current,
    ]);
    setRecommendModalOpen(false);
    setSelectedRecommendations([]);
    setPage(1);
    toast("AI 推荐 Query 已加入", { description: `已加入 ${additions.length} 条 Query`, type: "success" });
  };

  const updateKeyword = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const updatePriorityFilter = (value: string) => {
    setPriorityFilter(value);
    setPage(1);
  };

  const openResponseList = (query: QueryItem) => {
    setResponseQuery(query);
    setResponseModelFilter("");
    setResponseBatchFilter("");
    setResponseKeyword("");
  };

  return (
    <>
      <Link href="/monitor/queries" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-brand"><ArrowLeft size={15} />返回 Query 集</Link>
      <PageHeader
        eyebrow={`Query 管理 / ${querySet.scenario}`}
        title={`${querySet.name} ${querySet.version}`}
        description={querySet.description}
        action={
          <div className="flex gap-2">
            <ActionButton message="Query 集已冻结" description="冻结后如需修改，可复制为新版本" toastType="success" className="btn-secondary"><Snowflake size={15} />冻结版本</ActionButton>
            <ActionButton message="评测任务创建成功" description="已继承当前 Query 集配置" toastType="success" className="btn-primary"><Bot size={15} />创建评测任务</ActionButton>
          </div>
        }
      />

      <div className="panel mb-7 grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_520px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={querySet.status} />
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-muted">{querySet.version}</span>
            <span className="rounded-md bg-brand-pale px-2 py-1 text-[11px] font-bold text-brand">{querySet.scenario}</span>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-2">
            <p>关联品牌：<span className="font-semibold text-ink">{querySet.brand}</span></p>
            <p>关联产品 / 服务：<span className="font-semibold text-ink">{querySet.offering}</span></p>
            <p>负责人：<span className="font-semibold text-ink">{querySet.owner}</span></p>
            <p>更新时间：<span className="font-semibold text-ink">{querySet.updatedAt}</span></p>
            <p className="md:col-span-2">最近评测：<span className="font-semibold text-ink">{querySet.lastEvaluatedAt || "暂无评测"}</span></p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl border border-line bg-[#f8faf9] p-4"><p className="text-xs font-semibold text-muted">Query</p><p className="mt-2 text-2xl font-bold">{stats.total}</p></div>
          <div className="rounded-xl border border-line bg-[#f8faf9] p-4"><p className="text-xs font-semibold text-muted">高优先级</p><p className="mt-2 text-2xl font-bold">{stats.highPriority}</p></div>
          <div className="rounded-xl border border-line bg-[#fff7f7] p-4"><p className="text-xs font-semibold text-muted">品牌缺席</p><p className="mt-2 text-2xl font-bold text-rose-700">{stats.missing}</p></div>
          <div className="rounded-xl border border-line bg-[#f3fbf7] p-4"><p className="text-xs font-semibold text-muted">已推荐</p><p className="mt-2 text-2xl font-bold text-emerald-700">{stats.recommended}</p></div>
        </div>
      </div>

      <section>
        <SectionTitle title="Query 列表" description="在当前 Query 集内查看、添加和维护需要评测的问题" />
        <div className="panel mb-4 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-72 flex-1"><Search size={16} className="absolute left-3 top-3 text-muted" /><input value={keyword} onChange={(event) => updateKeyword(event.target.value)} className="field pl-9" placeholder="搜索 Query 内容" /></label>
            <FilterSelect value={priorityFilter} options={["高", "中", "低"]} placeholder="全部优先级" onChange={updatePriorityFilter} className="w-36" />
            <button onClick={() => setShowAddForm((open) => !open)} className="btn-secondary"><Plus size={15} />手动添加</button>
            <button onClick={() => setRecommendModalOpen(true)} className="btn-secondary"><Sparkles size={15} />AI 推荐</button>
            <ActionButton message="已打开批量导入" description="Mock 版本暂不读取真实文件" className="btn-secondary"><FilePlus2 size={15} />批量导入</ActionButton>
          </div>

          {showAddForm && (
            <div className="mt-4 rounded-xl border border-line bg-[#f8faf9] p-4">
              <p className="mb-2 text-xs font-semibold text-muted">添加 Query</p>
              <div className="flex items-start gap-3">
                <textarea value={newQueryText} onChange={(event) => setNewQueryText(event.target.value)} className="field min-h-20 resize-none" placeholder="输入用户会向 AI 提出的真实问题" />
                <div className="flex shrink-0 flex-col gap-2">
                  <button onClick={addManualQuery} className="btn-primary !py-2"><Plus size={15} />添加</button>
                  <button onClick={() => { setShowAddForm(false); setNewQueryText(""); }} className="btn-secondary !py-2">取消</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="table-wrap">
          <table className="w-full text-sm">
            <thead className="table-head"><tr><th className="px-5 py-3.5">Query</th><th>优先级</th><th>最近表现</th><th>主要竞品</th><th className="pr-5 text-right">操作</th></tr></thead>
            <tbody className="divide-y divide-line">
              {pagedItems.map((query) => (
                <tr key={query.id} className="hover:bg-[#fbfcfb]">
                  <td className="max-w-xl px-5 py-4 font-semibold">{query.text}</td>
                  <td><StatusBadge status={query.priority} /></td>
                  <td>
                    <div className="flex max-w-sm flex-wrap gap-1.5">
                      {getModelSignals(query).map((signal) => {
                        const status = signal.recommended ? "推荐" : signal.mentioned ? "提及" : "缺席";
                        const tone = signal.recommended
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : signal.mentioned
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-rose-100 bg-rose-50 text-rose-700";
                        return (
                          <span key={signal.model} className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-bold ${tone}`} title={`${signal.model}：${status}`}>
                            <span>{signal.model}</span>
                            <span>{status}</span>
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="text-muted">{query.competitor}</td>
                  <td className="pr-5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openResponseList(query)} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="查看回复"><Eye size={15} /></button>
                      <Link href={`/content/publish/new?query=${query.id}`} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="准备内容"><Send size={15} /></Link>
                      <button onClick={() => removeQuery(query.id)} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-rose-200 hover:text-rose-700" title="移除 Query"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length > 0 && <Pagination page={page} pageSize={pageSize} total={filteredItems.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />}
          {filteredItems.length === 0 && <div className="grid min-h-48 place-items-center text-center"><div><p className="font-bold">没有找到符合条件的 Query</p><p className="mt-2 text-xs text-muted">尝试清除筛选条件或添加新的 Query</p></div></div>}
        </div>
      </section>

      {recommendModalOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/55 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setRecommendModalOpen(false); }}>
          <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <h2 className="text-lg font-bold">AI 推荐 Query</h2>
                <p className="mt-1 text-xs text-muted">基于 {querySet.brand} / {querySet.offering} / {recommendScene} 生成候选问题，确认后加入当前 Query 集。</p>
              </div>
              <button onClick={() => setRecommendModalOpen(false)} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="关闭"><X size={17} /></button>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)] overflow-hidden">
              <aside className="border-r border-line bg-[#f8faf9] p-5">
                <h3 className="text-sm font-bold">推荐配置</h3>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-muted">目标场景</span>
                    <select value={recommendScene} onChange={(event) => setRecommendScene(event.target.value)} className="field">
                      {scenarioOptions.map((scene) => <option key={scene}>{scene}</option>)}
                    </select>
                  </label>
                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted">推荐方向</p>
                    <div className="flex flex-wrap gap-2">
                      {["推荐", "比较", "评价", "认知", "售后", "价格"].map((direction) => {
                        const active = recommendDirections.includes(direction);
                        return (
                          <button key={direction} onClick={() => toggleDirection(direction)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${active ? "border-brand bg-brand-pale text-brand" : "border-line bg-white text-muted hover:border-brand/40 hover:text-brand"}`}>
                            {direction}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="rounded-xl border border-line bg-white p-4 text-xs leading-5 text-muted">
                    <p>品牌：<strong className="text-ink">{querySet.brand}</strong></p>
                    <p className="mt-1">产品 / 服务：<strong className="text-ink">{querySet.offering}</strong></p>
                    <p className="mt-1">当前集合：<strong className="text-ink">{querySet.name} {querySet.version}</strong></p>
                  </div>
                  <button onClick={() => toast("推荐已刷新", { description: `已按 ${recommendDirections.join("、") || "全部方向"} 重新生成候选 Query` })} className="btn-primary w-full"><RefreshCw size={15} />重新生成</button>
                </div>
              </aside>

              <section className="min-h-0 overflow-y-auto p-5">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold">候选 Query</h3>
                    <p className="mt-1 text-xs text-muted">已自动排除当前 Query 集内的重复问题。</p>
                  </div>
                  <span className="text-xs font-semibold text-muted">已选择 {selectedRecommendations.length} 条</span>
                </div>

                <div className="space-y-3">
                  {recommendedQueries.map((query) => {
                    const checked = selectedRecommendations.includes(query.text);
                    return (
                      <button key={query.text} onClick={() => toggleRecommendation(query.text)} className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${checked ? "border-brand bg-brand-pale/60" : "border-line hover:border-brand/40 hover:bg-[#fbfcfb]"}`}>
                        <span className={`mt-1 grid size-5 shrink-0 place-items-center rounded border text-xs ${checked ? "border-brand bg-brand text-white" : "border-line text-transparent"}`}><Check size={13} /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold">{query.text}</span>
                          <span className="mt-2 block text-xs leading-5 text-muted">{query.opportunity}</span>
                        </span>
                        <StatusBadge status={query.priority} />
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-4">
              <p className="text-xs text-muted">加入后仍可在 Query 列表里编辑优先级。</p>
              <div className="flex gap-2">
                <button onClick={() => setRecommendModalOpen(false)} className="btn-secondary !py-2">取消</button>
                <button onClick={addRecommendations} className="btn-primary !py-2"><Sparkles size={15} />加入选中 Query</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {responseQuery && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/55 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setResponseQuery(null); }}>
          <div className="flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-lg bg-brand-pale text-brand"><Eye size={17} /></div>
                  <div>
                    <h2 className="text-lg font-bold">模型回复列表</h2>
                    <p className="mt-1 max-w-3xl truncate text-xs text-muted">{responseQuery.text}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setResponseQuery(null)} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="关闭"><X size={17} /></button>
            </div>

            <div className="min-h-0 overflow-y-auto p-6">
              <div className="mb-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-line bg-[#f8faf9] p-4"><p className="text-xs font-semibold text-muted">所属 Query 集</p><p className="mt-2 text-sm font-bold">{responseQuery.querySet}</p></div>
                <div className="rounded-xl border border-line bg-[#f8faf9] p-4"><p className="text-xs font-semibold text-muted">优先级</p><div className="mt-2"><StatusBadge status={responseQuery.priority} /></div></div>
                <div className="rounded-xl border border-line bg-[#f8faf9] p-4"><p className="text-xs font-semibold text-muted">最近表现</p><p className="mt-2 text-sm font-bold">{responseQuery.mentioned ? responseQuery.recommended ? "已推荐" : "已提及" : "品牌缺席"}</p></div>
              </div>

              <div className="panel mb-4 flex flex-wrap items-center gap-3 p-4">
                <label className="relative min-w-72 flex-1"><Search size={16} className="absolute left-3 top-3 text-muted" /><input value={responseKeyword} onChange={(event) => setResponseKeyword(event.target.value)} className="field pl-9" placeholder="搜索回复内容或引用来源" /></label>
                <FilterSelect value={responseModelFilter} options={[...new Set(responseRecords.map((record) => record.model))]} placeholder="全部模型" onChange={setResponseModelFilter} className="w-36" />
                <FilterSelect value={responseBatchFilter} options={responseBatches.map((batch) => batch.name)} placeholder="全部批次" onChange={setResponseBatchFilter} className="w-52" />
              </div>

              <div className="table-wrap">
                <table className="w-full text-sm">
                  <thead className="table-head"><tr><th className="px-5 py-3.5">批次</th><th>模型</th><th>判断</th><th>回复内容</th><th>引用来源</th><th className="pr-5 text-right">任务</th></tr></thead>
                  <tbody className="divide-y divide-line">
                    {filteredResponseRecords.map((record) => (
                      <tr key={`${record.batchId}-${record.model}`} className="align-top hover:bg-[#fbfcfb]">
                        <td className="px-5 py-4"><p className="font-semibold">{record.batchName}</p><p className="mt-1 text-xs text-muted">{record.batchDate}</p></td>
                        <td className="py-4 font-bold">{record.model}</td>
                        <td className="py-4"><div className="flex flex-col items-start gap-2"><StatusBadge status={record.mentioned ? "已提及" : "品牌缺席"} /><StatusBadge status={record.recommended ? "已推荐" : "未推荐"} /></div></td>
                        <td className="max-w-xl py-4"><p className="rounded-xl bg-[#f8faf9] p-3 text-sm leading-6 text-[#34483e]">{record.answer}</p></td>
                        <td className="py-4"><div className="flex max-w-52 flex-wrap gap-1.5">{record.sources.map((source) => <span key={source} className="rounded-md border border-line px-2 py-1 text-xs text-muted">{source}</span>)}</div></td>
                        <td className="pr-5 pt-4 text-right"><Link href={`/monitor/tasks/${record.batchId}`} className="font-semibold text-brand">查看任务</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredResponseRecords.length === 0 && <div className="grid min-h-40 place-items-center text-center"><div><p className="font-bold">没有找到符合条件的回复</p><p className="mt-2 text-xs text-muted">尝试清除模型、批次或关键词筛选</p></div></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
