<template>
  <div class="home-container">
    <div class="home-page-title">小程序设置</div>
    <a-tabs v-model="current">
      <a-tab-pane key="2" tab="开发设置" force-render>
        <AppauthConfig />
      </a-tab-pane>
      <a-tab-pane key="3" tab="支付设置" force-render>
        <AppmchConfig />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import AppauthConfig from '@/components/config/AppauthConfig.vue';
import AppmchConfig from '@/components/config/AppMch.vue';
export default Vue.extend({
  components: {
    AppauthConfig,
    AppmchConfig
  },
  layout: 'global',
  data() {
    return { current: this.$route.query.type || '2' };
  }
});
</script>
