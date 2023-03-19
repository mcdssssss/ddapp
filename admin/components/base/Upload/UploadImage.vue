<template>
  <div>
    <div
      class="upload"
      :style="{
        width: width + 'px',
        height: height + 'px',
        backgroundImage: `url(${imageCenterCrop(image, width, height, 100)})`
      }"
      @click="visible = true"
    >
      <div class="flex flex-center item-center">
        <i v-if="!image" class="iconfont icon-pic-add"></i>
      </div>
    </div>
    <a-modal
      :visible="visible"
      :destroy-on-close="true"
      :footer="null"
      :width="1230"
      @cancel="visible = false"
    >
      <Picture
        ref="pic"
        type="component"
        :limit="limit"
        @cancel="visible = false"
        @choose="choosePic"
      />
    </a-modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Picture from '@/pages/material/picture.vue';
import { imageCenterCrop } from '@/plugins/oss';
export default Vue.extend({
  model: {
    prop: 'image',
    event: 'change'
  },
  components: {
    Picture
  },
  props: {
    width: {
      type: [Number, Array],
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
      default: 1
    }
  },
  data() {
    return {
      visible: false
    };
  },
  watch: {
    visible(val: boolean) {
      if (!val) {
        (this.$refs.pic as any).checkedAllChange({ target: { checked: false } });
      }
    }
  },
  methods: {
    imageCenterCrop,
    choosePic(e: any[]) {
      const arr = [];
      for (const item of e) {
        arr.push(item.fileLink);
      }
      if (this.limit === 1) {
        this.$emit('change', arr[0]);
      } else {
        this.$emit('change', arr);
      }
      this.visible = false;
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
