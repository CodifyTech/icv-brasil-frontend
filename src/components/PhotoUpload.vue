<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface PhotoItem {
  id?: string | null
  file?: File
}

interface Props {
  modelValue?: PhotoItem[]
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
  label: 'Fotos',
  placeholder: 'Arraste fotos aqui ou clique para selecionar',
  multiple: true,
  accept: 'image/*',
  maxFiles: 10,
  maxFileSize: 5, // 5MB
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
      url: item.file,
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
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      emit('error', `Arquivo ${file.name} não é uma imagem válida`)

      return false
    }

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

    const reader = new FileReader()
    const currentIndex = previews.value.length

    loadingStates.value.push(true)

    reader.onload = e => {
      if (e.target?.result) {
        const newPhoto: PhotoItem = {
          id: null,
          file,
        }

        previews.value.push(newPhoto)
        emitChange()
        emit('upload', [file])
      }
      loadingStates.value[currentIndex] = false
    }

    reader.readAsDataURL(file)
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
          tabler-photo-plus
        </VIcon>

        <p class="dropzone-text">
          <strong>{{ placeholder }}</strong>
        </p>

        <p class="dropzone-info">
          Formatos: JPG, PNG, GIF • Máx: {{ maxFileSize }}MB • Máx: {{ maxFiles }} arquivos
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

    <!-- Grid de Fotos -->
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
        lg="3"
      >
        <VCard
          class="photo-card"
          :class="{ loading: loadingStates[index] }"
        >
          <!-- Imagem -->
          <div class="photo-wrapper">
            <VImg
              :src="photo.url"
              aspect-ratio="1"
              cover
              eager
              class="photo-image"
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
              <CDFButton
                v-if="!isDisabled"
                :disabled="removingStates[index]"
                color="error"
                size="24"
                icon-size="14"
                icon="tabler-x"
                rounded="xl"
                @click="removePhoto(index)"
              />
            </div>
          </div>

          <!-- Informações da Foto -->
          <VCardText class="pa-2">
            <div class="photo-info">
              <p class="photo-name text-truncate text-body-2">
                {{ photo.file?.name || `Foto ${index + 1}` }}
              </p>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

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
        Limpar Todas
      </VBtn>
    </div>
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
  block-size: 200px;
  inline-size: 100%;
}

.photo-actions {
  position: absolute;
  z-index: 10;
  inset-block-start: 8px;
  inset-inline-end: 8px;
}

.photo-info {
  .photo-name {
    color: var(--v-theme-on-surface);
    font-weight: 500;
    margin-block-end: 8px;
  }
}

.d-none {
  display: none;
}
</style>
