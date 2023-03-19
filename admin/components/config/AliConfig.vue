<template>
  <div class="config-content">
    <a-form-model ref="ruleForm" :model="formData" :rules="rules">
      <div class="flex flex-between item-center">
        <div class="bold">阿里云配置</div>
        <a
          href="https://gitee.com/landalfyao/ddrun/wikis/pages?sort_id=5873680&doc_id=403865"
          target="_blank"
          >帮助</a
        >
      </div>
      <a-form-model-item ref="accessKeyId" label="AccessKey ID" prop="accessKeyId">
        <a-input
          v-model="formData.accessKeyId"
          placeholder="请输入accessKeyId"
          @blur="
            () => {
              $refs.accessKeyId.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="accessKeySecret" label="秘钥 Secret" prop="accessKeySecret">
        <a-input
          v-model="formData.accessKeySecret"
          placeholder="请输入秘钥 Secret"
          @blur="
            () => {
              $refs.accessKeySecret.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="arn" label="ARN" prop="arn">
        <a-input
          v-model="formData.arn"
          placeholder="请输入ARN"
          @blur="
            () => {
              $refs.arn.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="ossRegion" label="对象存储Oss Region" prop="ossRegion">
        <a-input
          v-model="formData.ossRegion"
          placeholder="请输入对象存储Oss Region"
          @blur="
            () => {
              $refs.ossRegion.onFieldBlur();
            }
          "
        />
        <div class="fo-12 fo-9">
          查看oss所在地域。如在杭州则填写为“oss-cn-hangzhou”、在上海填“oss-cn-shanghai”
        </div>
      </a-form-model-item>

      <a-form-model-item ref="ossBucket" label="对象存储Oss Bucket 名称" prop="ossBucket">
        <a-input
          v-model="formData.ossBucket"
          placeholder="请输入对象存储Oss Bucket"
          @blur="
            () => {
              $refs.ossBucket.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <div class="flex flex-between item-center">
        <div class="bold">阿里云短信验证码</div>
        <a href="https://dysms.console.aliyun.com/overview" target="_blank">帮助</a>
      </div>

      <a-form-model-item ref="smsSignName" label="签名名称" prop="smsSignName">
        <a-input
          v-model="formData.smsSignName"
          placeholder="请输入签名名称"
          @blur="
            () => {
              $refs.smsSignName.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="smsTemplateCode" label="模板CODE" prop="smsTemplateCode">
        <a-input
          v-model="formData.smsTemplateCode"
          placeholder="请输入模板CODE"
          @blur="
            () => {
              $refs.smsTemplateCode.onFieldBlur();
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
        accessKeyId: '',
        accessKeySecret: '',
        arn: '',
        ossRegion: '',
        ossBucket: '',
        smsSignName: '',
        smsTemplateCode: ''
      },
      rules: {
        accessKeyId: [{ required: true, message: '请输入AccessKey ID', trigger: 'blur' }],
        accessKeySecret: [{ required: true, message: '请输入秘钥 Secret', trigger: 'blur' }],
        arn: [{ required: true, message: '请输入ARN', trigger: 'blur' }],
        ossRegion: [{ required: true, message: '请输入Region', trigger: 'blur' }],
        ossBucket: [{ required: true, message: '请输入Bucket', trigger: 'blur' }],
        smsSignName: [{ required: true, message: '请输入签名名称', trigger: 'blur' }],
        smsTemplateCode: [{ required: true, message: '请输入模板CODE', trigger: 'blur' }]
      },
      loading: false
    };
  },
  mounted() {
    this.getauth();
  },
  methods: {
    async getauth() {
      const result = await (this as any).$api.adminAliGet();
      if (result.code === 200) {
        this.formData = Object.assign(this.formData, result.data);
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminAliPost(this.formData);
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
