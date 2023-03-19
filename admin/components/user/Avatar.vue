<template>
  <a-popover trigger="hover" placement="bottomRight">
    <template slot="content">
      <div class="user-avatar">
        <div class="info-panel flex flex-between">
          <div>
            <div class="nick-name ell">{{ realName }} {{ mobileNumber || '----' }}</div>
            <div class="user-no ell">NO:{{ adminNo || '----' }}</div>
          </div>
        </div>
        <div
          v-for="(item, index) in links"
          :key="index"
          class="link-item flex flex-start item-center"
          @click="action(item.action)"
        >
          <i :class="['iconfont', item.icon]"></i>
          <div class="link-label">{{ item.label }}</div>
        </div>
      </div>
    </template>
    <a-avatar class="pointer" :src="imageCenterCrop(avatarUrl, 32, 32)">
      <i slot="icon" class="iconfont icon-avatar"></i>
    </a-avatar>
  </a-popover>
</template>

<script lang="ts">
import Vue from 'vue';
import jsCookie from 'js-cookie';
import { imageCenterCrop } from '@/plugins/oss';
export default Vue.extend({
  data() {
    return {
      links: [
        { label: '个人设置', icon: 'icon-setting', action: 'navToSetting' },
        { label: '修改密码', icon: 'icon-password', action: 'navToUpdatePwd' },
        { label: '退出登录', icon: 'icon-out', action: 'logout' }
      ]
    };
  },
  computed: {
    adminName(): string {
      return this.$store.state.profile.adminName;
    },
    realName(): string {
      return this.$store.state.profile.realName;
    },
    mobileNumber(): string {
      return this.$store.state.profile.mobileNumber;
    },
    adminNo(): string {
      return this.$store.state.profile.adminNo;
    },
    avatarUrl(): string {
      return this.$store.state.profile.avatarUrl;
    }
  },
  methods: {
    imageCenterCrop,
    action(key: string) {
      switch (key) {
        case 'logout':
          this.logout();
          break;
        case 'navToSetting':
          this.$router.push({ path: '/user/update' });
          break;
        case 'navToUpdatePwd':
          this.$router.push({ path: '/user/pwd' });
          break;
      }
    },
    logout() {
      jsCookie.remove('token');
      this.$store.commit('profile/clearAdminInfo');
      this.$router.push('/login');
    }
  }
});
</script>
<style lang="less" scoped>
.user-avatar {
  width: 240px;
  min-height: 150px;
  background-color: #ffffff;
  border-radius: 4px;
  .info-panel {
    width: 100%;
    padding: 20px;
    background-image: linear-gradient(-225deg, #5271c4 0%, #b19fff 48%, #eca1fe 100%);
    border-radius: 3px 3px 0 0;
    .nick-name {
      font-size: 20px;
      color: #ffffff;
    }
    .user-no {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  .link-item {
    height: 50px;
    padding: 0 20px;
    cursor: pointer;
    &:last-child {
      border-top: 1px solid #e1e1e1;
    }
    &:hover {
      background-color: #f3f3f3;
    }
    .link-label {
      font-size: 14px;
      margin-left: 16px;
    }
  }
}
</style>
