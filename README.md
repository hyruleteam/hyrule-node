### Koa+Requirejs-Kit

使用koa进行首屏服务端加载，使用koa-arttemplate作为页面统一的渲染框架。采取MVC结构模式进行开发
大量使用async await进行异步编程。之后会加入mock数据格式，断点调试等功能

### 目录说明
* `Client` 前台浏览器端代码
* `Config` 全局的配置文件
* `Logs` 日志文件记录
* `Server` Node端代码
* `Static` 全站静态资源文件
* `ecosystem.config.js` PM2文件发布配置文件
* `gulpfiles` gulp配置文件

### api环境切换工具
`npm run capi -d <env>`

#### 可选参数
* `dev` 本地开发环境
* `prod` 线上生产环境

### 如何启动
* 进入根目录，通过`gulp`命令启动

### 其他命令
* 打包资源文件：通过`gulp buildAssets`命令启动
* 打包生产环境文件：通过`gulp buildPack`命令启动