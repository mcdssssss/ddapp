<template>
  <div class="home-container">
    <a-page-header title="协议及指南设置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="用户指南">
          <UploadRichtext v-model="formData.userGuide" />
        </a-form-model-item>

        <a-form-model-item label="登录注册协议">
          <UploadRichtext v-model="formData.loginAgreement" />
        </a-form-model-item>

        <a-form-model-item label="接单员指南">
          <UploadRichtext v-model="formData.takerGuide" />
        </a-form-model-item>

        <a-form-model-item label="接单员协议">
          <UploadRichtext v-model="formData.takerAgreement" />
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
        userGuide: '',
        loginAgreement: '',
        takerGuide: '',
        takerAgreement: ''
      },
      autoBack: false
    };
  },
  computed: {
    method() {
      return 'adminProtocolPost';
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      const result = await (this as any).$api.adminProtocolGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    }
  }
});
</script>
