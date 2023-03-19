<template>
  <div class="config-content">
    <a-form-model ref="ruleForm" :model="formData" :rules="rules">
      <div class="flex flex-between item-center">
        <div class="bold">地图配置</div>
        <a
          href="https://gitee.com/landalfyao/ddrun/wikis/pages?sort_id=5937453&doc_id=403865"
          target="_blank"
          >帮助</a
        >
      </div>
      <a-form-model-item ref="mapKey" label="腾讯地图key" prop="mapKey">
        <a-input
          v-model="formData.mapKey"
          placeholder="请输入腾讯地图key"
          @blur="
            () => {
              $refs.mapKey.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item>
        <a-button type="primary" size="large" :loading="loading" @click="submit">提交保存</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      formData: {
        mapKey: ''
      },
      rules: {
        mapKey: [{ required: true, message: '输入腾讯地图key', trigger: 'blur' }]
      },
      loading: false
    };
  },
  mounted() {
    this.getauth();
  },
  methods: {
    async getauth() {
      const result = await (this as any).$api.adminMapGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminMapPost(this.formData);
          this.loading = false;
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
          }
        } else {
          return false;
        }
      });
    }
  }
});
</script>
<style lang="less" scoped>
.config-content {
  width: 500px;
  margin: auto;
  padding-top: 80px;
}
</style>
