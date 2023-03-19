<template>
  <div class="home-container">
    <a-page-header title="大厅展示的订单类型"> </a-page-header>
    <div class="edit-content">
      <a-form-model
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="待接单/已支付">
          <a-switch v-model="formData.pay" />
        </a-form-model-item>
        <a-form-model-item label="已接单/进行中">
          <a-switch v-model="formData.take" />
        </a-form-model-item>
        <a-form-model-item label="待确认完成">
          <a-switch v-model="formData.send" />
        </a-form-model-item>
        <a-form-model-item label="已完成">
          <a-switch v-model="formData.complete" />
        </a-form-model-item>

        <a-form-model-item label="已取消">
          <a-switch v-model="formData.cancel" />
        </a-form-model-item>
        <a-form-model-item label="已关闭">
          <a-switch v-model="formData.close" />
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
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      formData: {
        close: false,
        cancel: false,
        pay: true,
        take: true,
        send: true,
        complete: true
      },
      autoBack: false
    };
  },
  computed: {
    method() {
      return 'adminConfigOrdertypePost';
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      const result = await (this as any).$api.adminConfigOrdertypeGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    }
  }
});
</script>
