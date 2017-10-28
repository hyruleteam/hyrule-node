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