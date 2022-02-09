module.exports = {
    apps: [
        {
            name: 'thread_buffet',
            script: './dist/index.js',

            watch: false,

            min_uptime: '5s',
            max_restarts: 3,
            restart_delay: 0,
            autorestart: true
        }
    ]
};
