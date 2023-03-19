<template>
  <div class="box mt-20">
    <div class="fo-20 fo-9">订单数据曲线</div>
    <DatePicker v-model="dates" class="mt-12" @change="dateChange" />
    <div ref="orderLine" class="mt-20"></div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
export default Vue.extend({
  data() {
    return {
      dates: [] as string[],
      chart: null as any,
      viewData: []
    };
  },

  mounted() {
    // 查看过去7天的数据
    const endDate = dayjs(Date.now()).format('YYYYMMDD');
    const beginDate = dayjs(Date.now() - 24 * 60 * 60 * 1000 * 6).format('YYYYMMDD');
    this.dates = [beginDate, endDate];
    this.init();
    this.getData();
  },
  methods: {
    init() {
      this.chart = new Chart({
        container: (this.$refs as any).orderLine,
        autoFit: true,
        height: 500
      });
      this.chart.scale({
        date: {
          range: [0, 1]
        },
        value: {
          nice: true
        }
      });

      this.chart.tooltip({
        showCrosshairs: true,
        shared: true
      });

      this.chart.axis('value', {
        label: {
          formatter: (val: string) => {
            return val;
          }
        }
      });

      this.chart.line().position('date*value').color('status').shape('smooth');

      this.chart.point().position('date*value').color('status').shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      });

      this.chart.removeInteraction('legend-filter'); // 移除默认的 legend-filter 数据过滤交互
      this.chart.interaction('legend-visible-filter'); // 使用分类图例的图形过滤
    },
    dateChange() {
      this.getData();
    },
    render() {
      this.chart.data(this.viewData);
      this.chart.render(true);
    },
    async getData() {
      const result = await (this as any).$api.schoolAnlysisNewOrder({
        beginDate: this.dates[0],
        endDate: this.dates[1]
      });
      if (result.code === 200) {
        this.viewData = result.data;
        this.render();
      }
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
