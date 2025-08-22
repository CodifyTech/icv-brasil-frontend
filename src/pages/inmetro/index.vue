<script setup lang="ts">
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
import DialogDocumentosAnexos from '@/pages/os/components/DialogDocumentosAnexos.vue'
import DialogFinalizarOs from '@/pages/os/components/DialogFinalizarOS.vue'
import DialogMaterialEquipamento from '@/pages/os/components/DialogMaterialEquipamento.vue'
import DialogReprovarOs from '@/pages/os/components/DialogReprovarOS.vue'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

definePage({
  meta: {
    action: 'read',
    subject: 'inmetro',
  },
})

// Estados para controle de loading dos emails
const loadingEmails = ref<Record<number, boolean>>({})

const store = useOrdemServicoStore()
const inmetroStore = useInmetroStore()
const snackbarStore = useSnackbarStore()

const { ordensServico, loading, filtros } = storeToRefs(store)

const {
  escopos,
  tiposServico,
  responsaveis,
  clientes,
} = storeToRefs(inmetroStore)

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

const isDialogAprovarVisible = ref<boolean>(false)
const isDialogReprovarVisible = ref<boolean>(false)
const isDialogMaterialVisible = ref<boolean>(false)
const isDialogDocumentosVisible = ref<boolean>(false)
const ordemServicoSelecionada = ref<IOrdemServico | null>(null)

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

// Funções para os botões do menu
const abrirDialogAprovar = (item: IOrdemServico) => {
  ordemServicoSelecionada.value = item
  isDialogAprovarVisible.value = true
}

const abrirDialogReprovar = (item: IOrdemServico) => {
  ordemServicoSelecionada.value = item
  isDialogReprovarVisible.value = true
}

// Função para criar o menu list dinamicamente
const menuList = (item: IOrdemServico) => [
  {
    title: 'Aprovar',
    icon: 'tabler-check',
    color: 'success',
    click: (() => abrirDialogAprovar(item)) as any,
  },
  {
    title: 'Reprovar',
    color: 'error',
    icon: 'tabler-x',
    click: (() => abrirDialogReprovar(item)) as any,
  },
]

// Funções auxiliares para carregamento de dados
const carregarMateriais = async () => {
  if (ordemServicoSelecionada.value?.id)
    return await store.carregarMateriais(ordemServicoSelecionada.value.id)

  return []
}

const carregarAnexos = async () => {
  if (ordemServicoSelecionada.value?.id)
    return await store.carregarAnexos(ordemServicoSelecionada.value.id)

  return []
}

const carregarFotos = async () => {
  if (ordemServicoSelecionada.value?.id) {
    // Implementação temporária - converter anexos para formato de fotos
    const anexos = await store.carregarAnexos(ordemServicoSelecionada.value.id)

    return anexos.map((anexo: any) => ({
      ...anexo,
      url: anexo.anexo || '', // Usar anexo como URL temporariamente
    }))
  }

  return []
}

const exportarRelatorios = async () => {
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

    await store.exportarCSV()
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

const confirmarFinalizacao = async (dados: { os: IOrdemServico | null; dadosFinalizacao: any }) => {
  if (!dados.os)
    return

  try {
    console.log('Finalizando OS:', dados.os)
    console.log('Dados de finalização:', dados.dadosFinalizacao)

    // Implementação da chamada para o backend
    const osAtualizada = {
      ...dados.os,
      num_relatorio: dados.dadosFinalizacao.num_relatorio,
      data_execucao: dados.dadosFinalizacao.data_execucao,
      certificado_associado: dados.dadosFinalizacao.certificado_associado,
      resultado: dados.dadosFinalizacao.resultado,
      observacoes: dados.dadosFinalizacao.observacoes,
      status: 'FINALIZADA',
    }

    // Chamada para a API
    await store.finalizarOS(osAtualizada)

    // Atualizar a lista após finalizar
    await store.fetchOrdensServico()

    // Fechar o dialog
    isDialogAprovarVisible.value = false
    ordemServicoSelecionada.value = null

    // Mostrar mensagem de sucesso
    snackbarStore.showSnackbar({
      text: 'Ordem de serviço finalizada com sucesso!',
      color: 'success',
      timeout: 3000,
    })
  }
  catch (error) {
    console.error('Erro ao finalizar OS:', error)

    // Mostrar mensagem de erro
    snackbarStore.showSnackbar({
      text: 'Erro ao finalizar ordem de serviço. Tente novamente.',
      color: 'error',
      timeout: 4000,
    })
  }
}

const confirmarReprovacao = async (dados: { os: IOrdemServico | null; dadosReprovacao: any }) => {
  if (!dados.os)
    return

  try {
    console.log('Reprovando OS:', dados.os)
    console.log('Dados de reprovação:', dados.dadosReprovacao)

    // Implementação da chamada para o backend
    const osAtualizada = {
      ...dados.os,
      motivo_reprovacao: dados.dadosReprovacao.motivo_reprovacao,
      observacoes_reprovacao: dados.dadosReprovacao.observacoes,
      data_reprovacao: dados.dadosReprovacao.data_reprovacao,
      status: 'REPROVADA',
    }

    // Chamada para a API
    await store.reprovarOS(osAtualizada)

    // Atualizar a lista após reprovar
    await store.fetchOrdensServico()

    // Fechar o dialog
    isDialogReprovarVisible.value = false
    ordemServicoSelecionada.value = null

    // Mostrar mensagem de sucesso
    snackbarStore.showSnackbar({
      text: 'Ordem de serviço reprovada com sucesso!',
      color: 'warning',
      timeout: 3000,
    })
  }
  catch (error) {
    console.error('Erro ao reprovar OS:', error)

    // Mostrar mensagem de erro
    snackbarStore.showSnackbar({
      text: 'Erro ao reprovar ordem de serviço. Tente novamente.',
      color: 'error',
      timeout: 4000,
    })
  }
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
          :loading="loading.relatorios"
          :disabled="loading.relatorios"
          @click="exportarRelatorios"
        >
          {{ loading.relatorios ? 'Exportando...' : 'Exportar CSV' }}
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
        <VRow>
          <VCol
            cols="12"
            md="3"
          >
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
              placeholder="Digite o nome do fornecedor"
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
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
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
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
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppTextField
              v-model="filtroForm.num_pedido_compra"
              label="Nº Pedido"
              clearable
              hide-details
              placeholder="Digite o número do pedido de compra"
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppTextField
              v-model="filtroForm.certificado_associado"
              label="Nº Certificado"
              clearable
              hide-details
              placeholder="Digite o número do certificado associado"
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AppTextField
              v-model="filtroForm.codigo_os"
              label="Nº OS"
              clearable
              hide-details
              placeholder="Digite o número da OS"
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
        ]"
        :items="ordensServico"
        :loading="loading.relatorios"
        class="elevation-1"
      >
        <template #[`item.material_equipamento`]="{ item }">
          <VBtn
            variant="text"
            color="primary"
            size="small"
            @click="() => {
              ordemServicoSelecionada = item
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
          {{ formatDate(getItemValue(item, 'data_inspecao')) }}
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
          <div class="d-flex align-center gap-1">
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
              tabler-check-circle
            </VIcon>
          </div>
        </template>

        <template #[`item.documentos`]="{ item }">
          <VBtn
            variant="text"
            color="primary"
            size="small"
            @click="() => {
              ordemServicoSelecionada = item
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
          <div class="d-flex gap-2">
            <VBtn
              size="small"
              color="primary"
              variant="text"
              :to="`/inmetro/relatorio/${item.id}`"
            >
              <VIcon>tabler-eye</VIcon>
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
      </VDataTable>
    </VCardText>
  </VCard>

  <DialogFinalizarOs
    v-model:is-dialog-visible="isDialogAprovarVisible"
    :os="ordemServicoSelecionada"
    @confirm="confirmarFinalizacao"
  />

  <DialogReprovarOs
    v-model:is-dialog-visible="isDialogReprovarVisible"
    :os="ordemServicoSelecionada"
    @confirm="confirmarReprovacao"
  />

  <DialogMaterialEquipamento
    v-model:is-dialog-visible="isDialogMaterialVisible"
    :os="ordemServicoSelecionada"
    :carregar-materiais="carregarMateriais"
  />

  <DialogDocumentosAnexos
    v-model:is-dialog-visible="isDialogDocumentosVisible"
    :os="ordemServicoSelecionada"
    :carregar-anexos="carregarAnexos"
    :carregar-fotos="carregarFotos"
  />
</template>
