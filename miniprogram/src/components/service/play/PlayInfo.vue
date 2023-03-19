<template>
  <view class="publish-service-info">
    <PubInfo label="陪练方式" :value="`${playStyle} ${playValue}`" />
    <PubInfo label="赏金" :value="`${info.priceDetails.totalPrice || 0}元`" />
    <view class="pt-30 pb-30">
      <view class="fo-24">描述</view>
    </view>
    <view class="info-content fo-24">{{ info.priceDetails.desc }}</view>
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
            playStyle: "",
            playValue: 1,
            desc: "",
            // 赏金
            totalPrice: 1,
          },
        } as any;
      },
    },
  },
  computed: {
    playStyle(): string {
      switch (this.info.priceDetails.playStyle) {
        case "time":
          return "按时间";
        case "matchUp":
          return "按对局";
        case "task":
          return "按任务";
      }
      return "";
    },
    playValue(): string {
      switch (this.info.priceDetails.playStyle) {
        case "time":
          return `打${this.info.priceDetails.playValue}小时`;
        case "matchUp":
          return `打${this.info.priceDetails.playValue}局`;
        case "task":
          return `做${this.info.priceDetails.playValue}个任务`;
      }
      return "";
    },
  },
});
</script>
