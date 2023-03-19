<template>
  <div class="home-container">
    <div class="home-page-title">地图及上传设置</div>
    <a-tabs v-model="current">
      <a-tab-pane key="map" tab="地图设置" force-render>
        <MapConfig />
      </a-tab-pane>
      <a-tab-pane key="ali" tab="阿里云上传配置">
        <AliConfig />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import AliConfig from '@/components/config/AliConfig.vue';
import MapConfig from '@/components/config/MapConfig.vue';
export default Vue.extend({
  components: {
    AliConfig,
    MapConfig
  },
  layout: 'global',
  data() {
    return {
      current: this.$route.query.type || 'map'
    };
  }
});
</script>
