import Link from "next/link";
import { ArrowLeft, CalendarDays, FileText } from "lucide-react";
import { getReleaseDoc, getReleaseDocs } from "@/lib/release-docs";
import { cn } from "@/lib/utils";

export default async function ReleasePage({ searchParams }: { searchParams?: Promise<{ doc?: string }> }) {
  const params = await searchParams;
  const docs = getReleaseDocs();
  const activeDoc = getReleaseDoc(params?.doc);

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <Link href="/monitor/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-brand"><ArrowLeft size={15} />返回首页</Link>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Release</p>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-ink">版本更新记录</h1>
          <p className="mt-2 text-sm text-muted">查看 release 目录下的更新说明文档。</p>
        </div>
      </div>

      {docs.length === 0 || !activeDoc ? (
        <div className="panel grid min-h-72 place-items-center p-8 text-center">
          <div>
            <FileText size={32} className="mx-auto text-muted" />
            <h2 className="mt-4 font-bold">暂无 Release 文档</h2>
            <p className="mt-2 text-sm text-muted">请在 release 目录下添加 Markdown 文件。</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-5">
          <aside className="panel sticky top-[92px] h-fit overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <p className="text-xs font-bold text-muted">Release 列表</p>
            </div>
            <div className="p-2">
              {docs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/release?doc=${encodeURIComponent(doc.slug)}`}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition",
                    activeDoc.slug === doc.slug ? "bg-brand-pale font-bold text-brand" : "text-muted hover:bg-[#f4f8f6] hover:text-ink",
                  )}
                >
                  <CalendarDays size={15} />
                  {doc.title}
                </Link>
              ))}
            </div>
          </aside>

          <article className="panel p-7">
            <MarkdownView content={activeDoc.content} />
          </article>
        </div>
      )}
    </>
  );
}

function MarkdownView({ content }: { content: string }) {
  const blocks = parseMarkdown(content);
  return (
    <div className="max-w-none">
      {blocks.map((block, index) => {
        if (block.type === "h1") return <h1 key={index} className="mb-5 text-3xl font-bold tracking-tight">{renderInline(block.text)}</h1>;
        if (block.type === "h2") return <h2 key={index} className="mb-3 mt-8 border-b border-line pb-2 text-xl font-bold">{renderInline(block.text)}</h2>;
        if (block.type === "h3") return <h3 key={index} className="mb-2 mt-6 text-base font-bold">{renderInline(block.text)}</h3>;
        if (block.type === "ul") return <ul key={index} className="mb-4 ml-5 list-disc space-y-1.5 text-sm leading-7 text-muted">{block.items?.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>;
        if (block.type === "code") return <pre key={index} className="mb-5 overflow-x-auto rounded-xl bg-[#10271f] p-4 text-xs leading-6 text-white"><code>{block.text}</code></pre>;
        return <p key={index} className="mb-4 text-sm leading-7 text-muted">{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

type MarkdownBlock = { type: "h1" | "h2" | "h3" | "p" | "ul" | "code"; text: string; items?: string[] };

function parseMarkdown(content: string): MarkdownBlock[] {
  const lines = content.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let listItems: string[] = [];
  let codeLines: string[] = [];
  let inCode = false;

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: "ul", text: "", items: listItems });
      listItems = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", text: codeLines.join("\n") });
        codeLines = [];
        inCode = false;
      } else {
        flushList();
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      flushList();
      return;
    }
    if (line.startsWith("# ")) {
      flushList();
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      return;
    }
    if (line.startsWith("## ")) {
      flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      return;
    }
    if (line.startsWith("### ")) {
      flushList();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      return;
    }
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2).trim());
      return;
    }
    flushList();
    blocks.push({ type: "p", text: line.trim() });
  });

  flushList();
  if (codeLines.length) blocks.push({ type: "code", text: codeLines.join("\n") });
  return blocks;
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-ink">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
