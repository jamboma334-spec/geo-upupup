# GEO 双中心前端 Mock

这是一个用于验证 GEO 双中心产品交互的前端 Mock 项目。当前没有后端依赖，所有业务数据都在本地 Mock 文件中维护，适合产品评审、交互验证和后续工程化改造。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- React 19
- Recharts
- lucide-react

## 快速启动

```bash
npm install
npm run dev
```

访问：

```text
http://localhost:3000
```

生产构建验证：

```bash
npm run build
```

`build` 脚本会输出到 `.next-build`，避免覆盖正在运行的开发服务 `.next` 目录。

## 目录结构

```text
src/
  app/                         # Next.js App Router 页面
    content/
      accounts/                # 平台授权
      library/                 # 内容数据：数据总览、作品数据
      publish/                 # 内容发布列表、新建、详情
    monitor/                   # 监测中心页面
    settings/                  # 设置：企业管理、成员管理
    globals.css                # 全局样式与 Tailwind component class
    layout.tsx                 # 全局 Provider 与 AppShell
  components/                  # 通用组件
  lib/                         # 工具函数
  mocks/                       # Mock 数据
  types/                       # 业务类型
knowledge/                     # 产品规划与方案文档
```

## 页面规范

### 页面入口

页面统一放在 `src/app/**/page.tsx`。动态详情页使用 App Router 目录约定，例如：

```text
src/app/content/publish/[id]/page.tsx
```

### 页面标题

普通页面使用 `PageHeader`：

```tsx
<PageHeader
  eyebrow="内容中心 / 平台授权"
  title="平台与账号"
  description="通过平台扫码登录添加账号，统一测试登录状态并管理发布权限。"
/>
```

带页面级 Tab 的页面使用 `TabbedPageHeader`，保持“标题 + Tab 同行，说明在标题下方”的规范：

```tsx
<TabbedPageHeader
  eyebrow="内容中心"
  title="内容数据"
  description="查看各平台内容增长与作品表现"
  tabs={[{ value: "overview", label: "数据总览" }]}
  value={activeTab}
  onChange={setActiveTab}
/>
```

后续新增页面级 Tab 时，不要重新写一套 Tab 样式，直接复用 `src/components/page-tabs.tsx`。

## 通用组件规范

### AppShell

`src/components/app-shell.tsx` 负责：

- 左侧导航
- 顶部企业切换
- 场景选择
- 全局布局宽度与 header

新增主菜单时优先修改 `navGroups`，不要在页面内自建侧边栏。

### Toast

所有列表操作完成后都应该给用户反馈，使用：

```tsx
const { toast } = useToast();
toast("操作成功", { description: "可选描述" });
```

Provider 在 `src/app/layout.tsx` 中已统一注入。

### 筛选下拉

查询筛选型下拉统一使用 `FilterSelect`：

- 支持选项模糊搜索
- 支持叉号一键清除
- 选择或清除后应立即重置分页到第一页

```tsx
<FilterSelect
  value={statusFilter}
  options={["成功", "失败"]}
  placeholder="全部状态"
  onChange={(value) => {
    setStatusFilter(value);
    setPage(1);
  }}
/>
```

分页条数、表格内编辑角色、顶部场景选择等不是查询筛选的场景，可以继续使用原生 `select`。

### 时间筛选

时间范围筛选统一使用 `DateRangeFilter`：

- 全部时间
- 昨天
- 近 7 天
- 近 30 天
- 自定义时间范围

过滤判断复用 `matchesDateRange`，不要在页面内重复写日期边界逻辑。

### 分页

列表分页统一使用 `Pagination`：

- 默认每页 10 条
- 支持 20 / 50 条切换
- 切换筛选条件时重置到第一页

### 表格

表格外层使用：

```tsx
<div className="table-wrap">
  <table className="w-full text-sm">
    <thead className="table-head">...</thead>
  </table>
</div>
```

`table-head` 已在 `globals.css` 中设置吸顶，避免滚动后丢失列标题。

## Mock 数据规范

业务数据集中维护：

```text
src/mocks/data.ts            # Query、任务、发布、作品、趋势等数据
src/mocks/organizations.ts   # 企业与成员数据
```

类型集中维护：

```text
src/types/index.ts
```

新增字段时请同步处理三件事：

1. 更新 TypeScript 类型。
2. 更新 Mock seed 数据。
3. 更新新增数据逻辑，例如扫码添加账号、同步作品数据等。

当前常见字段约定：

- 时间展示使用 `yyyy-MM-dd hh:mm:ss` 或已有业务列表格式。
- 发布相关任务使用 `publisher` 表示发布人。
- 作品数据使用 `publishedAt` 表示发布时间，`updated` 表示最近同步时间。
- 平台授权使用 `addedAt`、`addedBy` 表示添加时间和添加人。

## 状态与 Provider

全局企业状态由 `OrganizationProvider` 管理：

```text
src/components/organization-provider.tsx
```

它负责：

- 当前企业
- 企业列表
- 企业启用 / 停用状态

需要读取或切换企业时使用 `useOrganization()`，不要在页面里另建一份企业状态。

## 样式规范

常用 Tailwind component class 定义在 `src/app/globals.css`：

- `panel`
- `btn-primary`
- `btn-secondary`
- `field`
- `table-wrap`
- `table-head`

优先复用这些 class，避免每个页面堆一套重复样式。

颜色和阴影 token 在 `tailwind.config.ts` 中维护：

- `brand`
- `brand-dark`
- `brand-pale`
- `ink`
- `muted`
- `line`
- `canvas`
- `shadow-panel`

## 新增列表页建议流程

1. 新建 `src/app/.../page.tsx`。
2. 使用 `PageHeader` 或 `TabbedPageHeader`。
3. 查询区使用 `FilterSelect`、`DateRangeFilter`。
4. 表格使用 `table-wrap` + `table-head`。
5. 分页使用 `Pagination`。
6. 操作完成后用 `useToast()` 提示。
7. Mock 数据放入 `src/mocks`，类型放入 `src/types`。
8. 跑 `npm run build` 验证。

## 后续工程化建议

- 将页面内较长的业务片段拆成局部组件，例如列表筛选区、表格行、详情信息条。
- 将 Mock 数据替换为 API 层时，先抽 `services/` 或 `api/` 目录，不要让页面直接散落请求代码。
- 引入 ESLint / Prettier 配置并接入 CI。
- 为复杂筛选、分页、弹窗确认等通用逻辑补单元测试或组件测试。
- 梳理真实后端字段后，统一生成或维护 DTO 类型，避免 Mock 字段和接口字段分叉。
