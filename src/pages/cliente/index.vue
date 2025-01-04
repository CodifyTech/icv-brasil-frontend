<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { useClienteStore } from './store/useClienteStore'
import type { ICliente } from './types'
import LayoutTable from '@/components/CDF/LayoutTable.vue'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import { getI18n } from '@/plugins/i18n'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'

withDefaults(defineProps<{
  isHeader: boolean
}>(), {
  isHeader: true,
})

const i18n = getI18n()
const { t } = useI18n(i18n)

definePage({
  meta: {
    action: 'list',
    subject: 'cliente',
  },
})

const store = useClienteStore()

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
      title: 'Razao social',
      key: 'razao_social',
    },

    {
      title: 'Nome fantasia',
      key: 'nome_fantasia',
    },

    {
      title: 'Cnpj',
      key: 'cnpj',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: 'Razao social',
      value: 'razao_social',
    },

    {
      title: 'Nome fantasia',
      value: 'nome_fantasia',
    },

    {
      title: 'Cnpj',
      value: 'cnpj',
    },
  ]
})

const actions: ITableAction[] = [
  {
    icon: 'tabler-edit',
    color: 'primary',
    can: {
      action: 'edit',
      subject: 'cliente',
    },
    to: (item: ICliente) => `/Cliente/editar/${item.id}`,
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'cliente',
    },
    onClick: (item: ICliente) => dialogDestroy(item.id),
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
    title="Clientes"

    new-item="/cliente/cadastrar"
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
