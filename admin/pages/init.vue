<template>
  <div class="init-container">
    <div class="fo-26 bold text-center">添加超级管理员</div>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item ref="adminName" label="登录账号" prop="adminName">
        <a-input
          v-model="form.adminName"
          placeholder="请输入登录账号"
          @blur="
            () => {
              $refs.adminName.onFieldBlur();
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="adminPwd" label="登录密码" prop="adminPwd">
        <a-input
          v-model="form.adminPwd"
          type="password"
          placeholder="请输入登录密码"
          @blur="
            () => {
              $refs.adminPwd.onFieldBlur();
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="confirmPwd" label="确认密码" prop="confirmPwd">
        <a-input
          v-model="form.confirmPwd"
          type="password"
          placeholder="请再次输入密码"
          @blur="
            () => {
              $refs.confirmPwd.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="realName" label="真实姓名" prop="realName">
        <a-input
          v-model="form.realName"
          placeholder="请输入真实姓名"
          @blur="
            () => {
              $refs.realName.onFieldBlur();
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="mobileNumber" label="手机号" prop="mobileNumber">
        <a-input
          v-model="form.mobileNumber"
          placeholder="请输入手机号"
          @blur="
            () => {
              $refs.mobileNumber.onFieldBlur();
            }
          "
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
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    const validatePass = (_rule: any, value: string, callback: Function) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if ((this as any).form.conformPwd !== '') {
          (this.$refs as any).ruleForm.validateField('confirmPwd');
        }
        callback();
      }
    };
    const validatePass2 = (_rule: any, value: string, callback: Function) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== (this as any).form.adminPwd) {
        callback(new Error('密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        adminName: '',
        adminPwd: '',
        confirmPwd: '',
        mobileNumber: '',
        realName: ''
      },
      rules: {
        adminName: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
        adminPwd: [{ required: true, validator: validatePass, trigger: 'change' }],
        confirmPwd: [{ required: true, validator: validatePass2, trigger: 'change' }],
        mobileNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
      },
      loading: false
    };
  },
  methods: {
    onSubmit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.initAdmin(this.form);
          this.loading = false;
          if (result.code === 200) {
            (this as any).$message.success('添加超级管理员成功！');
            this.$router.push('/login');
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
.init-container {
  width: 800px;
  margin: auto;
  padding-top: 100px;
}
</style>