"use client";

import { Check, ExternalLink, FileText, Image as ImageIcon, Link2, Pencil, Plus, Search, Upload, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandProductHeader } from "@/components/brand-product-nav";
import { FilterSelect } from "@/components/filter-select";
import { PageTabs } from "@/components/page-tabs";
import { Pagination } from "@/components/pagination";
import { useToast } from "@/components/toast-provider";
import { StatusBadge } from "@/components/ui";
import { brandProfiles, knowledgeMaterials, offeringProfiles } from "@/lib/brand-product-data";

type Material = (typeof knowledgeMaterials)[number];
type ImageItem = Material["imageItems"][number];
const businessTypes = ["品牌事实", "产品 / 服务事实", "政策与权益", "官方口径", "FAQ", "案例与荣誉", "媒体素材", "过期说法"];
const emptyForm: Omit<Material, "id" | "updatedAt"> = {
  mediaType: "文本",
  businessType: "品牌事实",
  title: "",
  brand: brandProfiles[0].name,
  offering: "",
  sourceType: "手动创建",
  sourceUrl: "",
  sourceName: "",
  status: "草稿",
  owner: "",
  summary: "",
  markdown: "# 资料标题\n\n在这里输入 Markdown 内容。",
  imageItems: [],
};

const importedImageCandidates = [
  { id: "hero", title: "远途 X7 官方主视觉", description: "产品页面首屏主图", selected: true },
  { id: "interior", title: "远途 X7 二排空间", description: "家庭用户空间展示图", selected: true },
  { id: "charging", title: "城区补能场景", description: "城市充电站使用场景", selected: false },
];

export default function BrandKnowledgePage() {
  const [materials, setMaterials] = useState<Material[]>(knowledgeMaterials);
  const [activeView, setActiveView] = useState<"text" | "images">("text");
  const [keyword, setKeyword] = useState("");
  const [businessFilter, setBusinessFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editorOpen, setEditorOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [importStep, setImportStep] = useState<"input" | "review">("input");
  const [importUrl, setImportUrl] = useState("");
  const [importTitle, setImportTitle] = useState("远途 X7 官方产品资料");
  const [importMarkdown, setImportMarkdown] = useState("# 远途 X7 官方产品资料\n\n远途 X7 面向家庭用户，重点覆盖城市通勤和家庭出游场景。\n\n## 核心信息\n\n- CLTC 续航 650km\n- 中型纯电 SUV\n- 提供 24 小时道路救援权益");
  const [importImages, setImportImages] = useState(importedImageCandidates);
  const [importBrand, setImportBrand] = useState(brandProfiles[0].name);
  const [importOffering, setImportOffering] = useState("远途 X7");
  const [importBusinessType, setImportBusinessType] = useState("产品 / 服务事实");
  const { toast } = useToast();

  const filteredMaterials = useMemo(() => materials.filter((material) => (
    (material.title.includes(keyword) || material.summary.includes(keyword) || material.sourceName.includes(keyword))
    && material.mediaType === (activeView === "text" ? "文本" : "图片集")
    && (!businessFilter || material.businessType === businessFilter)
    && (!brandFilter || material.brand === brandFilter)
    && (!statusFilter || material.status === statusFilter)
  )), [activeView, brandFilter, businessFilter, keyword, materials, statusFilter]);
  const pagedMaterials = filteredMaterials.slice((page - 1) * pageSize, page * pageSize);
  const offeringOptions = offeringProfiles.filter((item) => item.brand === form.brand);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, mediaType: activeView === "text" ? "文本" : "图片集", markdown: activeView === "text" ? emptyForm.markdown : "", imageItems: [] });
    setEditorOpen(true);
  };

  const openEdit = (material: Material) => {
    setEditingId(material.id);
    setForm({
      mediaType: material.mediaType,
      businessType: material.businessType,
      title: material.title,
      brand: material.brand,
      offering: material.offering,
      sourceType: material.sourceType,
      sourceUrl: material.sourceUrl,
      sourceName: material.sourceName,
      status: material.status,
      owner: material.owner,
      summary: material.summary,
      markdown: material.markdown,
      imageItems: material.imageItems,
    });
    setEditorOpen(true);
  };

  const saveMaterial = () => {
    if (!form.title.trim() || !form.brand || !form.businessType) {
      toast("请完成资料基础信息");
      return;
    }
    if (form.mediaType === "文本" && !form.markdown.trim()) {
      toast("请输入 Markdown 正文");
      return;
    }
    if (form.mediaType === "图片集" && form.imageItems.length === 0) {
      toast("请至少上传一张图片");
      return;
    }
    if (editingId) {
      setMaterials((current) => current.map((item) => item.id === editingId ? { ...item, ...form, updatedAt: "2026-06-18 16:30" } : item));
      toast("资料已更新", { description: form.title, type: "success" });
    } else {
      setMaterials((current) => [{ id: `material-${Date.now()}`, ...form, updatedAt: "2026-06-18 16:30" }, ...current]);
      setPage(1);
      toast("资料已创建", { description: form.title, type: "success" });
    }
    setEditorOpen(false);
  };

  const openImport = () => {
    setImportStep("input");
    setImportUrl("");
    setImportImages(importedImageCandidates);
    setImportOpen(true);
  };

  const parseUrl = () => {
    if (!/^https?:\/\//.test(importUrl.trim())) {
      toast("请输入完整的网页链接", { description: "链接需要以 http:// 或 https:// 开头" });
      return;
    }
    setImportStep("review");
    toast("网页解析完成", { description: "已转换 Markdown，并提取 3 张候选图片", type: "success" });
  };

  const saveImportedMaterials = () => {
    const now = Date.now();
    const selectedImages = importImages.filter((image) => image.selected);
    const imported: Material[] = [
      {
        id: `material-import-text-${now}`,
        mediaType: "文本",
        businessType: importBusinessType,
        title: importTitle,
        brand: importBrand,
        offering: importOffering,
        sourceType: "链接导入",
        sourceUrl: importUrl,
        sourceName: new URL(importUrl).hostname,
        status: "草稿",
        updatedAt: "2026-06-18 16:30",
        owner: "李明",
        summary: "由外部网页解析生成的 Markdown 文本资料。",
        markdown: importMarkdown,
        imageItems: [],
      },
      ...(selectedImages.length > 0 ? [{
        id: `material-import-images-${now}`,
        mediaType: "图片集",
        businessType: importBusinessType,
        title: `${importTitle}图片集`,
        brand: importBrand,
        offering: importOffering,
        sourceType: "链接导入",
        sourceUrl: importUrl,
        sourceName: new URL(importUrl).hostname,
        status: "草稿",
        updatedAt: "2026-06-18 16:30",
        owner: "李明",
        summary: `由网页提取的 ${selectedImages.length} 张图片。`,
        markdown: "",
        imageItems: selectedImages.map((image, index): ImageItem => ({ id: `imported-image-${now}-${index}`, url: "", title: image.title, description: image.description, altText: image.title, ocrText: "待 OCR 识别", fileMeta: "网页图片 · 待转存" })),
      } as Material] : []),
    ];
    setMaterials((current) => [...imported, ...current]);
    setImportOpen(false);
    setPage(1);
    toast("网页资料已入库", { description: selectedImages.length > 0 ? `已创建 1 条文本资料和 1 个包含 ${selectedImages.length} 张图片的图片集` : "已创建 1 条文本资料", type: "success" });
  };

  return (
    <>
      <BrandProductHeader
        active="/monitor/brands/knowledge"
        title="品牌事实 / 资料库"
        description="统一管理可追溯的文本资料与图片集，支撑模型事实判断、Query 分析和内容生成。"
        action={<div className="flex gap-2"><button onClick={openImport} className="btn-secondary"><Link2 size={16} />链接导入</button><button onClick={openCreate} className="btn-primary"><Plus size={16} />{activeView === "text" ? "新建文本资料" : "新建图片集"}</button></div>}
      />

      <div className="mb-4 flex">
        <PageTabs
          tabs={[
            { label: "文本资料", value: "text" as const, icon: FileText, badge: materials.filter((item) => item.mediaType === "文本").length },
            { label: "图片集", value: "images" as const, icon: ImageIcon, badge: materials.filter((item) => item.mediaType === "图片集").length },
          ]}
          value={activeView}
          onChange={(value) => { setActiveView(value); setKeyword(""); setPage(1); }}
        />
      </div>

      <div className="panel mb-4 flex flex-wrap items-center gap-3 p-4">
        <label className="relative min-w-56 flex-1"><Search size={16} className="absolute left-3 top-3 text-muted" /><input value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} className="field pl-9" placeholder={activeView === "text" ? "搜索文本标题、摘要或来源" : "搜索图片集名称、说明或来源"} /></label>
        <FilterSelect value={businessFilter} options={businessTypes} placeholder="全部业务类型" onChange={(value) => { setBusinessFilter(value); setPage(1); }} className="w-40" />
        <FilterSelect value={brandFilter} options={[...new Set(materials.map((item) => item.brand))]} placeholder="全部品牌" onChange={(value) => { setBrandFilter(value); setPage(1); }} className="w-36" />
        <FilterSelect value={statusFilter} options={["草稿", "已生效", "已过期"]} placeholder="全部状态" onChange={(value) => { setStatusFilter(value); setPage(1); }} className="w-32" />
      </div>

      <div className="table-wrap">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="table-head"><tr><th className="px-5 py-3.5">{activeView === "text" ? "文本资料" : "图片集"}</th><th>业务类型</th><th>关联对象</th><th>来源</th><th>状态</th><th>更新时间</th><th className="pr-5 text-right">操作</th></tr></thead>
          <tbody className="divide-y divide-line">
            {pagedMaterials.map((material) => (
              <tr key={material.id} className="hover:bg-[#fbfcfb]">
                <td className="max-w-sm px-5 py-4"><div className="flex items-center gap-3"><div className={`grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg ${material.mediaType === "图片集" ? "bg-blue-50 text-blue-700" : "bg-brand-pale text-brand"}`}>{material.mediaType === "图片集" && material.imageItems[0]?.url ? <img src={material.imageItems[0].url} alt={material.imageItems[0].altText} className="size-full object-cover" /> : material.mediaType === "图片集" ? <ImageIcon size={18} /> : <FileText size={18} />}</div><div className="min-w-0"><p className="truncate font-bold">{material.title}</p><p className="mt-1 truncate text-xs text-muted">{material.mediaType === "图片集" ? `${material.imageItems.length} 张图片 · ${material.summary}` : material.summary}</p></div></div></td>
                <td className="font-semibold">{material.businessType}</td>
                <td><p className="font-semibold">{material.brand}</p><p className="mt-1 text-xs text-muted">{material.offering || "品牌级资料"}</p></td>
                <td><p className="font-semibold">{material.sourceType}</p><p className="mt-1 max-w-40 truncate text-xs text-muted">{material.sourceName || "暂无来源"}</p></td>
                <td><StatusBadge status={material.status} /></td>
                <td className="whitespace-nowrap text-xs text-muted">{material.updatedAt}</td>
                <td className="pr-5"><div className="flex justify-end gap-2">{material.sourceUrl && <a href={material.sourceUrl} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="查看来源"><ExternalLink size={15} /></a>}<button onClick={() => openEdit(material)} className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" title="编辑资料"><Pencil size={15} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMaterials.length > 0 ? <Pagination page={page} pageSize={pageSize} total={filteredMaterials.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /> : <div className="grid min-h-52 place-items-center text-center"><div><p className="font-bold">没有找到符合条件的{activeView === "text" ? "文本资料" : "图片集"}</p><p className="mt-2 text-xs text-muted">尝试清除筛选条件或新建资料</p></div></div>}
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/55 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setEditorOpen(false); }}>
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-line px-6 py-5"><div><h2 className="text-lg font-bold">{editingId ? "编辑资料" : form.mediaType === "文本" ? "新建文本资料" : "新建图片集"}</h2><p className="mt-1 text-xs text-muted">文本资料与图片集分别管理，并可通过来源和关联对象建立联系。</p></div><button onClick={() => setEditorOpen(false)} className="grid size-9 place-items-center rounded-lg border border-line text-muted" title="关闭"><X size={17} /></button></div>
            <div className="min-h-0 overflow-y-auto p-6">
              <div className="mb-5 grid gap-4 border-b border-line pb-5 md:grid-cols-4">
                <Field label="内容形态" required><select value={form.mediaType} disabled className="field bg-slate-50 text-muted"><option>文本</option><option>图片集</option></select></Field>
                <Field label="业务类型" required><select value={form.businessType} onChange={(event) => setForm((current) => ({ ...current, businessType: event.target.value }))} className="field">{businessTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
                <Field label="关联品牌" required><select value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value, offering: "" }))} className="field">{brandProfiles.map((brand) => <option key={brand.id}>{brand.name}</option>)}</select></Field>
                <Field label="关联产品 / 服务"><select value={form.offering} onChange={(event) => setForm((current) => ({ ...current, offering: event.target.value }))} className="field"><option value="">品牌级资料</option>{offeringOptions.map((item) => <option key={item.id}>{item.name}</option>)}</select></Field>
                <div className="md:col-span-2"><Field label="资料标题" required><input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="field" /></Field></div>
                <Field label="状态"><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="field"><option>草稿</option><option>已生效</option><option>已过期</option></select></Field>
                <Field label="负责人"><input value={form.owner} onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} className="field" /></Field>
              </div>

              {form.mediaType === "文本" ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  <div><p className="mb-2 text-xs font-semibold text-muted">Markdown 正文</p><textarea value={form.markdown} onChange={(event) => setForm((current) => ({ ...current, markdown: event.target.value }))} className="field min-h-[360px] resize-none font-mono text-xs leading-6" /></div>
                  <div><p className="mb-2 text-xs font-semibold text-muted">内容预览</p><div className="min-h-[360px] rounded-lg border border-line bg-[#fbfcfb] p-5"><MarkdownPreview content={form.markdown} /></div></div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-end justify-between gap-4"><Field label="图片集说明"><input value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} className="field min-w-80" placeholder="说明这组图片的用途和内容" /></Field><label className="btn-secondary shrink-0 cursor-pointer"><Upload size={15} />批量上传图片<input type="file" accept="image/*" multiple className="hidden" onChange={(event) => { Array.from(event.target.files || []).forEach((file) => { const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, imageItems: [...current.imageItems, { id: `image-${Date.now()}-${file.name}`, url: String(reader.result || ""), title: file.name.replace(/\.[^.]+$/, ""), description: "", altText: "", ocrText: "", fileMeta: `${file.type.split("/")[1]?.toUpperCase()} · ${(file.size / 1024).toFixed(0)}KB` }] })); reader.readAsDataURL(file); }); }} /></label></div>
                  {form.imageItems.length === 0 ? <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-line bg-[#f8faf9] text-center text-muted"><div><ImageIcon size={30} className="mx-auto" /><p className="mt-3 text-sm font-semibold">图片集暂无图片</p><p className="mt-1 text-xs">可以一次选择多张图片上传</p></div></div> : <div className="grid gap-4 md:grid-cols-2">{form.imageItems.map((image) => <div key={image.id} className="rounded-lg border border-line p-4"><div className="mb-4 flex gap-3"><div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-muted">{image.url ? <img src={image.url} alt={image.altText || image.title} className="size-full object-cover" /> : <ImageIcon size={22} />}</div><div className="min-w-0 flex-1"><input value={image.title} onChange={(event) => setForm((current) => ({ ...current, imageItems: current.imageItems.map((item) => item.id === image.id ? { ...item, title: event.target.value } : item) }))} className="field" placeholder="图片标题" /><p className="mt-2 text-xs text-muted">{image.fileMeta}</p></div><button onClick={() => setForm((current) => ({ ...current, imageItems: current.imageItems.filter((item) => item.id !== image.id) }))} className="grid size-8 shrink-0 place-items-center rounded-lg border border-line text-muted hover:text-rose-700" title="移除图片"><X size={14} /></button></div><div className="grid gap-3"><input value={image.description} onChange={(event) => setForm((current) => ({ ...current, imageItems: current.imageItems.map((item) => item.id === image.id ? { ...item, description: event.target.value } : item) }))} className="field" placeholder="图片说明" /><input value={image.altText} onChange={(event) => setForm((current) => ({ ...current, imageItems: current.imageItems.map((item) => item.id === image.id ? { ...item, altText: event.target.value } : item) }))} className="field" placeholder="Alt 文本" /><textarea value={image.ocrText} onChange={(event) => setForm((current) => ({ ...current, imageItems: current.imageItems.map((item) => item.id === image.id ? { ...item, ocrText: event.target.value } : item) }))} className="field min-h-16 resize-none" placeholder="OCR 识别文字" /></div></div>)}</div>}
                </div>
              )}

              <div className="mt-5 grid gap-4 border-t border-line pt-5 md:grid-cols-2"><Field label="来源名称"><input value={form.sourceName} onChange={(event) => setForm((current) => ({ ...current, sourceName: event.target.value }))} className="field" /></Field><Field label="来源链接"><input value={form.sourceUrl} onChange={(event) => setForm((current) => ({ ...current, sourceUrl: event.target.value }))} className="field" placeholder="https://" /></Field></div>
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-6 py-4"><button onClick={() => setEditorOpen(false)} className="btn-secondary">取消</button><button onClick={saveMaterial} className="btn-primary">{editingId ? "保存修改" : "创建资料"}</button></div>
          </div>
        </div>
      )}

      {importOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/55 p-6 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-line px-6 py-5"><div><h2 className="text-lg font-bold">链接导入</h2><p className="mt-1 text-xs text-muted">抓取网页正文并转换为 Markdown，提取的图片保存为一个图片集。</p></div><button onClick={() => setImportOpen(false)} className="grid size-9 place-items-center rounded-lg border border-line text-muted" title="关闭"><X size={17} /></button></div>
            {importStep === "input" ? <div className="p-6"><Field label="网页链接" required><div className="flex gap-2"><input value={importUrl} onChange={(event) => setImportUrl(event.target.value)} className="field" placeholder="https://example.com/article" /><button onClick={parseUrl} className="btn-primary shrink-0"><Link2 size={15} />开始解析</button></div></Field><div className="mt-5 rounded-lg border border-line bg-[#f8faf9] p-4 text-xs leading-6 text-muted">系统会提取标题、正文和图片，正文转为 Markdown；Logo、广告和二维码等无关图片可在下一步取消。</div></div> : <div className="min-h-0 overflow-y-auto p-6"><div className="mb-5 grid gap-4 md:grid-cols-3"><Field label="关联品牌"><select value={importBrand} onChange={(event) => setImportBrand(event.target.value)} className="field">{brandProfiles.map((brand) => <option key={brand.id}>{brand.name}</option>)}</select></Field><Field label="关联产品 / 服务"><select value={importOffering} onChange={(event) => setImportOffering(event.target.value)} className="field">{offeringProfiles.filter((item) => item.brand === importBrand).map((item) => <option key={item.id}>{item.name}</option>)}</select></Field><Field label="业务类型"><select value={importBusinessType} onChange={(event) => setImportBusinessType(event.target.value)} className="field">{businessTypes.map((type) => <option key={type}>{type}</option>)}</select></Field></div><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"><div><Field label="文本资料标题"><input value={importTitle} onChange={(event) => setImportTitle(event.target.value)} className="field" /></Field><p className="mb-2 mt-4 text-xs font-semibold text-muted">Markdown 转换结果</p><textarea value={importMarkdown} onChange={(event) => setImportMarkdown(event.target.value)} className="field min-h-[330px] resize-none font-mono text-xs leading-6" /></div><div><div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold text-muted">图片集内容</p><span className="text-xs text-muted">已选 {importImages.filter((item) => item.selected).length} 张</span></div><div className="space-y-2">{importImages.map((image) => <button key={image.id} onClick={() => setImportImages((current) => current.map((item) => item.id === image.id ? { ...item, selected: !item.selected } : item))} className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left ${image.selected ? "border-brand bg-brand-pale/60" : "border-line"}`}><span className={`grid size-8 shrink-0 place-items-center rounded-md ${image.selected ? "bg-brand text-white" : "bg-slate-100 text-muted"}`}>{image.selected ? <Check size={15} /> : <ImageIcon size={15} />}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{image.title}</span><span className="mt-1 block truncate text-xs text-muted">{image.description}</span></span></button>)}</div></div></div></div>}
            <div className="flex justify-between gap-2 border-t border-line px-6 py-4"><button onClick={() => importStep === "review" ? setImportStep("input") : setImportOpen(false)} className="btn-secondary">{importStep === "review" ? "返回修改链接" : "取消"}</button>{importStep === "review" && <button onClick={saveImportedMaterials} className="btn-primary">确认入库</button>}</div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted">{label}{required && <span className="ml-1 text-rose-600">*</span>}</span>{children}</label>;
}

function MarkdownPreview({ content }: { content: string }) {
  return <div className="space-y-3 text-sm leading-7 text-[#34483e]">{content.split(/\n+/).filter(Boolean).map((line, index) => line.startsWith("# ") ? <h2 key={index} className="text-xl font-bold text-ink">{line.slice(2)}</h2> : line.startsWith("## ") ? <h3 key={index} className="text-base font-bold text-ink">{line.slice(3)}</h3> : line.startsWith("- ") ? <p key={index} className="pl-3">• {line.slice(2)}</p> : <p key={index}>{line.replace(/\*\*/g, "")}</p>)}</div>;
}
