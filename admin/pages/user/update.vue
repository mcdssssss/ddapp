<template>
  <div class="home-container">
    <a-page-header title="个人信息设置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item ref="realName" label="头像">
          <UploadImage v-model="formData.avatarUrl" :height="100" :width="100"></UploadImage>
        </a-form-model-item>

        <a-form-model-item label="真实姓名" prop="realName">
          <a-input v-model="formData.realName" placeholder="请输入真实姓名" />
        </a-form-model-item>

        <a-form-model-item label="手机号" prop="mobileNumber">
          <a-input v-model="formData.mobileNumber" placeholder="请输入手机号" />
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
        mobileNumber: '',
        realName: '',
        avatarUrl: ''
      },
      rules: {
        realName: [{ required: true, message: '输入真实姓名', trigger: 'blur' }],
        mobileNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
    };
  },
  computed: {
    method(): string {
      return 'adminUpdateSelf';
    }
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      const result = await (this as any).$api.adminInfoSelf();
      if (result.code === 200) {
        this.formData = {
          mobileNumber: result.data.mobileNumber,
          realName: result.data.realName,
          avatarUrl: result.data.avatarUrl
        };
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api[this.method](this.formData);
          this.loading = false;
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
            this.$store.dispatch('profile/fetchUserInfo');
          }
        } else {
          return false;
        }
      });
    }
  }
});
</script>
