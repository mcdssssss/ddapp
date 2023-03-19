<template>
  <div class="home-container">
    <div class="home-page-title">用户列表</div>
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
      <template slot="avatarUrl" slot-scope="text">
        <a-avatar size="large" icon="user" :src="text.avatarUrl" />
      </template>

      <template slot="mobileNumber" slot-scope="text">
        <div>{{ text.mobileNumber }}</div>
      </template>

      <template slot="address" slot-scope="text">
        <div>{{ text.province || '----' }} {{ text.city }}</div>
      </template>

      <template slot="status" slot-scope="text">
        <a-tag v-if="text.status" color="green"> 启用 </a-tag>
        <a-tag v-else color="red"> 禁用 </a-tag>
      </template>
      <template slot="createTime" slot-scope="text">
        <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
        <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
      </template>
      <template slot="action" slot-scope="text">
        <Action
          :options="[
            { label: '启用', disabled: text.status === 1, key: 'status', value: 1 },
            { label: '禁用', disabled: text.status === 0, key: 'status', value: 0 }
          ]"
          @click-item="actionClick($event, text)"
        />
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
  components: {},
  data() {
    return {
      /* ---- 必要参数 start ---- */
      query: {
        current: 1,
        pageSize: 20
      },
      searchOptions: [
        { key: 'userNo', type: 'text', label: '用户编号' },
        { key: 'nickName', type: 'text', label: '昵称', like: true },
        { key: 'mobileNumber', type: 'text', label: '手机号', like: true },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '状态：全部', value: '' },
            { label: '状态：启用', value: 1 },
            { label: '状态：禁用', value: 0 }
          ],
          optionsValue: ''
        }
      ],
      columns: [
        {
          title: '编号',
          key: 'userNo',
          dataIndex: 'userNo'
        },
        { title: '头像', key: 'avatarUrl', scopedSlots: { customRender: 'avatarUrl' } },
        { title: '昵称', key: 'nickName', dataIndex: 'nickName' },
        { title: '手机号', key: 'mobileNumber', scopedSlots: { customRender: 'mobileNumber' } },
        { title: '地区', key: 'address', scopedSlots: { customRender: 'address' } },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'userNo',
      api: 'userList'
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'status':
          this.updateStatus(text.userNo, obj.value);
          break;
      }
    },
    // 修改状态
    async updateStatus(userNo: string, value: any) {
      const res = await (this as any).$api.userStatus({
        userNo,
        status: value
      });
      if (res.code === 200) {
        (this as any).$message.success('修改状态成功');
        this.getTableData();
      }
    }
  }
});
</script>
