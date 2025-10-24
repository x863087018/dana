module.exports = {
    apps: [{
      name: 'dana-console',
      script: 'server.js', // 使用 Node.js 运行 server.js
      cwd: '/root/dana', // 工作目录
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/root/dana/logs/err.log',
      out_file: '/root/dana/logs/out.log',
      log_file: '/root/dana/logs/combined.log',
      time: true,
    }]
  };