<template>
  <div>
    <div class="flex flex-start item-center mt-8">
      <div>载具: {{ order.priceDetails.vehicleName }}</div>
      <div class="ml-20">价格: {{ order.priceDetails.vehiclePrice }}元</div>
    </div>
    <div class="flex flex-start item-center mt-8">
      <div>是否需要帮助: {{ order.priceDetails.needsHelp ? '是' : '否' }}</div>
      <div v-if="order.priceDetails.needsHelp" class="ml-20">
        价格: {{ order.priceDetails.helpPrice }}元
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    order: {
      type: Object,
      default: () => {
        return {
          priceDetails: {}
        } as any;
      }
    }
  }
});
</script>
