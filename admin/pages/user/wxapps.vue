<template>
  <div class="home-container">
    <div class="home-page-title">微信小程序用户</div>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <!-- <a-button type="primary" size="large" @click="$router.push('/user/edit/add')"
          >添加用户</a-button
        > -->
      </div>
      <div class="flex flex-end item-center">
        <a-button size="large" icon="redo" :loading="loading" @click="getTableData()"> </a-button>
      </div>
    </div>
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
      <template slot="userNo" slot-scope="text">
        <user-link v-if="text.userNo" :no="text.userNo" />
        <div v-else>----</div>
      </template>
      <template slot="createTime" slot-scope="text">
        <div class="fo-12">{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
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
        pageSize: 20
      },
      searchOptions: [
        { key: 'userNo', type: 'text', label: '用户编号' },
        { key: 'openid', type: 'text', label: 'openid' }
      ],
      columns: [
        {
          title: '编号',
          key: 'wxappNo',
          dataIndex: 'wxappNo'
        },
        { title: 'openid', key: 'openid', dataIndex: 'openid' },
        { title: '关联用户', key: 'userNo', scopedSlots: { customRender: 'userNo' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } }
      ],
      rowKey: 'wxappNo',
      api: 'wxappList'
    };
  },

  methods: {}
});
</script>
