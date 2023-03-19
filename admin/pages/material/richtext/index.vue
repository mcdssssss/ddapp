<template>
  <div class="home-container">
    <div class="flex flex-between item-center">
      <div class="home-page-title">富文本管理</div>
      <a-button type="primary" size="large" @click="$router.push('/material/richtext/edit/add')">
        新增富文本
      </a-button>
    </div>
    <PicGroup
      ref="picGroup"
      v-model="queryGroupId"
      type="richtext"
      class="mt-30"
      @change="getList"
    />
    <div class="flex flex-between item-center mt-20">
      <div class="flex flex-start item-center">
        <a-checkbox v-if="type === 'page'" v-model="checkedAll" @change="checkedAllChange">
          全选
        </a-checkbox>
        <div v-else>已选择({{ getIds().length }}/{{ limit }})</div>
        <a-button v-if="type === 'page'" class="ml-20" type="danger" @click="delFiles"
          >批量删除</a-button
        >
        <a-button v-if="type === 'page'" class="ml-8" @click="moveVisible = true"
          >移动到分组</a-button
        >
      </div>
      <div class="flex flex-end item-center">
        <a-pagination
          v-model="queryCurrent"
          size="small"
          :total="fileCount"
          :pageSize="queryPageSize"
          :show-total="total => `共 ${total} 条`"
          show-quick-jumper
          @change="getList"
        />
        <a-button class="ml-20" icon="redo" :loading="pageLoading" @click="getList()"> </a-button>
      </div>
    </div>
    <div class="mt-20 flex flex-start flex-wrap">
      <RichtextItem
        v-for="(item, index) in list"
        :type="type"
        :key="index"
        :options="item"
        :checked="item.checked"
        @checkChange="checkedChange($event, index)"
      />
    </div>
    <div v-if="list.length === 0" class="mt-30">
      <CEmpty>暂无图片</CEmpty>
      <div v-if="queryGroupId > 0" class="flex flex-center mt-20">
        <a-button @click="delGroup">删除此分组</a-button>
      </div>
    </div>
    <div v-if="type === 'component'" class="mt-20 flex flex-end item-center">
      <a-button size="large" @click="$emit('cancel')">取消</a-button>
      <a-button
        class="ml-20"
        type="primary"
        size="large"
        :disabled="getIds().length === 0"
        @click="chooseConfirm"
        >确认选择</a-button
      >
    </div>
    <GroupMove v-model="moveVisible" @changeGroup="changeGroup" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import PicGroup from '@/components/material/PicGroup.vue';
import GroupMove from '@/components/material/GroupMove.vue';
import RichtextItem from '@/components/material/RichtextItem.vue';
export default Vue.extend({
  components: {
    PicGroup,
    GroupMove,
    RichtextItem
  },
  layout: 'global',
  props: {
    limit: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'page' // or component
    }
  },
  data() {
    return {
      loading: false,
      pageLoading: false,
      checkedAll: false,
      moveVisible: false
    };
  },
  computed: {
    list(): any {
      return this.$store.state.file.richtexts;
    },
    queryTitle: {
      get(): string {
        return this.$store.state.file.richQuery.richTitle;
      },
      set(val: string) {
        this.$store.commit('file/setRichTitle', val);
      }
    },
    queryGroupId: {
      get(): number {
        return this.$store.state.file.richQuery.groupId;
      },
      set(val: number) {
        this.$store.commit('file/setRichGroupId', val);
      }
    },
    queryCurrent: {
      get(): number {
        return this.$store.state.file.richQuery.current;
      },
      set(val: number) {
        this.$store.commit('file/setRichCurrent', val);
      }
    },
    queryPageSize(): number {
      return this.$store.state.file.richQuery.pageSize;
    },
    fileCount(): number {
      return this.$store.state.file.richCount;
    }
  },
  mounted() {
    if (this.$store.state.file.richtexts.length === 0) {
      this.getList();
    }
  },
  methods: {
    async getList() {
      this.pageLoading = true;
      await this.$store.dispatch('file/fetchRichtextList');
      this.pageLoading = false;
      this.checkedFilter();
    },
    checkedChange(val: boolean, index: number) {
      if (this.type === 'component') {
        const idsLen = this.getIds().length;
        if (val) {
          if (this.limit === 1) {
            this.checkedAllChange({ target: { checked: false } });
          } else if (idsLen >= this.limit) {
            (this as any).$message.warning('选中数量已达上限');
            return;
          }
        }
      }
      (this.list[index] as any).checked = val;
      this.checkedFilter();
      this.$forceUpdate();
    },

    checkedAllChange(e: { target: { checked: boolean } }) {
      for (const item of this.list) {
        (item as any).checked = e.target.checked;
      }
      this.checkedFilter();
    },

    checkedFilter() {
      let isCheckAll = true;
      if (this.list.length === 0) {
        isCheckAll = false;
      }
      for (const item of this.list) {
        if (!(item as any).checked) {
          isCheckAll = false;
        }
      }
      this.checkedAll = isCheckAll;
    },

    getIds() {
      const arr = [] as string[];
      for (const item of this.list) {
        if ((item as any).checked) {
          arr.push((item as any).id);
        }
      }
      return arr;
    },

    delFiles() {
      const ids = this.getIds();
      if (ids.length === 0) {
        (this as any).$message.warning('请选中至少一个富文本');
        return;
      }
      (this as any).$confirm({
        title: '提示',
        content: '确定要删除吗？删除数据无法恢复恢复。',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await (this as any).$api.richtextDel({ ids: ids.toString() });
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
            this.getList();
          }
        }
      });
    },

    delGroup() {
      (this as any).$confirm({
        title: '提示',
        content: '确定要删除吗？删除数据无法恢复恢复。',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await (this as any).$api.fileGroupDel({ id: this.queryGroupId });
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
            this.queryGroupId = 0;
            this.$store.dispatch('file/fetchFileGroupList', { groupType: 'richtext' });
            this.getList();
          }
        }
      });
    },

    async changeGroup(groupId: number) {
      const ids = this.getIds();
      if (ids.length === 0) {
        (this as any).$message.warning('请选中至少一个富文本');
        return;
      }
      const result = await (this as any).$api.richtextMoveToGroup({ ids: ids.toString(), groupId });
      if (result.code === 200) {
        (this as any).$message.success(result.msg);
        this.getList();
      }
      this.moveVisible = false;
    },

    chooseConfirm() {
      const arr = [] as any[];
      for (const item of this.list) {
        if ((item as any).checked) {
          arr.push(item);
        }
      }
      this.$emit('choose', arr);
    }
  }
});
</script>
