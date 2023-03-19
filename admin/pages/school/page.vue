<template>
  <div class="p-20">
    <a-row :gutter="20">
      <a-col v-for="(item, index) in pages" :key="index" class="page-item mb-20" :span="12">
        <div class="fo-14 fo-9">{{ item.style.navigationBarTitleText || '小程序页面' }}</div>
        <div class="mt-4 fo-14 fo-3">/{{ item.path }}</div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
const pageData = require('@/plugins/pages.json');
export default Vue.extend({
  data() {
    return {
      pages: pageData.pages
    };
  }
});
</script>
