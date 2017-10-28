module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name: 'scapp',
            script: './bin/www',
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
            host: '218.22.2.29',
            port: '35005',
            ref: 'origin/master',
            repo: 'git@ah.qwang.top:front-end/doubleGen_Mobile_SSR.git',
            path: '/data/wwwroot/sc_mobile',
            'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
            env: {
                NODE_ENV: 'production'
            }
        },
        dev: {
            user: 'root',
            host: '36.7.136.3',
            port: '4922',
            ref: 'origin/master',
            repo: 'git@ah.qwang.top:front-end/doubleGen_Mobile_SSR.git',
            path: '/home/wwwroot/sc_mobile',
            'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
            env: {
                NODE_ENV: 'dev'
            }
        }
    }
};
