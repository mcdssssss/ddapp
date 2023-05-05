# 校园跑腿-跑腿便利店小程序-本地开发

### 项目目录

```
- server   // 服务端项目
- admin    // 后台项目
- miniprogram // 小程序项目
```

## 1.准备工作

### 1.1 本地环境

- nodejs 建议使用 v16.x 版本以上。但是小程序项目必须使用 v12.x 版本
- nvm(建议安装) node 版本管理工具包
- mysql 5.7 以上
- redis 2.x 以上

### 1.2 开发工具

- vscode[https://code.visualstudio.com/download](https://code.visualstudio.com/download)
- 微信开发者工具[https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 2.服务端开发

- 用 vscode 打开“server”目录
- 开发文档 [https://midwayjs.org/docs/quickstart](https://midwayjs.org/docs/quickstart)

### 2.1 配置文件

> 找到 /server/src/config/config.env.ts.bak 文件
> 复制并粘贴到同目录下。命名为 config.local.ts
> 打开文件进行配置

```
// 数据库配置
...
orm: {
    /**
     * 单数据库实例
     */
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root', // 用户名
    password: 'root', // 密码
    database: 'ddrunv2-free', // 数据库
    synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
    logging: false,
  }
  ...
  // 配置redis
  redis: {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  }
  ...
  // task 和 bull中的redis 都填一样的即可
```

### 2.2 打开终端

```
// 以下操作都在终端完成
// 第一步 安装依赖(建议使用yarn,并采用淘宝源)
yarn 或 npm run install

// 第二步 启动项目
yarn local 或 npm run local

// 如出现以下信息，表示运行成功
[ Midway ] Start Server at  http://127.0.0.1:8001
[ Midway ] Start on LAN http://192.168.31.179:8001
```

## 3.后台开发

- 用 vscode 打开“admin”目录
- 开发文档 [https://www.nuxtjs.cn/guide/installation](https://www.nuxtjs.cn/guide/installation)
- 打开终端

```
// 以下操作都在终端完成
// 第一步 安装依赖(建议使用yarn,并采用淘宝源)
yarn 或 npm run install

// 第二步 启动项目
yarn local 或 npm run local
```

## 4.小程序项目开发

- 用 vscode 打开“miniprogram”目录
- uniapp 开发文档 [https://zh.uniapp.dcloud.io/](https://zh.uniapp.dcloud.io/)

### 4.1 打开终端

```
// 注意需要切换node版本至12.x版本
nvm use 12

// 第一步 安装依赖(建议使用yarn,并采用淘宝源)
yarn 或 npm run install

// 第二步 启动项目
yarn local-wx 或 npm run local-wx
```

### 4.2 打开微信开发者工具

- 打开微信开发者工具
- 导入项目，目录为 miniprogram/dist/dev/mp-weixin
