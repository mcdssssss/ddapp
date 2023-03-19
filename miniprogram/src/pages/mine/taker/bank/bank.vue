<template>
  <view>
    <view
      v-for="(item, index) in list"
      :key="index"
      class="border-b p-30 flex flex-between item-center"
      @click="chooseBankCard(item)"
    >
      <view>
        <view class="fo-28 fo-3">
          {{ item.bankName }}
        </view>
        <view class="fo-24 fo-6 mt-16">
          {{ item.cardNo }},{{ item.realname }}
        </view>
      </view>
      <view class="flex flex-end item-center" @click.stop="navToUpdate(item)">
        <view class="fo-9"> | </view>
        <view class="iconfont icon-edit fo-32 fo-9 ml-30"> </view>
      </view>
    </view>
    <view v-if="count === 0" class="text-center p-30 fo-24 fo-9">
      - 您还没有收款方式 -
    </view>
    <view class="add-btn" @click="navToAdd"> + </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { bankList } from "@/utils/api";
export default Vue.extend({
  data() {
    return {
      list: [],
      query: {
        current: 1,
        pageSize: 15,
      },
      count: 0,
      type: "",
    };
  },
  onLoad(options: { type: string }) {
    if (options.type) {
      this.type = options.type;
    }
  },
  onShow() {
    this.getList();
  },
  onPullDownRefresh() {
    this.getList();
  },
  onReachBottom() {
    if (this.count > this.list.length) {
      this.getList(true);
    }
  },
  methods: {
    // 选择银行卡
    chooseBankCard(item: any) {
      if (this.type === "cash") {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2] as any;
        prevPage.$vm.bankCard = item;
        uni.navigateBack({
          delta: 1,
        });
      }
    },
    navToUpdate(item: any) {
      uni.navigateTo({
        url: `/pages/mine/taker/bank/edit?bankNo=${item.bankNo}&cardNo=${item.cardNo}&realname=${item.realname}&bankName=${item.bankName}`,
      });
    },
    navToAdd() {
      uni.navigateTo({
        url: "/pages/mine/taker/bank/edit",
      });
    },
    async getList(isBottom = false) {
      uni.showLoading({ title: "加载中" });
      if (isBottom) {
        this.query.current++;
      } else {
        this.query.current = 1;
      }
      const res = await bankList(this.query);
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

<style lang="scss" scope>
.add-btn {
  width: 100rpx;
  height: 100rpx;
  position: fixed;
  bottom: 120rpx;
  right: 30rpx;
  background-color: $info;
  text-align: center;
  line-height: 100rpx;
  font-size: 50rpx;
  color: #ffffff;
  border-radius: 100rpx;
}
</style>
