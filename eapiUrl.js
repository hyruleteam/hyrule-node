#!/usr/bin/env node
const program = require('commander')
const fs = require('fs');
let chalk = require('chalk')
const jsConfig = './Static/js/pages/main.js';
const apiFile = {
    server: "./Config/server/index.js",
    client: "./Static/js/pages/module/apiURL.js"
}
const apiURL = {
    dev: {
        out: "http://172.16.5.49:8089",
        in: "http://172.16.5.49:8089"
    },
    devout: {
        out: "http://36.7.136.3:18089",
        in: "http://172.16.5.49:8089"
    },
    prod: {
        out: "http://101.201.51.188:8080",
        in: "http://10.46.180.210:8080"
    },
}

program
    .version('0.0.1')
    .description('环境地址切换工具 by Jacobwang')
    .option('-d, --deploy <type>', '发布切换', 'dev')

program.on('--help', function() {
    console.log(' 示例:');
    console.log('');
    console.log('    $ node build.js --deploy dev');
    console.log('    $ node build.js -d dev');
    console.log('');
});

program.parse(process.argv)

if (apiURL[program.deploy]) {
    //server
    fs.readFile(apiFile.server, 'utf8', (err, data) => {
        if (err) console.log(chalk.red(`服务端配置文件不存在`));
        const reg = /baseURL[\s]*=[\s]*["|'][^"|']+["|']/g;
        const reg2 = /["|'](.*)["|']/g;
        const rst = data.match(reg)[0].replace(reg2, `\'${apiURL[program.deploy].in}\'`);
        const newData = data.replace(reg, rst)

        fs.writeFile(apiFile.server, newData, (err) => {
            if (err) console.log(chalk.red(`服务端配置文件不存在`));
            console.log(chalk.green(`服务端接口地址成功更改为：${program.deploy}`));
        });
    });

    //client
    fs.readFile(apiFile.client, 'utf8', (err, data) => {
        if (err) console.log(chalk.red(`客户端配置文件不存在`));
        const reg = /\w+\.baseURL[=|\s]+["|'][^"|']+["|']/g;
        const reg2 = /["|'](.*)["|']/g;
        const rst = data.match(reg)[0].replace(reg2, `\'${apiURL[program.deploy].out}\'`);
        const newData = data.replace(reg, rst);

        fs.writeFile(apiFile.client, newData, (err) => {
            if (err) console.log(chalk.red(`客户端配置文件不存在`));
            console.log(chalk.green(`客户端接口地址成功更改为：${program.deploy}`));
        });
    });
} else {
    console.log(chalk.red(`参数错误`))
}

//set Version about requireJS
fs.readFile(jsConfig, 'utf8', (err, data) => {
    const timer = (new Date()).getTime();
    const reg = /{{+[a-z]+}}/g;
    const rst = data.replace(reg,timer);
    fs.writeFile(jsConfig, rst, (err) => {
        if (err) console.log(chalk.red(`js配置文件不存在`));
        console.log(chalk.green(`js配置文件修改成功，当前版本为${timer}`));
    });
});