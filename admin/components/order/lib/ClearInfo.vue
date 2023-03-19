<template>
  <div>
    <div
      v-for="(item, index) in order.priceDetails.clears"
      :key="index"
      class="flex flex-start item-center mt-8"
    >
      <div>
        {{ item.name }}
      </div>
      <div class="ml-20">x{{ item.count }}</div>
      <div class="ml-20">{{ item.price }}元/{{ item.unit }}</div>
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
