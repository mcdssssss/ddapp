<template>
  <a-tooltip title="骑手">
    <router-link :to="`/rider/riders?riderNo=${no}`">
      <i class="iconfont icon-rider fo-18"></i>
    </router-link>
  </a-tooltip>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    no: {
      type: String,
      default: ''
    }
  }
});
</script>
