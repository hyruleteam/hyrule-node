## hyrule-node

### 基于Nodejs Koa框架的前端渲染层服务

### 特性

#### 浏览器端
* 使用ES6+语法编码，支持模块化语法
* 使用Sass组织样式文件
* 内置`axios`,`vue`等前端框架、组件

#### Node服务端
* 使用ES6+语法编码
* 使用MVC架构组织目录
* 独立API层，内置API拦截器，API限流等

### 目录说明
* `client` 前台浏览器端代码
* `config` 全局的配置文件
* `logs` 日志文件记录
* `server` Node端代码
* `ecosystem.config.js` PM2文件发布配置文件

### 如何启动
* 进入根目录，通过`npm start`命令启动

### 其他命令
* 打包资源文件：通过`npm run build`命令启动
* 启动线上环境：通过`npm run prd`命令启动
