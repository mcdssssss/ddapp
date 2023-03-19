<template>
  <view class="publish-service-info">
    <PubInfo
      label="载具"
      :value="`${info.priceDetails.vehicleName} ${info.priceDetails.vehiclePrice}元`"
    />
    <PubInfo
      label="是否需要帮忙"
      :value="`${info.priceDetails.needsHelp ? '需要帮助' : '不需要帮助'}`"
    />
    <PubInfo
      v-if="info.priceDetails.needsHelp"
      label="帮忙搬家费用"
      :value="`${info.priceDetails.helpPrice}元`"
    />
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
            needsHelp: false,
            helpPrice: 1,
            vehicleName: "",
            // 赏金
            vehiclePrice: 1,
            totalPrice: 0,
            desc: "",
          },
        } as any;
      },
    },
  },
});
</script>
