<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import MarkdownItColor from 'markdown-it-color'
import MarkdownItIcons from 'markdown-it-icons-tabler/src/index'
import MarkdownItTaskLists from 'markdown-it-task-lists'

defineOptions({
  name: 'CDFText',
  inheritAttrs: false,
})

const props = defineProps<{
  text: string
}>()

const emit = defineEmits<{
  (e: 'update:text', value: string): void
}>()

const markdown = ref<HTMLElement>()
const text = toRef(props, 'text')

const md = new MarkdownIt()
  .use(MarkdownItColor, {
    defaultClassName: 'md-colorify',
    inline: false,
  })
  .use(MarkdownItIcons, 'tabler')
  .use(MarkdownItTaskLists, { enabled: true })

const getHtml = (text: string) => md.render(text)
</script>

<template>
  <!-- CDFText -->
  <div
    ref="markdown"
    class="markdown-text"
    v-bind="{
      ...$attrs,
    }"
    v-html="getHtml(text)"
  />
</template>

<style lang="scss">
.markdown-text{
  max-width: 100%;
  word-break: break-all;

  img{
    width: 100%;
    max-width: 100%;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  p:first-child{
    margin: 0px !important;
  }
}
</style>
