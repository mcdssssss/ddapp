<template>
  <view class="publish-service-info">
    <view
      v-for="(item, index) in info.priceDetails.clears"
      :key="index"
      class="border-b"
    >
      <view class="pt-30 pb-30 flex flex-between item-center">
        <view class="fo-24">{{ item.name }}</view>
        <view class="flex flex-end item-center">
          <view class="fo-24">x{{ item.count }}</view>
          <view class="fo-24 text-right" style="width: 200rpx"
            >{{ item.price }}元/{{ item.unit }}</view
          >
        </view>
      </view>
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
            clears: [],
          },
        } as any;
      },
    },
  },
});
</script>
