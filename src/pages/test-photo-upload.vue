<script setup lang="ts">
import { ref } from 'vue'
import type { IOrdemServicoFoto } from '@/pages/inmetro/types'

// Estado local
const fotos = ref<IOrdemServicoFoto[]>([])

// Handlers
const handleUpload = (files: File[]) => {
  console.log('📸 Upload de fotos:', files)
}

const handleRemove = (item: IOrdemServicoFoto, index: number) => {
  console.log('🗑️ Foto removida:', item, 'índice:', index)
}

const handleError = (error: string) => {
  console.error('❌ Erro:', error)
}

const logFotos = () => {
  console.log('📸 Estado atual das fotos:', fotos.value)
  console.log('📸 Fotos com arquivo:', fotos.value.filter(f => f.file))
}
</script>

<template>
  <div class="pa-6">
    <VCard>
      <VCardTitle class="text-h4 mb-4">
        🧪 Teste do Componente PhotoUpload
      </VCardTitle>

      <VCardText>
        <p class="text-body-1 mb-4">
          Esta página demonstra o funcionamento do componente PhotoUpload com todas as suas funcionalidades.
        </p>

        <VRow>
          <VCol
            cols="12"
            md="12"
          >
            <PhotoUpload
              v-model="fotos"
              label="Fotos de Teste"
              placeholder="Arraste fotos aqui ou clique para selecionar"
              :max-files="50"
              :max-file-size="10"

              @upload="handleUpload"
              @remove="handleRemove"
              @error="handleError"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.text-h4 {
  color: var(--v-primary-base);
}

.text-h6 {
  color: var(--v-secondary-base);
}
</style>
