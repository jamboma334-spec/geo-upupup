import { Globe, Plus, Tags } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { BrandProductHeader } from "@/components/brand-product-nav";
import { StatusBadge } from "@/components/ui";
import { brandProfiles } from "@/lib/brand-product-data";

export default function BrandsPage() {
  return (
    <>
      <BrandProductHeader
        active="/monitor/brands"
        title="品牌档案"
        description="维护目标品牌、竞品品牌、官网、别名和基础识别状态，作为评测结果识别的统一标准。"
        action={<ActionButton message="已准备添加品牌" description="Mock 版本暂未接入品牌编辑表单" className="btn-primary"><Plus size={16} />添加品牌</ActionButton>}
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {brandProfiles.map((brand) => (
          <div className="panel p-5" key={brand.name}>
            <div className="flex items-start justify-between">
              <div className="grid size-12 place-items-center rounded-xl bg-brand-pale text-brand"><Tags size={21} /></div>
              <StatusBadge status={brand.status} />
            </div>
            <h2 className="mt-5 text-lg font-bold">{brand.name}</h2>
            <p className="mt-1 text-xs font-semibold text-brand">{brand.role}</p>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted"><Globe size={13} />{brand.site}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
              <div><p className="text-xs text-muted">品牌别名</p><p className="mt-1 font-bold">{brand.aliases.length} 个</p></div>
              <div><p className="text-xs text-muted">产品数量</p><p className="mt-1 font-bold">{brand.products} 个</p></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {brand.aliases.map((alias) => <span key={alias} className="rounded bg-slate-100 px-2 py-1 text-[11px] text-muted">{alias}</span>)}
            </div>
            <ActionButton message="品牌档案已保存" description={`${brand.name} 的识别配置已更新`} toastType="success" className="btn-secondary mt-5 w-full">管理品牌档案</ActionButton>
          </div>
        ))}
      </div>
    </>
  );
}
