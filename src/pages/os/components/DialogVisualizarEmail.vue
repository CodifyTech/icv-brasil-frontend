<script setup lang="ts">
import type { IOrdemServico } from '../types'
import InmetroService from '@/pages/inmetro/services/InmetroService'

interface Props {
  isDialogVisible: boolean
  os?: IOrdemServico | null
}

interface Emits {
  (e: 'update:isDialogVisible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDialogVisible = computed({
  get: () => props.isDialogVisible,
  set: value => emit('update:isDialogVisible', value),
})

const emailContent = ref<string>('')
const emailSubject = ref<string>('')
const loading = ref<boolean>(false)

const carregarConteudoEmail = async () => {
  if (!props.os?.id)
    return

  loading.value = true
  try {
    const data = await InmetroService.fetch(`${props.os.id}/visualizar-email`)

    if (data?.content && data?.subject) {
      emailContent.value = data.content
      emailSubject.value = data.subject
    }
  }
  catch (error) {
    console.error('Erro ao carregar email:', error)
    emailContent.value = '<p>Erro ao carregar o conteúdo do email</p>'
  }
  finally {
    loading.value = false
  }
}

// Watcher para carregar o conteúdo quando o dialog abrir
watch(() => props.isDialogVisible, isVisible => {
  if (isVisible && props.os) {
    carregarConteudoEmail()
  }
  else if (!isVisible) {
    emailContent.value = ''
    emailSubject.value = ''
  }
})
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="800px"
    scrollable
  >
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span>Visualizar E-mail - OS Criada</span>
        <VBtn
          icon
          variant="text"
          @click="isDialogVisible = false"
        >
          <VIcon>tabler-x</VIcon>
        </VBtn>
      </VCardTitle>

      <VCardText class="pa-0">
        <div
          v-if="loading"
          class="d-flex justify-center align-center pa-8"
        >
          <VProgressCircular
            indeterminate
            color="primary"
          />
          <span class="ml-3">Carregando visualização do e-mail...</span>
        </div>
        <div
          v-else-if="emailContent"
          class="email-preview"
          v-html="emailContent"
        />
        <div
          v-else
          class="d-flex justify-center align-center pa-8"
        >
          <span>Nenhum conteúdo de e-mail disponível</span>
        </div>
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn
          color="secondary"
          variant="outlined"
          @click="isDialogVisible = false"
        >
          Fechar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.email-preview {
  overflow: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  max-block-size: 70vh;
}

.email-preview :deep(body) {
  padding: 0;
  margin: 0;
}
</style>
