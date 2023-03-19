<template>
  <div class="sidebar">
    <Scrollbar max-height="calc(100vh - 60px - 40px - 12px)">
      <a-menu mode="inline" :selected-keys="selectedKeys" @click="clickMenuItem">
        <a-sub-menu key="overview">
          <span slot="title">
            <i class="iconfont icon-user-maner"></i>
            <span class="ml-8 bold">数据总览</span>
          </span>
          <a-menu-item key="/"> 数据总览 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="user">
          <span slot="title">
            <i class="iconfont icon-user-maner"></i>
            <span class="ml-8 bold">小程序用户</span>
          </span>
          <a-menu-item key="/user/users"> 用户列表 </a-menu-item>
          <a-menu-item key="/user/wxapps"> 微信小程序 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="drawer">
          <span slot="title">
            <i class="iconfont icon-drawer"></i>
            <span class="ml-8 bold">订单管理</span>
          </span>
          <a-menu-item key="/school/order/orders"> 订单列表 </a-menu-item>
          <a-menu-item key="/school/order/capitaltrend"> 资金走向列表 </a-menu-item>
          <a-menu-item key="/config/ordertype">订单大厅展示</a-menu-item>
          <a-menu-item key="/config/timeRequirement">时间要求配置</a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="taker">
          <span slot="title">
            <i class="iconfont icon-taker"></i>
            <span class="ml-8 bold">接单员管理</span>
          </span>
          <a-menu-item key="/school/taker/takers"> 接单员列表 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="school">
          <span slot="title">
            <i class="iconfont icon-school"></i>
            <span class="ml-8 bold">学校管理</span>
          </span>
          <a-menu-item key="/school/detail"> 学校管理 </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="system">
          <span slot="title">
            <i class="iconfont icon-setting"></i>
            <span class="ml-8 bold">校园系统设置</span>
          </span>
          <a-menu-item key="/config/app"> 小程序设置 </a-menu-item>
          <a-menu-item key="/config/subscribe"> 订阅消息设置 </a-menu-item>
          <a-menu-item key="/config/protocol"> 协议及指南 </a-menu-item>
        </a-sub-menu>

        <a-divider></a-divider>

        <a-sub-menu key="pic">
          <span slot="title">
            <i class="iconfont icon-icon-test"></i>
            <span class="ml-8 bold">提现管理</span>
          </span>
          <a-menu-item key="/rider/cash"> 提现列表 </a-menu-item>
          <a-menu-item key="/config/cashSetting"> 提现设置 </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="material">
          <span slot="title">
            <i class="iconfont icon-pic"></i>
            <span class="ml-8 bold">素材</span>
          </span>
          <a-menu-item key="/material/picture"> 图片管理 </a-menu-item>
          <a-menu-item key="/material/richtext"> 富文本 </a-menu-item>
        </a-sub-menu>

        <a-divider></a-divider>

        <a-sub-menu key="setting">
          <span slot="title">
            <i class="iconfont icon-setting"></i>
            <span class="ml-8 bold">通用设置</span>
          </span>
          <a-menu-item key="/config/mapupload"> 地图及上传设置 </a-menu-item>
          <a-menu-item key="/config/setting"> 系统设置 </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </Scrollbar>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  computed: {
    selectedKeys: {
      get(): string[] {
        return [this.$route.fullPath];
      },
      set(val: string[]) {
        this.$router.push(val[0]);
      }
    }
  },
  methods: {
    clickMenuItem(e: { key: string }) {
      if (e.key !== this.selectedKeys[0]) {
        this.selectedKeys = [e.key];
      }
    }
  }
});
</script>
<style lang="less" scoped>
.sidebar {
  padding-top: 12px;
  position: absolute;
  width: 200px;
  height: calc(100vh - 60px - 40px);
  left: 20px;
  top: 80px;
  border-radius: 4px;
  background-color: #ffffff;
}
</style>
