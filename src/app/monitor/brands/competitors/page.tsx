"use client";

import { ExternalLink, Pencil, Plus, Power, PowerOff, Search, Swords, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandProductHeader } from "@/components/brand-product-nav";
import { FilterSelect } from "@/components/filter-select";
import { Pagination } from "@/components/pagination";
import { useToast } from "@/components/toast-provider";
import { StatusBadge } from "@/components/ui";
import { brandProfiles, competitorRelations, externalCompetitorObjects, offeringProfiles } from "@/lib/brand-product-data";

type CompetitorRelation = (typeof competitorRelations)[number];
type ExternalCompetitor = (typeof externalCompetitorObjects)[number];

const levels = ["品牌", "产品", "服务"];
const relationTypes = ["直接竞品", "间接竞品", "替代方案", "标杆对象", "潜在竞品"];
const emptyRelationForm = {
  ownBrand: brandProfiles[0].name,
  ownOffering: "",
  competitorId: "",
  level: "品牌",
  relationType: "直接竞品",
  scenario: "",
  overlap: "",
  audience: "",
  priority: "中",
  owner: "",
  description: "",
};

export default function CompetitorsPage() {
  const [relations, setRelations] = useState<CompetitorRelation[]>(competitorRelations);
  const [externalObjects, setExternalObjects] = useState<ExternalCompetitor[]>(externalCompetitorObjects);
  const [keyword, setKeyword] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [relationModalOpen, setRelationModalOpen] = useState(false);
  const [externalModalOpen, setExternalModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [relationForm, setRelationForm] = useState(emptyRelationForm);
  const [externalForm, setExternalForm] = useState({ level: "品牌", name: "", brand: "", category: "", site: "", aliases: "", description: "" });
  const { toast } = useToast();

  const objectMap = useMemo(() => new Map(externalObjects.map((item) => [item.id, item])), [externalObjects]);
  const filteredRelations = relations.filter((relation) => {
    const competitor = objectMap.get(relation.competitorId);
    return (
      (relation.ownBrand.includes(keyword) || relation.ownOffering.includes(keyword) || competitor?.name.includes(keyword) || competitor?.brand.includes(keyword))
      && (!brandFilter || relation.ownBrand === brandFilter)
      && (!levelFilter || relation.level === levelFilter)
      && (!priorityFilter || relation.priority === priorityFilter)
      && (!statusFilter || relation.status === statusFilter)
    );
  });
  const pagedRelations = filteredRelations.slice((page - 1) * pageSize, page * pageSize);
  const ownOfferingOptions = offeringProfiles.filter((item) => item.brand === relationForm.ownBrand && item.type === relationForm.level);
  const competitorOptions = externalObjects.filter((item) => item.level === relationForm.level);

  const openCreate = () => {
    setEditingId(null);
    setRelationForm(emptyRelationForm);
    setRelationModalOpen(true);
  };

  const openEdit = (relation: CompetitorRelation) => {
    setEditingId(relation.id);
    setRelationForm({
      ownBrand: relation.ownBrand,
      ownOffering: relation.ownOffering,
      competitorId: relation.competitorId,
      level: relation.level,
      relationType: relation.relationType,
      scenario: relation.scenario,
      overlap: relation.overlap,
      audience: relation.audience,
      priority: relation.priority,
      owner: relation.owner,
      description: relation.description,
    });
    setRelationModalOpen(true);
  };

  const changeLevel = (level: string) => {
    setRelationForm((current) => ({ ...current, level, ownOffering: "", competitorId: "" }));
  };

  const saveRelation = () => {
    if (!relationForm.ownBrand || !relationForm.competitorId || !relationForm.scenario.trim()) {
      toast("请完成竞品关系信息", { description: "我方对象、竞品对象和主要场景不能为空" });
      return;
    }
    if (relationForm.level !== "品牌" && !relationForm.ownOffering) {
      toast(`请选择我方${relationForm.level}`, { description: "产品或服务层级必须指定具体对象" });
      return;
    }
    if (editingId) {
      setRelations((current) => current.map((relation) => relation.id === editingId ? { ...relation, ...relationForm, updatedAt: "2026-06-18 14:20" } : relation));
      toast("竞品关系已更新", { type: "success" });
    } else {
      setRelations((current) => [{ id: `relation-${Date.now()}`, ...relationForm, status: "已启用", updatedAt: "2026-06-18 14:20" }, ...current]);
      setPage(1);
      toast("竞品关系已创建", { type: "success" });
    }
    setRelationModalOpen(false);
  };

  const toggleStatus = (relation: CompetitorRelation) => {
    const status = relation.status === "已启用" ? "已停用" : "已启用";
    setRelations((current) => current.map((item) => item.id === relation.id ? { ...item, status, updatedAt: "2026-06-18 14:20" } : item));
    toast(status === "已启用" ? "竞品关系已启用" : "竞品关系已停用", { type: "success" });
  };

  const openExternalCreate = () => {
    setExternalForm({ level: relationForm.level, name: "", brand: "", category: "", site: "", aliases: "", description: "" });
    setExternalModalOpen(true);
  };

  const saveExternalObject = () => {
    if (!externalForm.name.trim() || !externalForm.brand.trim()) {
      toast("请填写竞品名称和所属品牌");
      return;
    }
    const newObject: ExternalCompetitor = {
      id: `external-${Date.now()}`,
      level: externalForm.level,
      name: externalForm.name.trim(),
      brand: externalForm.brand.trim(),
      category: externalForm.category.trim() || "待完善",
      site: externalForm.site.trim(),
      aliases: externalForm.aliases.split(/[、,，]/).map((item) => item.trim()).filter(Boolean),
      description: externalForm.description.trim(),
    };
    setExternalObjects((current) => [...current, newObject]);
    setRelationForm((current) => ({ ...current, competitorId: newObject.id }));
    setExternalModalOpen(false);
    toast("外部竞品对象已创建", { description: newObject.name, type: "success" });
  };

  return (
    <>
      <BrandProductHeader
        active="/monitor/brands/competitors"
        title="竞品配置"
        description="定义我方品牌、产品或服务与外部竞品之间的竞争关系和监测范围。"
        action={<button onClick={openCreate} className="btn-primary"><Plus size={16} />新增竞品关系</button>}
      />

      <div className="panel mb-4 flex flex-wrap items-center gap-3 p-4">
        <label className="relative min-w-56 flex-1"><Search size={16} className="absolute left-3 top-3 text-muted" /><input value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} className="field pl-9" placeholder="搜索我方对象或竞品对象" /></label>
        <FilterSelect value={brandFilter} options={[...new Set(relations.map((item) => item.ownBrand))]} placeholder="全部我方品牌" onChange={(value) => { setBrandFilter(value); setPage(1); }} className="w-36" />
        <FilterSelect value={levelFilter} options={levels} placeholder="全部层级" onChange={(value) => { setLevelFilter(value); setPage(1); }} className="w-32" />
        <FilterSelect value={priorityFilter} options={["高", "中", "低"]} placeholder="全部优先级" onChange={(value) => { setPriorityFilter(value); setPage(1); }} className="w-32" />
        <FilterSelect value={statusFilter} options={["已启用", "已停用"]} placeholder="全部状态" onChange={(value) => { setStatusFilter(value); setPage(1); }} className="w-32" />
      </div>

      <div className="table-wrap">
        <table className="min-w-[980px] w-full text-sm">
          <thead className="table-head"><tr><th className="px-5 py-3.5">我方对象</th><th>竞品对象</th><th>层级</th><th>关系 / 场景</th><th>优先级</th><th>状态</th><th>更新时间</th><th className="pr-5 text-right">操作</th></tr></thead>
          <tbody className="divide-y divide-line">
            {pagedRelations.map((relation) => {
              const competitor = objectMap.get(relation.competitorId);
              return (
                <tr key={relation.id} className="hover:bg-[#fbfcfb]">
                  <td className="px-5 py-4"><p className="font-bold">{relation.ownOffering || relation.ownBrand}</p>{relation.ownOffering && <p className="mt-1 text-xs text-muted">{relation.ownBrand}</p>}</td>
                  <td><p className="font-bold">{competitor?.name || "未知竞品"}</p><p className="mt-1 text-xs text-muted">{competitor?.brand}</p></td>
                  <td><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-muted">{relation.level}</span></td>
                  <td><p className="font-semibold">{relation.relationType}</p><p className="mt-1 text-xs text-muted">{relation.scenario}</p></td>
                  <td><StatusBadge status={relation.priority} /></td>
                  <td><StatusBadge status={relation.status} /></td>
                  <td className="whitespace-nowrap text-xs text-muted">{relation.updatedAt}</td>
                  <td className="pr-5"><div className="flex justify-end gap-2"><a href={competitor?.site ? `https://${competitor.site}` : undefined} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="查看竞品官网"><ExternalLink size={15} /></a><button onClick={() => openEdit(relation)} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="编辑关系"><Pencil size={15} /></button><button onClick={() => toggleStatus(relation)} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title={relation.status === "已启用" ? "停用关系" : "启用关系"}>{relation.status === "已启用" ? <PowerOff size={15} /> : <Power size={15} />}</button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredRelations.length > 0 ? <Pagination page={page} pageSize={pageSize} total={filteredRelations.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /> : <div className="grid min-h-52 place-items-center text-center"><div><p className="font-bold">没有找到符合条件的竞品关系</p><p className="mt-2 text-xs text-muted">尝试清除筛选条件或新增竞品关系</p></div></div>}
      </div>

      {relationModalOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/55 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setRelationModalOpen(false); }}>
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-line px-6 py-5"><div><h2 className="text-lg font-bold">{editingId ? "编辑竞品关系" : "新增竞品关系"}</h2><p className="mt-1 text-xs text-muted">先确定竞争层级，再选择双方对象和主要场景。</p></div><button onClick={() => setRelationModalOpen(false)} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="关闭"><X size={17} /></button></div>
            <div className="min-h-0 overflow-y-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="竞争层级" required><select value={relationForm.level} onChange={(event) => changeLevel(event.target.value)} className="field">{levels.map((level) => <option key={level}>{level}</option>)}</select></Field>
                <Field label="关系类型" required><select value={relationForm.relationType} onChange={(event) => setRelationForm((current) => ({ ...current, relationType: event.target.value }))} className="field">{relationTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
                <Field label="我方品牌" required><select value={relationForm.ownBrand} onChange={(event) => setRelationForm((current) => ({ ...current, ownBrand: event.target.value, ownOffering: "" }))} className="field">{brandProfiles.filter((brand) => brand.status === "正常").map((brand) => <option key={brand.id}>{brand.name}</option>)}</select></Field>
                {relationForm.level !== "品牌" ? <Field label={`我方${relationForm.level}`} required><select value={relationForm.ownOffering} onChange={(event) => setRelationForm((current) => ({ ...current, ownOffering: event.target.value }))} className="field"><option value="">请选择</option>{ownOfferingOptions.map((item) => <option key={item.id}>{item.name}</option>)}</select></Field> : <div />}
                <div className="md:col-span-2"><Field label="外部竞品对象" required><div className="flex gap-2"><select value={relationForm.competitorId} onChange={(event) => setRelationForm((current) => ({ ...current, competitorId: event.target.value }))} className="field"><option value="">请选择已有竞品</option>{competitorOptions.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.brand}</option>)}</select><button onClick={openExternalCreate} className="btn-secondary shrink-0"><Plus size={15} />创建外部对象</button></div></Field></div>
                <Field label="主要竞争场景" required><input value={relationForm.scenario} onChange={(event) => setRelationForm((current) => ({ ...current, scenario: event.target.value }))} className="field" placeholder="例如：25 万级纯电 SUV 选购" /></Field>
                <Field label="监测优先级"><select value={relationForm.priority} onChange={(event) => setRelationForm((current) => ({ ...current, priority: event.target.value }))} className="field"><option>高</option><option>中</option><option>低</option></select></Field>
                <Field label="重叠市场 / 范围"><input value={relationForm.overlap} onChange={(event) => setRelationForm((current) => ({ ...current, overlap: event.target.value }))} className="field" /></Field>
                <Field label="核心重叠人群"><input value={relationForm.audience} onChange={(event) => setRelationForm((current) => ({ ...current, audience: event.target.value }))} className="field" /></Field>
                <Field label="负责人"><input value={relationForm.owner} onChange={(event) => setRelationForm((current) => ({ ...current, owner: event.target.value }))} className="field" /></Field>
                <div className="md:col-span-2"><Field label="说明"><textarea value={relationForm.description} onChange={(event) => setRelationForm((current) => ({ ...current, description: event.target.value }))} className="field min-h-20 resize-none" /></Field></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-6 py-4"><button onClick={() => setRelationModalOpen(false)} className="btn-secondary">取消</button><button onClick={saveRelation} className="btn-primary">{editingId ? "保存修改" : "创建关系"}</button></div>
          </div>
        </div>
      )}

      {externalModalOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#091c14]/60 p-6 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-line px-6 py-5"><div><h2 className="text-lg font-bold">创建外部竞品对象</h2><p className="mt-1 text-xs text-muted">对象会保存到外部竞品库，并自动选入当前关系。</p></div><button onClick={() => setExternalModalOpen(false)} className="grid size-9 place-items-center rounded-lg border border-line text-muted" title="关闭"><X size={17} /></button></div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <Field label="对象层级"><input value={externalForm.level} disabled className="field bg-slate-50 text-muted" /></Field>
              <Field label="竞品名称" required><input value={externalForm.name} onChange={(event) => setExternalForm((current) => ({ ...current, name: event.target.value }))} className="field" /></Field>
              <Field label="所属品牌" required><input value={externalForm.brand} onChange={(event) => setExternalForm((current) => ({ ...current, brand: event.target.value }))} className="field" /></Field>
              <Field label="品类 / 类型"><input value={externalForm.category} onChange={(event) => setExternalForm((current) => ({ ...current, category: event.target.value }))} className="field" /></Field>
              <Field label="官网"><input value={externalForm.site} onChange={(event) => setExternalForm((current) => ({ ...current, site: event.target.value }))} className="field" /></Field>
              <Field label="识别别名"><input value={externalForm.aliases} onChange={(event) => setExternalForm((current) => ({ ...current, aliases: event.target.value }))} className="field" placeholder="多个别名用顿号分隔" /></Field>
              <div className="md:col-span-2"><Field label="简介"><textarea value={externalForm.description} onChange={(event) => setExternalForm((current) => ({ ...current, description: event.target.value }))} className="field min-h-20 resize-none" /></Field></div>
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-6 py-4"><button onClick={() => setExternalModalOpen(false)} className="btn-secondary">返回</button><button onClick={saveExternalObject} className="btn-primary"><Plus size={15} />创建并选择</button></div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted">{label}{required && <span className="ml-1 text-rose-600">*</span>}</span>{children}</label>;
}
