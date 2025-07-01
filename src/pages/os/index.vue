<script setup lang="ts">
import { useInmetroStore } from '../inmetro/store/useInmetroStore'

definePage({
  meta: {
    action: 'read',
    subject: 'inmetro',
  },
})

const store = useInmetroStore()

const { relatoriosFinalizados, loading, filtros } = storeToRefs(store)

onMounted(async () => {
  await Promise.all([
    store.fetchOrdensServico(),
    store.fetchRelatoriosFinalizados(),
  ])
})

// Filtros para pesquisa avançada
const clienteOptions = ref([
  { title: 'Todos', value: '' },
  { title: 'ACME', value: 'acme' },
  { title: 'BETA Corp', value: 'beta' },
])

const inspetorOptions = ref([
  { title: 'Todos', value: '' },
  { title: 'João Silva', value: 'joao_silva' },
  { title: 'Maria Santos', value: 'maria_santos' },
])

const escopoOptions = ref([
  { title: 'Todos', value: '' },
  { title: 'Dimensional', value: 'dimensional' },
  { title: 'Visual', value: 'visual' },
  { title: 'Soldagem', value: 'soldagem' },
])

const tipoInspecaoOptions = ref([
  { title: 'Todos', value: '' },
  { title: 'Visual', value: 'visual' },
  { title: 'Ultrassom', value: 'ultrassom' },
])

const filtroForm = ref({
  cliente: '',
  data_inspecao_inicio: '',
  data_inspecao_fim: '',
  inspetor: '',
  fornecedor: '',
  escopo: '',
  tipo_inspecao: '',
  ordem_servico: '',
  pedido: '',
  certificado: '',
})

const pesquisar = () => {
  // Aplicar filtros
  Object.assign(filtros.value, filtroForm.value)
  store.fetchRelatoriosFinalizados()
}

const exportarCSV = () => {
  store.exportarCSV()
}

const getStatusColor = (status: string) => {
  const colors = {
    em_analise: 'info',
    andamento: 'warning',
    finalizado: 'success',
  }

  return colors[status as keyof typeof colors] || 'grey'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const estatisticas = ref({
  total: 0,
  emAnalise: 0,
  emAndamento: 0,
  finalizados: 0,
})

const ordensServico = ref([])
</script>

<template>
  <div>
    <!-- Estatísticas -->
    <VRow class="mb-6">
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar
                color="primary"
                variant="tonal"
                rounded
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-file" />
              </VAvatar>
              <div>
                <h3 class="text-h5 font-weight-bold">
                  {{ estatisticas?.total }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Total de OS
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar
                color="info"
                variant="tonal"
                rounded
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-clock" />
              </VAvatar>
              <div>
                <h3 class="text-h5 font-weight-bold">
                  {{ estatisticas.emAnalise }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Em Análise
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar
                color="warning"
                variant="tonal"
                rounded
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-progress" />
              </VAvatar>
              <div>
                <h3 class="text-h5 font-weight-bold">
                  {{ estatisticas.emAndamento }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Em Andamento
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar
                color="success"
                variant="tonal"
                rounded
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-check" />
              </VAvatar>
              <div>
                <h3 class="text-h5 font-weight-bold">
                  {{ estatisticas.finalizados }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Finalizados
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Ordens de Serviço Recentes -->
    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <VCard>
          <VCardTitle class="d-flex align-center justify-space-between">
            <span>Ordens de Serviço Recentes</span>
            <VBtn
              variant="text"
              size="small"
              to="/inmetro"
            >
              Ver todas
            </VBtn>
          </VCardTitle>

          <VCardText>
            <VList v-if="ordensServico?.length > 0">
              <VListItem
                v-for="os in ordensServico?.slice(0, 5)"
                :key="os.id"
                :to="`/inmetro/visualizar/${os.id}`"
              >
                <template #prepend>
                  <VAvatar
                    size="40"
                    :color="os.status === 'finalizado' ? 'success' : os.status === 'andamento' ? 'warning' : 'info'"
                    variant="tonal"
                  >
                    <VIcon :icon="os.status === 'finalizado' ? 'tabler-check' : os.status === 'andamento' ? 'tabler-progress' : 'tabler-clock'" />
                  </VAvatar>
                </template>

                <VListItemTitle>
                  {{ os.numero_os || os.codigo }}
                </VListItemTitle>

                <VListItemSubtitle>
                  {{ os.cliente?.razao_social || os.cliente_nome }} • {{ new Date(os.data_abertura).toLocaleDateString('pt-BR') }}
                </VListItemSubtitle>

                <template #append>
                  <VChip
                    :color="os.status === 'finalizado' ? 'success' : os.status === 'andamento' ? 'warning' : 'info'"
                    variant="tonal"
                    size="small"
                  >
                    {{ os.status }}
                  </VChip>
                </template>
              </VListItem>
            </VList>

            <div
              v-else
              class="text-center py-8"
            >
              <VIcon
                size="64"
                class="mb-4 text-medium-emphasis"
              >
                tabler-file-x
              </VIcon>
              <p class="text-body-1 text-medium-emphasis">
                Nenhuma ordem de serviço encontrada
              </p>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Ações Rápidas -->
      <VCol
        cols="12"
        md="4"
      >
        <VCard>
          <VCardTitle>Ações Rápidas</VCardTitle>

          <VCardText>
            <VBtn
              block
              color="primary"
              class="mb-3"
              to="/os/cadastrar"
            >
              <VIcon start>
                tabler-plus
              </VIcon>
              Nova Ordem de Serviço
            </VBtn>

            <VBtn
              block
              color="secondary"
              variant="outlined"
              class="mb-3"
              to="/inmetro"
            >
              <VIcon start>
                tabler-list
              </VIcon>
              Listar Todas as OS
            </VBtn>

            <VBtn
              block
              color="info"
              variant="outlined"
              class="mb-3"
              @click="store.exportarCSV"
            >
              <VIcon start>
                tabler-download
              </VIcon>
              Exportar Relatório
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
