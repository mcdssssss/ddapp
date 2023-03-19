<template>
  <a-tooltip title="代理人">
    <router-link :to="`/user/agent/agents?agentNo=${no}`">
      <i class="iconfont icon-agent fo-18"></i>
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
