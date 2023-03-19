import Vue from 'vue';
import Antd from 'ant-design-vue/lib';
import scrollbar from 'vue-scrollbar-live';

Vue.use(Antd);
Vue.component('Scrollbar', scrollbar);
Vue.prototype.$message.config({
  maxCount: 1
});
