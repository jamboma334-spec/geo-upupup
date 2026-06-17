import { Plus, Swords } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { BrandProductHeader } from "@/components/brand-product-nav";
import { StatusBadge } from "@/components/ui";
import { competitorProfiles } from "@/lib/brand-product-data";

export default function CompetitorsPage() {
  return (
    <>
      <BrandProductHeader
        active="/monitor/brands/competitors"
        title="竞品配置"
        description="配置需要共同监测的竞品、重叠场景和监测优先级，用于计算答案份额和推荐关系。"
        action={<ActionButton message="已准备添加竞品" description="Mock 版本暂未接入竞品编辑表单" className="btn-primary"><Plus size={16} />添加竞品</ActionButton>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {competitorProfiles.map((competitor) => (
          <div key={competitor.brand} className="panel p-5">
            <div className="flex items-start justify-between">
              <div className="grid size-12 place-items-center rounded-xl bg-rose-50 text-rose-700"><Swords size={20} /></div>
              <StatusBadge status={competitor.monitor} />
            </div>
            <h2 className="mt-5 text-lg font-bold">{competitor.brand}</h2>
            <p className="mt-1 text-xs font-semibold text-brand">{competitor.relation}</p>
            <div className="mt-5 space-y-4 border-t border-line pt-4 text-sm">
              <div><p className="text-xs text-muted">重叠场景</p><p className="mt-1 font-semibold">{competitor.overlap}</p></div>
              <div><p className="text-xs text-muted">当前优势</p><p className="mt-1 leading-6 text-muted">{competitor.strength}</p></div>
            </div>
            <ActionButton message="竞品配置已保存" description={`${competitor.brand} 的监测优先级已更新`} toastType="success" className="btn-secondary mt-5 w-full">调整监测配置</ActionButton>
          </div>
        ))}
      </div>
    </>
  );
}
