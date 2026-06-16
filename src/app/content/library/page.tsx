"use client";

import { BarChart3, CalendarDays, ExternalLink, Eye, FilePlus2, Heart, Library, LoaderCircle, MessageCircle, RefreshCw, Search, Star, Trash2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatusBadge } from "@/components/ui";
import { compactNumber } from "@/lib/utils";
import { contentDailyData, platformContents } from "@/mocks/data";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/toast-provider";
import { Pagination } from "@/components/pagination";
import { FilterSelect } from "@/components/filter-select";
import { TabbedPageHeader } from "@/components/page-tabs";
import { DateRangeFilter, matchesDateRange, type DateRangeValue } from "@/components/date-range-filter";

type PlatformContent = (typeof platformContents)[number];

const platforms = ["全部平台", "知乎", "小红书", "微信公众号", "头条号", "百家号"];
const metricOptions = [
  { key: "publishes", label: "发布数", icon: FilePlus2, color: "#16825d", cardColor: "text-emerald-600 bg-emerald-50" },
  { key: "followers", label: "新增粉丝", icon: UserPlus, color: "#2563eb", cardColor: "text-blue-600 bg-blue-50" },
  { key: "plays", label: "新增播放", icon: Eye, color: "#7c3aed", cardColor: "text-violet-600 bg-violet-50" },
  { key: "comments", label: "新增评论", icon: MessageCircle, color: "#d97706", cardColor: "text-amber-600 bg-amber-50" },
  { key: "likes", label: "新增点赞", icon: Heart, color: "#e11d48", cardColor: "text-rose-600 bg-rose-50" },
  { key: "saves", label: "新增收藏", icon: Star, color: "#0891b2", cardColor: "text-cyan-600 bg-cyan-50" },
] as const;
type MetricKey = typeof metricOptions[number]["key"];
type DateRange = "yesterday" | "7days" | "30days" | "custom";

function PlatformTabs({ active, onChange }: { active: string; onChange: (platform: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => <button key={platform} onClick={() => onChange(platform)} className={cn("rounded-lg border px-3 py-2 text-xs font-semibold transition", active === platform ? "border-brand bg-brand-pale text-brand" : "border-line bg-white text-muted hover:border-brand/40 hover:text-brand")}>{platform}</button>)}
    </div>
  );
}

export default function ContentDataPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "works">("overview");
  const [overviewPlatform, setOverviewPlatform] = useState("全部平台");
  const [worksPlatform, setWorksPlatform] = useState("全部平台");
  const [keyword, setKeyword] = useState("");
  const [worksAccount, setWorksAccount] = useState("");
  const [worksStatus, setWorksStatus] = useState("");
  const [worksPublisher, setWorksPublisher] = useState("");
  const [worksDateRange, setWorksDateRange] = useState<DateRangeValue>("");
  const [worksCustomStart, setWorksCustomStart] = useState("2026-06-01");
  const [worksCustomEnd, setWorksCustomEnd] = useState("2026-06-15");
  const [dateRange, setDateRange] = useState<DateRange>("7days");
  const [customStart, setCustomStart] = useState("2026-06-09");
  const [customEnd, setCustomEnd] = useState("2026-06-15");
  const [visibleMetrics, setVisibleMetrics] = useState<MetricKey[]>(["publishes", "followers", "plays"]);
  const [works, setWorks] = useState<PlatformContent[]>(platformContents);
  const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>([]);
  const [deleteTargets, setDeleteTargets] = useState<PlatformContent[]>([]);
  const [syncingIds, setSyncingIds] = useState<string[]>([]);
  const [worksPage, setWorksPage] = useState(1);
  const [worksPageSize, setWorksPageSize] = useState(10);
  const { toast } = useToast();

  const chartData = useMemo(() => {
    const days = dateRange === "yesterday" ? 1 : dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : undefined;
    const availableDates = [...new Set(contentDailyData.map((item) => item.date))].sort();
    const selectedDates = days ? availableDates.slice(-days) : availableDates.filter((date) => date >= customStart && date <= customEnd);
    const filtered = contentDailyData.filter((item) => selectedDates.includes(item.date) && (overviewPlatform === "全部平台" || item.platform === overviewPlatform));
    return Array.from(new Set(filtered.map((item) => item.date))).sort().map((date) => {
      const items = filtered.filter((item) => item.date === date);
      return {
        date,
        publishes: items.reduce((sum, item) => sum + item.publishes, 0),
        followers: items.reduce((sum, item) => sum + item.followers, 0),
        plays: items.reduce((sum, item) => sum + item.plays, 0),
        likes: items.reduce((sum, item) => sum + item.likes, 0),
        comments: items.reduce((sum, item) => sum + item.comments, 0),
        saves: items.reduce((sum, item) => sum + item.saves, 0),
      };
    });
  }, [overviewPlatform, dateRange, customStart, customEnd]);

  const totals = useMemo(() => chartData.reduce((result, item) => ({ publishes: result.publishes + item.publishes, followers: result.followers + item.followers, plays: result.plays + item.plays, likes: result.likes + item.likes, comments: result.comments + item.comments, saves: result.saves + item.saves }), { publishes: 0, followers: 0, plays: 0, likes: 0, comments: 0, saves: 0 }), [chartData]);
  const accountOptions = [...new Set(works.filter((item) => worksPlatform === "全部平台" || item.platform === worksPlatform).map((item) => item.account))];
  const publisherOptions = [...new Set(works.filter((item) => worksPlatform === "全部平台" || item.platform === worksPlatform).map((item) => item.publisher))];
  const filteredWorks = works.filter((item) => (worksPlatform === "全部平台" || item.platform === worksPlatform) && (!worksAccount || item.account === worksAccount) && (!worksStatus || item.status === worksStatus) && (!worksPublisher || item.publisher === worksPublisher) && item.title.includes(keyword) && matchesDateRange(item.publishedAt, worksDateRange, worksCustomStart, worksCustomEnd));
  const pagedWorks = filteredWorks.slice((worksPage - 1) * worksPageSize, worksPage * worksPageSize);
  const currentPlatformLabel = overviewPlatform === "全部平台" ? "全部平台" : overviewPlatform;
  const rangeLabel = dateRange === "yesterday" ? "昨天" : dateRange === "7days" ? "近 7 天" : dateRange === "30days" ? "近 30 天" : `${customStart} 至 ${customEnd}`;
  const toggleMetric = (key: MetricKey) => setVisibleMetrics((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  const allFilteredSelected = pagedWorks.length > 0 && pagedWorks.every((item) => selectedWorkIds.includes(item.id));
  const toggleSelectAll = () => {
    const filteredIds = pagedWorks.map((item) => item.id);
    setSelectedWorkIds((current) => allFilteredSelected ? current.filter((id) => !filteredIds.includes(id)) : [...new Set([...current, ...filteredIds])]);
  };
  const confirmDelete = () => {
    const targetIds = deleteTargets.map((item) => item.id);
    setWorks((current) => current.filter((item) => !targetIds.includes(item.id)));
    setSelectedWorkIds((current) => current.filter((id) => !targetIds.includes(id)));
    toast(deleteTargets.length > 1 ? "作品批量删除成功" : "作品删除成功", { description: `已删除 ${deleteTargets.length} 条作品数据` });
    setDeleteTargets([]);
  };
  const syncWorks = (ids: string[]) => {
    setSyncingIds((current) => [...new Set([...current, ...ids])]);
    window.setTimeout(() => {
      setWorks((current) => current.map((item) => ids.includes(item.id) ? {
        ...item,
        views: item.views + 168,
        likes: item.likes + 8,
        comments: item.comments + 2,
        saves: item.saves === undefined ? undefined : item.saves + 5,
        updated: "刚刚",
      } : item));
      setSyncingIds((current) => current.filter((id) => !ids.includes(id)));
      setSelectedWorkIds((current) => current.filter((id) => !ids.includes(id)));
      toast(ids.length > 1 ? "作品数据批量同步完成" : "作品数据同步完成", { description: `已更新 ${ids.length} 条作品的浏览与互动数据` });
    }, 900);
  };

  return (
    <>
      <TabbedPageHeader
        eyebrow="内容中心"
        title="内容数据"
        description="查看各平台内容增长与作品表现"
        tabs={[{ value: "overview", label: "数据总览", icon: BarChart3, badge: "6 项指标" }, { value: "works", label: "作品数据", icon: Library, badge: works.length }]}
        value={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "overview" && (
        <>
          <div className="panel mb-5 flex flex-wrap items-center justify-between gap-4 p-4"><PlatformTabs active={overviewPlatform} onChange={setOverviewPlatform} /><div className="flex flex-wrap items-center justify-end gap-2"><span className="mr-1 flex items-center gap-1.5 text-xs font-semibold text-muted"><CalendarDays size={15} className="text-brand" />统计时间</span>{[["yesterday", "昨天"], ["7days", "近 7 天"], ["30days", "近 30 天"], ["custom", "自定义"]].map(([value, label]) => <button key={value} onClick={() => setDateRange(value as DateRange)} className={cn("rounded-lg border px-3 py-2 text-xs font-semibold transition", dateRange === value ? "border-brand bg-brand-pale text-brand" : "border-line text-muted hover:border-brand/40")}>{label}</button>)}{dateRange === "custom" && <div className="ml-2 flex items-center gap-2"><input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className="rounded-lg border border-line px-2 py-1.5 text-xs outline-none focus:border-brand" /><span className="text-xs text-muted">至</span><input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className="rounded-lg border border-line px-2 py-1.5 text-xs outline-none focus:border-brand" /></div>}</div></div>
          <div className="grid grid-cols-3 gap-4">
            {metricOptions.map((metric) => {
              const Icon = metric.icon;
              return <div className="panel p-5" key={metric.label}><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-muted">{currentPlatformLabel} · {metric.label}</p><p className="mt-3 text-3xl font-bold">{compactNumber(totals[metric.key])}</p></div><span className={cn("grid size-10 place-items-center rounded-xl", metric.cardColor)}><Icon size={18} /></span></div><p className="mt-4 text-xs font-semibold text-emerald-700">{rangeLabel}统计数据</p></div>;
            })}
          </div>
          <div className="panel mt-5 p-5">
            <div className="mb-5 flex items-start justify-between gap-6"><div><h2 className="text-lg font-bold">每日数据增长</h2><p className="mt-1 text-xs text-muted">{currentPlatformLabel} · {rangeLabel} · 点击指标控制趋势线显示</p></div><div className="flex max-w-2xl flex-wrap justify-end gap-2">{metricOptions.map((metric) => <button key={metric.key} onClick={() => toggleMetric(metric.key)} className={cn("flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition", visibleMetrics.includes(metric.key) ? "border-transparent text-white" : "border-line bg-white text-muted")} style={visibleMetrics.includes(metric.key) ? { backgroundColor: metric.color } : undefined}><span className={cn("size-2 rounded-full", !visibleMetrics.includes(metric.key) && "bg-slate-300")} style={visibleMetrics.includes(metric.key) ? { backgroundColor: "white" } : undefined} />{metric.label}</button>)}</div></div>
            <ResponsiveContainer width="100%" height={330}>
              <LineChart data={chartData} margin={{ left: -10, right: 18, top: 8 }}>
                <CartesianGrid stroke="#edf2ef" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#718077", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#718077", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e4ebe7" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                {metricOptions.filter((metric) => visibleMetrics.includes(metric.key)).map((metric) => <Line key={metric.key} type="monotone" name={metric.label} dataKey={metric.key} stroke={metric.color} strokeWidth={metric.key === "plays" ? 3 : 2} dot={{ r: 2.5 }} />)}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeTab === "works" && (
        <>
          <div className="panel mb-4 divide-y divide-line p-4"><div className="pb-4"><PlatformTabs active={worksPlatform} onChange={(platform) => { setWorksPlatform(platform); setWorksAccount(""); setWorksPublisher(""); setWorksPage(1); }} /></div><div className="flex flex-wrap items-center justify-between gap-5 pt-4"><div className="flex flex-wrap items-center gap-3"><label className="relative w-64 shrink-0"><Search size={15} className="absolute left-3 top-3 text-muted" /><input value={keyword} onChange={(event) => { setKeyword(event.target.value); setWorksPage(1); }} className="field pl-9" placeholder="搜索作品标题" /></label><FilterSelect value={worksAccount} options={accountOptions} placeholder="全部账号" onChange={(value) => { setWorksAccount(value); setWorksPage(1); }} /><FilterSelect value={worksPublisher} options={publisherOptions} placeholder="全部发布人" onChange={(value) => { setWorksPublisher(value); setWorksPage(1); }} /><FilterSelect value={worksStatus} options={["成功", "失败"]} placeholder="全部状态" onChange={(value) => { setWorksStatus(value); setWorksPage(1); }} className="w-36" /><DateRangeFilter value={worksDateRange} customStart={worksCustomStart} customEnd={worksCustomEnd} onChange={(value) => { setWorksDateRange(value); setWorksPage(1); }} onCustomStartChange={(value) => { setWorksCustomStart(value); setWorksPage(1); }} onCustomEndChange={(value) => { setWorksCustomEnd(value); setWorksPage(1); }} /></div><div className="flex items-center gap-3"><span className="text-xs text-muted">{selectedWorkIds.length > 0 ? `已选择 ${selectedWorkIds.length} 条作品` : `共 ${filteredWorks.length} 条作品`}</span>{selectedWorkIds.length > 0 && <><button disabled={selectedWorkIds.some((id) => syncingIds.includes(id))} onClick={() => syncWorks(selectedWorkIds)} className="inline-flex items-center gap-1.5 rounded-lg border border-brand/20 bg-brand-pale px-3 py-2 text-xs font-semibold text-brand transition hover:bg-emerald-100 disabled:cursor-wait disabled:opacity-60">{selectedWorkIds.some((id) => syncingIds.includes(id)) ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCw size={14} />}批量同步</button><button onClick={() => setDeleteTargets(works.filter((item) => selectedWorkIds.includes(item.id)))} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"><Trash2 size={14} />批量删除</button></>}</div></div></div>
          <div className="table-wrap">
            <table className="w-full text-sm">
              <thead className="table-head"><tr><th className="w-12 px-5 py-3.5"><input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll} className="size-4 accent-brand" aria-label="全选作品" /></th><th>作品</th><th>平台 / 账号</th><th>状态</th><th>浏览</th><th>点赞</th><th>评论</th><th>收藏</th><th>发布人</th><th>发布时间 / 同步</th><th className="pr-5 text-right">操作</th></tr></thead>
              <tbody className="divide-y divide-line">{pagedWorks.map((content) => <tr key={content.id} className="hover:bg-[#fbfcfb]"><td className="px-5 py-5"><input type="checkbox" checked={selectedWorkIds.includes(content.id)} onChange={() => setSelectedWorkIds((current) => current.includes(content.id) ? current.filter((id) => id !== content.id) : [...current, content.id])} className="size-4 accent-brand" aria-label={`选择 ${content.title}`} /></td><td className="font-semibold"><a href={content.url} target="_blank" rel="noreferrer" className="hover:text-brand hover:underline">{content.title}</a></td><td><p className="font-semibold">{content.platform}</p><p className="mt-1 text-xs text-muted">{content.account}</p></td><td><StatusBadge status={content.status} /></td><td>{compactNumber(content.views)}</td><td>{compactNumber(content.likes)}</td><td>{compactNumber(content.comments)}</td><td className={content.saves === undefined ? "text-amber-700" : ""}>{compactNumber(content.saves)}</td><td><div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-[#d6eee3] to-[#abd8c4] text-[11px] font-bold text-brand-dark">{content.publisher.slice(0, 1)}</span><span className="text-xs font-semibold">{content.publisher}</span></div></td><td><p className="font-mono text-xs text-ink">{content.publishedAt}</p><p className="mt-1 text-xs text-muted">同步于 {content.updated}</p></td><td className="pr-5"><div className="flex justify-end gap-3"><a href={content.url} target="_blank" rel="noreferrer" className="text-muted transition hover:text-brand" title="查看原平台作品"><ExternalLink size={15} /></a><button disabled={syncingIds.includes(content.id)} onClick={() => syncWorks([content.id])} className="text-muted transition hover:text-brand disabled:cursor-wait" title="同步作品数据">{syncingIds.includes(content.id) ? <LoaderCircle size={15} className="animate-spin text-brand" /> : <RefreshCw size={15} />}</button><button onClick={() => setDeleteTargets([content])} className="text-muted transition hover:text-rose-700" title="删除作品"><Trash2 size={15} /></button></div></td></tr>)}</tbody>
            </table>
            {filteredWorks.length === 0 && <div className="grid min-h-64 place-items-center text-center"><div><p className="font-bold">没有找到对应作品</p><p className="mt-2 text-sm text-muted">请切换平台或调整搜索关键词</p></div></div>}
            {filteredWorks.length > 0 && <Pagination page={worksPage} pageSize={worksPageSize} total={filteredWorks.length} onPageChange={setWorksPage} onPageSizeChange={(size) => { setWorksPageSize(size); setWorksPage(1); }} />}
          </div>
        </>
      )}

      {deleteTargets.length > 0 && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#091c14]/45 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setDeleteTargets([]); }}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"><div className="flex items-start gap-4"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-700"><Trash2 size={18} /></div><div><h2 className="font-bold">{deleteTargets.length > 1 ? `删除选中的 ${deleteTargets.length} 条作品？` : "删除作品？"}</h2><p className="mt-2 text-sm leading-6 text-muted">删除后作品将从内容数据列表中移除，且无法恢复。</p></div></div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeleteTargets([])} className="btn-secondary !py-2">取消</button><button onClick={confirmDelete} className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"><Trash2 size={14} />确认删除</button></div></div>
        </div>
      )}
    </>
  );
}
