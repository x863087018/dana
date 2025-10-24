const Koa = require('koa');
const koaStatic = require('koa-static');
const path = require('path');
const send = require('koa-send');

const app = new Koa();
const port = process.env.PORT || 3000;

// 服务静态文件
app.use(koaStatic(path.join(__dirname, 'dist')));

// 处理 SPA 路由，所有请求都返回 index.html
app.use(async (ctx) => {
  await send(ctx, 'dist/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

