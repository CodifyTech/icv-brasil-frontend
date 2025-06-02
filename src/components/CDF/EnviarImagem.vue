<script setup lang="ts">
import { useFileDialog, useObjectUrl } from '@vueuse/core'
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: File | string | null
  placeholder?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | string | null): void
}>()

// Preview da imagem
const previewImage = ref<string | null>(null)

// FileDialog do vueuse
const { open, onChange, reset } = useFileDialog({ accept: 'image/*' })

// Atualiza preview quando modelValue muda
watch(
  () => props.modelValue,
  newValue => {
    if (newValue instanceof File)
      previewImage.value = useObjectUrl(newValue).value ?? null
    else
      previewImage.value = newValue as string | null
  },
  { immediate: true },
)

// Abre seletor de arquivos
function triggerFileUpload() {
  open()
}

// Quando arquivo é selecionado
onChange((files: FileList | File[] | null) => {
  const file = Array.isArray(files) ? files[0] : files?.[0]
  if (file)
    emit('update:modelValue', file)
})

// Remove imagem
function removeImage() {
  emit('update:modelValue', null)
  reset()
}
</script>

<template>
  <div class="enviar-imagem position-relative">
    <!-- Avatar Preview -->
    <CDFAvatar
      class="enviar-imagem-avatar"
      color="primary"
      variant="tonal"
      size="150"
      :foto="previewImage"
      :name="props.placeholder || 'Avatar'"
      @click="triggerFileUpload"
    />
    <div class="enviar-imagem-actions">
      <!-- Upload Button -->
      <CDFButton
        is-icon
        icon="tabler-cloud-upload"
        variant="text"
        class="enviar-imagem-btn"
        color="info"
        rounded="100%"
        size="30px"
        type="button"
        @click="triggerFileUpload"
      />
      <!-- Remove Button (shown only if an image is uploaded) -->
      <CDFButton
        v-if="previewImage"
        is-icon
        icon="tabler-trash"
        variant="text"
        class="enviar-imagem-btn"
        color="error"
        rounded="100%"
        size="30px"
        type="button"
        @click="removeImage"
      />
    </div>
  </div>
</template>

<style lang="scss">
.enviar-imagem {
  inline-size: fit-content;

  .enviar-imagem-avatar:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  .enviar-imagem-actions {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 2px;
    inset-block-end: 30px;
    inset-inline-end: -15px;
    transform: translate(50%, 50%);
  }
}
</style>
