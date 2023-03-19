// eslint-disable-next-line nuxt/no-cjs-in-config
const config = require('./config');
const isEnv = process.env.NODE_ENV === 'dev';
const isLocal = process.env.NODE_ENV === 'local';
const isProd = process.env.NODE_ENV === 'prod';
const getProxyTarget = () => {
  if (isEnv) {
    return config.envDomain;
  } else if (isLocal) {
    return config.localDomain;
  } else if (isProd) {
    return config.prodDomain;
  } else {
    return config.localDomain;
  }
};
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: config.title,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ]
  },
  server: {
    port: config.port, // default: 3000
    host: '0.0.0.0' // default: localhost,
  },
  ssr: false,
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    './assets/font/iconfont.css',
    'ant-design-vue/dist/antd.less',
    './assets/style/common.less',
    './assets/style/theme.less',
    'froala-editor/css/froala_editor.pkgd.min.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/antd-ui',
    '@/components/base/index',
    '@/plugins/bus',
    '@/plugins/api',
    '@/plugins/froala'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    perfix: '/admin',
    credentials: true
  },
  proxy: {
    '/admin': {
      target: getProxyTarget()
    }
  },
  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      less: {
        strictMath: false,
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#955ce6', // 全局主色
          'link-color': '#955ce6', // 链接色
          'success-color': '#52c41a', // 成功色
          'warning-color': '#faad14', // 警告色
          'error-color': '#f5222d', // 错误色
          'font-size-base': '14px', // 主字号
          'heading-color': '#333333', // 标题色
          'text-color': '#333333', // 主文本色
          'text-color-secondary': '#666666', // 次文本色
          'disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
          'border-radius-base': '4px', // 组件/浮层圆角
          'border-color-base': '#d9d9d9', // 边框色
          'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
          'input-height-base': '40px',
          'font-size-lg': '14px'
        }
      }
    }
  }
};
