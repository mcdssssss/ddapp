<template>
  <div class="login-container">
    <div>
      <div class="flex flex-center item-center">
        <img v-if="logo" :src="logo" height="35px" />
        <div class="ml-20 fo-26 bold-500">{{ systemName || title }}</div>
      </div>
      <div class="login-content mt-40 flex flex-between item-start">
        <div class="content flex flex-center item-center">
          <img src="@/assets/images/login.png" width="360px" alt="" />
        </div>
        <div class="content">
          <Account />
        </div>
      </div>
      <div class="text-center fo-12 fo-6 mt-40">
        Copyright © 2022 {{ companyName || '码里码外' }} All right reserved.<a
          v-if="recordNo"
          href="https://beian.miit.gov.cn/"
          target="_blank"
          >{{ recordNo }}</a
        >
      </div>
      <!-- <div class="text-center fo-14 fo-3 mt-8">{{ copyrightContent }}</div> -->
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Account from '@/components/official/login/Account.vue';
import { imageCenterCrop } from '@/plugins/oss';
const config = require('../config');
export default Vue.extend({
  components: {
    Account
  },
  data() {
    return {
      title: config.title,
      copyright: config.copyright,
      copyrightContent: config.copyrightContent
    };
  },
  computed: {
    systemName(): string {
      return this.$store.state.system.systemName;
    },
    logo(): string {
      return this.$store.state.system.logo;
    },
    recordNo(): string {
      return this.$store.state.system.recordNo;
    },
    companyName(): string {
      return this.$store.state.system.companyName;
    }
  },
  async mounted() {
    const result = await (this as any).$api.hasSuper();
    if (result.code === 200 && result.data === false) {
      this.$router.push('/init');
    }
    await this.$store.dispatch('system/fetchSystemInfo');
  },
  methods: {
    imageCenterCrop
  }
});
</script>
<style lang="less" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-content {
    width: 800px;
    height: 500px;
    border-radius: 8px;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
    .content {
      width: 400px;
      height: 500px;
      padding: 40px 40px;
    }
  }
}
</style>
