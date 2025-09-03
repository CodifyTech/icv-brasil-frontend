<script setup lang="ts">
import moment from 'moment'
import { onMounted, ref } from 'vue'
import { useOrdemServicoStore } from '../store/useOrdemServicoStore'
import { getOSStatusColor, getOSStatusLabel } from '@/enums/OSStatusEnum'
import type { OSStatusEnum } from '@/enums/OSStatusEnum'

// Definir meta da página para não precisar de autenticação
definePage({
  meta: {
    layout: 'blank', // Layout sem sidebar/navbar
    public: true, // Página pública, sem autenticação
    title: 'Aceitar Ordem de Serviço',
  },
})

interface OrdemServico {
  id: number
  codigo: string
  descritivo: string
  cliente: {
    razao_social: string
    nome_fantasia: string
    contato_responsavel?: string
    telefone?: string
    email?: string
  }
  responsavel: {
    nome: string
    email: string
  }
  tipo_servico?: {
    nome: string
  }
  escopo_acreditacao?: {
    nome: string
  }
  data_execucao?: string
  num_pedido_compra?: string
  fornecedor?: string
  observacoes?: string
  status: OSStatusEnum
}

interface TokenData {
  ordem_servico: OrdemServico
  token: {
    token: string
    expires_at: string
    used_at?: string
  }
  valid: boolean
}

const route = useRoute()

const token = route.params.token as string
const loading = ref(true)
const loadingAccept = ref(false)
const tokenData = ref<TokenData | null>(null)
const observacoes = ref('')
const success = ref(false)
const error = ref('')

// Função para fechar/voltar
const fecharPagina = () => {
  window.close()
}

const store = useOrdemServicoStore()

// Função para aceitar a OS
const aceitarOS = async () => {
  try {
    loadingAccept.value = true

    await store.aceitarOS(token, observacoes.value)

    // Mostrar estado de sucesso
    success.value = true
  }
  catch (err: any) {
    console.error('Erro ao aceitar OS:', err)
    error.value = err.message || 'Erro ao aceitar ordem de serviço'
  }
  finally {
    loadingAccept.value = false
  }
}

// Verificar token ao montar componente
onMounted(async () => {
  try {
    const data: any = await store.verificarToken(token)

    tokenData.value = data.token as TokenData
  }
  catch (err: any) {
    error.value = err.message || 'Token inválido ou expirado'
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="aceitar-os-page">
    <!-- Loading state -->
    <VCard
      v-if="loading"
      class="mx-auto"
      max-width="600"
    >
      <VCardText class="text-center">
        <VProgressCircular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="mt-4">
          Verificando token...
        </p>
      </VCardText>
    </VCard>

    <!-- Success state -->
    <VCard
      v-else-if="success"
      class="mx-auto"
      max-width="600"
    >
      <VCardText class="text-center">
        <VIcon
          icon="tabler-check"
          color="success"
          size="64"
          class="mb-4"
        />
        <h2 class="text-h5 mb-4">
          Ordem de Serviço Aceita com Sucesso!
        </h2>
        <p class="text-body-1 mb-4">
          A ordem de serviço foi aceita e você receberá as próximas instruções por e-mail.
        </p>
        <VBtn
          color="primary"
          @click="() => fecharPagina()"
        >
          Fechar
        </VBtn>
      </VCardText>
    </VCard>

    <!-- Error state -->
    <VCard
      v-else-if="error"
      class="mx-auto"
      max-width="600"
    >
      <VCardText class="text-center">
        <VIcon
          icon="tabler-exclamation-circle"
          color="error"
          size="64"
          class="mb-4"
        />
        <h2 class="text-h5 mb-4">
          Token Inválido ou Expirado
        </h2>
        <p class="text-body-1 mb-4">
          {{ error }}
        </p>
        <VBtn
          color="primary"
          @click="fecharPagina"
        >
          Fechar
        </VBtn>
      </VCardText>
    </VCard>

    <!-- Main content -->
    <VContainer
      v-else-if="tokenData"
      class="pa-4"
    >
      <VRow justify="center">
        <VCol
          cols="12"
          md="8"
          lg="6"
        >
          <!-- Header -->
          <VCard class="mb-6">
            <VCardText class="text-center">
              <VIcon
                icon="tabler-clipboard-check"
                color="primary"
                size="48"
                class="mb-3"
              />
              <h1 class="text-h4 mb-2">
                Aceitar Ordem de Serviço
              </h1>
              <p class="text-body-1">
                Você foi designado para executar a ordem de serviço abaixo.
              </p>
            </VCardText>
          </VCard>

          <!-- OS Info -->
          <VCard class="mb-6">
            <VCardTitle class="d-flex align-center">
              <VIcon
                icon="tabler-file-text"
                class="me-2"
              />
              Dados da Ordem de Serviço
            </VCardTitle>
            <VDivider />
            <VCardText>
              <VRow>
                <VCol
                  cols="12"
                  sm="6"
                >
                  <div class="info-item">
                    <strong>Código:</strong>
                    <VChip
                      :color="getOSStatusColor(tokenData.ordem_servico.status)"
                      variant="outlined"
                      size="small"
                      class="ms-2"
                    >
                      {{ tokenData.ordem_servico.codigo }}
                    </VChip>
                  </div>
                </VCol>
                <VCol
                  cols="12"
                  sm="6"
                >
                  <div class="info-item">
                    <strong>Status:</strong>
                    <VChip
                      :color="getOSStatusColor(tokenData.ordem_servico.status)"
                      size="small"
                      class="ms-2"
                    >
                      {{ getOSStatusLabel(tokenData.ordem_servico.status) }}
                    </VChip>
                  </div>
                </VCol>
                <VCol cols="12">
                  <div class="info-item">
                    <strong>Descritivo:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.descritivo ?? '-' }}
                    </p>
                  </div>
                </VCol>
                <VCol
                  v-if="tokenData.ordem_servico.tipo_servico"
                  cols="12"
                  sm="6"
                >
                  <div class="info-item">
                    <strong>Tipo de Serviço:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.tipo_servico.nome }}
                    </p>
                  </div>
                </VCol>
                <VCol
                  v-if="tokenData.ordem_servico.escopo_acreditacao"
                  cols="12"
                  sm="6"
                >
                  <div class="info-item">
                    <strong>Escopo de Acreditação:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.escopo_acreditacao.nome }}
                    </p>
                  </div>
                </VCol>
                <VCol
                  v-if="tokenData.ordem_servico.data_execucao"
                  cols="12"
                  sm="6"
                >
                  <div class="info-item">
                    <strong>Data de Execução:</strong>
                    <p class="mt-1 mb-0">
                      {{ moment(tokenData.ordem_servico.data_execucao).format('DD/MM/YYYY HH:mm') }}
                    </p>
                  </div>
                </VCol>
                <VCol
                  v-if="tokenData.ordem_servico.num_pedido_compra"
                  cols="12"
                  sm="6"
                >
                  <div class="info-item">
                    <strong>Nº Pedido de Compra:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.num_pedido_compra }}
                    </p>
                  </div>
                </VCol>
                <VCol
                  v-if="tokenData.ordem_servico.observacoes"
                  cols="12"
                >
                  <div class="info-item">
                    <strong>Observações:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.observacoes }}
                    </p>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Cliente Info -->
          <VCard class="mb-6">
            <VCardTitle class="d-flex align-center">
              <VIcon
                icon="tabler-building"
                class="me-2"
              />
              Informações do Cliente
            </VCardTitle>
            <VDivider />
            <VCardText>
              <VRow>
                <VCol cols="12">
                  <div class="info-item">
                    <strong>Razão Social:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.cliente.razao_social }}
                    </p>
                  </div>
                </VCol>
                <VCol
                  v-if="tokenData.ordem_servico.cliente.nome_fantasia"
                  cols="12"
                >
                  <div class="info-item">
                    <strong>Nome Fantasia:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.cliente.nome_fantasia }}
                    </p>
                  </div>
                </VCol>
                <VCol
                  v-if="tokenData.ordem_servico.cliente.contato_responsavel"
                  cols="12"
                  sm="6"
                >
                  <div class="info-item">
                    <strong>Contato Responsável:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.cliente.contato_responsavel }}
                    </p>
                  </div>
                </VCol>
                <VCol
                  v-if="tokenData.ordem_servico.cliente.telefone"
                  cols="12"
                  sm="6"
                >
                  <div class="info-item">
                    <strong>Telefone:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.cliente.telefone }}
                    </p>
                  </div>
                </VCol>
                <VCol
                  v-if="tokenData.ordem_servico.cliente.email"
                  cols="12"
                >
                  <div class="info-item">
                    <strong>E-mail:</strong>
                    <p class="mt-1 mb-0">
                      {{ tokenData.ordem_servico.cliente.email }}
                    </p>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Accept Form -->
          <VCard class="mb-6">
            <VCardTitle class="d-flex align-center">
              <VIcon
                icon="tabler-message"
                class="me-2"
              />
              Aceitar Ordem de Serviço
            </VCardTitle>
            <VDivider />
            <VCardText>
              <AppTextarea
                v-model="observacoes"
                label="Observações (opcional)"
                placeholder="Adicione observações sobre a aceitação..."
                rows="4"
                variant="outlined"
                class="mb-4"
              />

              <div class="d-flex justify-end gap-3">
                <VBtn
                  color="error"
                  variant="outlined"
                  @click="fecharPagina"
                >
                  Cancelar
                </VBtn>
                <VBtn
                  color="success"
                  :loading="loadingAccept"
                  @click="aceitarOS"
                >
                  <VIcon
                    icon="tabler-check"
                    class="me-1"
                  />
                  Aceitar Ordem de Serviço
                </VBtn>
              </div>
            </VCardText>
          </VCard>

          <!-- Token Info -->
          <VCard>
            <VCardText class="text-center">
              <VIcon
                icon="tabler-clock"
                color="warning"
                class="me-2"
              />
              <span class="text-body-2">
                Este link expira em:
                <strong>{{ moment(tokenData.token.expires_at).format('DD/MM/YYYY HH:mm') }}</strong>
              </span>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style scoped>
.aceitar-os-page {
  padding: 20px;
  min-block-size: 100vh;
}

.info-item {
  margin-block-end: 16px;
}

.info-item:last-child {
  margin-block-end: 0;
}

.info-item strong {
  display: block;
  color: rgb(var(--v-theme-primary));
  margin-block-end: 4px;
}

.v-card {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 12%);
}

.gap-3 {
  gap: 12px;
}
</style>
