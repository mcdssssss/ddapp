<template>
  <div>
    <a-table
      class="mt-20"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :row-key="rowKey"
      :columns="columns"
      :data-source="tabelData"
      :pagination="false"
      :loading="loading"
      bordered
    >
      <template slot="action" slot-scope="text">
        <a-button type="link" @click="chooseTmp(text.tid, text.title)">选用</a-button>
      </template>
    </a-table>
    <div class="mt-20 flex flex-end">
      <a-pagination
        v-model="query.current"
        size="small"
        :total="count"
        :page-size="query.pageSize"
        show-quick-jumper
        :show-total="total => `共 ${total} 条数据`"
        @change="pageChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import TableDataMixins from '@/plugins/mixins/table-data-mixin.vue';
export default TableDataMixins.extend({
  data() {
    return {
      /* ---- 必要参数 start ---- */
      query: {
        current: 1,
        pageSize: 10
      },
      columns: [
        { title: 'ID', key: 'tid', dataIndex: 'tid' },
        { title: '标题', key: 'title', dataIndex: 'title' },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'tid',

      cates: [] as { id: number; name: string }[]
    };
  },
  async mounted() {
    await this.getCate();
    this.getList();
  },
  methods: {
    async getCate() {
      const result = await (this as any).$api.wxSubscribeCate();
      if (result.code === 200) {
        this.cates = result.data;
      }
    },
    getTableData() {
      // return;
    },
    async getList() {
      this.loading = true;
      const ids = [] as number[];
      for (const item of this.cates) {
        ids.push(item.id);
      }

      const result = await (this as any).$api.wxSubscribeTitles({
        ids: ids.toString(),
        start: (this.query.current - 1) * this.query.pageSize,
        limit: this.query.pageSize
      });
      this.loading = false;
      if (result.code === 200) {
        this.tabelData = result.data.data;
        this.count = result.data.count;
      }
    },
    pageChange() {
      this.getList();
    },
    // 选用模板
    chooseTmp(tid: string, title: string) {
      this.$router.push({ path: '/config/wxsubscribeedit', query: { tid, title } });
    }
  }
});
</script>
