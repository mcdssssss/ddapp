<template>
  <view>
    <view class="location-bar flex flex-between item-center">
      <view class="flex flex-start item-center">
        <div class="location-logo">
          <image v-if="schoolLogo" :src="schoolLogo" mode="aspectFill"></image>
        </div>
        <view class="location-title ell">
          {{ schoolName || "" }}
        </view>
      </view>
    </view>
    <view style="height: 120rpx"></view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {};
  },
  computed: {
    schoolName(): string {
      return this.$store.state.school.schoolName;
    },
    schoolLogo(): string {
      return this.$store.state.school.schoolLogo;
    },
  },
});
</script>

<style lang="scss">
.location-bar {
  width: 690rpx;
  padding: 30rpx;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  .location-logo {
    width: 60rpx;
    height: 60rpx;
    border-radius: 60rpx;
    background-color: #f3f3f3;
    image {
      width: 60rpx;
      height: 60rpx;
      border-radius: 60rpx;
    }
  }
  .location-title {
    margin-left: 30rpx;
    font-size: 30rpx;
    font-weight: 500;
  }
}
</style>
