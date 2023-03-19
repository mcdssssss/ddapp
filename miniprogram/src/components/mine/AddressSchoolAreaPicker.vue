<template>
  <view class="p-30 flex flex-between item-center" @click="openPicker">
    <view class="flex flex-start item-center">
      <view class="iconfont icon-local fo-30 fo-3"></view>
      <view class="ml-30 fo-28 fo-3">选择地点</view>
    </view>
    <view class="flex flex-end item-center">
      <view v-if="active.length > 1" class="fo-28 fo-6"
        >{{ options[active[0]].areaName }}-{{
          options[active[0]].children[active[1]].buildName || "暂无地点"
        }}</view
      >
      <view v-else class="fo-28 fo-9">请选择地点</view>
      <view class="iconfont icon-arrow-right fo-24 fo-9 ml-20"></view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { mapLocation } from "@/utils/api";
export default Vue.extend({
  props: {
    options: {
      type: Array,
      default: () => [] as any,
    },
    active: {
      type: Array,
      default: () => [] as any,
    },
  },
  data() {
    return {
      column: 0,
    };
  },

  methods: {
    openPicker() {
      const list = [];
      for (const area of this.options) {
        let param = { name: (area as any).areaName, subList: [] as any[] };
        for (const build of (area as any).children) {
          param.subList.push({ name: build.buildName });
        }
        list.push(param);
      }
      (my as any).multiLevelSelect({
        title: "地点选择",
        list,
        success: async (res: any) => {
          if (res.success) {
            let areaIndex = 0;
            let buildIndex = 0;
            for (let i = 0; i < this.options.length; i++) {
              const item = this.options[i] as any;
              if (item.areaName === res.result[0].name) {
                areaIndex = i;
              }
            }
            for (
              let i = 0;
              i < (this.options as any)[areaIndex].children;
              i++
            ) {
              const item = (this.options as any)[areaIndex].children[i];
              if (item.buildName === res.result[1].name) {
                buildIndex = i;
              }
            }
            this.$emit("change", [areaIndex, buildIndex]);
            const buildLocation = (this.options as any)[areaIndex].children[
              buildIndex
            ].latlng;
            const split = buildLocation.split(",");
            uni.showLoading({ title: "获取结果中" });
            const result = await mapLocation({
              latitude: parseFloat(split[0]),
              longitude: parseFloat(split[1]),
            });
            uni.hideLoading();
            if (result.code === 200) {
              this.$emit("locationChange", result.data);
            }
          }
        },
        fail: (res: any) => {
          my.alert({
            title: "组件构建失败",
            content: JSON.stringify(res),
          });
        },
      });
    },
  },
});
</script>
