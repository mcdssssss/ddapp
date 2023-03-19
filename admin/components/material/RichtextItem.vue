<template>
  <div class="richtext-item">
    <div class="pic-image">
      <img
        :src="imageCenterCrop(options.richImage, 200, 160, 90)"
        @click.stop="
          type === 'page'
            ? $router.push({
                path: '/material/richtext/edit/update',
                query: { richNo: options.richNo }
              })
            : (isCheck = !isCheck)
        "
      />
      <a-checkbox v-model="isCheck" class="pic-checkbox"></a-checkbox>
    </div>
    <div class="richtext-title ell-2 bold">
      {{ options.richTitle }}
    </div>
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
          richNo: '',
          richImage: '',
          richTitle: ''
        } as any;
      }
    },
    checked: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'page' // component
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
.richtext-item {
  width: 200px;
  margin-right: 12px;
  margin-bottom: 12px;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  .pic-image {
    width: 200px;
    height: 160px;
    border-radius: 4px 4px 0 0;
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
  .richtext-title {
    padding: 10px;
    line-height: 16px;
    font-size: 12px;
    height: 52px;
  }
}
</style>
