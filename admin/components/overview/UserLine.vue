<template>
  <div class="box">
    <div class="fo-20 fo-9">用户数据曲线</div>
    <DatePicker v-model="dates" class="mt-12" @change="dateChange" />
    <div ref="userLine"></div>
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
      viewData: [],
      chart: null as any
    };
  },
  mounted() {
    // 查看过去7天的数据
    const endDate = dayjs(Date.now() - 24 * 60 * 60 * 1000).format('YYYYMMDD');
    const beginDate = dayjs(Date.now() - 24 * 60 * 60 * 1000 * 7).format('YYYYMMDD');
    this.dates = [beginDate, endDate];
    this.init();
    this.getData();
  },
  methods: {
    init() {
      this.chart = new Chart({
        container: (this.$refs as any).userLine,
        autoFit: true,
        height: 500,
        padding: [30, 20, 70, 30]
      });

      this.chart.scale({
        wx: {
          min: 0,
          max: 100
        },
        user: {
          min: 0,
          max: 100
        }
      });

      this.chart.axis('wx', false);

      this.chart.legend({
        custom: true,
        items: [
          {
            name: '新增注册用户',
            value: 'user',
            marker: { symbol: 'line', style: { stroke: '#1890ff', lineWidth: 2 } }
          },
          {
            name: '新增微信用户',
            value: 'wx',
            marker: { symbol: 'line', style: { stroke: '#2fc25b', lineWidth: 2 } }
          }
        ]
      });

      this.chart.line().position('date*user').color('#1890ff');
      this.chart.line().position('date*wx').color('#2fc25b');

      this.chart.removeInteraction('legend-filter'); // 自定义图例，移除默认的分类图例筛选交互
    },
    render() {
      this.chart.data(this.viewData);
      this.chart.render(true);
    },
    async getData() {
      const res = await (this as any).$api.analysisNewUser({
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
