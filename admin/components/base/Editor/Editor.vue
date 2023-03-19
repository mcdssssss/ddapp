<template>
  <div class="f-editor" :style="{ width: width + 'px' }">
    <div id="editor"></div>
    <div class="upload-pic">
      <a-tooltip placement="bottom">
        <template slot="title">
          <span>上传图片</span>
        </template>
        <a-button shape="circle" icon="picture" @click="visible = true" />
      </a-tooltip>
    </div>
    <a-modal
      :visible="visible"
      :destroy-on-close="true"
      :footer="null"
      :width="1300"
      @cancel="visible = false"
    >
      <Picture type="component" :limit="9" @cancel="visible = false" @choose="choosePic" />
    </a-modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import FroalaEditor from 'froala-editor';
import Picture from '@/pages/material/picture.vue';
export default Vue.extend({
  components: {
    Picture
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      editor: null as any,
      visible: false
    };
  },

  mounted() {
    let _this = this;
    this.editor = new FroalaEditor(
      '#editor',
      {
        width: this.width,
        heightMin: 500,
        language: 'zh_cn',
        charCounterCount: false,
        toolbarButtons: {
          moreText: {
            buttons: [
              'fontSize',
              'textColor',
              'bold',
              'italic',
              'underline',
              'strikeThrough',
              'subscript',
              'superscript',
              'fontFamily',
              'backgroundColor',
              'inlineClass',
              'inlineStyle',
              'clearFormatting'
            ]
          },
          moreParagraph: {
            buttons: [
              'alignLeft',
              'alignCenter',
              'formatUL',
              'alignRight',
              'alignJustify',
              'formatOLSimple',
              'formatOL',
              'paragraphFormat',
              'paragraphStyle',
              'lineHeight',
              'outdent',
              'indent',
              'quote'
            ]
          },
          moreRich: {
            buttons: [
              'insertLink',
              // 'insertImage',
              // 'insertVideo',
              'insertTable',
              'emoticons',
              'fontAwesome',
              'specialCharacters',
              'embedly',
              'insertFile',
              'insertHR'
            ]
          },
          moreMisc: {
            buttons: [
              'undo',
              'redo',
              'fullscreen',
              'print',
              'getPDF',
              'spellChecker',
              'selectAll',
              'html',
              'help'
            ],
            align: 'right',
            buttonsVisible: 2
          }
        },
        linkAlwaysBlank: true,
        linkList: [
          {
            text: '百度',
            href: 'http://baidu.com',
            target: '_blank',
            rel: 'nofollow'
          },
          {
            text: 'Google',
            href: 'http://google.com',
            target: '_blank',
            rel: 'nofollow'
          }
        ],
        events: {
          'html.set'() {
            //   this.html.set("54646");
          },
          contentChanged() {
            _this.$emit('change', _this.editor.html.get());
          }
        }
      },
      () => {
        this.editor.html.set(this.value);
      }
    );
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    getContent() {
      return this.editor.html.get();
    },
    getImage() {
      return this.editor.image.get();
    },
    setContent(value: string) {
      this.editor.html.set(value);
    },
    choosePic(e: any[]) {
      for (const item of e) {
        this.editor.image.insert(item.fileLink);
      }
      this.visible = false;
    }
  }
});
</script>
<style lang="less" scoped>
.f-editor {
  position: relative;
  .upload-pic {
    position: absolute;
    right: -40px;
    top: 5px;
  }
}
</style>
