# unopp_client
unopp 是一个联机桌游应用。本仓库是 unopp 的客户端，基于 React 开发。

## 构建
本项目使用 yarn 构建。

安装依赖：
```
yarn install
```

调试：
```
yarn start
```
应用会默认被加载在 http://localhost:3000 上。修改源代码并保存，便能自动重新编译，不用重新启动调试。

构建：
```
yarn build
```
输出目录为 `build`，随后就可以部署在服务器上了。

## 配置
`unopp_client` 会向端口 `1145` 和 `1146` 发送数据。其中 `1145` 用于 WebSocket 连接，`1146` 用于 Http 连接。你可以在 `src/config.js` 中配置后端主机地址以及通信端口。