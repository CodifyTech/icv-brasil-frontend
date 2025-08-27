<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { usePropostaStore } from './store/usePropostaStore'
import type { IProposta } from './types'
import LayoutTable from '@/components/CDF/LayoutTable.vue'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'
import { getI18n } from '@/plugins/i18n'

withDefaults(defineProps<{
  isHeader: boolean
}>(), {
  isHeader: true,
})

const i18n = getI18n()

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
} = storeToRefs(store)

const {
  loadMore,
  search: onSearch,
  searchAgain: onSearchAgain,
  resetSearch,
  destroy,
  onOrderBy,
  dialogDestroy,
} = store

const headers: ComputedRef<IHeader[]> = computed(() => {
  return [
    {
      title: 'Pessoa contato',
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

const actions: ITableAction[] = [
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
]

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
  />
</template>
