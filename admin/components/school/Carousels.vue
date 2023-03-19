<template>
  <div class="carousel">
    <div class="flex flex-between item-center" style="width: 600px">
      <a-button type="primary" size="large" @click="banners.push({ image: '', path: '' })"
        >添加Banner图</a-button
      >
      <a target="_blank" href="/school/page">查看跳转页面路径</a>
    </div>
    <div class="mt-12 fo-9">
      <div>注意:跳转路径可带参数，写法 “/pages/index/index?userNo=uio890ffd”</div>
    </div>
    <div style="width: 600px">
      <CEmpty v-if="banners.length === 0">还没有添加banner图</CEmpty>
      <draggable v-model="banners" class="mt-20" :animation="200" draggable=".carousel-item">
        <div
          v-for="(item, index) in banners"
          :key="index"
          class="carousel-item flex flex-between item-center"
        >
          <div>
            <UploadImage v-model="item.image" :height="202" :width="500"></UploadImage>
            <div class="mt-12 flex flex-start item-center">
              <a-input v-model="item.path" placeholder="输入跳转路径" />
            </div>
          </div>
          <div class="ml-20">
            <a-button icon="drag"></a-button>
            <a-button
              class="mt-20"
              type="danger"
              icon="delete"
              @click="banners.splice(index, 1)"
            ></a-button>
          </div>
        </div>
      </draggable>
      <a-button
        class="mt-40"
        type="primary"
        :disabled="banners.length === 0"
        size="large"
        block
        :loading="loading"
        @click="submit"
        >提交保存</a-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
export default Vue.extend({
  components: {
    draggable
  },
  data() {
    return {
      banners: [] as { image: string; path: string }[],
      loading: false
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      const result = await (this as any).$api.schoolCarouselGet({
        schoolNo: this.$route.query.schoolNo
      });
      if (result.code === 200 && result.data) {
        this.banners = result.data;
      }
    },
    async submit() {
      const arr = [] as { image: string; path: string }[];
      for (const item of this.banners) {
        if (item.image) {
          arr.push(item);
        }
      }
      if (arr.length === 0) {
        (this as any).$message.error('请上传图片');
        return;
      }
      this.loading = true;
      const result = await (this as any).$api.schoolCarouselUpsert({
        schoolNo: this.$route.query.schoolNo,
        banners: arr
      });
      this.loading = false;
      if (result.code === 200) {
        (this as any).$message.success(result.msg);
      }
    }
  }
});
</script>
<style lang="less" scoped>
.carousel-item {
  padding: 20px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin-bottom: 12px;
}
</style>