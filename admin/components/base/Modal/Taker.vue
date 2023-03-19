<template>
  <div class="find-user">
    <a-input-search
      v-model="mobileNumber"
      placeholder="输入接单员手机号查询"
      size="large"
      @search="onSearch"
    >
      <a-button slot="enterButton" :loading="loading"> 查询 </a-button>
    </a-input-search>
    <div
      class="user-content mt-8 flex flex-start item-center"
      :style="{ border: userInfo.takerNo ? '1px solid #e1e1e1' : '1px solid rgba(0,0,0,0)' }"
    >
      <a-avatar v-if="userInfo.takerNo" :src="userInfo.avatarUrl" :size="40">
        <i slot="icon" class="iconfont icon-avatar"></i>
      </a-avatar>
      <div v-if="userInfo.takerNo" class="ml-12">
        <div class="fo-14">
          {{ userInfo.realName }}
          <span v-if="userInfo.mobileNumber">({{ userInfo.mobileNumber }})</span>
          <span class="fo-14 fo-9">NO: {{ userInfo.takerNo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  model: {
    prop: 'no',
    event: 'change'
  },
  props: {
    no: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      mobileNumber: '',
      userInfo: {} as any
    };
  },
  mounted() {
    if (this.no) {
      this.searchUsers({
        mobileNumber: this.no
      });
    }
  },
  methods: {
    onSearch() {
      if (this.mobileNumber.length !== 11) {
        (this as any).$message.error('请输入11位手机号码');
        return;
      }
      this.searchUsers({
        mobileNumber: this.mobileNumber,
        takerType: this.$store.state.version
      });
    },
    async searchUsers(params: any) {
      this.loading = true;
      const item = await (this as any).$api.takerByMobile(params);
      this.loading = false;
      if (item.code === 200) {
        if (item.data) {
          this.userInfo = item.data;
          this.$emit('change', this.userInfo.takerNo);
        } else {
          this.userInfo = JSON.parse(JSON.stringify({}));
        }
      }
    }
  }
});
</script>
<style lang="less" scoped>
.find-user {
  .user-content {
    padding: 16px;
    border-radius: 4px;
  }
}
</style>
