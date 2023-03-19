<template>
  <view class="order-bg">
    <OrderTab
      :type="query.orderType"
      :status="query.status"
      @change="changeOrder"
    />
    <view v-if="list.length === 0" class="p-30">
      <DEmpty type="order">
        <view>{{ notTakerMsg || "你还没有订单哦!" }}</view>
        <view v-if="notTakerMsg" class="flex flex-center mt-20">
          <DButton type="info" radius @click="navToRegister">
            <span class="fo-24"> 前往申请</span>
          </DButton>
        </view>
      </DEmpty>
    </view>
    <view class="p-30">
      <OrderItem
        v-for="(item, index) in list"
        :key="index"
        :type="query.orderType"
        :options="item"
        :isMch="true"
        @takeSuccess="getList()"
      />
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import OrderTab from "@/components/order/OrderTab.vue";
import OrderItem from "@/components/order/OrderItem.vue";
import { fetchOrderList } from "@/utils/api";
import { OrderTypeType, StatusType } from "@/utils/constrants";
export default Vue.extend({
  components: {
    OrderTab,
    OrderItem,
  },
  data() {
    return {
      query: {
        current: 1,
        pageSize: 15,
        status: "all" as StatusType,
        orderType: "user" as OrderTypeType,
      },
      list: [],
      count: 0,
      notTakerMsg: "",
    };
  },
  onLoad() {
    this.getList();
  },
  onPullDownRefresh() {
    this.getList();
  },
  onReachBottom() {
    if (this.list.length < this.count) {
      this.getList(true);
    }
  },
  methods: {
    navToRegister() {
      uni.navigateTo({
        url: "/pages/mine/taker/charge?next=1",
      });
    },
    changeOrder({
      orderType,
      status,
    }: {
      orderType: OrderTypeType;
      status: StatusType;
    }) {
      this.query.status = status;
      this.query.orderType = orderType;
      this.getList();
    },
    async getList(isBottom = false) {
      if (isBottom) {
        this.query.current++;
      } else {
        this.query.current = 1;
      }
      uni.showLoading({ title: "加载中" });
      const result = await fetchOrderList(this.query);
      uni.stopPullDownRefresh();
      uni.hideLoading();
      if (result.code === 200) {
        this.notTakerMsg = "";
        if (isBottom) {
          this.list = this.list.concat(result.data.data);
        } else {
          this.list = result.data.data;
        }
        this.count = result.data.count;
      } else if (result.code === 1002) {
        this.list = [];
        this.count = 0;
        this.notTakerMsg = result.msg;
      }
    },
  },
});
</script>
