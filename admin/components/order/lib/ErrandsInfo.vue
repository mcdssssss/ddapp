<template>
  <div>
    <div class="mt-8 fo-9">
      <div v-for="(item, index) in priceDetails.distanceDetail" :key="index">
        {{ item }}
      </div>
    </div>
    <div class="flex flex-start item-center mt-8">
      <div>
        重量:
        {{ priceDetails.weight }}kg
      </div>
      <div class="ml-20">价格: {{ priceDetails.weightPriceTotal }}元</div>
    </div>
    <div class="mt-8 fo-9">
      <div v-for="(item, index) in priceDetails.weightDetail" :key="index">
        {{ item }}
      </div>
    </div>

    <CPicture v-if="priceDetails.image" :src="priceDetails.image" :width="60" :height="60" />
    <div class="flex flex-start item-center">
      <CPicture
        v-for="(item, index) in priceDetails.images"
        :key="index"
        style="margin-right: 8rpx"
        :src="item"
        :width="60"
        :height="60"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { imageCenterCrop } from '@/plugins/oss';
export default Vue.extend({
  props: {
    priceDetails: {
      type: Object,
      default: () => {
        return {} as any;
      }
    }
  },
  methods: {
    imageCenterCrop
  }
});
</script>
