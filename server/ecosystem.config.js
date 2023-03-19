module.exports = {
  apps: [
    {
      name: 'ddrunv2-free',
      script: 'bootstrap.js',
      cwd: './',
      // 是否启用监控模式，默认是false。如果设置成true，当应用程序变动时，pm2会自动重载。这里也可以设置你要监控的文件。
      watch: false,
      env: {
        // 环境参数，当前指定为生产环境 process.env.NODE_ENV
        NODE_ENV: 'prod',
      },
    },
  ],
};
