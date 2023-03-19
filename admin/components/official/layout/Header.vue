<template>
  <div class="header flex flex-between item-center">
    <div class="flex flex-start item-center">
      <!-- <Logo /> -->
      <img v-if="logo" :src="logo" height="35px" />
      <div class="fo-20 ml-12 bold">
        {{ systemName || title }}
      </div>
    </div>
    <div class="flex flex-end item-center">
      开源校园版
      <Avatar class="ml-20" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Avatar from '@/components/user/Avatar.vue';
export default Vue.extend({
  components: {
    Avatar
  },
  data() {
    return {
      title: document.title
    };
  },
  computed: {
    systemName(): string {
      return this.$store.state.system.systemName;
    },
    logo(): string {
      return this.$store.state.system.logo;
    }
  }
});
</script>
<style lang="less" scoped>
.header {
  min-width: 1200px;
  width: 100vw;
  background-color: #ffffff;
  height: 60px;
  padding: 0 20px;
  //   border-bottom: 1px solid #e1e1e1;
  .level-btn {
    cursor: pointer;
    .iconfont {
      font-size: 25px;
      color: #f5222d;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
