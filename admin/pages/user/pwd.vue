<template>
  <div class="home-container">
    <a-page-header title="修改密码"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item has-feedback label="旧密码" prop="oldpwd">
          <a-input
            v-model="formData.oldpwd"
            type="password"
            placeholder="请输入旧密码"
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item has-feedback label="新密码" prop="adminPwd">
          <a-input
            v-model="formData.adminPwd"
            type="password"
            placeholder="请输入新密码"
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
        oldpwd: '',
        adminPwd: '',
        confirmPwd: ''
      },
      rules: {
        oldpwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        adminPwd: [{ required: true, validator: validatePass, trigger: 'change' }],
        confirmPwd: [{ required: true, validator: validatePass2, trigger: 'change' }]
      }
    };
  },
  computed: {
    method(): string {
      return 'adminUpdateSelf';
    }
  },
  mounted() {},
  methods: {
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminUpdatepwd(this.formData);
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
