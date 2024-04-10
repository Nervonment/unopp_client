# unopp_client
unopp 是一个联机桌游应用。本仓库是 unopp 的前端/客户端。

本项目使用 [Next.js](https://nextjs.org/) 框架开发，使用 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 构建。

## 运行（开发环境）

使用以下命令运行调试服务器：

```sh
npm run dev
```

然后在 [http://localhost:3000](http://localhost:3000) 即可查看结果。对代码的更改保存后会即时重新编译。

## 配置服务器主机地址和端口

在 `config.js` 中配置运行后端的主机地址和通信端口：   
- `server` 是运行后端的主机地址；  
- `wsPort` 是用于 WebSocket 通信的端口；
- `httpPort` 是用于 Http 通信的端口。

你需要在后端的相关文件里配置相同的端口，详见后端仓库的说明文档。

## 构建/部署

有两种方式进行构建和部署：

### 输出静态 HTML 页面

使用以下命令输出静态的 html, js, css 文件：

```sh
npm run build
```

输出目录为 `out`。随后可以用 `nginx` 之类的 http 服务器挂载。

### 直接使用 Node.js 服务器运行

首先需要在 `next.config.mjs` 配置文件中把 `output: "export"` 去掉。然后运行以下两条命令即可：

```sh
npm run build
npm run start
```

关于部署的详细内容请参考 [Next.js 文档](https://nextjs.org/docs/pages/building-your-application/deploying)。