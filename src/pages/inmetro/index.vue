<script setup lang="ts">
import moment from 'moment'
import {
  getOSResultadoColor,
  getOSResultadoLabel,
} from '../../enums/OSResultadoEnum'
import {
  OsStatusEnum,
  getOSStatusColor,
  getOSStatusLabel,
} from '../../enums/OSStatusEnum'
import { useInmetroStore } from './store/useInmetroStore'
import type { IOrdemServico } from './types/index'
import AppAutocomplete from '@/@core/components/app-form-elements/AppAutocomplete.vue'
import CDFMoreBtn from '@/components/CDF/CDFMoreBtn.vue'
import { RoleEnum } from '@/enums/RoleEnum'
import DialogDocumentosAnexos from '@/pages/os/components/DialogDocumentosAnexos.vue'
import DialogFinalizarOs from '@/pages/os/components/DialogFinalizarOS.vue'
import DialogMaterialEquipamento from '@/pages/os/components/DialogMaterialEquipamento.vue'
import DialogReprovarOs from '@/pages/os/components/DialogReprovarOS.vue'
import DialogVisualizarEmail from '@/pages/os/components/DialogVisualizarEmail.vue'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

definePage({
  meta: {
    action: 'list',
    subject: 'inmetro',
  },
})

const store = useOrdemServicoStore()
const inmetroStore = useInmetroStore()
const snackbarStore = useSnackbarStore()

const {
  ordensServico,
  loading,
  filtros,
  ordemServicoAtual,
  isDialogAprovarVisible,
  isDialogReprovarVisible,
  page,
  itemsPerPage,
  total,
} = storeToRefs(store)

const {
  escopos,
  tiposServico,
  responsaveis,
  clientes,
} = storeToRefs(inmetroStore)

const {
  confirmarFinalizacao,
  confirmarReprovacao,
  menuList,
  loadMore,
} = store

onMounted(async () => {
  await Promise.all([
    store.fetchOrdensServico(),
  ])

  inmetroStore.carregarDadosApoio()
})

const filtroForm = ref({
  cliente_id: null,
  data_inspecao_inicio: null,
  data_inspecao_fim: '',
  responsavel_id: null,
  fornecedor: '',
  escopo_acreditacao_id: null,
  tipo_servico_id: null,
  num_pedido_compra: '',
  certificado_associado: '',
  codigo_os: '',
})

const isDialogMaterialVisible = ref<boolean>(false)
const isDialogDocumentosVisible = ref<boolean>(false)
const isDialogEmailVisible = ref<boolean>(false)
const loadingEmails = ref<Record<number, boolean>>({})
const auth = useAuth()

const aplicarFiltros = async () => {
  // Converter valores null para undefined para compatibilidade
  const filtrosLimpos = {
    ...filtroForm.value,
    cliente_id: filtroForm.value.cliente_id || undefined,
    data_inspecao_inicio: filtroForm.value.data_inspecao_inicio || undefined,
    data_inspecao_fim: filtroForm.value.data_inspecao_fim || undefined,
    responsavel_id: filtroForm.value.responsavel_id || undefined,
    escopo_acreditacao_id: filtroForm.value.escopo_acreditacao_id || undefined,
    tipo_servico_id: filtroForm.value.tipo_servico_id || undefined,
  }

  filtros.value = filtrosLimpos
  await store.fetchOrdensServico({ filtros: filtros.value })
}

const limparFiltros = () => {
  filtroForm.value = {
    cliente_id: null,
    data_inspecao_inicio: null,
    data_inspecao_fim: '',
    responsavel_id: null,
    fornecedor: '',
    escopo_acreditacao_id: null,
    tipo_servico_id: null,
    num_pedido_compra: '',
    certificado_associado: '',
    codigo_os: '',
  }
  store.resetFiltros()
}

// Função para enviar solicitação para responsável
const enviarSolicitacaoResponsavel = async (ordemServico: IOrdemServico) => {
  if (!ordemServico.id)
    return

  try {
    loadingEmails.value[Number.parseInt(ordemServico.id)] = true

    await store.enviarSolicitacaoResponsavel(ordemServico.id)

    snackbarStore.showSnackbar({
      text: 'E-mail enviado para o responsável com sucesso!',
      color: 'success',
    })

    // Recarregar a lista para atualizar o status
    await store.fetchOrdensServico()
  }
  catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    snackbarStore.showSnackbar({
      text: 'Erro ao enviar e-mail para o responsável',
      color: 'error',
    })
  }
  finally {
    loadingEmails.value[Number.parseInt(ordemServico.id)] = false
  }
}

// Função para verificar se o email já foi enviado hoje
const emailJaEnviadoHoje = (ordemServico: IOrdemServico) => {
  if (!ordemServico.email_responsavel_enviado_em)
    return false

  const dataEnvio = new Date(ordemServico.email_responsavel_enviado_em)
  const hoje = new Date()

  return dataEnvio.toDateString() === hoje.toDateString()
}

// Funções auxiliares para carregamento de dados
const carregarMateriais = async () => {
  if (ordemServicoAtual.value?.id)
    return await store.carregarMateriais(ordemServicoAtual.value.id)

  return []
}

const carregarAnexos = async () => {
  if (ordemServicoAtual.value?.id)
    return await store.carregarAnexos(ordemServicoAtual.value.id)

  return []
}

const carregarFotos = async () => {
  if (ordemServicoAtual.value?.id) {
    // Implementação temporária - converter anexos para formato de fotos
    const anexos = await store.carregarAnexos(ordemServicoAtual.value.id)

    return anexos.map((anexo: any) => ({
      ...anexo,
      url: anexo.anexo || '', // Usar anexo como URL temporariamente
    }))
  }

  return []
}

const exportarRelatorios = async (option: 'CSV' | 'EXCEL') => {
  try {
    // Aplicar os filtros atuais do formulário antes de exportar
    const filtrosLimpos = {
      ...filtroForm.value,
      cliente_id: filtroForm.value.cliente_id || undefined,
      data_inspecao_inicio: filtroForm.value.data_inspecao_inicio || undefined,
      data_inspecao_fim: filtroForm.value.data_inspecao_fim || undefined,
      responsavel_id: filtroForm.value.responsavel_id || undefined,
      escopo_acreditacao_id: filtroForm.value.escopo_acreditacao_id || undefined,
      tipo_servico_id: filtroForm.value.tipo_servico_id || undefined,
    }

    filtros.value = filtrosLimpos

    // Mostrar loading
    loading.value.relatorios = true

    if (option === 'CSV')
      await store.exportarCSV()
    else if (option === 'EXCEL')
      await store.exportarExcel()
  }
  catch (error) {
    console.error('Erro ao exportar CSV:', error)

    // Mostrar mensagem de erro se o store não mostrou
    snackbarStore.showSnackbar({
      text: 'Erro ao exportar CSV. Verifique os filtros e tente novamente.',
      color: 'error',
      timeout: 4000,
    })
  }
  finally {
    loading.value.relatorios = false
  }
}

const getItemValue = (item: any, key: string) => {
  return item[key]
}

const headers = computed(() => {
  if (auth.hasRole(RoleEnum.InmetroQualidade)) {
    return [
      { title: 'Nº OS', key: 'codigo', minWidth: '150px' },
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
    ]
  }

  return [
    { title: 'Nº OS', key: 'codigo', minWidth: '150px' },
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
    { title: 'Email Status', key: 'email_status', sortable: false, minWidth: '120px' },
    { title: 'Documentos', key: 'documentos', sortable: false },
    { title: 'Status', key: 'status' },
    { title: 'Ações', key: 'actions', sortable: false },
  ]
})
</script>

<template>
  <!-- Header -->
  <VCard class="mb-6">
    <VCardText class="d-flex align-center justify-space-between">
      <div>
        <h1 class="mb-0 text-h6 text-lg-h4">
          Lista de Relatórios
        </h1>
      </div>

      <div class="gap-2 d-flex">
        <VBtn
          color="secondary"
          variant="outlined"
          prepend-icon="tabler-file-type-csv"
          :loading="loading.relatorios"
          :disabled="loading.relatorios"
          @click="exportarRelatorios('CSV')"
        >
          {{ loading.relatorios ? 'Exportando...' : 'CSV' }}
        </VBtn>
        <VBtn
          color="secondary"
          variant="outlined"
          prepend-icon="tabler-file-type-xls"
          :loading="loading.relatorios"
          :disabled="loading.relatorios"
          @click="exportarRelatorios('EXCEL')"
        >
          {{ loading.relatorios ? 'Exportando...' : 'Excel' }}
        </VBtn>
      </div>
    </VCardText>
  </VCard>

  <!-- Filtros -->
  <VCard class="mb-6">
    <VCardTitle class="py-4">
      <VIcon class="me-2">
        tabler-filter
      </VIcon>
      Filtros de Pesquisa Avançada
    </VCardTitle>
    <VCardText>
      <VForm @submit.prevent="aplicarFiltros">
        <div class="filters">
          <AppAutocomplete
            v-model="filtroForm.cliente_id"
            label="Cliente"
            :items="clientes"
            item-title="razao_social"
            item-value="id"
            clearable
            hide-details
            placeholder="Selecione o cliente"
          />
          <AppTextField
            v-model="filtroForm.data_inspecao_inicio"
            label="Data Inspeção (Início)"
            type="date"
            clearable
            hide-details
          />
          <AppTextField
            v-model="filtroForm.data_inspecao_fim"
            label="Data Inspeção (Fim)"
            type="date"
            clearable
            hide-details
          />
          <AppAutocomplete
            v-model="filtroForm.responsavel_id"
            label="Responsável"
            :items="responsaveis"
            item-title="nome"
            item-value="id"
            clearable
            hide-details
            placeholder="Selecione o responsável"
          />
          <AppTextField
            v-model="filtroForm.fornecedor"
            label="Fornecedor"
            clearable
            hide-details
            placeholder="Digite o nome do fornecedor"
          />
          <AppAutocomplete
            v-model="filtroForm.escopo_acreditacao_id"
            label="Escopo"
            :items="escopos"
            clearable
            item-title="nome"
            item-value="id"
            hide-details
            placeholder="Selecione o escopo"
          />
          <AppSelect
            v-model="filtroForm.tipo_servico_id"
            label="Tipo de Serviço"
            :items="tiposServico"
            item-title="nome"
            item-value="id"
            clearable
            hide-details
            placeholder="Selecione o tipo de serviço"
          />
          <AppTextField
            v-model="filtroForm.num_pedido_compra"
            label="Nº Pedido"
            clearable
            hide-details
            placeholder="Digite o número do pedido de compra"
          />
          <AppTextField
            v-model="filtroForm.certificado_associado"
            label="Nº Certificado"
            clearable
            hide-details
            placeholder="Digite o número do certificado associado"
          />
          <AppTextField
            v-model="filtroForm.codigo_os"
            label="Nº OS"
            clearable
            hide-details
            placeholder="Digite o número da OS"
          />
        </div>
        <VRow class="mt-4">
          <VCol class="justify-end gap-3 d-flex">
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
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:items-length="total"
        :headers="headers"
        :items="ordensServico"
        :loading="loading.relatorios"
        @update:page="(value) => {
          page = value
          loadMore()
        }"
      >
        <template #[`item.material_equipamento`]="{ item }">
          <VBtn
            variant="text"
            color="primary"
            size="small"
            @click="() => {
              ordemServicoAtual = item
              isDialogMaterialVisible = true
            }"
          >
            <VIcon
              icon="tabler-package"
              class="me-1"
            />
            Ver Materiais
          </VBtn>
        </template>

        <template #[`item.data_inspecao`]="{ item }">
          {{ moment(getItemValue(item, 'data_inspecao')).format('DD/MM/YYYY') }}
        </template>

        <template #[`item.resultado`]="{ item }">
          <VChip
            v-if="getItemValue(item, 'resultado')"
            :color="getOSResultadoColor(getItemValue(item, 'resultado'))"
            size="small"
          >
            {{ getOSResultadoLabel(getItemValue(item, 'resultado')) }}
          </VChip>
        </template>

        <template #[`item.email_status`]="{ item }">
          <div class="gap-1 d-flex align-center">
            <VIcon
              v-if="item.email_cliente_enviado_em"
              color="success"
              size="16"
              title="E-mail do cliente enviado"
            >
              tabler-mail-check
            </VIcon>
            <VIcon
              v-if="emailJaEnviadoHoje(item)"
              color="info"
              size="16"
              title="E-mail do responsável enviado hoje"
            >
              tabler-mail-forward
            </VIcon>
            <VIcon
              v-if="item.responsavel_aceitou_em"
              color="primary"
              size="16"
              title="Responsável aceitou"
            >
              tabler-user-check
            </VIcon>
          </div>
        </template>

        <template #[`item.documentos`]="{ item }">
          <VBtn
            variant="text"
            color="primary"
            size="small"
            @click="() => {
              ordemServicoAtual = item
              isDialogDocumentosVisible = true
            }"
          >
            <VIcon
              icon="tabler-paperclip"
              class="me-1"
            />
            Ver Anexos
          </VBtn>
        </template>

        <template #[`item.status`]="{ item }">
          <VChip
            :color="getOSStatusColor(getItemValue(item, 'status'))"
            size="small"
          >
            {{ getOSStatusLabel(getItemValue(item, 'status')) }}
          </VChip>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="gap-2 d-flex">
            <VBtn
              size="small"
              color="primary"
              variant="text"
              :to="`/inmetro/relatorio/${item.id}`"
            >
              <VIcon>tabler-eye</VIcon>
            </VBtn>

            <!-- Botão para visualizar email -->
            <VBtn
              v-if="item.email_cliente_enviado_em"
              size="small"
              color="info"
              variant="outlined"
              @click="() => {
                ordemServicoAtual = item
                isDialogEmailVisible = true
              }"
            >
              <VIcon size="18">
                tabler-mail-opened
              </VIcon>
            </VBtn>

            <!-- Botão de enviar para responsável -->
            <VBtn
              v-if="item.responsavel && !emailJaEnviadoHoje(item)"
              size="small"
              color="secondary"
              variant="outlined"
              :loading="loadingEmails[Number.parseInt(item.id || '0')]"
              @click="enviarSolicitacaoResponsavel(item)"
            >
              <VIcon size="18">
                tabler-mail
              </VIcon>
            </VBtn>

            <!-- Indicador de email já enviado -->
            <VTooltip
              v-else-if="emailJaEnviadoHoje(item)"
              text="E-mail já enviado hoje"
              location="top"
            >
              <template #activator="{ props: tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  size="small"
                  color="success"
                  variant="text"
                  disabled
                >
                  <VIcon size="18">
                    tabler-mail-check
                  </VIcon>
                </VBtn>
              </template>
            </VTooltip>

            <CDFMoreBtn
              v-if="item.status === OsStatusEnum.EM_ANALISE || item.status === OsStatusEnum.ANDAMENTO"
              color="gray"
              :menu-list="menuList(item)"
            />
          </div>
        </template>
      </VDataTableServer>
    </VCardText>
  </VCard>

  <DialogFinalizarOs
    v-model:is-dialog-visible="isDialogAprovarVisible"
    :os="ordemServicoAtual"
    @confirm="confirmarFinalizacao"
  />

  <DialogReprovarOs
    v-model:is-dialog-visible="isDialogReprovarVisible"
    :os="ordemServicoAtual"
    @confirm="confirmarReprovacao"
  />

  <DialogMaterialEquipamento
    v-model:is-dialog-visible="isDialogMaterialVisible"
    :os="ordemServicoAtual"
    :carregar-materiais="carregarMateriais"
  />

  <DialogDocumentosAnexos
    v-model:is-dialog-visible="isDialogDocumentosVisible"
    :os="ordemServicoAtual"
    :carregar-anexos="carregarAnexos"
    :carregar-fotos="carregarFotos"
  />

  <DialogVisualizarEmail
    v-model:is-dialog-visible="isDialogEmailVisible"
    :os="ordemServicoAtual"
  />
</template>

<style scoped>
.filters {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(200px, 1fr));
}
</style>
