<template>
  <div>
    <div class="fo-20 ml-8 text-center">账号密码登录</div>

    <div class="mt-40">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="adminName" prop="adminName">
          <a-input v-model="form.adminName" placeholder="管理员账号" @keyup.enter="onSubmit">
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item ref="adminPwd" prop="adminPwd">
          <a-input
            v-model="form.adminPwd"
            type="password"
            placeholder="管理员密码"
            @keyup.enter="onSubmit"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item ref="verifyCode" prop="verifyCode">
          <div class="flex flex-bwtween item-center">
            <a-input
              v-model="form.verifyCode"
              placeholder="输入验证码"
              :style="{ width: '190px' }"
              @keyup.enter="onSubmit"
            >
              <a-icon slot="prefix" type="safety-certificate" />
            </a-input>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="pointer" @click="getVerifycode" v-html="svg"></div>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            class="mt-40"
            type="primary"
            size="large"
            block
            :loading="loading"
            @click="onSubmit"
            >登录</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      form: {
        adminName: '',
        adminPwd: '',
        verifyCode: '',
        no: ''
      },
      rules: {
        adminName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        adminPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      svg: '',
      loading: false
    };
  },
  mounted() {
    this.getVerifycode();
  },
  methods: {
    async getVerifycode() {
      const result = await (this as any).$api.verifycode();
      if (result.code === 200) {
        this.svg = result.data.svg;
        this.form.no = result.data.no;
      }
    },
    onSubmit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.login(this.form);
          this.loading = false;
          if (result.code === 200) {
            this.$router.push('/');
          } else {
            this.getVerifycode();
          }
        } else {
          return false;
        }
      });
    }
  }
});
</script>
