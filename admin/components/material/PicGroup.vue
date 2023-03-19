<template>
  <div class="pic-group flex flex-start flex-wrap">
    <div class="fo-14" style="line-height: 30px">分组:</div>
    <div :class="['group-item', value === 0 ? 'group-item--active' : '']" @click="emitChange(0)">
      全部
    </div>
    <div :class="['group-item', value === -1 ? 'group-item--active' : '']" @click="emitChange(-1)">
      未分组
    </div>
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="['group-item', value === item.id ? 'group-item--active' : '']"
      @click="emitChange(item.id)"
      @dblclick="updateGroup(item)"
    >
      {{ item.groupName }}
    </div>
    <div class="group-item" @click="addGroup">+</div>

    <GroupEdit
      ref="groupEdit"
      v-model="visible"
      @success="(visible = false), $store.dispatch('file/fetchFileGroupList', { groupType: type })"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import GroupEdit from '@/components/material/GroupEdit.vue';
export default Vue.extend({
  components: {
    GroupEdit
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      default: 0 // 0 全部 -1未分组
    },
    type: {
      type: String,
      default: 'file'
    }
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    list(): any[] {
      return this.type === 'file'
        ? this.$store.state.file.list
        : this.$store.state.file.richGroupList;
    }
  },
  mounted() {
    if (
      (this.type === 'file' && this.$store.state.file.list.length === 0) ||
      (this.type === 'richtext' && this.$store.state.file.richGroupList.length === 0)
    ) {
      console.log(123);
      this.$store.dispatch('file/fetchFileGroupList', { groupType: this.type });
    }
  },
  methods: {
    emitChange(value: number) {
      this.$emit('change', value);
    },
    addGroup() {
      (this.$refs.groupEdit as any).formData = {
        groupName: '',
        groupType: this.type
      };
      this.visible = true;
    },
    updateGroup(item: any) {
      (this.$refs.groupEdit as any).formData = {
        groupName: item.groupName,
        groupType: item.groupType,
        id: item.id
      };
      this.visible = true;
    }
    // async getList() {
    //   const res = await (this as any).$api.fileGroupList();
    //   if (res.code === 200) {
    //     this.list = res.data;
    //   }
    // }
  }
});
</script>
<style lang="less" scoped>
.pic-group {
  .group-item {
    padding: 0 12px;
    line-height: 30px;
    border-radius: 30px;
    background-color: #f3f3f3;
    font-size: 12px;
    color: #999999;
    margin-left: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: 0.2s linear all;
    &:hover {
      color: #ffffff;
      background-color: #955ce6;
    }
  }
  .group-item--active {
    color: #ffffff;
    background-color: #955ce6;
  }
}
</style>
