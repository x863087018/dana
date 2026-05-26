# Dana Web（dana）维护说明

> Web 管理端/后台页面（SPA）。

## 1. 技术栈

- Vue 3 + TypeScript
- Vite（开发/构建）
- Pinia（状态管理）
- Vue Router
- Ant Design Vue（UI）
- Axios（请求封装）

## 2. 目录结构（核心）

```
src/
  api/                # 接口定义与 axios 封装、拦截器
  assets/             # 静态资源（图片/样式）
  components/         # 通用组件
  config/             # 环境变量读取等
  router/             # 路由与路由守卫
  store/              # Pinia 模块
  view/               # 页面
```

## 3. 环境变量与配置

项目使用 Vite 环境变量控制后端地址，并通过 Vite Proxy 代理到后端：

- `.env.development` / `.env.production`
  - `VITE_API_BASE_URL`：后端 HTTP 地址（例：`http://<host>:1123`）
  - `VITE_WS_BASE_URL`：后端 WS 地址（例：`ws://<host>:1123`）

关键文件：

- `src/config/env.ts`：读取 `import.meta.env.*`
- `vite.config.ts`：代理规则
  - `/api` → `VITE_API_BASE_URL`
  - `/ws`  → `VITE_WS_BASE_URL`

## 4. 本地开发

### 4.1 安装依赖

```bash
npm install
```

### 4.2 启动开发服务器（Vite）

```bash
npm run dev
```

- 默认端口：`3000`（见 `vite.config.ts`）
- 会自动打开浏览器（`open: true`）

> 注意：本项目也提供了一个用于“生产静态站点”的 Koa server（见下方），它默认也使用 3000 端口。开发时请使用 `npm run dev`，不要同时用 `npm start`。

## 5. 构建与部署

### 5.1 构建静态资源（推荐）

```bash
npm run build:web
```

产物输出到 `dist/`。

### 5.2 静态站点启动（Koa）

```bash
npm run start
```

会执行 `node server.js`：

- 将 `dist/` 作为静态目录
- 所有路由回落到 `dist/index.html`（SPA）
- 端口：`PORT` 环境变量或默认 `3000`

## 6. 与后端 dana-api 的对接约定

### 6.1 API 前缀

`src/api/index.ts` 中 `baseURL` 固定为：

- `baseURL: '/api'`

因此：

- **开发环境**：依赖 Vite proxy 转发到 `VITE_API_BASE_URL`
- **生产环境**：建议由 Nginx/网关将 `/api` 转发到后端服务

### 6.2 鉴权（JWT）

请求拦截器会读取：

- `sessionStorage.spaceToken`

并自动加到 Header：

- `Authorization: Bearer <token>`

当后端返回未登录状态码时，会清理登录信息并跳转到 `/login`。

## 7. 常见维护点（建议）

1. **不要提交产物/依赖到仓库**：建议忽略 `dist/`、`node_modules/`。
2. **统一端口**：开发（Vite）与生产静态服务（Koa）默认都为 3000，若需同时运行请改其中一个端口。
3. **后端地址切换**：优先通过 `.env.*` 文件控制，不要硬编码在代码里。

## 8. 常用命令速查（package.json）

- `npm run dev`：启动开发服务器（Vite）
- `npm run build:web`：构建静态资源（Vite build）
- `npm run serve`：本地预览构建产物（vite preview）
- `npm run start`：使用 Koa 启动 `dist/` 静态站点

