<template>
  <div class="home-container">
    <div class="home-page-title">订阅消息设置</div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="我的模板" force-render>
        <MySubscribe />
      </a-tab-pane>
      <a-tab-pane key="2" tab="公共模板" force-render>
        <PubSubscribe />
      </a-tab-pane>
      <a-tab-pane key="3" tab="消息设置" force-render>
        <SubscribeSetting />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import MySubscribe from '@/components/config/MySubscribe.vue';
import PubSubscribe from '@/components/config/PubSubscribe.vue';
import SubscribeSetting from '@/components/config/SubscribeSetting.vue';
export default Vue.extend({
  components: {
    MySubscribe,
    PubSubscribe,
    SubscribeSetting
  },
  layout: 'global',
  data() {
    return {};
  },
  mounted() {},
  methods: {}
});
</script>
