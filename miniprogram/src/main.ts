import Vue from "vue";
import App from "./App.vue";
import store from "@/store";
import "@/assets/font/iconfont.css";
import Button from "@/components/base/button/Button.vue";
import Tag from "@/components/base/tag/Tag.vue";
import Empty from "@/components/base/empty/Empty.vue";
import ScrollX from "@/components/base/scroll/ScrollX.vue";
import DImage from "@/components/base/image/image.vue";
import Watermark from "@/components/base/watermark/Watermark.vue";

Vue.component("DButton", Button);
Vue.component("DTag", Tag);
Vue.component("DEmpty", Empty);
Vue.component("DScrollX", ScrollX);
Vue.component("DImage", DImage);
Vue.component("Watermark", Watermark);

Vue.config.productionTip = false;
Vue.prototype.$store = store;
new App({
  store,
}).$mount();
