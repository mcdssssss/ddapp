<template>
  <div class="box mt-20">
    <div class="fo-20 fo-9">订单数据曲线</div>
    <DatePicker v-model="dates" class="mt-12" @change="dateChange" />
    <div ref="orderLine"></div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';

export default Vue.extend({
  data() {
    return {
      dates: [
        dayjs(Date.now() - 24 * 60 * 60 * 1000 * 30).format('YYYYMMDD'),
        dayjs(Date.now() - 24 * 60 * 60 * 1000).format('YYYYMMDD')
      ] as string[],
      chart: null as any,
      viewData: []
    };
  },

  mounted() {
    this.init();
    this.getData();
  },
  methods: {
    init() {
      this.chart = new Chart({
        container: (this.$refs as any).orderLine,
        autoFit: true,
        height: 500,
        padding: [30, 20, 70, 30]
      });

      this.chart.scale({
        cancel: {
          nice: true
        },
        close: {
          nice: true
        },
        waitPay: {
          nice: true
        },
        waitReceive: {
          nice: true
        },
        sending: {
          nice: true
        },
        waitConfirm: {
          nice: true
        },
        success: {
          nice: true
        }
      });
      this.chart.tooltip({
        showCrosshairs: true,
        shared: true
      });
      this.chart.axis('cancel', false);
      this.chart.axis('close', false);
      this.chart.axis('waitPay', false);
      this.chart.axis('waitReceive', false);
      this.chart.axis('sending', false);
      this.chart.axis('waitConfirm', false);
      this.chart.legend({
        custom: true,
        items: [
          {
            name: '已取消',
            value: 'cancel',
            marker: { symbol: 'line', style: { stroke: '#aaaaaa', lineWidth: 2 } }
          },
          {
            name: '已关闭',
            value: 'close',
            marker: { symbol: 'line', style: { stroke: '#333333', lineWidth: 2 } }
          },
          {
            name: '待支付',
            value: 'waitPay',
            marker: { symbol: 'line', style: { stroke: '#0099FF', lineWidth: 2 } }
          },
          {
            name: '待接单',
            value: 'waitReceive',
            marker: { symbol: 'line', style: { stroke: '#ff6633', lineWidth: 2 } }
          },
          {
            name: '配送中',
            value: 'sending',
            marker: { symbol: 'line', style: { stroke: '#FF6666', lineWidth: 2 } }
          },
          {
            name: '待确认',
            value: 'waitConfirm',
            marker: { symbol: 'line', style: { stroke: '#FF3300', lineWidth: 2 } }
          },
          {
            name: '已完成',
            value: 'complete',
            marker: { symbol: 'line', style: { stroke: '#00CC66', lineWidth: 2 } }
          }
        ]
      });

      this.chart.line().position('date*cancel').color('#aaaaaa');
      this.chart.line().position('date*close').color('#333333');
      this.chart.line().position('date*waitPay').color('#0099FF');
      this.chart.line().position('date*waitReceive').color('#ff6633');
      this.chart.line().position('date*sending').color('#FF6666');
      this.chart.line().position('date*waitConfirm').color('#FF3300');
      this.chart.line().position('date*complete').color('#00CC66');

      this.chart.removeInteraction('legend-filter'); // 自定义图例，移除默认的分类图例筛选交互
      this.chart.render();
    },
    render() {
      this.chart.data(this.viewData);
      this.chart.render(true);
    },
    async getData() {
      const res = await (this as any).$api.analysisNewOrder({
        beginDate: this.dates[0],
        endDate: this.dates[1]
      });
      if (res.code === 200) {
        this.viewData = res.data;
        this.render();
      }
    },
    dateChange() {
      this.getData();
    }
  }
});
</script>
<style lang="less" scoped>
.box {
  border-radius: 4px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.05);
  padding: 20px;
}
</style>
