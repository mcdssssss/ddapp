<template>
  <a-tooltip title="操作人">
    <router-link :to="`/user/admins?adminNo=${no}`">
      <i class="iconfont icon-admin fo-18"></i>
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
