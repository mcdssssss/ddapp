<template>
  <view class="publish-service-info">
    <PubInfo
      :label="`重量(${info.priceDetails.weight || 0}kg)`"
      :value="`${info.priceDetails.weightPriceTotal || 0}元`"
      :details="info.priceDetails.weightDetail"
    />

    <view class="er-desc pt-30 pb-30">
      <view class="fo-24">描述</view>
    </view>
    <view class="info-content fo-24">{{ desc }}</view>

    <view class="flex flex-start item-center">
      <image
        class="er-image"
        v-for="(item, index) in images"
        :key="index"
        :src="item"
        mode="aspectFill"
        @click="openImage(index)"
      ></image>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import PubInfo from "@/components/publish/PubInfo.vue";
export default Vue.extend({
  components: {
    PubInfo,
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          priceDetails: {
            weight: 0,
            weightPriceTotal: 0,
          },
        } as any;
      },
    },
    desc: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    images: {
      type: Array,
      default: [],
    },
  },
  methods: {
    openImage(index: number) {
      uni.previewImage({
        current: index,
        urls: this.images as string[],
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.er-image {
  width: 120rpx;
  height: 120rpx;
  margin-top: 20rpx;
  background-color: #ffffff;
  border-radius: 10rpx;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  background-size: cover;
  background-position: center;
  margin-right: 20rpx;
}
</style>
