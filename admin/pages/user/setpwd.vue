<template>
  <div class="home-container">
    <a-page-header title="请先设置密码"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item has-feedback label="登录密码" prop="adminPwd">
          <a-input
            v-model="formData.adminPwd"
            type="password"
            placeholder="请输入登录密码"
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item has-feedback label="确认密码" prop="confirmPwd">
          <a-input
            v-model="formData.confirmPwd"
            type="password"
            placeholder="请再次输入密码"
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item class="text-center">
          <a-button
            style="width: 50%; margin-top: 100px"
            type="primary"
            size="large"
            block
            :loading="loading"
            @click="onSubmit"
          >
            立即添加
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  layout: 'global',
  data() {
    const validatePass = (_rule: any, value: string, callback: Function) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if ((this as any).formData.confirmPwd !== '') {
          (this.$refs as any).ruleForm.validateField('confirmPwd');
        }
        callback();
      }
    };
    const validatePass2 = (_rule: any, value: string, callback: Function) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== (this as any).formData.adminPwd) {
        callback(new Error('密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      formData: {
        adminPwd: '',
        confirmPwd: ''
      },
      rules: {
        adminPwd: [{ required: true, validator: validatePass, trigger: 'change' }],
        confirmPwd: [{ required: true, validator: validatePass2, trigger: 'change' }]
      },
      loading: false
    };
  },
  methods: {
    onSubmit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminSetpwd(this.formData);
          this.loading = false;
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
            this.$router.push('/');
          }
        } else {
          return false;
        }
      });
    }
  }
});
</script>
