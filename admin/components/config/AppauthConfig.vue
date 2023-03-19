<template>
  <div class="config-content">
    <a-form-model ref="ruleForm" :model="formData" :rules="rules">
      <div class="flex flex-between item-center">
        <div class="bold">微信小程序配置</div>
        <a
          href="https://gitee.com/landalfyao/ddrun/wikis/pages?sort_id=5937452&doc_id=403865"
          target="_blank"
          >帮助</a
        >
      </div>
      <a-form-model-item ref="wxAppId" label="小程序ID" prop="wxAppId">
        <a-input
          v-model="formData.wxAppId"
          placeholder="请输入小程序ID"
          @blur="
            () => {
              $refs.wxAppId.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="wxAppSecret" label="小程序秘钥" prop="wxAppSecret">
        <a-input
          v-model="formData.wxAppSecret"
          placeholder="请输入小程序秘钥"
          @blur="
            () => {
              $refs.wxAppSecret.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="wxUploadKey" label="小程序代码上传密钥" prop="wxUploadKey">
        <a-textarea
          v-model="formData.wxUploadKey"
          placeholder="请粘贴代码上传小程序秘钥"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
        <div class="fo-12 fo-9">
          在小程序后台下载上传秘钥文件，打开复制文件内容。注意还要给ip授权。
        </div>
      </a-form-model-item>

      <a-form-model-item>
        <a-button type="primary" size="large" :loading="loading" @click="submit">提交保存</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { isSass } from '@/plugins/config';
export default Vue.extend({
  data() {
    return {
      isSass: isSass(),
      formData: {
        type: '',
        wxAppId: '',
        wxAppSecret: '',
        wxUploadKey: '',
        alipayAppId: '',
        alipayPublicKey: '',
        alipayPrivateKey: '',
        alipayEncryptKey: '',
        qqAppid: '',
        qqAppSecret: '',
        ttAppid: '',
        ttAppSecret: '',
        ttSalt: '',
        ttToken: ''
      },
      rules: {
        wxAppId: [{ required: true, message: '输入小程序ID', trigger: 'blur' }],
        wxAppSecret: [{ required: true, message: '输入小程序秘钥', trigger: 'blur' }],
        wxUploadKey: [{ required: true, message: '粘贴小程序代码上传密钥', trigger: 'blur' }]
      },
      loading: false
    };
  },
  mounted() {
    if (this.$store.state.version) {
      this.formData.type = this.$store.state.version;
    }
    this.getauth();
  },
  methods: {
    async getauth() {
      const result = await (this as any).$api.adminAppauthGet({
        schoolType: this.$store.state.version
      });
      if (result.code === 200 && result.data) {
        this.formData = Object.assign(this.formData, result.data);
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminAppauthPost(this.formData);
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
