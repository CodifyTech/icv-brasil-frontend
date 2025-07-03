<script setup lang="ts">
import CDFMoreBtn from '@/components/CDF/CDFMoreBtn.vue'
import DialogDocumentosAnexos from '@/pages/os/components/DialogDocumentosAnexos.vue'
import DialogFinalizarOs from '@/pages/os/components/DialogFinalizarOS.vue'
import DialogMaterialEquipamento from '@/pages/os/components/DialogMaterialEquipamento.vue'
import DialogReprovarOs from '@/pages/os/components/DialogReprovarOS.vue'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
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

definePage({
  meta: {
    action: 'read',
    subject: 'inmetro',
  },
})

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
})

const isDialogAprovarVisible = ref<boolean>(false)
const isDialogReprovarVisible = ref<boolean>(false)
const isDialogMaterialVisible = ref<boolean>(false)
const isDialogDocumentosVisible = ref<boolean>(false)
const ordemServicoSelecionada = ref<IOrdemServico | null>(null)

const aplicarFiltros = async () => {
  filtros.value = { ...filtroForm.value }
  await store.fetchOrdensServico({ filtros: filtros.value })
}

const limparFiltros = () => {
  filtroForm.value = {
    cliente_id: null,
    data_inspecao_inicio: null,
    data_inspecao_fim: '',
    responsavel_id: '',
    fornecedor: '',
    escopo_acreditacao_id: null,
    tipo_servico_id: null,
    num_pedido_compra: '',
    certificado_associado: '',
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
      <!-- 
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
      -->
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
            <AppSelect
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
            <AppSelect
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
            <AppSelect
              v-model="filtroForm.escopoAcreditacao"
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
            <CDFMoreBtn
              v-if="item.status === OsStatusEnum.EM_ANALISE || item.status === OsStatusEnum.ANDAMENTO"
              color="gray"
              :menu-list="[
                {
                  title: 'Aprovar',
                  icon: 'tabler-check',
                  color: 'success',
                  click: () => {
                    ordemServicoSelecionada = item
                    isDialogAprovarVisible = true
                  },
                },
                {
                  title: 'Reprovar',
                  color: 'error',
                  icon: 'tabler-x',
                  click: () => {
                    ordemServicoSelecionada = item
                    isDialogReprovarVisible = true
                  },
                },
              ]"
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
    :carregar-materiais="() => store.carregarMateriais(ordemServicoSelecionada.id)"
  />

  <DialogDocumentosAnexos
    v-model:is-dialog-visible="isDialogDocumentosVisible"
    :os="ordemServicoSelecionada"
    :carregar-anexos="() => store.carregarAnexos(ordemServicoSelecionada.id)"
  />
</template>
