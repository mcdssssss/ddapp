<template>
  <div class="home-container">
    <div class="home-page-title">接单员列表</div>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <!-- <a-button type="primary" size="large" @click="$router.push('/school/taker/edit/add')"
          >添加接单员</a-button
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
      <template slot="realName" slot-scope="text">
        <div>姓名: {{ text.realName }}</div>
        <div>学号: {{ text.idCard }}</div>
        <div>用户: <user-link :no="text.userNo" /></div>
        <div>手机: {{ text.mobileNumber }}</div>
      </template>

      <template slot="cert" slot-scope="text">
        <c-picture
          v-if="text.cardImages.studentCard"
          :src="text.cardImages.studentCard"
          :height="100"
          :width="100"
        ></c-picture>
      </template>

      <template slot="status" slot-scope="text">
        <a-tag v-if="text.status === 1" color="green"> 已通过 </a-tag>
        <a-tag v-else-if="text.status === 0" color="orange"> 待审核 </a-tag>
        <a-tag v-else color="red"> 未通过 </a-tag>
        <div v-if="text.status === -1" class="mt-8 fo-12">理由：{{ text.refuseMsg }}</div>
      </template>
      <template slot="createTime" slot-scope="text">
        <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
        <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
      </template>
      <template slot="action" slot-scope="text">
        <Action
          :options="[
            { label: '通过', disabled: text.status === 1, key: 'pass' },
            { label: '拒绝', disabled: text.status === -1, key: 'refuse' }
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
    <RefuseModal v-model="visibile" :no="tmpNo" @success="getTableData()" />
  </div>
</template>
<script lang="ts">
import TableDataMixins from '@/plugins/mixins/table-data-mixin.vue';
import RefuseModal from '@/components/taker/Refuse.vue';
export default TableDataMixins.extend({
  components: {
    RefuseModal
  },
  data() {
    return {
      /* ---- 必要参数 start ---- */
      query: {
        current: 1,
        pageSize: 20
      },
      searchOptions: [
        { key: 'userNo', type: 'text', label: '用户编号' },
        { key: 'takerNo', type: 'text', label: '接单员编号' },
        { key: 'realName', type: 'text', label: '姓名' },
        { key: 'idCard', type: 'text', label: '学号' },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '状态：全部', value: '' },
            { label: '状态：已通过', value: 1 },
            { label: '状态：待审核', value: 0 },
            { label: '状态：未通过', value: -1 }
          ],
          optionsValue: ''
        }
      ],
      columns: [
        {
          title: '编号',
          key: 'takerNo',
          dataIndex: 'takerNo'
        },
        { title: '姓名', key: 'realName', scopedSlots: { customRender: 'realName' } },
        { title: '证件', key: 'cert', scopedSlots: { customRender: 'cert' } },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'takerNo',
      api: 'takerList',

      tmpNo: '',
      visibile: false
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'pass':
          this.pass(text.takerNo);
          break;
        case 'refuse':
          this.tmpNo = text.takerNo;
          this.visibile = true;
          break;
      }
    },
    // 修改状态
    pass(takerNo: string) {
      (this as any).$confirm({
        title: '提示',
        content: '您确定已仔细核对过信息了吗?',
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          const res = await (this as any).$api.takerPass({
            takerNo
          });
          if (res.code === 200) {
            (this as any).$message.success('审核已通过');
            this.getTableData();
          }
        }
      });
    }
  }
});
</script>
