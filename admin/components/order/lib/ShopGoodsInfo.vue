<template>
  <div class="shop-goods-info">
    <div
      v-for="(item, index) in order.priceDetails.carts"
      :key="index"
      class="goods-item flex flex-between item-center"
    >
      <img :src="imageCenterCrop(item.goodsImage, 50, 50, 100)" alt="" />
      <div class="goods-contents">
        <div class="fo-12">{{ item.goodsName }}</div>
        <div class="fo-12 fo-9">{{ item.spec.join(' / ') }}</div>
        <div class="flex flex-between item-center">
          <div class="fo-6 fo-12">x{{ item.count }}</div>
          <div class="bold fo-14">x{{ item.totalPrice }}</div>
        </div>
      </div>
    </div>

    <div class="flex flex-start item-center mt-8">
      <div>
        包装费:
        {{ order.priceDetails.totalPackFee }}元
      </div>
      <!-- <div class="ml-20">价格: {{ order.priceDetails.weightPriceTotal }}元</div> -->
    </div>
    <ErrandsInfo
      v-if="order.priceDetails.errandsPriceDetails"
      :priceDetails="order.priceDetails.errandsPriceDetails"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { imageCenterCrop } from '@/plugins/oss';
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
          priceDetails: {
            carts: []
          }
        } as any;
      }
    }
  },
  methods: {
    imageCenterCrop
  }
});
</script>
<style lang="less" scoped>
.shop-goods-info {
  width: 300px;
  .goods-item {
    width: 300px;
    padding: 8px 0;
    img {
      border-radius: 4px;
    }
  }
  .goods-contents {
    width: 242px;
  }
}
</style>
