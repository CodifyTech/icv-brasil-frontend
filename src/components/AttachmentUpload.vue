<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface AnexoItem {
  id?: string | null
  file?: File
  url?: string
  type?: string
  size?: number
  name?: string
}

interface Props {
  modelValue?: AnexoItem[]
  label?: string
  placeholder?: string
  multiple?: boolean
  accept?: string
  maxFiles?: number
  maxFileSize?: number // em MB
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  label: 'Anexos',
  placeholder: 'Arraste arquivos aqui ou clique para selecionar',
  multiple: true,
  accept: '*/*',
  maxFiles: 10,
  maxFileSize: 10, // 10MB
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: PhotoItem[]]
  'upload': [files: File[]]
  'remove': [item: PhotoItem, index: number]
  'error': [error: string]
}>()

// Estado local
const previews = ref<PhotoItem[]>([])
const loadingStates = ref<boolean[]>([])
const removingStates = ref<boolean[]>([])
const dragActive = ref(false)
const fileInput = ref<HTMLInputElement>()

// Computed
const hasPhotos = computed(() => previews.value.length > 0)
const canAddMore = computed(() => previews.value.length < props.maxFiles)
const isDisabled = computed(() => props.disabled || props.loading)

// Função para determinar o tipo de arquivo
const getFileType = (file: File): string => {
  const type = file?.type?.toLowerCase() || 'file'

  if (type.startsWith('image/'))
    return 'image'
  if (type.includes('pdf'))
    return 'pdf'
  if (type.includes('word') || type.includes('document'))
    return 'document'
  if (type.includes('sheet') || type.includes('excel'))
    return 'spreadsheet'
  if (type.includes('text'))
    return 'text'
  if (type.includes('video'))
    return 'video'
  if (type.includes('audio'))
    return 'audio'
  if (type.includes('zip') || type.includes('rar') || type.includes('compressed'))
    return 'archive'

  return 'file'
}

// Função para obter o ícone baseado no tipo de arquivo
const getFileIcon = (fileType: string): string => {
  const icons = {
    image: 'tabler-photo',
    pdf: 'tabler-file-type-pdf',
    document: 'tabler-file-type-doc',
    spreadsheet: 'tabler-file-type-xls',
    text: 'tabler-file-text',
    video: 'tabler-video',
    audio: 'tabler-music',
    archive: 'tabler-file-zip',
    file: 'tabler-file',
  }

  return icons[fileType] || 'tabler-file'
}

// Função para formatar o tamanho do arquivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0)
    return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// Watch para sincronizar com v-model
watch(
  () => props.modelValue,
  newValue => {
    if (!newValue || !newValue.length) {
      previews.value = []
      loadingStates.value = []
      removingStates.value = []

      return
    }

    previews.value = newValue.map(item => ({
      id: item.id,
      file: item.file,
      url: isObject(item.file) ? item.url : item.file,
      type: item.file && isObject(item.file) ? getFileType(item.file) : item.type,
      size: item.file && isObject(item.file) ? item.file?.size : item.size,
      name: item.file?.name || item.name,
    }))
    loadingStates.value = Array(previews.value.length).fill(false)
    removingStates.value = Array(previews.value.length).fill(false)
  },
  { immediate: true },
)

// Emitir mudanças
const emitChange = () => {
  emit('update:modelValue', [...previews.value])
}

// Função principal para processar arquivos
const handleFiles = (files: File[]) => {
  if (!canAddMore.value) {
    emit('error', `Máximo de ${props.maxFiles} arquivos permitidos`)

    return
  }

  const validFiles = files.filter(file => {
    // Validar tamanho
    if (file.size > props.maxFileSize * 1024 * 1024) {
      emit('error', `Arquivo ${file.name} excede o tamanho máximo de ${props.maxFileSize}MB`)

      return false
    }

    return true
  })

  validFiles.forEach(file => {
    if (!canAddMore.value)
      return

    const fileType = getFileType(file)
    const currentIndex = previews.value.length

    loadingStates.value.push(true)

    // Para imagens, criar preview
    if (fileType === 'image') {
      const reader = new FileReader()

      reader.onload = e => {
        if (e.target?.result) {
          const newPhoto: PhotoItem = {
            id: null,
            file,
            url: e.target.result as string,
            type: fileType,
            size: file.size,
            name: file.name,
          }

          previews.value.push(newPhoto)
          emitChange()
          emit('upload', [file])
        }
        loadingStates.value[currentIndex] = false
      }
      reader.readAsDataURL(file)
    }
    else {
      // Para outros tipos de arquivo, não criar preview de imagem
      const newPhoto: PhotoItem = {
        id: null,
        file,
        type: fileType,
        size: file.size,
        name: file.name,
      }

      previews.value.push(newPhoto)
      emitChange()
      emit('upload', [file])
      loadingStates.value[currentIndex] = false
    }
  })
}

// Handlers de arquivo
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files)
    return

  handleFiles(Array.from(input.files))
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragActive.value = false

  if (e.dataTransfer?.files)
    handleFiles(Array.from(e.dataTransfer.files))
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  dragActive.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  dragActive.value = false
}

// Remover foto
const removePhoto = (index: number) => {
  const item = previews.value[index]

  removingStates.value[index] = true

  // Simular delay de remoção
  setTimeout(() => {
    previews.value.splice(index, 1)
    loadingStates.value.splice(index, 1)
    removingStates.value.splice(index, 1)
    emitChange()
    emit('remove', item, index)
  }, 300)
}

// Limpar todas as fotos
const clearAll = () => {
  previews.value = []
  loadingStates.value = []
  removingStates.value = []
  emitChange()
}

const openAttachment = (photo: PhotoItem) => {
  window.open(photo.file, '_blank')
}
</script>

<template>
  <div class="photo-upload">
    <!-- Dropzone -->
    <div
      class="dropzone"
      :class="{
        'drag-active': dragActive,
        'disabled': isDisabled,
        'has-photos': hasPhotos,
      }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div class="dropzone-content">
        <VIcon
          size="48"
          color="primary"
          class="mb-2"
        >
          tabler-paperclip
        </VIcon>

        <p class="dropzone-text">
          <strong>{{ placeholder }}</strong>
        </p>

        <p class="dropzone-info">
          Todos os tipos de arquivo • Máx: {{ maxFileSize }}MB • Máx: {{ maxFiles }} arquivos
        </p>

        <VBtn
          v-if="canAddMore && !isDisabled"
          variant="outlined"
          color="primary"
          class="mt-2"
          @click="() => fileInput?.click()"
        >
          Selecionar Arquivos
        </VBtn>
      </div>

      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        class="d-none"
        @change="handleFileChange"
      >
    </div>

    <!-- Ações -->
    <div
      v-if="hasPhotos"
      class="d-flex justify-end mt-3"
    >
      <VBtn
        v-if="!isDisabled"
        variant="outlined"
        color="error"
        size="small"
        @click="clearAll"
      >
        Limpar
      </VBtn>
    </div>

    <!-- Grid de Arquivos -->
    <VRow
      v-if="hasPhotos"
      class="mt-4 mx-0"
      dense
    >
      <VCol
        v-for="(photo, index) in previews"
        :key="`photo-${index}`"
        cols="12"
        sm="6"
        md="4"
        lg="2"
      >
        <VCard
          class="photo-card"
          :class="{ loading: loadingStates[index] }"
        >
          <!-- Visualização do Arquivo -->
          <div class="photo-wrapper">
            <!-- Para imagens -->
            <VImg
              v-if="photo.type === 'image' && photo?.url"
              :src="photo?.url"
              aspect-ratio="1"
              cover
              eager
              class="photo-image"
              @click="() => openAttachment(photo)"
            >
              <template #placeholder>
                <VRow
                  align="center"
                  class="fill-height ma-0"
                  justify="center"
                >
                  <VProgressCircular
                    v-if="loadingStates[index]"
                    color="primary"
                    indeterminate
                  />
                  <VIcon
                    v-else
                    size="48"
                    color="grey-lighten-1"
                  >
                    tabler-photo
                  </VIcon>
                </VRow>
              </template>
            </VImg>

            <!-- Para outros tipos de arquivo -->
            <div
              v-else
              class="file-preview"
              @click="() => openAttachment(photo)"
            >
              <VIcon
                :icon="getFileIcon(photo.type || 'file')"
                size="64"
                :color="photo?.type === 'pdf' ? 'error' : photo?.type === 'document' ? 'info' : photo?.type === 'spreadsheet' ? 'success' : 'primary'"
              />
              <div class="file-extension">
                {{ photo?.name?.split('.').pop()?.toUpperCase() || 'file' }}
              </div>
            </div>

            <!-- Overlay de Loading/Removendo -->
            <VOverlay
              :model-value="loadingStates[index] || removingStates[index]"
              class="align-center justify-center"
              contained
            >
              <VProgressCircular
                :color="removingStates[index] ? 'error' : 'primary'"
                size="30"
                indeterminate
              />
            </VOverlay>

            <!-- Botões de Ação -->
            <div class="photo-actions">
              <IconBtn
                v-if="!isDisabled"
                :disabled="removingStates[index]"
                size="20"
                class="bg-error"
                @click="removePhoto(index)"
              >
                <VIcon size="14">
                  tabler-x
                </VIcon>
              </IconBtn>
            </div>
          </div>

          <!-- Informações do Arquivo -->
          <VCardText class="pa-2">
            <div class="file-info">
              <p class="file-name text-truncate text-body-2 font-weight-medium">
                {{ photo?.name || `Arquivo ${index + 1}` }}
              </p>
              <p class="file-size text-caption text-medium-emphasis">
                {{ photo?.size ? formatFileSize(photo.size) : '' }}
              </p>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped lang="scss">
.photo-upload {
  inline-size: 100%;
}

.dropzone {
  position: relative;
  border: 2px dashed var(--v-theme-border-color);
  border-radius: 12px;
  background-color: var(--v-theme-surface-variant);
  cursor: pointer;
  padding-block: 40px;
  padding-inline: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover:not(.disabled) {
    border-color: var(--v-theme-primary);
    background-color: rgba(var(--v-theme-primary), 0.04);
  }

  &.drag-active {
    border-color: var(--v-theme-primary);
    background-color: rgba(var(--v-theme-primary), 0.08);
    transform: scale(1.02);
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &.has-photos {
    border: 1px solid var(--v-theme-primary);
    background-color: rgba(var(--v-theme-primary), 0.04);
  }
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropzone-text {
  color: var(--v-theme-on-surface);
  font-weight: 500;
  margin-block: 8px;
  margin-inline: 0;
}

.dropzone-info {
  color: var(--v-theme-on-surface-variant);
  font-size: 0.875rem;
  margin-block: 4px;
  margin-inline: 0;
}

.photo-card {
  block-size: 100%;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 15%);
    transform: translateY(-2px);
  }

  &.loading {
    opacity: 0.7;
  }
}

.photo-wrapper {
  position: relative;
  overflow: hidden;
}

.photo-image {
  block-size: 150px;
  cursor: pointer;
  inline-size: 100%;
}

.file-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px 8px 0 0;
  background-color: var(--v-theme-surface-variant);
  block-size: 150px;
  cursor: pointer;
  inline-size: 100%;

  .file-extension {
    color: var(--v-theme-on-surface-variant);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-block-start: 8px;
    text-transform: uppercase;
  }
}

.photo-actions {
  position: absolute;
  z-index: 10;
  inset-block-start: 8px;
  inset-inline-end: 8px;
}

.file-info {
  .file-name {
    color: var(--v-theme-on-surface);
    margin-block-end: 4px;
  }

  .file-size {
    margin: 0;
  }
}

.d-none {
  display: none;
}
</style>
