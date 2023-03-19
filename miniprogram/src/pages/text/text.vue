<template>
  <view class="p-30 border-t fo-28">
    <view v-if="node.length === 0" class="pb-30">
      <DEmpty type="shop">暂无无文本</DEmpty>
    </view>
    <rich-text :nodes="node"></rich-text>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import parse from "mini-html-parser2";
import { richtextInfo } from "@/utils/api";
export default Vue.extend({
  data() {
    return {
      node: [],
      richNo: "",
      loading: false,
    };
  },
  onLoad(options: { richNo: string }) {
    if (options.richNo) {
      this.richNo = options.richNo;
      this.getText();
    }
  },
  methods: {
    async getText() {
      uni.showLoading({ title: "加载中" });
      const res = await richtextInfo({
        richNo: this.richNo,
      });
      uni.hideLoading();
      if (res.code === 200 && res.data.richContent) {
        // this.node = res.data.richContent;
        parse(res.data.richContent, (err: Error, nodes: any) => {
          if (!err) {
            this.node = nodes;
          }
        });
        uni.setNavigationBarTitle({
          title: res.data.richTitle,
        });
      }
    },
  },
});
</script>
