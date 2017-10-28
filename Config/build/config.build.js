module.exports = {
    dev: {
        version: '1.0.0',
        env: 'yl server',
        // 上传配置
        ssh: {
            host: '22.22.22.22',
            port: 22,
            username: 'root',
            password: '123'
        },
        remoteDir: `/home/wwwroot/demo`,
        commands: [
            // 删除现有文件
            `rm -rf /home/wwwroot/demo`
        ]
    },
    production: {
        version: '1.0.0',
        env: 'yl server',
        // 上传配置
        ssh: {
            host: '22.22.22.22',
            port: 22,
            username: 'root',
            password: '123'
        },
        remoteDir: `/home/wwwroot/demo`,
        commands: [
            // 删除现有文件
            `rm -rf /home/wwwroot/demo`
        ]
    },
}