"use client";

import { Globe2, ImageUp, Pencil, Plus, Power, PowerOff, Search, Tags, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandProductHeader } from "@/components/brand-product-nav";
import { FilterSelect } from "@/components/filter-select";
import { Pagination } from "@/components/pagination";
import { useToast } from "@/components/toast-provider";
import { StatusBadge } from "@/components/ui";
import { brandProfiles } from "@/lib/brand-product-data";

type BrandProfile = (typeof brandProfiles)[number];

const emptyForm = {
  logo: "",
  name: "",
  englishName: "",
  legalName: "",
  description: "",
  position: "",
  industry: "新能源汽车",
  market: "中国大陆",
  foundedAt: "",
  headquarters: "",
  slogan: "",
  audience: "",
  priceRange: "",
  site: "",
  aliases: "",
  exclusions: "",
  owner: "",
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandProfile[]>(brandProfiles);
  const [keyword, setKeyword] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const filteredBrands = useMemo(() => brands.filter((brand) => (
    (brand.name.includes(keyword) || brand.englishName.toLowerCase().includes(keyword.toLowerCase()) || brand.aliases.some((alias) => alias.includes(keyword)))
    && (!industryFilter || brand.industry === industryFilter)
    && (!statusFilter || brand.status === statusFilter)
  )), [brands, industryFilter, keyword, statusFilter]);
  const pagedBrands = filteredBrands.slice((page - 1) * pageSize, page * pageSize);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (brand: BrandProfile) => {
    setEditingId(brand.id);
    setForm({
      logo: brand.logo,
      name: brand.name,
      englishName: brand.englishName,
      legalName: brand.legalName,
      description: brand.description,
      position: brand.position,
      industry: brand.industry,
      market: brand.market,
      foundedAt: brand.foundedAt,
      headquarters: brand.headquarters,
      slogan: brand.slogan,
      audience: brand.audience,
      priceRange: brand.priceRange,
      site: brand.site,
      aliases: brand.aliases.join("、"),
      exclusions: brand.exclusions,
      owner: brand.owner,
    });
    setModalOpen(true);
  };

  const saveBrand = () => {
    const name = form.name.trim();
    const requiredFields = [
      [form.logo, "品牌 Logo"], [name, "品牌名称"], [form.legalName, "法定主体名称"], [form.description, "品牌简介"],
      [form.position, "品牌定位"], [form.market, "主要市场 / 地区"], [form.foundedAt, "成立时间"], [form.headquarters, "总部地区"],
      [form.slogan, "品牌口号"], [form.audience, "核心人群"], [form.priceRange, "价格区间"], [form.exclusions, "排除词 / 歧义说明"],
    ];
    const missingField = requiredFields.find(([value]) => !value.trim());
    if (missingField) {
      toast(`请填写${missingField[1]}`, { description: "创建品牌前需要完成完整的基础档案" });
      return;
    }
    const aliases = form.aliases.split(/[、,，]/).map((alias) => alias.trim()).filter(Boolean);
    if (editingId) {
      setBrands((current) => current.map((brand) => brand.id === editingId ? {
        ...brand,
        ...form,
        name,
        aliases,
        updatedAt: "2026-06-18 10:30",
      } : brand));
      toast("品牌档案已更新", { description: name, type: "success" });
    } else {
      const newBrand: BrandProfile = {
        id: `brand-${Date.now()}`,
        logo: form.logo,
        name,
        englishName: form.englishName.trim(),
        legalName: form.legalName.trim(),
        description: form.description.trim(),
        position: form.position.trim(),
        industry: form.industry,
        market: form.market.trim(),
        foundedAt: form.foundedAt,
        headquarters: form.headquarters.trim(),
        slogan: form.slogan.trim(),
        audience: form.audience.trim(),
        priceRange: form.priceRange.trim(),
        site: form.site.trim() || "待配置",
        aliases,
        exclusions: form.exclusions.trim(),
        offerings: 0,
        competitors: 0,
        querySets: 0,
        owner: form.owner.trim() || "待分配",
        status: "正常",
        updatedAt: "2026-06-18 10:30",
      };
      setBrands((current) => [newBrand, ...current]);
      setPage(1);
      toast("品牌档案已创建", { description: name, type: "success" });
    }
    setModalOpen(false);
  };

  const toggleStatus = (brand: BrandProfile) => {
    const nextStatus = brand.status === "正常" ? "已停用" : "正常";
    setBrands((current) => current.map((item) => item.id === brand.id ? { ...item, status: nextStatus, updatedAt: "2026-06-18 10:30" } : item));
    toast(nextStatus === "正常" ? "品牌已启用" : "品牌已停用", { description: brand.name, type: "success" });
  };

  return (
    <>
      <BrandProductHeader
        active="/monitor/brands"
        title="品牌档案"
        description="维护当前企业旗下品牌及其识别信息，为 Query、评测任务和模型结果提供统一的品牌基准。"
        action={<button onClick={openCreate} className="btn-primary"><Plus size={16} />新增品牌</button>}
      />

      <div className="panel mb-4 flex flex-wrap items-center gap-3 p-4">
        <label className="relative min-w-72 flex-1"><Search size={16} className="absolute left-3 top-3 text-muted" /><input value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} className="field pl-9" placeholder="搜索品牌名称、英文名或别名" /></label>
        <FilterSelect value={industryFilter} options={[...new Set(brands.map((brand) => brand.industry))]} placeholder="全部行业" onChange={(value) => { setIndustryFilter(value); setPage(1); }} className="w-40" />
        <FilterSelect value={statusFilter} options={["正常", "已停用"]} placeholder="全部状态" onChange={(value) => { setStatusFilter(value); setPage(1); }} className="w-36" />
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="px-5 py-3.5">品牌</th><th>品牌定位</th><th>识别别名</th><th>关联数据</th><th>负责人</th><th>状态</th><th>更新时间</th><th className="pr-5 text-right">操作</th></tr></thead>
          <tbody className="divide-y divide-line">
            {pagedBrands.map((brand) => (
              <tr key={brand.id} className="hover:bg-[#fbfcfb]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-brand-pale font-bold text-brand">{brand.logo ? <img src={brand.logo} alt={`${brand.name} Logo`} className="size-full object-cover" /> : brand.name.slice(0, 1)}</div>
                    <div className="min-w-0"><p className="font-bold">{brand.name}</p><p className="mt-1 text-xs text-muted">{brand.englishName || "未配置英文名"}</p></div>
                  </div>
                </td>
                <td className="max-w-52"><p className="font-semibold">{brand.industry}</p><p className="mt-1 truncate text-xs text-muted" title={brand.position}>{brand.position}</p><p className="mt-1 text-xs text-muted">{brand.market}</p></td>
                <td><div className="flex items-center gap-2"><Tags size={14} className="text-muted" /><span className="font-semibold">{brand.aliases.length} 个</span></div><p className="mt-1 max-w-40 truncate text-xs text-muted">{brand.aliases.join("、") || "暂无别名"}</p></td>
                <td><p className="font-semibold">{brand.offerings} 个产品 / 服务</p><p className="mt-1 text-xs text-muted">{brand.competitors} 个竞品 · {brand.querySets} 个 Query 集</p></td>
                <td>{brand.owner}</td>
                <td><StatusBadge status={brand.status} /></td>
                <td className="text-xs text-muted">{brand.updatedAt}</td>
                <td className="pr-5">
                  <div className="flex justify-end gap-2">
                    <a href={brand.site === "待配置" ? undefined : `https://${brand.site}`} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="访问官网"><Globe2 size={15} /></a>
                    <button onClick={() => openEdit(brand)} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="编辑品牌"><Pencil size={15} /></button>
                    <button onClick={() => toggleStatus(brand)} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title={brand.status === "正常" ? "停用品牌" : "启用品牌"}>{brand.status === "正常" ? <PowerOff size={15} /> : <Power size={15} />}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBrands.length > 0 ? <Pagination page={page} pageSize={pageSize} total={filteredBrands.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /> : <div className="grid min-h-52 place-items-center text-center"><div><p className="font-bold">没有找到符合条件的品牌</p><p className="mt-2 text-xs text-muted">尝试清除筛选条件或新增品牌</p></div></div>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/55 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setModalOpen(false); }}>
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div><h2 className="text-lg font-bold">{editingId ? "编辑品牌档案" : "新增品牌"}</h2><p className="mt-1 text-xs text-muted">品牌识别信息会用于 Query 推荐和模型回复判断。</p></div>
              <button onClick={() => setModalOpen(false)} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:border-brand hover:text-brand" title="关闭"><X size={17} /></button>
            </div>
            <div className="min-h-0 overflow-y-auto p-6">
              <div className="mb-6 flex items-center gap-4 border-b border-line pb-6">
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-line bg-[#f8faf9] text-muted">{form.logo ? <img src={form.logo} alt="品牌 Logo 预览" className="size-full object-cover" /> : <ImageUp size={22} />}</div>
                <div><p className="text-sm font-bold">品牌 Logo <span className="text-rose-600">*</span></p><p className="mt-1 text-xs text-muted">建议上传正方形 PNG 或 JPG，大小不超过 2 MB。</p><label className="btn-secondary mt-3 inline-flex cursor-pointer !py-2"><ImageUp size={15} />选择图片<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 2 * 1024 * 1024) { toast("图片不能超过 2 MB"); return; } const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, logo: String(reader.result || "") })); reader.readAsDataURL(file); }} /></label></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
              <Field label="品牌名称" required><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="field" placeholder="例如：远途汽车" /></Field>
              <Field label="英文名称"><input value={form.englishName} onChange={(event) => setForm((current) => ({ ...current, englishName: event.target.value }))} className="field" placeholder="例如：Yuantu Auto" /></Field>
              <Field label="法定主体名称" required><input value={form.legalName} onChange={(event) => setForm((current) => ({ ...current, legalName: event.target.value }))} className="field" placeholder="输入企业登记主体全称" /></Field>
              <Field label="所属行业"><select value={form.industry} onChange={(event) => setForm((current) => ({ ...current, industry: event.target.value }))} className="field"><option>新能源汽车</option><option>汽车服务</option><option>智能出行</option><option>其他</option></select></Field>
              <Field label="主要市场 / 地区" required><input value={form.market} onChange={(event) => setForm((current) => ({ ...current, market: event.target.value }))} className="field" placeholder="例如：中国大陆、东南亚" /></Field>
              <Field label="成立时间" required><input type="date" value={form.foundedAt} onChange={(event) => setForm((current) => ({ ...current, foundedAt: event.target.value }))} className="field" /></Field>
              <Field label="总部地区" required><input value={form.headquarters} onChange={(event) => setForm((current) => ({ ...current, headquarters: event.target.value }))} className="field" placeholder="例如：上海" /></Field>
              <Field label="负责人"><input value={form.owner} onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} className="field" placeholder="输入负责人姓名" /></Field>
              <Field label="品牌官网"><input value={form.site} onChange={(event) => setForm((current) => ({ ...current, site: event.target.value }))} className="field" placeholder="例如：yuantu-auto.example.com" /></Field>
              <Field label="品牌别名"><input value={form.aliases} onChange={(event) => setForm((current) => ({ ...current, aliases: event.target.value }))} className="field" placeholder="多个别名用顿号分隔" /></Field>
              <Field label="品牌口号" required><input value={form.slogan} onChange={(event) => setForm((current) => ({ ...current, slogan: event.target.value }))} className="field" placeholder="输入品牌 Slogan" /></Field>
              <Field label="价格区间" required><input value={form.priceRange} onChange={(event) => setForm((current) => ({ ...current, priceRange: event.target.value }))} className="field" placeholder="例如：16-35 万元" /></Field>
              <div className="md:col-span-2"><Field label="品牌简介" required><textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="field min-h-20 resize-none" placeholder="描述品牌主营业务和主要产品服务" /></Field></div>
              <div className="md:col-span-2"><Field label="品牌定位" required><textarea value={form.position} onChange={(event) => setForm((current) => ({ ...current, position: event.target.value }))} className="field min-h-24 resize-none" placeholder="描述品牌面向的市场、人群和核心定位" /></Field></div>
              <div className="md:col-span-2"><Field label="核心人群" required><textarea value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))} className="field min-h-20 resize-none" placeholder="描述主要消费者或企业客户群体" /></Field></div>
              <div className="md:col-span-2"><Field label="排除词 / 歧义说明" required><textarea value={form.exclusions} onChange={(event) => setForm((current) => ({ ...current, exclusions: event.target.value }))} className="field min-h-20 resize-none" placeholder="说明哪些名称或语境不应识别为当前品牌" /></Field></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-6 py-4"><button onClick={() => setModalOpen(false)} className="btn-secondary">取消</button><button onClick={saveBrand} className="btn-primary">{editingId ? "保存修改" : "创建品牌"}</button></div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted">{label}{required && <span className="ml-1 text-rose-600">*</span>}</span>{children}</label>;
}
