<template>
  <div>
    <div>
      维修项目:
      {{ order.priceDetails.repairName }}
    </div>
    <div>价格: {{ order.priceDetails.repairPrice }}元</div>
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
