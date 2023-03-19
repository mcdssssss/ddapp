<template>
  <div>
    <div>{{ order.priceDetails.desc }}</div>
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
