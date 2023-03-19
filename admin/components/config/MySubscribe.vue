<template>
  <div>
    <a-table
      class="mt-20"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :row-key="rowKey"
      :columns="columns"
      :data-source="subscribes"
      :pagination="false"
      :loading="loading"
      bordered
    >
      <template slot="priTmplId" slot-scope="text">
        <div style="width: 150px">{{ text.priTmplId }}</div>
      </template>
      <template slot="title" slot-scope="text">
        <div style="width: 150px">{{ text.title }}</div>
      </template>
      <template slot="content" slot-scope="text">
        <p style="white-space: pre-wrap; width: 250px">{{ text.content }}</p>
      </template>
      <template slot="example" slot-scope="text">
        <p style="white-space: pre-wrap; width: 250px">{{ text.example }}</p>
      </template>
      <template slot="action" slot-scope="text">
        <Action
          :options="[{ label: '删除', key: 'del' }]"
          @click-item="actionClick($event, text)"
        />
      </template>
    </a-table>
  </div>
</template>
<script lang="ts">
import TableDataMixins from '@/plugins/mixins/table-data-mixin.vue';
export default TableDataMixins.extend({
  data() {
    return {
      /* ---- 必要参数 start ---- */
      query: {},
      columns: [
        {
          title: 'tmpID',
          key: 'priTmplId',
          scopedSlots: { customRender: 'priTmplId' }
        },
        { title: '标题', key: 'title', scopedSlots: { customRender: 'title' } },
        { title: '说明', key: 'content', scopedSlots: { customRender: 'content' } },
        { title: '示例', key: 'example', scopedSlots: { customRender: 'example' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'priTmplId'
    };
  },
  computed: {
    subscribes() {
      return this.$store.state.subscribe.mySubscribes;
    }
  },
  methods: {
    async getTableData() {
      this.loading = true;
      await this.$store.dispatch('subscribe/fetchMySubscribe');
      this.loading = false;
    },
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'del':
          this.del(text.priTmplId);
          break;
      }
    },
    del(priTmplId: string) {
      (this as any).$confirm({
        title: '提示',
        content: '确定要删除吗？删除后可登录小程序账号进行恢复。',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await (this as any).$api.wxSubscribeDel({ priTmplId });
          if (result.code === 200) {
            (this as any).$message.success('删除成功');
            this.getTableData();
          }
        }
      });
    }
  }
});
</script>
