<template>
  <picker
    mode="multiSelector"
    :range="range"
    :value="rangeIndex"
    @change="handleChange"
    @columnchange="handleColumnChange"
  >
    <view class="p-30 flex flex-between item-center">
      <view class="flex flex-start item-center">
        <view class="iconfont icon-local fo-30 fo-3"></view>
        <view class="ml-30 fo-28 fo-3">选择地点</view>
      </view>
      <view class="flex flex-end item-center">
        <view v-if="active.length > 1" class="fo-28 fo-6"
          >{{ range[0][active[0]] }}-{{
            range[1][active[1]] || "暂无地点"
          }}</view
        >
        <view v-else class="fo-28 fo-9">请选择地点</view>
        <view class="iconfont icon-arrow-right fo-24 fo-9 ml-20"></view>
      </view>
    </view>
  </picker>
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
  computed: {
    rangeIndex: {
      get(): number[] {
        return this.active as number[];
      },
      set(val: number[]) {
        this.$emit("change", val);
        this.filterAddress(val);
      },
    },
    range(): string[][] {
      const arr = [] as string[][];
      const areas = [] as string[];
      const builds = [] as string[];
      for (const area of this.options) {
        areas.push((area as any).areaName);
      }
      let index = this.column;

      if (
        this.options.length > 0 &&
        (this.options[index] as any).children.length > 0
      ) {
        for (const build of (this.options[index] as any).children) {
          builds.push((build as any).buildName);
        }
      }
      arr.push(areas);
      arr.push(builds);
      return arr;
    },
  },
  methods: {
    handleChange(e: { detail: { value: number[] } }) {
      this.rangeIndex = e.detail.value;
    },
    handleColumnChange(e: { detail: { column: number; value: number } }) {
      if (e.detail.column === 0) {
        this.column = e.detail.value;
      }
    },
    async filterAddress(val: number[]) {
      if (val.length === 0) {
        return;
      }
      if (this.range[0][val[0]] && this.range[1][val[1]]) {
        const buildLocation = (this.options as any)[val[0]].children[val[1]]
          .latlng;
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
  },
});
</script>
