"use client";

import { BriefcaseBusiness, Globe2, ImageUp, Layers3, Pencil, Plus, Power, PowerOff, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandProductHeader } from "@/components/brand-product-nav";
import { FilterSelect } from "@/components/filter-select";
import { Pagination } from "@/components/pagination";
import { useToast } from "@/components/toast-provider";
import { StatusBadge } from "@/components/ui";
import { brandProfiles, offeringProfiles } from "@/lib/brand-product-data";

type Offering = (typeof offeringProfiles)[number];

const offeringTypes = ["产品", "服务"];
const emptyForm = {
  type: "产品",
  name: "",
  englishName: "",
  brand: brandProfiles[0].name,
  logo: "",
  category: "",
  description: "",
  positioning: "",
  aliases: "",
  exclusions: "",
  audience: "",
  market: "中国大陆",
  officialPage: "",
  launchedAt: "",
  owner: "",
  price: "",
  modelCode: "",
  useCases: "",
  deliveryMode: "",
  billingMode: "",
  serviceArea: "",
  serviceCommitment: "",
};

export default function ProductsPage() {
  const [offerings, setOfferings] = useState<Offering[]>(offeringProfiles);
  const [keyword, setKeyword] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const filteredOfferings = useMemo(() => offerings.filter((offering) => (
    (offering.name.includes(keyword) || offering.englishName.toLowerCase().includes(keyword.toLowerCase()) || offering.aliases.some((alias) => alias.includes(keyword)))
    && (!brandFilter || offering.brand === brandFilter)
    && (!typeFilter || offering.type === typeFilter)
    && (!statusFilter || offering.status === statusFilter)
  )), [brandFilter, keyword, offerings, statusFilter, typeFilter]);
  const pagedOfferings = filteredOfferings.slice((page - 1) * pageSize, page * pageSize);
  const serviceLike = form.type === "服务";

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (offering: Offering) => {
    setEditingId(offering.id);
    setForm({
      type: offering.type,
      name: offering.name,
      englishName: offering.englishName,
      brand: offering.brand,
      logo: offering.logo,
      category: offering.category,
      description: offering.description,
      positioning: offering.positioning,
      aliases: offering.aliases.join("、"),
      exclusions: offering.exclusions,
      audience: offering.audience,
      market: offering.market,
      officialPage: offering.officialPage,
      launchedAt: offering.launchedAt,
      owner: offering.owner,
      price: offering.price,
      modelCode: offering.modelCode,
      useCases: offering.useCases,
      deliveryMode: offering.deliveryMode,
      billingMode: offering.billingMode,
      serviceArea: offering.serviceArea,
      serviceCommitment: offering.serviceCommitment,
    });
    setModalOpen(true);
  };

  const saveOffering = () => {
    const required = [
      [form.name, "名称"], [form.brand, "所属品牌"], [form.category, "品类 / 服务类型"], [form.description, "简介"],
      [form.positioning, "定位"], [form.exclusions, "排除词 / 歧义说明"], [form.audience, "核心人群"], [form.market, "主要市场 / 地区"],
      [form.launchedAt, "上线时间"], [form.price, serviceLike ? "收费方式 / 价格" : "价格区间"],
    ];
    const missing = required.find(([value]) => !value.trim());
    if (missing) {
      toast(`请填写${missing[1]}`, { description: "创建前需要完成产品 / 服务的基础档案" });
      return;
    }
    const aliases = form.aliases.split(/[、,，]/).map((alias) => alias.trim()).filter(Boolean);
    const activeStatus = serviceLike ? "服务中" : "在售";
    if (editingId) {
      setOfferings((current) => current.map((offering) => offering.id === editingId ? { ...offering, ...form, aliases, updatedAt: "2026-06-18 11:20" } : offering));
      toast("档案已更新", { description: form.name, type: "success" });
    } else {
      const newOffering: Offering = {
        id: `offering-${Date.now()}`,
        ...form,
        aliases,
        status: activeStatus,
        querySets: 0,
        knowledgeCount: 0,
        updatedAt: "2026-06-18 11:20",
      };
      setOfferings((current) => [newOffering, ...current]);
      setPage(1);
      toast("档案已创建", { description: form.name, type: "success" });
    }
    setModalOpen(false);
  };

  const toggleStatus = (offering: Offering) => {
    const activeStatus = offering.type === "服务" ? "服务中" : "在售";
    const nextStatus = offering.status === "已下线" ? activeStatus : "已下线";
    setOfferings((current) => current.map((item) => item.id === offering.id ? { ...item, status: nextStatus, updatedAt: "2026-06-18 11:20" } : item));
    toast(nextStatus === "已下线" ? "档案已下线" : "档案已启用", { description: offering.name, type: "success" });
  };

  return (
    <>
      <BrandProductHeader
        active="/monitor/brands/products"
        title="产品 / 服务档案"
        description="统一维护品牌提供的产品、服务和解决方案，定义其身份、定位及监测识别边界。"
        action={<button onClick={openCreate} className="btn-primary"><Plus size={16} />新增产品 / 服务</button>}
      />

      <div className="panel mb-4 flex flex-wrap items-center gap-3 p-4">
        <label className="relative min-w-72 flex-1"><Search size={16} className="absolute left-3 top-3 text-muted" /><input value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} className="field pl-9" placeholder="搜索名称、英文名或别名" /></label>
        <FilterSelect value={brandFilter} options={[...new Set(offerings.map((item) => item.brand))]} placeholder="全部品牌" onChange={(value) => { setBrandFilter(value); setPage(1); }} className="w-40" />
        <FilterSelect value={typeFilter} options={offeringTypes} placeholder="全部类型" onChange={(value) => { setTypeFilter(value); setPage(1); }} className="w-40" />
        <FilterSelect value={statusFilter} options={[...new Set(offerings.map((item) => item.status))]} placeholder="全部状态" onChange={(value) => { setStatusFilter(value); setPage(1); }} className="w-36" />
      </div>

      <div className="table-wrap">
        <table className="min-w-[880px] w-full text-sm">
          <thead className="table-head"><tr><th className="px-5 py-3.5">产品 / 服务</th><th>所属品牌</th><th>类型</th><th>价格 / 收费</th><th>状态</th><th>更新时间</th><th className="pr-5 text-right">操作</th></tr></thead>
          <tbody className="divide-y divide-line">
            {pagedOfferings.map((offering) => {
              const Icon = offering.type === "服务" ? BriefcaseBusiness : PackageIcon;
              return (
                <tr key={offering.id} className="hover:bg-[#fbfcfb]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-brand-pale text-brand">{offering.logo ? <img src={offering.logo} alt={`${offering.name} 图片`} className="size-full object-cover" /> : <Icon size={18} />}</div><div><p className="font-bold">{offering.name}</p><p className="mt-1 text-xs text-muted">{offering.category}</p></div></div></td>
                  <td className="font-semibold">{offering.brand}</td>
                  <td><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-muted">{offering.type}</span></td>
                  <td className="max-w-48"><p className="font-semibold">{offering.price}</p>{offering.billingMode && <p className="mt-1 text-xs text-muted">{offering.billingMode}</p>}</td>
                  <td><StatusBadge status={offering.status} /></td>
                  <td className="whitespace-nowrap text-xs text-muted">{offering.updatedAt}</td>
                  <td className="pr-5"><div className="flex justify-end gap-2"><a href={`https://${offering.officialPage}`} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="访问官方页面"><Globe2 size={15} /></a><button onClick={() => openEdit(offering)} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="编辑档案"><Pencil size={15} /></button><button onClick={() => toggleStatus(offering)} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title={offering.status === "已下线" ? "启用" : "下线"}>{offering.status === "已下线" ? <Power size={15} /> : <PowerOff size={15} />}</button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredOfferings.length > 0 ? <Pagination page={page} pageSize={pageSize} total={filteredOfferings.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /> : <div className="grid min-h-52 place-items-center text-center"><div><p className="font-bold">没有找到符合条件的档案</p><p className="mt-2 text-xs text-muted">尝试清除筛选条件或新增产品 / 服务</p></div></div>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/55 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setModalOpen(false); }}>
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5"><div><h2 className="text-lg font-bold">{editingId ? "编辑产品 / 服务档案" : "新增产品 / 服务"}</h2><p className="mt-1 text-xs text-muted">选择要创建的档案类型，并填写对应的基础信息。</p></div><button onClick={() => setModalOpen(false)} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="关闭"><X size={17} /></button></div>
            <div className="min-h-0 overflow-y-auto p-6">
              <div className="mb-6 flex items-center gap-4 border-b border-line pb-6"><div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-line bg-[#f8faf9] text-muted">{form.logo ? <img src={form.logo} alt="图片预览" className="size-full object-cover" /> : <ImageUp size={22} />}</div><div><p className="text-sm font-bold">Logo / 主图</p><p className="mt-1 text-xs text-muted">建议上传正方形 PNG、JPG 或 WebP。</p><label className="btn-secondary mt-3 inline-flex cursor-pointer !py-2"><ImageUp size={15} />选择图片<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 2 * 1024 * 1024) { toast("图片不能超过 2 MB"); return; } const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, logo: String(reader.result || "") })); reader.readAsDataURL(file); }} /></label></div></div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="档案类型" required><select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className="field">{offeringTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
                <Field label="名称" required><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="field" placeholder="输入产品或服务名称" /></Field>
                <Field label="英文名称"><input value={form.englishName} onChange={(event) => setForm((current) => ({ ...current, englishName: event.target.value }))} className="field" placeholder="输入英文名称" /></Field>
                <Field label="所属品牌" required><select value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} className="field">{brandProfiles.filter((brand) => brand.status === "正常").map((brand) => <option key={brand.id}>{brand.name}</option>)}</select></Field>
                <Field label="品类 / 服务类型" required><input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="field" placeholder={serviceLike ? "例如：企业出行服务" : "例如：中型纯电 SUV"} /></Field>
                <Field label="主要市场 / 地区" required><input value={form.market} onChange={(event) => setForm((current) => ({ ...current, market: event.target.value }))} className="field" /></Field>
                <Field label="上线时间" required><input type="date" value={form.launchedAt} onChange={(event) => setForm((current) => ({ ...current, launchedAt: event.target.value }))} className="field" /></Field>
                <Field label={serviceLike ? "收费方式 / 价格" : "价格区间"} required><input value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} className="field" placeholder={serviceLike ? "例如：项目制 / 按次收费" : "例如：16-25 万元"} /></Field>
                <Field label="负责人"><input value={form.owner} onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} className="field" placeholder="输入负责人" /></Field>
                <Field label="官方页面"><input value={form.officialPage} onChange={(event) => setForm((current) => ({ ...current, officialPage: event.target.value }))} className="field" placeholder="输入官方页面域名或路径" /></Field>
                <Field label="识别别名"><input value={form.aliases} onChange={(event) => setForm((current) => ({ ...current, aliases: event.target.value }))} className="field" placeholder="多个别名用顿号分隔" /></Field>
                <div className="md:col-span-2"><Field label="简介" required><textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="field min-h-20 resize-none" placeholder="描述主要产品能力或服务内容" /></Field></div>
                <div className="md:col-span-2"><Field label="定位" required><textarea value={form.positioning} onChange={(event) => setForm((current) => ({ ...current, positioning: event.target.value }))} className="field min-h-20 resize-none" placeholder="描述目标市场和核心价值" /></Field></div>
                <Field label="核心人群" required><input value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))} className="field" placeholder="描述目标用户或客户" /></Field>
                <Field label="排除词 / 歧义说明" required><input value={form.exclusions} onChange={(event) => setForm((current) => ({ ...current, exclusions: event.target.value }))} className="field" placeholder="说明不应识别的名称或语境" /></Field>
                {serviceLike ? <><Field label="交付方式"><input value={form.deliveryMode} onChange={(event) => setForm((current) => ({ ...current, deliveryMode: event.target.value }))} className="field" placeholder="线上、线下、上门或混合" /></Field><Field label="结算方式"><input value={form.billingMode} onChange={(event) => setForm((current) => ({ ...current, billingMode: event.target.value }))} className="field" placeholder="按次、订阅或项目制" /></Field><Field label="服务区域"><input value={form.serviceArea} onChange={(event) => setForm((current) => ({ ...current, serviceArea: event.target.value }))} className="field" /></Field><Field label="服务承诺 / SLA"><input value={form.serviceCommitment} onChange={(event) => setForm((current) => ({ ...current, serviceCommitment: event.target.value }))} className="field" /></Field></> : <><Field label="型号 / 产品代码"><input value={form.modelCode} onChange={(event) => setForm((current) => ({ ...current, modelCode: event.target.value }))} className="field" /></Field><Field label="主要使用场景"><input value={form.useCases} onChange={(event) => setForm((current) => ({ ...current, useCases: event.target.value }))} className="field" /></Field></>}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-6 py-4"><button onClick={() => setModalOpen(false)} className="btn-secondary">取消</button><button onClick={saveOffering} className="btn-primary">{editingId ? "保存修改" : "创建档案"}</button></div>
          </div>
        </div>
      )}
    </>
  );
}

function PackageIcon({ size }: { size: number }) {
  return <Layers3 size={size} />;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted">{label}{required && <span className="ml-1 text-rose-600">*</span>}</span>{children}</label>;
}
