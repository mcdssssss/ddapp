<template>
  <view class="p-30 flex flex-between item-center" @click="chooseLocation">
    <view class="flex flex-start item-center">
      <view class="iconfont icon-local fo-30 fo-3"></view>
      <view class="ml-30 fo-28 fo-3">选择地址</view>
    </view>
    <view class="flex flex-end item-center">
      <view v-if="label" class="fo-28 fo-6">{{ label }}</view>
      <view v-else class="fo-28 fo-9">请选择地点</view>
      <view class="iconfont icon-arrow-right fo-24 fo-9 ml-20"></view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { mapLocation } from "@/utils/api";
import { getLocation } from "@/utils/common";
export default Vue.extend({
  props: {
    label: {
      type: String,
      default: "",
    },
  },
  methods: {
    async chooseLocation() {
      const location = await getLocation();
      uni.chooseLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        success: async (result) => {
          // 地址选择结果
          uni.showLoading({ title: "获取结果中" });
          const res = await mapLocation({
            longitude: result.longitude,
            latitude: result.latitude,
          });
          uni.hideLoading();
          if (res.code === 200) {
            this.$emit("change", res.data);
          }
        },
      });
    },
  },
});
</script>
