<template>
  <a-tooltip title="用户">
    <router-link :to="`/user/users?userNo=${no}`">
      <i class="iconfont icon-avatar fo-18"></i>
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
