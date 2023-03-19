<template>
  <div class="home-container">
    <a-page-header
      title="添加订单消息模板"
      sub-title="你可以在同一个公共模板下，使用不同的关键词。提交后，关键词的内容和顺序将无法修改。"
      @back="() => $router.go(-1)"
    >
    </a-page-header>
    <div class="flex flex-start mt-20 flex-wrap">
      <SubscribeTmp :arr="chooses" />
      <div class="subscribe-form">
        <!-- 关键词 -->
        <div class="flex flex-start">
          <div class="subscribe-form-title fo-3">关键词</div>
          <div class="subscribe-form-content">
            <a-input-search v-model="searchKey" placeholder="搜索关键字" @search="onSearch" />
            <ScrollBar class="mt-8" max-height="170px">
              <a-spin :spinning="loading">
                <div style="min-height: 170px">
                  <div
                    v-for="(item, index) in keywords"
                    v-show="!searchKey || item.name.includes(searchKey)"
                    :key="index"
                    class="check-item"
                    @click="itemChecked(index)"
                  >
                    <a-checkbox :checked="item.checked" @change.stop="itemChecked(index)">
                      {{ item.name }}
                    </a-checkbox>
                  </div>
                </div>
              </a-spin>
            </ScrollBar>
          </div>
        </div>
        <!-- 已选择 -->
        <div class="flex flex-start mt-20 item-start">
          <div class="subscribe-form-title fo-3">已选择({{ chooses.length }}/5)</div>
          <div class="subscribe-form-content2">
            <div v-if="chooses.length === 0" class="fo-9 mt-8">请先从上方选择关键词</div>
            <draggable v-model="chooses" :animation="200" draggable=".move-item">
              <div
                v-for="(item, index) in chooses"
                :key="item.tid"
                class="move-item flex flex-between item-center"
              >
                <a-checkbox :checked="item.checked" @change.stop="itemClickChecked(index)">
                  {{ item.name }}
                </a-checkbox>
                <div class="iconfont icon-menu fo-9"></div>
              </div>
            </draggable>
          </div>
        </div>
        <!-- 场景说明 -->
        <div class="flex flex-start mt-20">
          <div class="subscribe-form-title fo-3">场景说明</div>
          <a-input v-model="sceneDesc" placeholder="说明订阅消息服务场景"></a-input>
        </div>
      </div>
    </div>
    <div class="text-center" style="max-width: 936px">
      <a-divider />
      <a-button
        style="width: 200px"
        size="large"
        type="primary"
        :loading="loadingBtn"
        @click="submit"
        >提交</a-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import ScrollBar from 'vue-scrollbar-live';
import draggable from 'vuedraggable';
import SubscribeTmp from '@/components/config/SubscribeTmp.vue';
export default Vue.extend({
  components: {
    SubscribeTmp,
    ScrollBar,
    draggable
  },
  layout: 'global',
  data() {
    return {
      keywords: [] as any[],
      chooses: [] as any[],
      searchKey: '',
      loading: false,
      sceneDesc: '',
      loadingBtn: false
    };
  },
  mounted() {
    this.getKeywords();
  },
  methods: {
    async getKeywords() {
      this.loading = true;
      const res = await (this as any).$api.wxSubscribeKeyword({
        tid: this.$route.query.tid
      });
      this.loading = false;
      if (res.code === 200) {
        for (const item of res.data) {
          item.checked = false;
        }
        this.keywords = res.data;
      }
    },
    itemChecked(index: number) {
      this.keywords[index].checked = !this.keywords[index].checked;
      if (this.keywords[index].checked) {
        if (this.chooses.length < 5) {
          this.chooses.push(this.keywords[index]);
        } else {
          this.keywords[index].checked = !this.keywords[index].checked;
        }
      } else {
        for (let i = 0; i < this.chooses.length; i++) {
          if (this.chooses[i].kid === this.keywords[index].kid) {
            this.chooses.splice(i, 1);
            break;
          }
        }
      }
    },
    itemClickChecked(index: number) {
      const kid = this.chooses[index].kid;
      for (let i = 0; i < this.keywords.length; i++) {
        if (this.keywords[i].kid === kid) {
          this.itemChecked(i);
        }
      }
    },
    async submit() {
      if (this.chooses.length === 0) {
        (this as any).$message.error('请选择至少一个关键词');
        return;
      }
      const arr = [];
      for (const item of this.chooses) {
        arr.push(item.kid);
      }
      this.loadingBtn = true;
      const res = await (this as any).$api.wxSubscribeAdd({
        tid: this.$route.query.tid,
        kidList: arr,
        sceneDesc: this.sceneDesc
      });
      this.loadingBtn = false;
      if (res.code === 200) {
        (this as any).$message.success('添加成功');
        this.$router.go(-1);
      }
    }
  }
});
</script>
<style lang="less" scoped>
.subscribe-form {
  width: calc(100% - 20px - 318px);
  max-width: 600px;
  border-radius: 4px;
  padding: 20px;
  background-color: #f5f7f8;
  margin-left: 20px;
  .subscribe-form-title {
    width: 92px;
    padding: 10px 0;
  }
  .subscribe-form-content {
    width: calc(100% - 92px);
    border-radius: 4px;
    background-color: #ffffff;
    padding: 20px;
    .check-item {
      padding: 12px 8px;
      cursor: pointer;
      &:hover {
        background-color: #f5f7f8;
      }
    }
  }
  .subscribe-form-content2 {
    width: calc(100% - 92px);
    .move-item {
      border-radius: 4px;
      padding: 12px;
      background-color: #ffffff;
      margin-bottom: 8px;
      cursor: move;
    }
  }
}
</style>
