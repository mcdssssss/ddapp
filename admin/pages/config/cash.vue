<template>
  <div class="home-container">
    <a-page-header title="提现设置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData">
        <a-form-model-item label="是否开启提现功能">
          <a-radio-group v-model="formData.useCash">
            <a-radio :value="true"> 开启 </a-radio>
            <a-radio :value="false"> 关闭 </a-radio>
          </a-radio-group>
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
        useCash: false
      }
    };
  },
  computed: {
    method(): string {
      return 'adminConfigCashPost';
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      const result = await (this as any).$api.adminConfigCashGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    }
  }
});
</script>
