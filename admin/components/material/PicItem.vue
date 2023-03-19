<template>
  <div class="pic-item">
    <div class="pic-image">
      <img
        :src="imageCenterCrop(options.fileLink, 130, 130, 90)"
        @click.stop="isCheck = !isCheck"
      />
      <a-checkbox v-model="isCheck" class="pic-checkbox"></a-checkbox>
    </div>
    <div class="fo-12 fo-9 mt-4 ell text-center">{{ options.fileName }}</div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { imageCenterCrop } from '@/plugins/oss';
export default Vue.extend({
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          fileLink: ''
        } as any;
      }
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isCheck: {
      get(): boolean {
        return this.checked;
      },
      set(val: boolean) {
        this.$emit('checkChange', val);
      }
    }
  },
  methods: {
    imageCenterCrop
  }
});
</script>
<style lang="less" scoped>
.pic-item {
  width: 130px;
  margin-right: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  .pic-image {
    width: 130px;
    height: 130px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    img {
      transition: 0.1s linear transform;
    }
    &:hover {
      img {
        transform: scale(1.1, 1.1);
      }
    }

    .pic-checkbox {
      position: absolute;
      top: 4px;
      left: 6px;
    }
  }
}
</style>
