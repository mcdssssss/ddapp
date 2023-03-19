# 后台管理系统

## 一、安装启动

```
# 安装 
yarn

# 启动 并访问 本地服务器 localhost
yarn local

# 启动 并访问 线上服务器
yarn prod
```

## 二、开发规范

### 1.命名需遵从以下原则

- 变量名驼峰规范
- 常量首字母大写
- 禁止缩写 详细一些
- 数组一律 s 结尾 users buckets
- 函数命名规范 动词开头 can get set load send handle filter fetch
- 组件的文件夹为 小写字母+下划线 组件名为驼峰 首字母大写

### 2.框架

- nuxt
- ant-design
- less
- typescript
- 使用 eslint 和 prettier .vscode
- 使用 yarn 代替 npm

### 3.git 规范

- 使用前缀 fix: bug fixed
  （注意，是英文的冒号，后面跟一个英文的空格）
  > feat: 新功能（feature）
  > fix: 修补 bug
  > docs: 文档（documentation）
  > style: 格式（不影响代码运行的变动）
  > refactor: 重构（即不是新增功能，也不是修改 bug 的代码变动）
  > test: 增加测试
  > chore: 构建过程或辅助工具的变动
- 使用 pull request
- 使用 dev 分支开发

### 4.全局组件

- 注册到全局的组件一律写到 ~/components/base 目录下
- 在~/components/base/index.js 中注册组件

### 5.文件创建规范

- ~/pages 目录下创建页面文件夹+index.ts
- 页面的所有组件编写在~/components 目录下，并以页面的文件夹命名
- 公用混合方法文件写在~/plugins/mixins 目录下
