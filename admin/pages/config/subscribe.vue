<template>
  <div class="home-container">
    <div class="home-page-title">订阅消息设置</div>
    <a-tabs default-active-key="2">
      <a-tab-pane key="2" tab="微信订阅消息">
        <WxappSubscribe />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import WxappSubscribe from '@/components/config/WxappSubscribe.vue';
export default Vue.extend({
  components: {
    WxappSubscribe
  },
  layout: 'global'
});
</script>
