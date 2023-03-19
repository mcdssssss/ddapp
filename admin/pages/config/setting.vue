<template>
  <div class="home-container">
    <a-page-header title="系统设置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="系统名称">
          <a-input v-model="formData.systemName" placeholder="请输入系统名称"></a-input>
        </a-form-model-item>

        <a-form-model-item label="LOGO">
          <UploadImage v-model="formData.logo" :height="100" :width="100"></UploadImage>
          <div class="fo-12 fo-9">尺寸随意，会自动适配</div>
        </a-form-model-item>

        <a-form-model-item label="公司简称">
          <a-input v-model="formData.companyName" placeholder="请输入公司简称"></a-input>
        </a-form-model-item>

        <a-form-model-item label="备案号">
          <a-input v-model="formData.recordNo" placeholder="请输入备案号"></a-input>
          <div class="fo-12 fo-9">如:浙ICP备10000xxx号-x</div>
        </a-form-model-item>

        <a-form-model-item>
          <a-button type="primary" size="large" :loading="loading" @click="submit"
            >提交保存</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script lang="ts">
import EditMixin from '@/plugins/mixins/edit-mixin.vue';
export default EditMixin.extend({
  layout: 'global',
  data() {
    return {
      formData: {
        systemName: '后台管理系统-码里码外',
        companyName: '码里码外',
        recordNo: '',
        logo: ''
      },
      autoBack: false
    };
  },
  computed: {
    method() {
      return 'adminSystemSettingPost';
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      const result = await (this as any).$api.adminSystemSettingGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    }
  }
});
</script>
