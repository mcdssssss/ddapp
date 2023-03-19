<template>
  <div class="taker-box">
    <div class="fo-20 fo-9">接单员排行榜</div>
    <DatePicker v-model="dates" class="mt-12" @change="dateChange" />
    <div class="mt-20">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="taker-item flex flex-between item-center"
      >
        <div class="flex flex-start item-center">
          <div
            class="avatar"
            :style="{ backgroundImage: `url(${imageCenterCrop(item.avatarUrl, 50, 50)})` }"
          >
            <img v-if="index === 0" class="avatar-logo" src="@/assets/images/no1.svg" alt="" />
            <img v-else-if="index === 1" class="avatar-logo" src="@/assets/images/no2.svg" alt="" />
            <img v-else-if="index === 2" class="avatar-logo" src="@/assets/images/no3.svg" alt="" />
            <div v-else class="avatar-tip">{{ index + 1 }}</div>
          </div>
          <div class="ml-16">
            <div>{{ item.realName }}</div>
            <div class="fo-9 fo-12">「{{ item.schoolName }}」</div>
          </div>
        </div>
        <div>
          <div class="price-tip">￥{{ item.income }}</div>
          <div class="fo-12 fo-6 text-right mt-8">{{ item.total }}单</div>
        </div>
      </div>
      <div v-if="list.length === 0" class="text-center mt-20 fo-9">暂无排名</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import { imageCenterCrop } from '@/plugins/oss';
export default Vue.extend({
  data() {
    return {
      dates: [] as string[],
      list: []
    };
  },
  mounted() {
    // 查看过去7天的数据
    const endDate = dayjs(Date.now() - 24 * 60 * 60 * 1000).format('YYYYMMDD');
    const beginDate = dayjs(Date.now() - 24 * 60 * 60 * 1000 * 7).format('YYYYMMDD');
    this.dates = [beginDate, endDate];
    // this.init();
    this.getData();
  },
  methods: {
    imageCenterCrop,
    dateChange() {
      this.getData();
    },
    async getData() {
      const result = await (this as any).$api.schoolAnlysisTaker({
        beginDate: this.dates[0],
        endDate: this.dates[1]
      });
      if (result.code === 200) {
        this.list = result.data;
      }
    }
  }
});
</script>
<style lang="less" scoped>
.taker-box {
  border-radius: 4px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.05);
  padding: 20px;
  height: 622px;
  .taker-item {
    padding: 15px 0;
    border-bottom: 1px solid #eaeaea;
    .avatar {
      width: 50px;
      height: 50px;
      background: #f3f3f3;
      border-radius: 50px;
      position: relative;
      background-size: cover;
      background-position: center;
      .avatar-logo {
        width: 30px;
        height: 30px;
        position: absolute;
        left: -5px;
        top: -10px;
      }
      .avatar-tip {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        position: absolute;
        left: 0px;
        top: 0px;
        background-color: #666;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        color: #fff;
      }
    }
    .price-tip {
      padding: 0 8px;
      line-height: 24px;
      font-size: 12px;
      color: #ffffff;
      background-color: #f93d3d;
      border-radius: 2px;
    }
  }
}
</style>
