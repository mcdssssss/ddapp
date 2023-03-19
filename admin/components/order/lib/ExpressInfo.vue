<template>
  <div>
    <div>
      快递件选项:
      {{ order.priceDetails.expressObj.name }}
    </div>
    <div>价格: {{ order.priceDetails.expressObj.price }}元</div>
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
