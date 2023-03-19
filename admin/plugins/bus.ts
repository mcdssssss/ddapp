import Vue from 'vue';

const bus = {} as any;

bus.install = function () {
  Vue.prototype.$bus = new Vue();
};

Vue.use(bus);
