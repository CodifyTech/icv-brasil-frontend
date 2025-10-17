<script setup lang="ts">
import { OS_RESULTADO_OPTIONS } from '@/enums/OSResultadoEnum'
import { getOSStatusColor, getOSStatusLabel } from '@/enums/OSStatusEnum'
import type { IOrdemServico } from '@/pages/inmetro/types/index'

const props = defineProps<{
  isDialogVisible: boolean
  os: IOrdemServico | null
}>()

const emit = defineEmits<{
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:os', value: IOrdemServico | null): void
  (e: 'confirm', dados: { os: IOrdemServico | null; dadosFinalizacao: any }): void
}>()

// Computed que funciona como v-model
const isDialogVisible = computed({
  get: () => props.isDialogVisible,
  set: (value: boolean) => emit('update:isDialogVisible', value),
})

// Dados do formulário
const dadosFinalizacao = ref({
  num_relatorio: '',
  data_execucao: '',
  certificado_associado: '',
  resultado: null,
})

// Regras de validação
const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
}

// Watch para preencher os campos quando a OS mudar
watch(() => props.os, (newOs: IOrdemServico | null) => {
  if (newOs) {
    dadosFinalizacao.value = {
      num_relatorio: newOs.num_relatorio || '',
      data_execucao: newOs.data_execucao || '',
      certificado_associado: newOs.certificado_associado || '',
      resultado: newOs.resultado || '',
    }
  }
}, { immediate: true })

const confirmarFinalizacao = () => {
  emit('confirm', {
    os: props.os,
    dadosFinalizacao: dadosFinalizacao.value,
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
        <span>Finalizar Ordem de Serviço</span>
        <VIcon
          icon="tabler-x"
          @click="isDialogVisible = false"
        />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <div v-if="props.os">
          <p class="mb-4">
            Você está prestes a finalizar a ordem de serviço <strong>#{{ os.codigo }}</strong>.
          </p>

          <VAlert
            type="info"
            variant="outlined"
            class="mb-4"
          >
            Esta ação irá alterar o status da ordem de serviço para "Finalizada".
          </VAlert>

          <!-- Formulário para preenchimento dos dados obrigatórios -->
          <VForm>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="dadosFinalizacao.num_relatorio"
                  label="Número do Relatório *"
                  :rules="[rules.required]"
                  required
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="dadosFinalizacao.data_execucao"
                  label="Data de Execução *"
                  type="date"
                  :rules="[rules.required]"
                  required
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="dadosFinalizacao.certificado_associado"
                  label="Certificado Associado *"
                  :rules="[rules.required]"
                  required
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="dadosFinalizacao.resultado"
                  label="Resultado *"
                  :items="OS_RESULTADO_OPTIONS"
                  :rules="[rules.required]"
                  required
                />
              </VCol>
            </VRow>
          </VForm>

          <!-- Informações atuais da OS -->
          <div class="mt-4">
            <h6 class="text-subtitle-1 mb-2">
              Informações da OS:
            </h6>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <p><strong>Cliente:</strong> {{ os.cliente?.nome_fantasia || 'N/A' }}</p>
                <p><strong>Responsável:</strong> {{ os.responsavel?.nome || 'N/A' }}</p>
                <p>
                  <strong>Status atual:</strong> <VChip :color="getOSStatusColor(os.status)">
                    {{ getOSStatusLabel(os.status) || 'N/A' }}
                  </VChip>
                </p>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <p><strong>Fornecedor:</strong> {{ os.fornecedor || 'N/A' }}</p>
                <p><strong>Nº Pedido:</strong> {{ os.num_pedido_compra || 'N/A' }}</p>
                <p><strong>Código:</strong> {{ os.codigo || 'N/A' }}</p>
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
          color="primary"
          @click="confirmarFinalizacao"
        >
          Confirmar Finalização
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
