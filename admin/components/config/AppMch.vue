<template>
  <div class="config-content">
    <a-form-model ref="ruleForm" :model="formData" :rules="rules">
      <div class="flex flex-between item-center">
        <div class="bold">微信商户号配置</div>
        <a
          href="https://gitee.com/landalfyao/ddrun/wikis/pages?sort_id=5937468&doc_id=403865"
          target="_blank"
          >帮助</a
        >
      </div>
      <a-form-model-item label="微信商户ID" prop="wxMchId">
        <a-input v-model="formData.wxMchId" placeholder="请输入微信商户ID" />
      </a-form-model-item>

      <a-form-model-item label="微信商户秘钥" prop="wxMchSecert">
        <a-input v-model="formData.wxMchSecert" placeholder="请输入商户号秘钥" />
      </a-form-model-item>

      <a-form-model-item label="回调地址" prop="notifyUrl">
        <a-input v-model="formData.notifyUrl" placeholder="请输入回调地址" />
        <div class="fo-12 fo-9">
          填写当前后台地址即可，注意结尾不要加“/”。如: "https://op.xx.com"
        </div>
      </a-form-model-item>
      <a-divider></a-divider>
      <div class="bold mb-12">
        注意：上传依赖阿里OSS配置<router-link to="/config/mapupload?type=ali">前往配置</router-link>
      </div>
      <a-alert v-if="!canIUpload" type="error" banner>
        <div slot="message">
          无法使用上传功能,您还没有配置阿里云上传
          <router-link to="/config/mapupload?type=ali">前往配置</router-link>
        </div>
      </a-alert>

      <a-form-model-item label="上传apiclient_cert.p12文件" prop="certP12">
        <a-upload action="/" accept="p12" :before-upload="beforeUploadCertP12">
          <a-button> <a-icon type="upload" /> 上传p12文件 </a-button>
        </a-upload>
        <div v-if="formData.certP12" class="fo-12 fo-success">已上传</div>
      </a-form-model-item>

      <a-form-model-item label="上传apiclient_cert.pem文件" prop="certPem">
        <a-upload action="/" accept="pem" :before-upload="beforeUploadCertPem">
          <a-button> <a-icon type="upload" /> 上传文件 </a-button>
        </a-upload>
        <div v-if="formData.certPem" class="fo-12 fo-success">已上传</div>
      </a-form-model-item>

      <a-form-model-item label="上传apiclient_key.pem文件" prop="certKey">
        <a-upload action="/" accept="pem" :before-upload="beforeUploadCertKey">
          <a-button> <a-icon type="upload" /> 上传文件 </a-button>
        </a-upload>
        <div v-if="formData.certKey" class="fo-12 fo-success">已上传</div>
      </a-form-model-item>

      <a-form-model-item>
        <a-button type="primary" size="large" :loading="loading" @click="submit">提交保存</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { putFile } from '@/plugins/oss';

export default Vue.extend({
  data() {
    return {
      formData: {
        wxMchId: '',
        wxMchSecert: '',
        notifyUrl: '',
        certP12: '',
        certPem: '',
        certKey: ''
      },
      rules: {
        wxMchId: [{ required: true, message: '输入微信商户ID', trigger: 'blur' }],
        wxMchSecert: [{ required: true, message: '输入微信商户秘钥', trigger: 'blur' }],
        notifyUrl: [{ required: true, message: '输入回调地址', trigger: 'blur' }],
        certP12: [{ required: true, message: '上传apiclient_cert.p12文件', trigger: 'blur' }],
        certPem: [{ required: true, message: '上传apiclient_cert.pem文件', trigger: 'blur' }],
        certKey: [{ required: true, message: '上传apiclient_key.pem文件', trigger: 'blur' }]
      },
      loading: false
    };
  },
  computed: {
    canIUpload(): boolean {
      return this.$store.state.file.canIUpload;
    }
  },
  mounted() {
    this.getauth();
    if (!this.canIUpload) {
      this.$store.dispatch('file/checkUpload');
    }
  },
  methods: {
    beforeUploadCertPem(file: File) {
      this.beforeUpload(file, 'certPem');
    },
    beforeUploadCertP12(file: File) {
      this.beforeUpload(file, 'certP12');
    },
    beforeUploadCertKey(file: File) {
      this.beforeUpload(file, 'certKey');
    },
    async beforeUpload(file: File, type: 'certP12' | 'certPem' | 'certKey') {
      const split = file.name.split('.');
      const suffix = split[split.length - 1];
      this.loading = true;
      const result = await putFile('cert/' + uuidv4() + '.' + suffix, file);
      this.loading = false;
      if (result) {
        this.formData[type] = result;
      }
    },
    async getauth() {
      const result = await (this as any).$api.adminAppMchGet();
      if (result.code === 200 && result.data) {
        this.formData = Object.assign(this.formData, result.data);
        delete (this.formData as any).type;
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminAppMchPost(this.formData);
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
