<script setup lang="ts">
import { getOSStatusColor, getOSStatusLabel } from '@/enums/OSStatusEnum'
import type { IOrdemServico } from '@/pages/inmetro/types/index'

const props = defineProps<{
  isDialogVisible: boolean
  os: IOrdemServico | null
}>()

const emit = defineEmits<{
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:os', value: IOrdemServico | null): void
  (e: 'confirm', dados: { os: IOrdemServico | null; dadosReprovacao: any }): void
}>()

// Computed que funciona como v-model
const isDialogVisible = computed({
  get: () => props.isDialogVisible,
  set: (value: boolean) => emit('update:isDialogVisible', value),
})

// Dados do formulário de reprovação
const dadosReprovacao = ref({
  motivo_reprovacao: '',
  observacoes: '',
  data_reprovacao: new Date().toISOString().split('T')[0],
})

// Regras de validação
const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
  minLength: (value: string) => value.length >= 10 || 'Mínimo de 10 caracteres',
}

// Watch para resetar os campos quando a OS mudar
watch(() => props.os, (newOs: IOrdemServico | null) => {
  console.log('🟠 DialogReprovarOS - Watch disparado. OS recebida:', newOs)
  if (newOs) {
    dadosReprovacao.value = {
      motivo_reprovacao: '',
      observacoes: '',
      data_reprovacao: new Date().toISOString().split('T')[0],
    }
    console.log('🟠 Dados de reprovação resetados:', dadosReprovacao.value)
  }
}, { immediate: true })

const confirmarReprovacao = () => {
  emit('confirm', {
    os: props.os,
    dadosReprovacao: dadosReprovacao.value,
  })
  isDialogVisible.value = false
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="600"
    persistent
  >
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span>Reprovar Ordem de Serviço</span>
        <VIcon
          icon="tabler-x"
          @click="isDialogVisible = false"
        />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <div v-if="props.os">
          <p class="mb-4">
            Você está prestes a reprovar a ordem de serviço <strong>#{{ props.os.codigo }}</strong>.
          </p>

          <VAlert
            type="warning"
            variant="outlined"
            class="mb-4"
          >
            Esta ação irá alterar o status da ordem de serviço para "Reprovada". Esta ação pode ser irreversível.
          </VAlert>

          <!-- Formulário para dados da reprovação -->
          <VForm>
            <VRow>
              <VCol cols="12">
                <AppTextarea
                  v-model="dadosReprovacao.motivo_reprovacao"
                  label="Motivo da Reprovação *"
                  :rules="[rules.required, rules.minLength]"
                  placeholder="Descreva detalhadamente o motivo da reprovação..."
                  rows="3"
                  required
                />
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="dadosReprovacao.observacoes"
                  label="Observações Adicionais"
                  placeholder="Observações complementares (opcional)..."
                  rows="2"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="dadosReprovacao.data_reprovacao"
                  label="Data da Reprovação *"
                  type="date"
                  :rules="[rules.required]"
                  required
                />
              </VCol>
            </VRow>
          </VForm>

          <!-- Informações da OS -->
          <div class="mt-4">
            <h6 class="text-subtitle-1 mb-2">
              Informações da OS:
            </h6>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <p><strong>Cliente:</strong> {{ props.os.cliente?.nome_fantasia || 'N/A' }}</p>
                <p><strong>Responsável:</strong> {{ props.os.responsavel?.nome || 'N/A' }}</p>
                <strong>Status atual:</strong> <VChip :color="getOSStatusColor(os.status)">
                  {{ getOSStatusLabel(os.status) || 'N/A' }}
                </VChip>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <p><strong>Fornecedor:</strong> {{ props.os.fornecedor || 'N/A' }}</p>
                <p><strong>Nº Pedido:</strong> {{ props.os.num_pedido_compra || 'N/A' }}</p>
                <p><strong>Código:</strong> {{ props.os.codigo || 'N/A' }}</p>
              </VCol>
            </VRow>
          </div>
        </div>
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn
          variant="outlined"
          @click="isDialogVisible = false"
        >
          Cancelar
        </VBtn>

        <VBtn
          color="error"
          @click="confirmarReprovacao"
        >
          Confirmar Reprovação
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
