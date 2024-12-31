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
      title: t('funcionario.headers.nome'),
      key: 'nome',
    },

    {
      title: t('funcionario.headers.rg'),
      key: 'rg',
    },

    {
      title: t('funcionario.headers.cpf'),
      key: 'cpf',
    },

    {
      title: t('funcionario.headers.telefone_1'),
      key: 'telefone_1',
    },

    {
      title: t('funcionario.headers.telefone_2'),
      key: 'telefone_2',
    },

    {
      title: t('funcionario.headers.email_1'),
      key: 'email_1',
    },

    {
      title: t('funcionario.headers.email_2'),
      key: 'email_2',
    },

    {
      title: t('funcionario.headers.logradouro'),
      key: 'logradouro',
    },

    {
      title: t('funcionario.headers.bairro'),
      key: 'bairro',
    },

    {
      title: t('funcionario.headers.cidade'),
      key: 'cidade',
    },

    {
      title: t('funcionario.headers.uf'),
      key: 'uf',
    },

    {
      title: t('funcionario.headers.aeroporto_proximo'),
      key: 'aeroporto_proximo',
    },

    {
      title: t('funcionario.headers.razao_social'),
      key: 'razao_social',
    },

    {
      title: t('funcionario.headers.nome_fantasia'),
      key: 'nome_fantasia',
    },

    {
      title: t('funcionario.headers.cnpj'),
      key: 'cnpj',
    },

    {
      title: t('funcionario.headers.valor_hh'),
      key: 'valor_hh',
    },

    {
      title: t('funcionario.headers.valor_diaria'),
      key: 'valor_diaria',
    },

    {
      title: t('funcionario.headers.valor_demanda'),
      key: 'valor_demanda',
    },

    {
      title: t('funcionario.headers.valor_deslocamento'),
      key: 'valor_deslocamento',
    },

    {
      title: t('funcionario.headers.valor_refeicao'),
      key: 'valor_refeicao',
    },

    {
      title: t('funcionario.headers.valor_pedagio'),
      key: 'valor_pedagio',
    },

    {
      title: t('funcionario.headers.valor_hospedagem'),
      key: 'valor_hospedagem',
    },

    {
      title: t('funcionario.headers.valor_outros'),
      key: 'valor_outros',
    },

    {
      title: t('funcionario.headers.banco'),
      key: 'banco',
    },

    {
      title: t('funcionario.headers.agencia'),
      key: 'agencia',
    },

    {
      title: t('funcionario.headers.conta'),
      key: 'conta',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: t('funcionario.terms.nome'),
      value: 'nome',
    },

    {
      title: t('funcionario.terms.rg'),
      value: 'rg',
    },

    {
      title: t('funcionario.terms.cpf'),
      value: 'cpf',
    },

    {
      title: t('funcionario.terms.telefone_1'),
      value: 'telefone_1',
    },

    {
      title: t('funcionario.terms.telefone_2'),
      value: 'telefone_2',
    },

    {
      title: t('funcionario.terms.email_1'),
      value: 'email_1',
    },

    {
      title: t('funcionario.terms.email_2'),
      value: 'email_2',
    },

    {
      title: t('funcionario.terms.logradouro'),
      value: 'logradouro',
    },

    {
      title: t('funcionario.terms.bairro'),
      value: 'bairro',
    },

    {
      title: t('funcionario.terms.cidade'),
      value: 'cidade',
    },

    {
      title: t('funcionario.terms.uf'),
      value: 'uf',
    },

    {
      title: t('funcionario.terms.aeroporto_proximo'),
      value: 'aeroporto_proximo',
    },

    {
      title: t('funcionario.terms.razao_social'),
      value: 'razao_social',
    },

    {
      title: t('funcionario.terms.nome_fantasia'),
      value: 'nome_fantasia',
    },

    {
      title: t('funcionario.terms.cnpj'),
      value: 'cnpj',
    },

    {
      title: t('funcionario.terms.valor_hh'),
      value: 'valor_hh',
    },

    {
      title: t('funcionario.terms.valor_diaria'),
      value: 'valor_diaria',
    },

    {
      title: t('funcionario.terms.valor_demanda'),
      value: 'valor_demanda',
    },

    {
      title: t('funcionario.terms.valor_deslocamento'),
      value: 'valor_deslocamento',
    },

    {
      title: t('funcionario.terms.valor_refeicao'),
      value: 'valor_refeicao',
    },

    {
      title: t('funcionario.terms.valor_pedagio'),
      value: 'valor_pedagio',
    },

    {
      title: t('funcionario.terms.valor_hospedagem'),
      value: 'valor_hospedagem',
    },

    {
      title: t('funcionario.terms.valor_outros'),
      value: 'valor_outros',
    },

    {
      title: t('funcionario.terms.banco'),
      value: 'banco',
    },

    {
      title: t('funcionario.terms.agencia'),
      value: 'agencia',
    },

    {
      title: t('funcionario.terms.conta'),
      value: 'conta',
    },
  ]
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
