<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { useFuncionarioStore } from './store/useFuncionarioStore'
import type { IFuncionario } from './types'
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
    subject: 'funcionario',
  },
})

const store = useFuncionarioStore()

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
      title: 'CPF',
      key: 'cpf',
    },
    {
      title: 'Telefone',
      key: 'telefone_1',
    },
    {
      title: 'Email',
      key: 'email_1',
    },
    {
      title: 'Cidade',
      key: 'cidade',
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
      title: 'CPF',
      value: 'cpf',
      mask: '###.###.###-##',
    },
    {
      title: 'Telefone',
      value: 'telefone_1',
      mask: '(##) ######-####',
    },
    {
      title: 'Email',
      value: 'email_1',
    },
    {
      title: 'Cidade',
      value: 'cidade',
      type: 'ENUM',
      options: [
        'São Paulo',
        'Rio de Janeiro',
      ],
    },
  ] as ITerm[]
})

const actions: ITableAction[] = [
  {
    icon: 'tabler-edit',
    color: 'primary',
    can: {
      action: 'edit',
      subject: 'funcionario',
    },
    to: (item: IFuncionario) => `/Funcionario/editar/${item.id}`,
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'funcionario',
    },
    onClick: (item: IFuncionario) => dialogDestroy(item.id),
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
    :title="$t('funcionario.list')"

    new-item="/funcionario/cadastrar"
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
