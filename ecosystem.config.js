module.exports = {
  apps: [
    {
      name: "rolbot",
      script: "index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      restart_delay: 5000,
      max_restarts: 10,
      kill_timeout: 10000,
      env: {
        NODE_ENV: "production",
      },
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
