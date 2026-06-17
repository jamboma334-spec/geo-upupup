import { BookOpenText, Plus } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { BrandProductHeader } from "@/components/brand-product-nav";
import { StatusBadge } from "@/components/ui";
import { knowledgeFacts } from "@/lib/brand-product-data";

export default function BrandKnowledgePage() {
  return (
    <>
      <BrandProductHeader
        active="/monitor/brands/knowledge"
        title="品牌事实 / 知识资料"
        description="沉淀品牌事实、产品资料、过期说法和差异化表达，作为判断 AI 回答是否准确的依据。"
        action={<ActionButton message="已准备添加资料" description="Mock 版本暂未接入知识资料编辑表单" className="btn-primary"><Plus size={16} />添加资料</ActionButton>}
      />

      <div className="grid gap-4">
        {knowledgeFacts.map((fact) => (
          <div key={fact.title} className="panel flex items-start gap-4 p-5">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-pale text-brand"><BookOpenText size={19} /></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold">{fact.title}</h2>
                <StatusBadge status={fact.type} />
                <StatusBadge status={fact.status} />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{fact.summary}</p>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-3 text-xs text-muted">
                <span>来源：<strong className="text-ink">{fact.source}</strong></span>
                <span>更新时间：<strong className="text-ink">{fact.updatedAt}</strong></span>
              </div>
            </div>
            <ActionButton message="资料已加入识别依据" description={fact.title} toastType="success" className="btn-secondary !px-3 !py-2">设为依据</ActionButton>
          </div>
        ))}
      </div>
    </>
  );
}
