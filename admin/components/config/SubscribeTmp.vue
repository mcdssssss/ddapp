<template>
  <div class="subscribe-tmp">
    <div class="subscribe-header flex flex-start item-center">
      <div class="avatar">
        <i slot="icon" class="iconfont icon-weixin"></i>
      </div>
      <div class="fo-14 fo-9 ml-20">微信小程序</div>
    </div>
    <div class="subscribe-content">
      <div class="fo-14 fo-3">{{ noticeTitle }}</div>
      <div class="text-content">
        <div v-for="(item, index) in arr" :key="index" class="flex flex-start item-center mb-8">
          <div class="w-50 fo-9 fo-14">{{ item.name }}</div>
          <div class="w-50 fo-3 fo-14">{{ item.example }}</div>
        </div>
      </div>
    </div>
    <div class="subscribe-footer flex flex-between item-center">
      <div class="fo-14 fo-9">查看详情</div>
      <div class="iconfont icon-arrow-right fo-9"></div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    arr: {
      type: Array,
      default: () => {
        return [];
      }
    } as any
  },
  data() {
    return {
      noticeTitle: ''
    };
  },
  mounted() {
    this.noticeTitle = this.$route.query.title as string;
  }
});
</script>
<style lang="less" scoped>
.subscribe-tmp {
  width: 318px;
  height: 376px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  .subscribe-header {
    padding: 14px 15px 10px;
    height: 74px;
    border-bottom: 1px solid #e1e1e1;
    .avatar {
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 32px;
    }
    .icon-weixin {
      font-size: 20px;
      color: #1ba318;
    }
  }
  .subscribe-content {
    height: 260px;
    border-bottom: 1px solid #e1e1e1;
    padding: 15px;
    .text-content {
      padding: 30px 0;
    }
  }
  .subscribe-footer {
    padding: 9px 15px;
  }
}
</style>
