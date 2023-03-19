<template>
  <div class="home-container">
    <div class="flex flex-between item-center">
      <div class="home-page-title">图片管理</div>

      <a-upload
        name="file"
        :multiple="true"
        :file-list="[]"
        :show-upload-list="false"
        action="/"
        :before-upload="beforeUpload"
        :custom-request="customRequest"
      >
        <a-button type="primary" size="large" :loading="loading">
          <a-icon type="upload" /> 上传图片
        </a-button>
      </a-upload>
    </div>
    <a-alert v-if="!canIUpload" class="mt-20" type="error" banner>
      <div slot="message">
        无法使用上传功能,您还没有配置阿里云上传
        <router-link to="/config/mapupload?type=ali">前往配置</router-link>
      </div>
    </a-alert>
    <PicGroup ref="picGroup" v-model="queryGroupId" class="mt-30" @change="getList" />
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
      <PicItem
        v-for="(item, index) in list"
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
import { v4 as uuidv4 } from 'uuid';
import { putFile } from '@/plugins/oss';
import PicGroup from '@/components/material/PicGroup.vue';
import PicItem from '@/components/material/PicItem.vue';
import GroupMove from '@/components/material/GroupMove.vue';
export default Vue.extend({
  components: {
    PicGroup,
    PicItem,
    GroupMove
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
      upSize: 0,
      nowSize: 0,
      pageLoading: false,
      checkedAll: false,
      moveVisible: false
    };
  },
  computed: {
    list(): any {
      return this.$store.state.file.files;
    },
    queryGroupId: {
      get(): number {
        return this.$store.state.file.query.groupId;
      },
      set(val: number) {
        this.$store.commit('file/setGroupId', val);
      }
    },
    queryCurrent: {
      get(): number {
        return this.$store.state.file.query.current;
      },
      set(val: number) {
        this.$store.commit('file/setCurrent', val);
      }
    },
    queryPageSize(): number {
      return this.$store.state.file.query.pageSize;
    },
    fileCount(): number {
      return this.$store.state.file.fileCount;
    },
    canIUpload(): boolean {
      return this.$store.state.file.canIUpload;
    }
  },
  mounted() {
    if (this.$store.state.file.files.length === 0) {
      this.getList();
    }
    if (!this.canIUpload) {
      this.$store.dispatch('file/checkUpload');
    }
  },
  methods: {
    beforeUpload(e: File, fileList: File[]) {
      let len = 0;
      for (const item of fileList) {
        if (item.size <= 10 * 1024 * 1024) {
          len++;
        }
      }
      this.upSize = len;
      if (e.size > 10 * 1024 * 1024) {
        (this as any).$message.error(`图片不得大于10MB`);
        return false;
      }
    },
    async customRequest(e: { file: File }) {
      const split = e.file.name.split('.');
      const suffix = split[split.length - 1];
      this.loading = true;
      const result = await putFile('pic/' + uuidv4() + '.' + suffix, e.file);
      if (result) {
        await (this as any).$api.fileAdd({
          fileName: e.file.name,
          fileSize: e.file.size,
          fileLink: result,
          suffix,
          groupId: this.queryGroupId
        });
        this.nowSize++;
      }
      if (this.nowSize === this.upSize) {
        this.loading = false;
        this.nowSize = 0;
        this.getList();
      }
    },

    async getList() {
      this.pageLoading = true;
      await this.$store.dispatch('file/fetchFileList');
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
        (this as any).$message.warning('请选中至少一张图片');
        return;
      }
      (this as any).$confirm({
        title: '提示',
        content: '确定要删除吗？删除数据无法恢复恢复。',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await (this as any).$api.fileDel({ ids: ids.toString() });
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
            this.$store.dispatch('file/fetchFileGroupList', { groupType: 'file' });
            this.getList();
          }
        }
      });
    },

    async changeGroup(groupId: number) {
      const ids = this.getIds();
      if (ids.length === 0) {
        (this as any).$message.warning('请选中至少一张图片');
        return;
      }
      const result = await (this as any).$api.fileMoveToGroup({ ids: ids.toString(), groupId });
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
