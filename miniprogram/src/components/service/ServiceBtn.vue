<template>
  <view>
    <view class="service-btn flex flex-center item-center" @click="openMenu">
      <view class="iconfont icon-publish"></view>
    </view>
    <view v-if="open" class="service-popup" @click="open = false"> </view>
    <view
      class="service-panel"
      :style="{ bottom: open ? '0' : '-510rpx' }"
      @click.stop="() => {}"
    >
      <ServiceBar />
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import ServiceBar from "@/components/service/ServiceBar.vue";
export default Vue.extend({
  components: {
    ServiceBar,
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    change() {},
    openMenu() {
      this.open = true;
    },
  },
});
</script>
<style lang="scss" scoped>
.service-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 100rpx;
  background-color: #ffffff;

  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  position: fixed;
  bottom: 30rpx;
  right: 30rpx;
  background: #333333;
  .icon-publish {
    font-size: 40rpx;
    color: #fff;
  }
}
.service-popup {
  width: 750rpx;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0.5);
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
}
.service-panel {
  width: 750rpx;
  height: 450rpx;
  background: #ffffff;
  padding: 30rpx 0;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 4;
  transition: bottom 0.1s linear;
}
</style>
