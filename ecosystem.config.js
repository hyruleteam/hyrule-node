module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [{
        name: 'demo',
        script: './Server/bin/www',
        env: {
            COMMON_VARIABLE: 'true'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user: 'root',
            host: '11.11.11.11',
            port: '22',
            ref: 'origin/master',
            repo: 'git@github.com:wenyuking/koa-requirejs-kit.git',
            path: '/data/wwwroot/demo',
            'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
            env: {
                NODE_ENV: 'production'
            }
        },
        dev: {
            user: 'root',
            host: '22.22.22.22',
            port: '22',
            ref: 'origin/master',
            repo: 'git@github.com:wenyuking/koa-requirejs-kit.git',
            path: '/home/wwwroot/demo',
            'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
            env: {
                NODE_ENV: 'dev'
            }
        }
    }
};