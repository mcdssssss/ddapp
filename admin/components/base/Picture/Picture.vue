<template>
  <div
    class="picture"
    :style="{ width: width + 'px', height: height + 'px', borderRadius: radius + 'px' }"
    @click="noclick ? null : (visible = true)"
  >
    <img
      v-if="src"
      :width="width"
      :height="height"
      :src="imageCenterCrop(src, width, height, quality)"
    />
    <div v-else>
      <i class="iconfont icon-pic fo-30 fo-9"></i>
    </div>
    <a-modal v-model="visible" :footer="null" :width="1000">
      <img :src="src" width="100%" />
    </a-modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { imageCenterCrop } from '@/plugins/oss';
export default Vue.extend({
  props: {
    noclick: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    src: {
      type: String,
      default: ''
    },
    quality: {
      type: Number,
      default: 90
    },
    radius: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    imageCenterCrop
  }
});
</script>
<style lang="less" scoped>
.picture {
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
</style>
