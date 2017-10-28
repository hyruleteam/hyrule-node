module.exports = {
    dev:{
        version: '1.0.0',
        env: 'yl server',
        // 上传配置
        ssh: {
            //host: '172.16.5.49',
            host: '36.7.136.3',
            port: 4922,
            username: 'root',
            password:'abc123'
        },
        remoteDir: `/home/wwwroot/sc_mobile/current/public`,
        commands: [
            // 删除现有文件
            // `rm -rf /home/wwwroot/sc_mobile/current/public`
            `gulp qwui`
        ]
    },
    production:{
        version: '1.0.0',
        env: 'yl server',
        // 上传配置
        ssh: {
            host: '218.22.2.29',
            port: 35005,
            username: 'root',
            password:'scPt#2017'
        },
        remoteDir: `/data/wwwroot/sc_mobile/current/public`,
        commands: [
            // 删除现有文件
            `rm -rf /data/wwwroot/sc_mobile/current/public`
        ]
    }
}