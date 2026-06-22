"use client";

import Link from "next/link";
import { Bot, Copy, FileQuestion, Plus, Search, Snowflake, X } from "lucide-react";
import { useMemo, useState } from "react";
import { FilterSelect } from "@/components/filter-select";
import { useToast } from "@/components/toast-provider";
import { PageHeader, StatusBadge } from "@/components/ui";
import { queries, querySets } from "@/mocks/data";
import type { QuerySet } from "@/types";

const scenarioOptions = ["选购决策", "品牌认知", "口碑评价", "竞品比较", "价格预算", "售后服务", "使用场景"];
const offeringOptions = ["远途 X7", "远途 M5", "企业接送服务", "道路救援服务", "全品牌"];

export default function QueriesPage() {
  const [sets, setSets] = useState<QuerySet[]>(querySets);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [scenarioFilter, setScenarioFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    scenario: scenarioOptions[0],
    brand: "远途汽车",
    offering: offeringOptions[0],
    owner: "李明",
    description: "",
  });
  const { toast } = useToast();

  const querySetSummaries = useMemo(() => sets.map((querySet) => {
    const items = queries.filter((query) => query.querySetId === querySet.id);
    return {
      ...querySet,
      queryCount: items.length,
      highPriorityCount: items.filter((query) => query.priority === "高").length,
      missingCount: items.filter((query) => !query.mentioned).length,
      recommendedCount: items.filter((query) => query.recommended).length,
    };
  }), [sets]);

  const filteredQuerySets = querySetSummaries.filter((querySet) => (
    (querySet.name.includes(keyword) || querySet.scenario.includes(keyword) || querySet.brand.includes(keyword) || querySet.offering.includes(keyword))
    && (!statusFilter || querySet.status === statusFilter)
    && (!scenarioFilter || querySet.scenario === scenarioFilter)
  ));

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      scenario: scenarioOptions[0],
      brand: "远途汽车",
      offering: offeringOptions[0],
      owner: "李明",
      description: "",
    });
  };

  const createQuerySet = () => {
    const name = form.name.trim();
    if (!name) {
      toast("请填写 Query 集名称", { description: "名称用于在任务和复测中识别这组问题" });
      return;
    }
    const now = "2026-06-17 10:30";
    const newSet: QuerySet = {
      id: `qs-local-${Date.now()}`,
      name,
      scenario: form.scenario,
      brand: form.brand.trim() || "远途汽车",
      offering: form.offering,
      status: "草稿",
      version: "v1",
      owner: form.owner.trim() || "李明",
      updatedAt: now,
      description: form.description.trim() || `围绕${form.scenario}场景维护可重复评测的 Query 集。`,
    };
    setSets((current) => [newSet, ...current]);
    setModalOpen(false);
    resetForm();
    toast("Query 集创建成功", { description: `${newSet.name} ${newSet.version}`, type: "success" });
  };

  return (
    <>
      <PageHeader
        eyebrow="监测中心 / Query 管理"
        title="Query 集"
        description="先创建一组可重复评测的问题集，再在详情页维护该集合下的 Query、AI 推荐和冻结状态。"
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={16} />新建 Query 集</button>
        }
      />

      <div className="panel mb-4 flex flex-wrap items-center gap-3 p-4">
        <label className="relative min-w-72 flex-1"><Search size={16} className="absolute left-3 top-3 text-muted" /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="field pl-9" placeholder="搜索 Query 集、场景、品牌或产品 / 服务" /></label>
        <FilterSelect value={scenarioFilter} options={[...new Set(sets.map((item) => item.scenario))]} placeholder="全部场景" onChange={setScenarioFilter} className="w-36" />
        <FilterSelect value={statusFilter} options={["草稿", "已冻结", "已归档"]} placeholder="全部状态" onChange={setStatusFilter} className="w-36" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {filteredQuerySets.map((querySet) => (
          <Link href={`/monitor/queries/${querySet.id}`} key={querySet.id} className="panel block p-5 transition hover:-translate-y-0.5 hover:border-brand/30">
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-12 place-items-center rounded-xl bg-brand-pale text-brand"><FileQuestion size={21} /></div>
              <StatusBadge status={querySet.status} />
            </div>
            <div className="mt-5 flex items-center gap-2">
              <h2 className="text-lg font-bold">{querySet.name}</h2>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-muted">{querySet.version}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{querySet.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-sm">
              <div><p className="text-xs text-muted">Query</p><p className="mt-1 font-bold">{querySet.queryCount} 条</p></div>
              <div><p className="text-xs text-muted">高优先级</p><p className="mt-1 font-bold">{querySet.highPriorityCount} 条</p></div>
              <div><p className="text-xs text-muted">品牌缺席</p><p className="mt-1 font-bold text-rose-700">{querySet.missingCount} 条</p></div>
            </div>
            <div className="mt-5 grid gap-2 text-xs text-muted">
              <p>场景：<span className="font-semibold text-ink">{querySet.scenario}</span></p>
              <p>对象：<span className="font-semibold text-ink">{querySet.brand} / {querySet.offering}</span></p>
              <p>最近评测：<span className="font-semibold text-ink">{querySet.lastEvaluatedAt || "暂无评测"}</span></p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-muted"><Copy size={13} />复制</span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-muted"><Snowflake size={13} />冻结</span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-muted"><Bot size={13} />创建评测</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredQuerySets.length === 0 && (
        <div className="panel grid min-h-56 place-items-center text-center">
          <div><p className="font-bold">没有找到符合条件的 Query 集</p><p className="mt-2 text-xs text-muted">尝试清除筛选条件或修改搜索关键词</p></div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/55 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setModalOpen(false); }}>
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <h2 className="text-lg font-bold">新建 Query 集</h2>
                <p className="mt-1 text-xs text-muted">先创建问题集合，再进入详情页添加 Query 或使用 AI 推荐。</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="关闭"><X size={17} /></button>
            </div>

            <div className="grid gap-5 px-6 py-5">
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-muted">Query 集名称</span>
                <input value={form.name} onChange={(event) => updateForm("name", event.target.value)} className="field" placeholder="例如：新能源购车决策" />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-1.5 block text-xs font-semibold text-muted">业务场景</span>
                  <select value={form.scenario} onChange={(event) => updateForm("scenario", event.target.value)} className="field">
                    {scenarioOptions.map((scenario) => <option key={scenario}>{scenario}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-xs font-semibold text-muted">关联产品 / 服务</span>
                  <select value={form.offering} onChange={(event) => updateForm("offering", event.target.value)} className="field">
                    {offeringOptions.map((offering) => <option key={offering}>{offering}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-xs font-semibold text-muted">关联品牌</span>
                  <input value={form.brand} onChange={(event) => updateForm("brand", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-1.5 block text-xs font-semibold text-muted">负责人</span>
                  <input value={form.owner} onChange={(event) => updateForm("owner", event.target.value)} className="field" />
                </label>
              </div>

              <label>
                <span className="mb-1.5 block text-xs font-semibold text-muted">说明</span>
                <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} className="field min-h-24 resize-none" placeholder="说明这组 Query 的用途、覆盖范围和评测目标" />
              </label>

              <div className="rounded-xl border border-line bg-[#f8faf9] p-4 text-xs leading-5 text-muted">
                创建后默认状态为草稿，进入详情页后可以手动添加 Query、使用 AI 推荐补充 Query，并在评测前冻结版本。
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
              <button onClick={() => { setModalOpen(false); resetForm(); }} className="btn-secondary !py-2">取消</button>
              <button onClick={createQuerySet} className="btn-primary !py-2"><Plus size={15} />创建 Query 集</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
