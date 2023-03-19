<template>
  <div>
    <div class="flex flex-start item-center mt-8">
      <div>
        文件数量:
        {{ order.priceDetails.files.length }} 个
      </div>
      <div class="ml-20">重量: {{ order.priceDetails.totalWeight }}kg</div>
    </div>
    <div class="flex flex-start item-center mt-8">
      <div>
        一份页数:
        {{ order.priceDetails.pageSize }} 页
      </div>
      <div class="ml-20">打印份数: {{ order.priceDetails.copySize }}份</div>
    </div>
    <div class="flex flex-start item-center mt-8">
      <div>纸张单价: {{ order.priceDetails.unitPaperPrice }}元</div>
      <div class="ml-20">纸张优惠: {{ order.priceDetails.paperRuleDiscountAmount }}元</div>
    </div>
    <div class="flex flex-start item-center mt-8">
      <div>纸张原价: {{ order.priceDetails.originPrice }}元</div>
    </div>
    <div
      v-if="order.priceDetails.paperRuleDiscountText"
      class="flex flex-start item-center mt-8 fo-9 fo-12"
    >
      <div>{{ order.priceDetails.paperRuleDiscountText }}元</div>
    </div>
    <ErrandsInfo
      v-if="order.priceDetails.errandsPriceDetails"
      :priceDetails="order.priceDetails.errandsPriceDetails"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import ErrandsInfo from './ErrandsInfo.vue';
export default Vue.extend({
  components: {
    ErrandsInfo
  },
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
