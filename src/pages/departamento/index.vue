<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { useDepartamentoStore } from './store/useDepartamentoStore'
import LayoutTable from '@/components/CDF/LayoutTable.vue'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'
import type { IDepartamento } from '@/pages/departamento/types'

withDefaults(defineProps<{
  isHeader: boolean
}>(), {
  isHeader: true,
})

definePage({
  meta: {
    action: 'list',
    subject: 'departamento',
  },
})

const store = useDepartamentoStore()

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
      title: 'Nome',
      key: 'nome',
    },

    {
      title: 'E-mail',
      key: 'email',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: 'Nome',
      value: 'nome',
    },

    {
      title: 'E-mail',
      value: 'email',
    },
  ]
})

const actions: ITableAction[] = [
  {
    icon: 'tabler-edit',
    color: 'primary',
    can: {
      action: 'edit',
      subject: 'departamento',
    },
    to: (item: IDepartamento) => `/departamento/editar/${item.id}`,
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'departamento',
    },
    onClick: (item: IDepartamento) => dialogDestroy(item.id),
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
    title="Departamento"

    new-item="/departamento/cadastrar"
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
