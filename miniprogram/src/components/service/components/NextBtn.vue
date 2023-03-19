<template>
  <view>
    <view class="next-btn flex flex-center item-center">
      <DButton
        width="570rpx"
        height="100rpx"
        type="theme"
        radius
        @click="$emit('click')"
        >下一步</DButton
      >
    </view>
    <view style="height: 200rpx"></view>
  </view>
</template>
<style lang="scss" scoped>
.next-btn {
  width: 690rpx;
  height: 160rpx;
  position: fixed;
  bottom: 0;
  z-index: 10;
}
</style>
