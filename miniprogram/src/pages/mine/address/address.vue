<template>
  <view class="p-30">
    <AddressItem
      v-for="(item, index) in list"
      :key="index"
      :options="item"
      @choose="addressType ? chooseItem($event) : null"
    />
    <navigator
      class="address-btn flex flex-center item-center"
      url="/pages/mine/address/edit?type=add"
      >+</navigator
    >
    <view v-if="list.length === 0" style="padding-top: 100rpx">
      <DEmpty>暂无地址,请在右下角添加</DEmpty>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import AddressItem from "@/components/mine/AddressItem.vue";
import { addressList } from "@/utils/api";
export default Vue.extend({
  components: {
    AddressItem,
  },
  data() {
    return {
      list: [],
      query: {
        current: 1,
        pageSize: 20,
      },
      count: 0,
      addressType: "",
    };
  },
  onLoad(options: { addressType?: "start" | "end" }) {
    this.addressType = options?.addressType || "";
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
    chooseItem(item: any) {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 2] as any;
      const params = JSON.parse(JSON.stringify(item));
      if (params.isDefault !== undefined) {
        delete params.isDefault;
      }
      delete params.updateTime;
      delete params.createTime;
      delete params.id;
      delete params.isDelete;
      delete params.userNo;

      currentPage.$vm[this.addressType + "Address"] = params;
      uni.navigateBack({
        delta: 1,
      });
    },
    async getList(isBottom = false) {
      if (isBottom) {
        this.query.current += 1;
      } else {
        this.query.current = 1;
      }
      uni.showLoading({ title: "加载中" });
      const result = await addressList(this.query);
      uni.hideLoading();
      uni.stopPullDownRefresh();
      if (result.code === 200) {
        this.count = result.data.data;
        if (isBottom) {
          this.list = this.list.concat(result.data.data);
        } else {
          this.list = result.data.data;
        }
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.address-btn {
  width: 100rpx;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 100rpx;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  background-color: #333333;
  color: #ffffff;
  font-size: 40rpx;
  position: absolute;
  bottom: 60rpx;
  right: 30rpx;
  &:hover {
    opacity: 0.8;
  }
}
</style>
