<template>
  <div class="order-status">
    <div class="fo-20 fo-9">订单数据</div>
    <DatePicker v-model="dates" class="mt-12" @change="dateChange" />
    <div class="flex flex-between flex-wrap">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="data-item flex flex-center item-center"
      >
        <div class="text-center">
          <div class="order-icon" :style="{ backgroundColor: item.color }">
            <div :class="['iconfont', 'fo-w', item.icon]"></div>
          </div>
          <div class="fo-12 fo-9 mt-8">{{ item.label }}</div>
          <div class="fo-18">{{ item.value }}个</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
export default Vue.extend({
  data() {
    return {
      list: [
        { label: '已完成', value: 0, color: '#00CC66', icon: 'icon-order-complete' },
        { label: '待确认', value: 0, color: '#FF3300', icon: 'icon-wait-confirm' },
        { label: '配送中', value: 0, color: '#FF6666', icon: 'icon-sending' },
        { label: '待接单', value: 0, color: '#ff6633', icon: 'icon-wait-receive' },
        { label: '待支付', value: 0, color: '#0099FF', icon: 'icon-wait-pay' },
        { label: '已取消', value: 0, color: '#aaaaaa', icon: 'icon-canceled' },
        { label: '已关闭', value: 0, color: '#333333', icon: 'icon-closed' },
        { label: '已退款', value: 0, color: '#FF6699', icon: 'icon-refunded' }
      ],
      dates: [] as string[]
    };
  },
  mounted() {
    const now = dayjs(Date.now()).format('YYYYMMDD');
    this.dates = [now, now];
    this.getDaily();
  },
  methods: {
    async getDaily() {
      const res = await (this as any).$api.analysisOrderStatusDaily({
        beginDate: this.dates[0],
        endDate: this.dates[1]
      });
      if (res.code === 200) {
        this.list[0].value = res.data.complete;
        this.list[1].value = res.data.waitConfirm;
        this.list[2].value = res.data.sending;
        this.list[3].value = res.data.waitReceive;
        this.list[4].value = res.data.waitPay;
        this.list[5].value = res.data.cancel;
        this.list[6].value = res.data.close;
        this.list[7].value = res.data.refund;
      }
    },
    dateChange() {
      this.getDaily();
    }
  }
});
</script>
<style lang="less" scoped>
.order-status {
  border-radius: 4px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.05);
  padding: 20px;
  .data-item {
    width: calc(100% / 2 - 20px);
    height: 125px;
  }
  .order-icon {
    width: 30px;
    height: 30px;
    border-radius: 0 8px 0 8px;
    text-align: center;
    margin: auto;
    .iconfont {
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>
