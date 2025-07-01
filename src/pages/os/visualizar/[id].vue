<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInmetroStore } from '@/pages/inmetro/store/useInmetroStore'

definePage({
  meta: {
    navActiveLink: 'inmetro',
    action: 'view',
    subject: 'inmetro',
  },
})

const route = useRoute()
const store = useInmetroStore()

const { ordemServicoAtual, loading } = storeToRefs(store)
const { fetchOrdemServico, resetOrdemAtual } = store

onMounted(async () => {
  if (route.params.id)
    await fetchOrdemServico(route.params.id as string)
})

onBeforeRouteLeave(() => {
  resetOrdemAtual()
})

const statusColor = computed(() => {
  if (!ordemServicoAtual.value?.status)
    return 'grey'

  const colors = {
    em_analise: 'info',
    andamento: 'warning',
    finalizado: 'success',
  }

  return colors[ordemServicoAtual.value.status] || 'grey'
})
</script>

<template>
  <div>
    <!-- Header -->
    <VRow class="mb-6">
      <VCol cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              Visualizar Ordem de Serviço
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              Detalhes da ordem de serviço {{ ordemServicoAtual?.codigo }}
            </p>
          </div>

          <VBtn
            color="primary"
            variant="outlined"
            prepend-icon="tabler-arrow-left"
            to="/inmetro"
          >
            Voltar
          </VBtn>
        </div>
      </VCol>
    </VRow>

    <!-- Loading -->
    <VRow v-if="loading.item">
      <VCol
        cols="12"
        class="text-center"
      >
        <VProgressCircular
          indeterminate
          color="primary"
        />
      </VCol>
    </VRow>

    <!-- Content -->
    <VRow v-else-if="ordemServicoAtual">
      <!-- Informações Básicas -->
      <VCol
        cols="12"
        md="8"
      >
        <VCard>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <h2 class="text-h5 mb-4">
                  Informações da Ordem de Serviço
                </h2>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <div class="mb-4">
                  <label class="text-body-2 text-medium-emphasis">Número da OS</label>
                  <p class="text-body-1 font-weight-medium">
                    {{ ordemServicoAtual.numero_os || ordemServicoAtual.codigo }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <div class="mb-4">
                  <label class="text-body-2 text-medium-emphasis">Cliente</label>
                  <p class="text-body-1 font-weight-medium">
                    {{ ordemServicoAtual.cliente?.razao_social || ordemServicoAtual.cliente_nome }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <div class="mb-4">
                  <label class="text-body-2 text-medium-emphasis">Data de Abertura</label>
                  <p class="text-body-1 font-weight-medium">
                    {{ new Date(ordemServicoAtual.created_at).toLocaleDateString('pt-BR') }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <div class="mb-4">
                  <label class="text-body-2 text-medium-emphasis">Status</label>
                  <div>
                    <VChip
                      :color="statusColor"
                      variant="tonal"
                      size="small"
                    >
                      {{ ordemServicoAtual.status }}
                    </VChip>
                  </div>
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <div class="mb-4">
                  <label class="text-body-2 text-medium-emphasis">Tipo de Serviço</label>
                  <p class="text-body-1 font-weight-medium">
                    {{ ordemServicoAtual.tipo_servico?.nome || '-' }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <div class="mb-4">
                  <label class="text-body-2 text-medium-emphasis">Responsável</label>
                  <p class="text-body-1 font-weight-medium">
                    {{ ordemServicoAtual.responsavel?.nome || '-' }}
                  </p>
                </div>
              </VCol>

              <VCol
                v-if="ordemServicoAtual.descritivo"
                cols="12"
              >
                <div class="mb-4">
                  <label class="text-body-2 text-medium-emphasis">Observações</label>
                  <p class="text-body-1">
                    {{ ordemServicoAtual.descritivo }}
                  </p>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Actions -->
      <VCol
        cols="12"
        md="4"
      >
        <VCard>
          <VCardTitle>Ações</VCardTitle>
          <VCardText>
            <VBtn
              block
              color="primary"
              variant="outlined"
              class="mb-3"
              :to="`/inmetro/editar/${ordemServicoAtual.id}`"
            >
              <VIcon start>
                tabler-edit
              </VIcon>
              Editar
            </VBtn>

            <VBtn
              v-if="ordemServicoAtual.status === 'finalizado'"
              block
              color="success"
              variant="outlined"
              class="mb-3"
            >
              <VIcon start>
                tabler-download
              </VIcon>
              Download Relatório
            </VBtn>

            <VBtn
              block
              color="info"
              variant="outlined"
            >
              <VIcon start>
                tabler-upload
              </VIcon>
              Upload Anexos
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Anexos -->
      <VCol
        v-if="ordemServicoAtual.anexos?.length"
        cols="12"
      >
        <VCard>
          <VCardTitle>Anexos</VCardTitle>
          <VCardText>
            <VRow>
              <VCol
                v-for="anexo in ordemServicoAtual.anexos"
                :key="anexo.id"
                cols="12"
                sm="6"
                md="4"
              >
                <VCard variant="outlined">
                  <VCardText class="text-center">
                    <VIcon
                      size="48"
                      class="mb-2"
                    >
                      {{ anexo.tipo_arquivo?.includes('image') ? 'tabler-photo' : 'tabler-file' }}
                    </VIcon>
                    <p class="text-body-2 mb-1">
                      {{ anexo.nome_arquivo }}
                    </p>
                    <VChip
                      v-if="anexo.inmetro_flag"
                      color="success"
                      size="x-small"
                    >
                      Inmetro
                    </VChip>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Not Found -->
    <VRow v-else>
      <VCol
        cols="12"
        class="text-center"
      >
        <VIcon
          size="64"
          class="mb-4 text-medium-emphasis"
        >
          tabler-file-x
        </VIcon>
        <h2 class="text-h6 mb-2">
          Ordem de serviço não encontrada
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-4">
          A ordem de serviço que você está procurando não existe ou foi removida.
        </p>
        <VBtn
          color="primary"
          to="/inmetro"
        >
          Voltar para lista
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
