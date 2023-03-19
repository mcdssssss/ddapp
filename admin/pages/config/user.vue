<template>
  <div class="home-container">
    <div class="home-page-title">用户指南</div>
    <f-editor ref="edit" v-model="content" class="mt-20" />
    <a-button
      class="mt-20"
      type="primary"
      size="large"
      :disabled="content === ''"
      :loading="loading"
      @click="submit"
      >提交保存</a-button
    >
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  layout: 'global',
  data() {
    return {
      content: '',
      loading: false
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      const result = await (this as any).$api.adminGuideUserGet();
      if (result.code === 200 && result.data) {
        this.content = result.data.content;
        (this.$refs as any).edit.setContent(this.content);
      }
    },
    async submit() {
      this.loading = true;
      const result = await (this as any).$api.adminGuideUserPost({ content: this.content });
      this.loading = false;
      if (result.code === 200) {
        (this as any).$message.success(result.msg);
      }
    }
  }
});
</script>
