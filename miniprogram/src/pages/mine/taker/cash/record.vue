<template>
  <view>
    <view
      v-for="(item, index) in list"
      :key="index"
      class="p-30 border-b flex flex-between"
    >
      <view>
        <view class="fo-28">
          <view class="fo-info" v-if="item.status === 0"> 发起提现 </view>
          <view class="fo-green" v-else-if="item.status === 1"> 提现成功 </view>
          <view class="fo-price" v-else> 提现失败 </view>
        </view>
        <view v-if="item.status === -1" class="fo-26 fo-6">
          {{ item.reason }}
        </view>
        <view class="fo-26 fo-9">
          {{ formatDate(item.createTime, "yyyy-MM-dd hh:mm") }}
        </view>
      </view>
      <view class="fo-32"> {{ item.amount }}元 </view>
    </view>
    <view v-if="list.length === 0" class="p-30 fo-9 fo-28 text-center"
      >--暂无提现记录--</view
    >
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { cashList } from "@/utils/api";
import { formatDate } from "@/utils/common";
export default Vue.extend({
  data() {
    return {
      list: [],
      count: 0,
      query: {
        current: 1,
        pageSize: 15,
      },
    };
  },
  onLoad() {
    this.getList();
  },
  onReachBottom() {
    if (this.count > this.list.length) {
      this.getList(true);
    }
  },
  onPullDownRefresh() {
    this.getList();
  },
  methods: {
    formatDate,
    async getList(isBottom = false) {
      uni.showLoading({ title: "加载中" });
      if (isBottom) {
        this.query.current++;
      } else {
        this.query.current = 1;
      }
      const res = await cashList(this.query);
      uni.hideLoading();
      uni.stopPullDownRefresh();
      if (res.code === 200) {
        if (isBottom) {
          this.list = this.list.concat(res.data.data);
        } else {
          this.list = res.data.data;
        }
        this.count = res.data.count;
      }
    },
  },
});
</script>
