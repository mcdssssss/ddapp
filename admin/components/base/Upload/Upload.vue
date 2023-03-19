<template>
  <a-upload :show-upload-list="false" action="/" :accept="accept" :before-upload="beforeUpload">
    <div
      class="upload"
      :style="{
        width: width + 'px',
        height: height + 'px',
        backgroundImage: `url(${imageCenterCrop(image, width, height, 100)})`
      }"
    >
      <a-spin :spinning="loading">
        <div class="flex flex-center item-center">
          <i v-if="!image" class="iconfont icon-pic-add"></i>
        </div>
      </a-spin>
    </div>
    <div class="fo-9 fo-12 mt-8">上传格式:{{ accept }}</div>
    <div class="fo-9 fo-12">最大限制{{ limit }}MB</div>
  </a-upload>
</template>
<script lang="ts">
import Vue from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { putFile, imageCenterCrop } from '@/plugins/oss';
import { Enterprise } from '~/plugins/config';
export default Vue.extend({
  model: {
    prop: 'image',
    event: 'change'
  },
  props: {
    accept: {
      type: String,
      default: 'jpg,jpeg,png,webp'
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    image: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    imageCenterCrop,
    async beforeUpload(file: File) {
      if (file.size > this.limit * 1024 * 1024) {
        (this as any).$message.error(`图片不得大于${this.limit}MB`);
        return false;
      }
      const split = file.name.split('.');
      const suffix = split[split.length - 1];
      this.loading = true;
      const result = await putFile(Enterprise + uuidv4() + '.' + suffix, file);
      this.loading = false;
      if (result) {
        this.$emit('change', result);
      }
    }
  }
});
</script>
<style lang="less" scoped>
.upload {
  border-radius: 4px;
  border: 1px solid #e1e1e1;
  overflow: hidden;
  background-color: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border 0.2s linear;
  background-size: cover;
  background-position: center;
  &:hover {
    border: 1px solid #955ce6;
    .iconfont {
      color: #955ce6;
    }
  }
  .iconfont {
    color: #999999;
    font-size: 26px;
    transition: color 0.2s linear;
  }
}
</style>
