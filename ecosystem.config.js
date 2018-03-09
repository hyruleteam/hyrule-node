module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [{
        name: 'greatwall-pc_out',
        script: './Server/bin/out',
        env: {
            COMMON_VARIABLE: 'true'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    },
        {
            name: 'greatwall-pc',
            script: './Server/bin/www',
            env: {
                COMMON_VARIABLE: 'true'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user: 'root',
            host: '101.201.51.188',
            port: '22',
            ref: 'origin/master',
            repo: 'git@ah.qwang.top:front-end/greatwall-car-pc.git',
            path: '/home/wwwroot/greatwall_pc',
            'post-deploy': 'npm install && gulp buildPack && node eapiUrl.js -d prod && pm2 reload ecosystem.config.js --env production --only greatwall-pc',
            env: {
                NODE_ENV: 'production'
            }
        },
        dev: {
            user: 'root',
            host: '172.16.5.49',
            ref: 'origin/master',
            repo: 'git@ah.qwang.top:front-end/greatwall-car-pc.git',
            path: '/home/wwwroot/greatwall_pc',
            'post-deploy': 'npm install && gulp buildPack && node eapiUrl.js -d dev && pm2 reload ecosystem.config.js --env production --only greatwall-pc',
            env: {
                NODE_ENV: 'dev'
            }
        },
        out: {
            user: 'root',
            host: '172.16.5.49',
            ref: 'origin/master',
            repo: 'git@ah.qwang.top:front-end/greatwall-car.git',
            path: '/home/wwwroot/greatwall_pc_out',
            'post-deploy': 'npm install && gulp buildPack && node eapiUrl.js -d devout && pm2 reload ecosystem.config.js --env production --only greatwall-pc_out',
            env: {
                NODE_ENV: 'dev'
            }
        }
    }
};