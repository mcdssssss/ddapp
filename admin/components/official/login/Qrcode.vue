<template>
  <a-spin :spinning="loading">
    <div class="qrcode">
      <img :src="path" width="160px" height="160px" />
      <div v-if="showBtn" class="mask">
        <div class="refresh-btn" @click="getQrcode">
          <i class="iconfont icon-refresh"></i>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      path: '',
      ticket: '',
      expireSeconds: 0,
      loading: false,
      intv: undefined as NodeJS.Timer | number | undefined,
      nowSeconds: 0,
      showBtn: false
    };
  },
  beforeDestroy() {
    this.clearIntv();
  },
  mounted() {
    this.getQrcode();
  },
  methods: {
    clearIntv() {
      clearInterval(this.intv as number);
      this.nowSeconds = 0;
      this.showBtn = true;
    },
    async getQrcode() {
      this.loading = true;
      const res = await (this as any).$api.loginQrcode();
      if (res.code === 200 && res.data) {
        this.path = res.data.path;
        this.ticket = res.data.ticket;
        this.expireSeconds = res.data.expire_seconds;
        this.clearIntv();
        this.setInterval();
      }
      this.loading = false;
    },
    setInterval() {
      this.showBtn = false;
      this.intv = setInterval(async () => {
        if (this.nowSeconds >= this.expireSeconds - 2) {
          this.clearIntv();
        }
        await this.getStatus();
        this.nowSeconds += 2;
      }, 2000);
    },
    async getStatus() {
      const result = await (this as any).$api.getLoginQrcodeStatus({
        ticket: this.ticket
      });
      if (result.code === 200) {
        if (result.data.status === 'mobile' || result.data.status === 'logind') {
          this.clearIntv();
          this.$store.commit('profile/setOpenLoginPanel', false);
          if (result.data.status === 'logind') {
            this.$router.push('/');
          } else {
            this.$store.commit('profile/setTicket', this.ticket);
            this.$store.commit('profile/setOpenBoundingMobile', true);
          }
        }
      }
    }
  }
});
</script>
<style lang="less" scoped>
.qrcode {
  width: 160px;
  height: 160px;
  margin: auto;
  margin-top: 4px;
  position: relative;
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 160px;
    height: 160px;
    background-color: rgba(255, 255, 255, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    .refresh-btn {
      width: 40px;
      height: 40px;
      border-radius: 40px;
      background-color: rgba(0, 0, 0, 0.7);
      cursor: pointer;
      transition: 0.2s linear background-color;
      line-height: 40px;
      text-align: center;

      &:hover {
        background-color: #333;
      }
      .iconfont {
        font-size: 20px;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
}
</style>
