import { Globe, Plus, Tags } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/ui";
import { ActionButton } from "@/components/action-button";

export default function BrandsPage() {
  const brands = [
    { name: "远途汽车", role: "目标品牌", site: "yuantu-auto.example.com", aliases: 4, products: 5, status: "正常" },
    { name: "智行汽车", role: "核心竞品", site: "zhixing.example.com", aliases: 3, products: 6, status: "正常" },
    { name: "跃界汽车", role: "核心竞品", site: "yuejie.example.com", aliases: 2, products: 4, status: "正常" },
  ];
  return <><PageHeader eyebrow="监测中心 / 品牌与产品" title="品牌识别标准" description="统一维护目标品牌、产品、别名和竞品，为评测结果识别提供依据。" action={<ActionButton message="已准备添加品牌" description="Mock 版本暂未接入品牌编辑表单" className="btn-primary"><Plus size={16} />添加品牌</ActionButton>} /><div className="grid grid-cols-3 gap-5">{brands.map((brand) => <div className="panel p-5" key={brand.name}><div className="flex items-start justify-between"><div className="grid size-12 place-items-center rounded-xl bg-brand-pale text-brand"><Tags size={21} /></div><StatusBadge status={brand.status} /></div><h2 className="mt-5 text-lg font-bold">{brand.name}</h2><p className="mt-1 text-xs font-semibold text-brand">{brand.role}</p><p className="mt-4 flex items-center gap-2 text-xs text-muted"><Globe size={13} />{brand.site}</p><div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm"><div><p className="text-xs text-muted">品牌别名</p><p className="mt-1 font-bold">{brand.aliases} 个</p></div><div><p className="text-xs text-muted">产品数量</p><p className="mt-1 font-bold">{brand.products} 个</p></div></div><ActionButton message="识别信息已保存" description={`${brand.name} 的识别配置已更新`} toastType="success" className="btn-secondary mt-5 w-full">管理识别信息</ActionButton></div>)}</div></>;
}
