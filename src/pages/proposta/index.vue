<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import PropostaStatusModal from './components/PropostaStatusModal.vue'
import VisualizarPropostaModal from './components/VisualizarPropostaModal.vue'
import { usePropostaStore } from './store/usePropostaStore'
import type { IProposta } from './types'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'
import { PropostaEnum, getPropostaStatusColor, getPropostaStatusIcon, getPropostaStatusLabel } from '@/enums/PropostaStatusEnum'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import LayoutTable from '@/components/CDF/LayoutTable.vue'

withDefaults(defineProps<{
  isHeader: boolean
}>(), {
  isHeader: true,
})

definePage({
  meta: {
    action: 'list',
    subject: 'proposta',
  },
})

const store = usePropostaStore()

const {
  items,
  itemsPerPage,
  page,
  loading,
  searchTerm,
  isSearching,
  data,
} = storeToRefs(store)

const {
  loadMore,
  search: onSearch,
  searchAgain: onSearchAgain,
  resetSearch,
  destroy,
  onOrderBy,
  dialogDestroy,
  fetchItem,
} = store

const statusModal = ref(false)
const selectedPropostaId = ref('')
const showVisualizarModal = ref(false)

const openStatusModal = (proposta: IProposta) => {
  selectedPropostaId.value = proposta.id!
  statusModal.value = true
}

const headers: ComputedRef<IHeader[]> = computed(() => {
  return [
    {
      title: 'Código da Proposta',
      key: 'codigo_proposta',
    },
    {
      title: 'Pessoa Contato',
      key: 'pessoa_contato',
    },
    {
      title: 'Consultor',
      key: 'consultor.nome',
    },
    {
      title: 'Cliente',
      key: 'cliente.nome_fantasia',
    },
    {
      title: 'Área',
      key: 'area',
    },
    {
      title: 'Status',
      key: 'status',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: 'Código da Proposta',
      value: 'codigo_proposta',
    },
    {
      title: 'Pessoa Contato',
      value: 'pessoa_contato',
    },

    {
      title: 'Consultor',
      value: 'consultor',
    },
    {
      title: 'Cliente',
      value: 'nome_fantasia',
      relationship: 'filial',
    },
    {
      title: 'Área',
      value: 'area',
    },
    {
      title: 'Status',
      value: 'status',
    },
  ] as ITerm[]
})

const actions: ComputedRef<ITableAction[]> = computed(() => {
  return [
    {
      onClick: async (item: IProposta) => {
        await fetchItem(item.id)
        showVisualizarModal.value = true
      },
      label: 'Visualizar',
      icon: 'tabler-eye',
      color: 'info',
    },
    {
      icon: 'tabler-edit',
      color: 'primary',
      can: {
        action: 'edit',
        subject: 'proposta',
      },
      to: (item: IProposta) => `/Proposta/editar/${item.id}`,
    },
    {
      icon: 'tabler-trash',
      color: 'error',
      can: {
        action: 'delete',
        subject: 'proposta',
      },
      onClick: (item: IProposta) => dialogDestroy(item.id),
    },

  ] as ITableAction[]
})

onBeforeRouteLeave(() => {
  store.$reset()
})
</script>

<template>
  <LayoutTable
    v-model:items="items"
    v-model:loading="loading.items"
    v-model:loading-destroy="loading.destroy"
    v-model:search="searchTerm"
    v-model:is-searching="isSearching"
    :destroy="destroy"
    :is-header="isHeader"
    title="Gestão de Propostas"
    subtitle="Gerencie e acompanhe todas as propostas comerciais"

    new-item="/proposta/cadastrar"
    new-item-text="Nova Proposta"
    :headers="headers"
    :actions="actions"
    :items-per-page="itemsPerPage"
    :page="page"

    :load-more="loadMore"
    :terms-search="terms"
    :on-search="onSearch"
    :on-search-again="onSearchAgain"
    :on-reset="resetSearch"
    :on-order-by="onOrderBy"
  >
    <template #actions="{ item }">
      <CDFActionButton
        v-if="item.status === PropostaEnum.ANDAMENTO"
        icon="tabler-check"
        color="success"
        tooltip="Alterar Status"
        @click="() => openStatusModal(item)"
      />
    </template>
    <template #item.status="{ item }">
      <VChip
        density="comfortable"
        size="small"
        :text="getPropostaStatusLabel(item.status)"
        :color="getPropostaStatusColor(item.status)"
        :icon="getPropostaStatusIcon(item.status)"
      />
    </template>
  </LayoutTable>

  <PropostaStatusModal
    v-model="statusModal"
    :proposta-id="selectedPropostaId"
    @status-changed="(data) => store.handleStatusChange(selectedPropostaId, data)"
  />

  <!-- Modal de Visualização da Proposta -->
  <VisualizarPropostaModal
    v-model="showVisualizarModal"
    :proposta="data"
  />
</template>
