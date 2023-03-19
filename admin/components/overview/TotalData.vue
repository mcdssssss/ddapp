<template>
  <div style="margin-top: 60px">
    <a-row :gutter="20">
      <a-col :span="6">
        <div class="total-box">
          <div class="ml-20 text-center total-box-per">
            <div class="total-box-icon fo-w total-box--1">
              <div class="iconfont icon-avatar"></div>
            </div>
            <div class="fo-12 fo-9 mt-30">昨日新增</div>
            <div class="fo-12 fo-6">{{ yesterdayUserTotal }}人</div>
          </div>
          <div class="ml-40">
            <div class="fo-14 fo-3">总用户数</div>
            <div class="fo-24 fo-3">{{ userTotal }} <span class="fo-12">人</span></div>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="total-box">
          <div class="ml-20 text-center total-box-per">
            <div class="total-box-icon fo-w total-box--2">
              <div class="iconfont icon-income"></div>
            </div>
            <div class="fo-12 fo-9 mt-30">昨日新增</div>
            <div class="fo-12 fo-6">{{ yesterdayIncomeTotal }}元</div>
          </div>
          <div class="ml-40">
            <div class="fo-14 fo-3">总盈利</div>
            <div class="fo-24 fo-3">{{ incomeTotal }} <span class="fo-12">元</span></div>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="total-box">
          <div class="ml-20 text-center total-box-per">
            <div class="total-box-icon fo-w total-box--3">
              <div class="iconfont icon-trade"></div>
            </div>
            <div class="fo-12 fo-9 mt-30">昨日新增</div>
            <div class="fo-12 fo-6">{{ yesterdayTradeTotal }}元</div>
          </div>
          <div class="ml-40">
            <div class="fo-14 fo-3">总交易额</div>
            <div class="fo-24 fo-3">{{ tradeTotal }} <span class="fo-12">元</span></div>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="total-box">
          <div class="ml-20 text-center total-box-per">
            <div class="total-box-icon fo-w total-box--4">
              <div class="iconfont icon-order-complete"></div>
            </div>
            <div class="fo-12 fo-9 mt-30">昨日新增</div>
            <div class="fo-12 fo-6">{{ yesterdayOrderCompleteTotal }}个</div>
          </div>
          <div class="ml-40">
            <div class="fo-14 fo-3">订单完成量</div>
            <div class="fo-24 fo-3">{{ orderCompleteTotal }} <span class="fo-12">个</span></div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    school: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userTotal: 0,
      orderCompleteTotal: 0,
      tradeTotal: 0,
      incomeTotal: 0,
      yesterdayUserTotal: 0,
      yesterdayOrderCompleteTotal: 0,
      yesterdayTradeTotal: 0,
      yesterdayIncomeTotal: 0
    };
  },
  async mounted() {
    const res = await (this as any).$api[this.school ? 'schoolAnlysisTotal' : 'analysisTotal']();
    if (res.code === 200) {
      this.userTotal = res.data.userTotal;
      this.orderCompleteTotal = res.data.orderCompleteTotal;
      this.tradeTotal = res.data.tradeTotal;
      this.incomeTotal = res.data.incomeTotal;

      this.yesterdayUserTotal = res.data.yesterdayUserTotal;
      this.yesterdayOrderCompleteTotal = res.data.yesterdayOrderCompleteTotal;
      this.yesterdayTradeTotal = res.data.yesterdayTradeTotal;
      this.yesterdayIncomeTotal = res.data.yesterdayIncomeTotal;
    }
  }
});
</script>
<style lang="less" scoped>
.total-box {
  width: 100%;
  height: 100px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  .total-box-per {
    width: 60px;
  }
  .total-box-icon {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    background: #ffffff;
    line-height: 60px;
    text-align: center;
    position: absolute;
    top: -20px;
    .iconfont {
      font-size: 24px;
    }
  }
  .total-box--1 {
    background-image: linear-gradient(to bottom right, #f3af19, #ea6439);
  }
  .total-box--2 {
    background-image: linear-gradient(to bottom right, #46aaf4, #385cf4);
  }
  .total-box--3 {
    background-image: linear-gradient(to bottom right, #5ad4e0, #2299d2);
  }
  .total-box--4 {
    background-image: linear-gradient(to bottom right, #4ed855, #3ec296);
  }
}
</style>
