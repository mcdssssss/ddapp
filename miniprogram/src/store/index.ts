import Vue from "vue";
import Vuex from "vuex";

import profile from "./modules/profile";
import school from "./modules/school";
import publish from "./modules/publish";
import config from "./modules/config";
import coupon from "./modules/coupon";
import shop from "./modules/shop";

Vue.use(Vuex);
interface IndexState {
  provider: string;
}
export default new Vuex.Store({
  state: {
    provider: "",
  },
  mutations: {
    setProvider(state: IndexState, value: string) {
      state.provider = value;
    },
  },
  modules: {
    profile,
    school,
    publish,
    config,
    coupon,
    shop,
  },
  actions: {},
});
