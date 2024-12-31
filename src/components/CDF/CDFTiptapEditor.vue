<script setup lang="ts">
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { StarterKit } from '@tiptap/starter-kit'
import { Heading } from '@tiptap/extension-heading'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { ListItem } from '@tiptap/extension-list-item'
import { Code } from '@tiptap/extension-code'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import type { IFileData } from '@/types/IFileData'
import { useValidationDialogStore } from '@/stores/useValidationDialogStore'
import ApiService from '@/services/ApiService'
import { TabExtension } from '@/extensions/TabExtension'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  driverS3?: string
  attachments?: IFileData[]
  disabledAttachment?: boolean
  disabledImage?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const {
  showValidationDialog,
} = useValidationDialogStore()

const editorRef = ref()

const addURL = ref({
  text: '',
  url: '',
})

const menuLink = ref<boolean>(false)
const attachments = toRef(props, 'attachments', [])
const isActiveAttachments = ref<boolean>(attachments.value.length > 0)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: props.placeholder ?? 'Write something here...',
    }),
    Heading,
    Image.configure({
      HTMLAttributes: {
        alt: 'image',
        class: 'img-fluid',
      },
    }),
    Link.configure({
      autolink: false,
      openOnClick: false,
    }),
    ListItem,
    Code,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    TabExtension,
  ],
  onUpdate() {
    if (!editor.value)
      return

    emit('update:modelValue', editor.value.getHTML())
  },
})

watch(() => props.modelValue, value => {
  const isSame = editor.value?.getHTML() === props.modelValue

  if (isSame)
    return

  editor.value?.commands.setContent(props.modelValue)
})

const headingMenu = [
  {
    title: 'Título 1',
    value: 1,
  },
  {
    title: 'Título 2',
    value: 2,
  },
  {
    title: 'Título 3',
    value: 3,
  },
  {
    title: 'Título 4',
    value: 4,
  },
  {
    title: 'Título 5',
    value: 5,
  },
  {
    title: 'Título 6',
    value: 6,
  },
]

const addImage = () => {
  // Criar um elemento input do tipo file
  const input = document.createElement('input')

  input.type = 'file'

  // Escutar o evento de mudança do input
  input.addEventListener('change', async event => {
    const file = event?.target?.files[0]

    const imageURL = await new ApiService({ endpoint: '/anexos/adicionar' })
      .createFormData({
        arquivo: file,
        driver: props.driverS3,
      })
      .then(res => res)
      .catch(reason => console.log(reason.response))

    editor.value?.commands.setImage({ src: imageURL })
  })

  // Abrir o seletor de arquivos
  input.click()
}

const validateLink = (href: string) => {
  const test = /^https?:\/\//.test(href)

  if (!href)
    showValidationDialog('Você precisa informar um link', '')

  if (!test)
    showValidationDialog('O link informado é inválido', '')

  return test
}

const visualizarLink = (href: string) => {
  if (validateLink(href))
    window.open(addURL.value.url, '_blank')
}

const getLink = () => {
  const { from, to } = editor.value?.state.selection
  let linkText = ''
  let linkUrl = ''

  editor.value?.state.doc.nodesBetween(from, to, node => {
    if (node.marks.some(mark => mark.type.name === 'link')) {
      const linkMark = node.marks.find(mark => mark.type.name === 'link')
      if (linkMark) {
        linkUrl = linkMark.attrs.href
        linkText = node.textContent
      }
    }
  })

  addURL.value = {
    url: linkUrl,
    text: linkText,
  }
}

const setLink = () => {
  // cancelled
  if (addURL.value.url === null)
    return

  validateLink(addURL.value.url)

  // empty
  if (addURL.value.url === '') {
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run()

    return
  }

  // update link
  editor.value
    ?.chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: addURL.value.url })
    .run()

  editor.value?.commands.insertContent(addURL.value.text)
}

const addAttachment = () => {
  isActiveAttachments.value = isActiveAttachments.value = !isActiveAttachments.value
}

watch(() => menuLink, value => {
  if (value)
    getLink()
})
</script>

<template>
  <div class="border rounded">
    <div
      v-if="editor"
      class="d-flex gap-2 pa-2 flex-wrap align-center"
    >
      <VMenu>
        <template #activator="{ props }">
          <div v-bind="props">
            <VIcon
              class="font-weight-medium"
              icon="tabler-heading"
              size="20"
            />
            <VIcon
              icon="tabler-caret-down"
              size="10"
            />
          </div>
        </template>
        <VList>
          <VListItem
            v-for="(item, index) in headingMenu"
            :key="index"
            :value="index"
            :active="editor.isActive('heading', { level: item.value })"
            @click="() => editor?.chain().focus().toggleHeading({ level: item.value }).run()"
          >
            <VListItemTitle>
              {{ item.title }}
            </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>

      <VIcon
        class="font-weight-medium"
        icon="tabler-bold"
        :color="editor.isActive('bold') ? 'primary' : 'default'"
        size="20"
        @click="editor.chain().focus().toggleBold().run()"
      />

      <VIcon
        :color="editor.isActive('italic') ? 'primary' : 'default'"
        icon="tabler-italic"
        size="20"
        @click="editor.chain().focus().toggleItalic().run()"
      />

      <VIcon
        :color="editor.isActive('code') ? 'primary' : 'default'"
        icon="tabler-code"
        size="20"
        @click="editor.chain().focus().toggleCode().run()"
      />

      <VIcon
        :color="editor.isActive('bulletList') ? 'primary' : 'default'"
        icon="tabler-list"
        size="20"
        @click="editor.chain().focus().toggleBulletList().run()"
      />

      <VIcon
        :color="editor.isActive('taskList') ? 'primary' : 'default'"
        icon="tabler-list-check"
        size="20"
        @click="editor.chain().focus().toggleTaskList().run()"
      />

      <VDivider vertical />

      <VDialog
        v-model="menuLink"
        max-width="400"
        location="right"
      >
        <template #activator>
          <VIcon
            class="font-weight-medium"
            icon="tabler-link"
            size="20"
            :color="editor.isActive('link') ? 'primary' : 'default'"
            @click="() => {
              getLink()
              menuLink = true
            }"
          />
        </template>
        <template #default="{ isActive }">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <div class="text-h5 text-medium-emphasis ps-2">
                Adicionar Link
              </div>

              <VBtn
                icon="tabler-x"
                variant="text"
                @click="isActive.value = false"
              />
            </VCardTitle>
            <VDivider class="mb-4" />
            <VForm>
              <VCardText class="d-flex flex-column gap-2">
                <AppTextField
                  v-model="addURL.text"
                  placeholder="Adicionar texto"
                />

                <AppTextField
                  v-model="addURL.url"
                  type="url"
                  placeholder="Adicionar URL"
                />

                <VBtn
                  v-if="addURL.url"
                  class="text-none font-weight-bold"
                  color="primary"
                  :text="`Visualizar: ${addURL.text}`"
                  rel="noopener noreferrer"
                  variant="text"
                  @click="() => {
                    visualizarLink(addURL.url)
                  }"
                />
              </VCardText>

              <VDivider class="mt-2" />

              <VCardActions class="my-2 d-flex justify-end">
                <VBtn
                  class="text-none"
                  rounded="xl"
                  text="Cancelar"
                  @click="() => {
                    addURL = {
                      text: '',
                      url: '',
                    }
                    isActive.value = false
                  }"
                />

                <VBtn
                  class="text-none"
                  color="primary"
                  rounded="xl"
                  text="Adicionar"
                  variant="flat"
                  @click="() => {
                    setLink()
                    isActive.value = false
                  }"
                />
              </VCardActions>
            </VForm>
          </VCard>
        </template>
      </VDialog>

      <VIcon
        v-if="!disabledImage"
        :color="editor.isActive('image') ? 'primary' : 'default'"
        icon="tabler-photo"
        size="20"
        @click="() => addImage()"
      />

      <VIcon
        v-if="!disabledAttachment"
        :color="isActiveAttachments ? 'primary' : 'default'"
        icon="tabler-paperclip"
        size="20"
        @click="() => addAttachment()"
      />
    </div>

    <EditorContent
      ref="editorRef"
      :editor="editor"
    />

    <CDFDropZone
      v-if="isActiveAttachments"
      v-model:model-value="attachments"
      :driver-s3="driverS3"
      class="border-t"
    />
  </div>
</template>

<style lang="scss">
.img-fluid{
  max-width: 100%;
  height: auto;
}

.ProseMirror {
  padding: 0.5rem;
  min-block-size: 15vh;

  ul{
    margin-left: 20px;
  }

  p {
    margin-block-end: 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    p {
      margin: 0;
    }

    li {
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }

      ul li,
      ol li {
        display: list-item;
      }

      ul[data-type="taskList"] > li {
        display: flex;
      }
    }
  }

  p.is-editor-empty:first-child::before {
    block-size: 0;
    color: #adb5bd;
    content: attr(data-placeholder);
    float: inline-start;
    pointer-events: none;
  }
}
</style>
