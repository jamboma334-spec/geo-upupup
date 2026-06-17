import { Package, Plus } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { BrandProductHeader } from "@/components/brand-product-nav";
import { StatusBadge } from "@/components/ui";
import { productProfiles } from "@/lib/brand-product-data";

export default function ProductsPage() {
  return (
    <>
      <BrandProductHeader
        active="/monitor/brands/products"
        title="产品档案"
        description="维护产品名称、别名、价格带、细分市场和核心表达，帮助识别 AI 回答中的产品提及。"
        action={<ActionButton message="已准备添加产品" description="Mock 版本暂未接入产品编辑表单" className="btn-primary"><Plus size={16} />添加产品</ActionButton>}
      />

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="px-5 py-3.5">产品</th><th>所属品牌</th><th>细分市场</th><th>价格带</th><th>重点表达</th><th>别名</th><th className="pr-5">状态</th></tr></thead>
          <tbody className="divide-y divide-line">
            {productProfiles.map((product) => (
              <tr key={product.name} className="hover:bg-[#fbfcfb]">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-pale text-brand"><Package size={18} /></span><p className="font-bold">{product.name}</p></div></td>
                <td className="font-semibold">{product.brand}</td>
                <td className="text-muted">{product.segment}</td>
                <td>{product.price}</td>
                <td className="max-w-xs text-muted">{product.focus}</td>
                <td><div className="flex flex-wrap gap-1.5">{product.aliases.map((alias) => <span key={alias} className="rounded bg-slate-100 px-2 py-1 text-[11px] text-muted">{alias}</span>)}</div></td>
                <td className="pr-5"><StatusBadge status={product.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
