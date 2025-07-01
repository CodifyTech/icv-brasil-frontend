<script setup lang="ts">
import { useInmetroStore } from './store/useInmetroStore'

definePage({
  meta: {
    action: 'read',
    subject: 'inmetro',
  },
})

const store = useInmetroStore()

const { ordensServico, loading, filtros } = storeToRefs(store)

onMounted(async () => {
  await Promise.all([
    store.fetchOrdensServico(),
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

const aplicarFiltros = async () => {
  filtros.value = { ...filtroForm.value }
  await store.fetchOrdensServico({ filtros: filtros.value })
}

const limparFiltros = () => {
  filtroForm.value = {
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
  }
  store.resetFiltros()
}

const exportarRelatorios = async () => {
  try {
    await store.exportarCSV()
  }
  catch (error) {
    console.error('Erro ao exportar CSV:', error)
  }
}

const getStatusColor = (status: string) => {
  const colors = {
    finalizado: 'success',
    em_analise: 'info',
    andamento: 'warning',
  }

  return colors[status as keyof typeof colors] || 'grey'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const getItemValue = (item: any, key: string) => {
  return item[key]
}
</script>

<template>
  <!-- Header -->
  <VCard class="mb-6">
    <VCardText class="d-flex align-center justify-space-between">
      <div>
        <h1 class="text-h6 text-lg-h4 mb-0">
          Lista de Relatórios
        </h1>
      </div>
      <div class="d-flex gap-2">
        <VBtn
          color="secondary"
          variant="outlined"
          prepend-icon="tabler-download"
          @click="exportarRelatorios"
        >
          Exportar CSV
        </VBtn>
      </div>
    </VCardText>
  </VCard>

  <!-- Filtros -->
  <VCard class="mb-6">
    <VCardTitle>
      <VIcon class="me-2">
        tabler-filter
      </VIcon>
      Filtros de Pesquisa Avançada
    </VCardTitle>
    <VCardText>
      <VForm @submit.prevent="aplicarFiltros">
        <VRow>
          <VCol
            cols="12"
            md="3"
          >
            <AppSelect
              v-model="filtroForm.cliente"
              label="Cliente"
              :items="clienteOptions"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppTextField
              v-model="filtroForm.data_inspecao_inicio"
              label="Data Inspeção (Início)"
              type="date"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppTextField
              v-model="filtroForm.data_inspecao_fim"
              label="Data Inspeção (Fim)"
              type="date"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppSelect
              v-model="filtroForm.inspetor"
              label="Inspetor"
              :items="inspetorOptions"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppTextField
              v-model="filtroForm.fornecedor"
              label="Fornecedor"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppSelect
              v-model="filtroForm.escopo"
              label="Escopo"
              :items="escopoOptions"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppSelect
              v-model="filtroForm.tipo_inspecao"
              label="Tipo de Inspeção"
              :items="tipoInspecaoOptions"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppTextField
              v-model="filtroForm.pedido"
              label="Nº Pedido"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppTextField
              v-model="filtroForm.certificado"
              label="Nº Certificado"
              clearable
              hide-details
            />
          </VCol>
        </VRow>
        <VRow class="mt-4">
          <VCol class="d-flex gap-3 justify-end">
            <VBtn
              type="submit"
              color="primary"
            >
              Pesquisar
            </VBtn>
            <VBtn
              variant="outlined"
              @click="limparFiltros"
            >
              Limpar
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>

  <!-- Tabela de Relatórios -->
  <VCard>
    <VCardText>
      <VDataTable
        :headers="[
          { title: 'Nº Pedido', key: 'num_pedido_compra', minWidth: '150px' },
          { title: 'Nº Relatório', key: 'num_relatorio', minWidth: '150px' },
          { title: 'Cliente', key: 'cliente.nome_fantasia', minWidth: '150px' },
          { title: 'Fornecedor', key: 'fornecedor' },
          { title: 'Responsável', key: 'responsavel.nome' },
          { title: 'Escopo', key: 'escopo_acreditacao.nome' },
          { title: 'Tipo Serviço', key: 'tipo_servico.nome', minWidth: '150px' },
          { title: 'Material/Equipamento', key: 'material_equipamento' },
          { title: 'Data', key: 'data_execucao', minWidth: '150px' },
          { title: 'Resultado', key: 'resultado' },
          { title: 'Documentos', key: 'documentos', sortable: false },
          { title: 'Status', key: 'status' },
          { title: 'Ações', key: 'actions', sortable: false },
        ]"
        :items="ordensServico"
        :loading="loading.relatorios"
        class="elevation-1"
      >
        <template #[`item.data_inspecao`]="{ item }">
          {{ formatDate(getItemValue(item, 'data_inspecao')) }}
        </template>

        <template #[`item.resultado`]="{ item }">
          <VChip
            :color="getItemValue(item, 'resultado') === 'aprovado' ? 'success' : getItemValue(item, 'resultado') === 'reprovado' ? 'error' : 'warning'"
            size="small"
          >
            {{ getItemValue(item, 'resultado') }}
          </VChip>
        </template>

        <template #[`item.documentos`]>
          <VBtn
            icon="tabler-paperclip"
            size="small"
            variant="text"
            title="Ver Anexos"
          />
        </template>

        <template #[`item.status`]="{ item }">
          <VChip
            :color="getStatusColor(item.status)"
            size="small"
          >
            {{ item.status }}
          </VChip>
        </template>

        <template #[`item.actions`]="{ item }">
          <VBtn
            size="small"
            color="primary"
            variant="text"
            :to="`/inmetro/relatorio/${item.id}`"
          >
            Ver Detalhes
          </VBtn>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>
</template>
