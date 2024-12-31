<script setup lang="ts">
import { type ComputedRef, capitalize } from 'vue'
import { storeToRefs } from 'pinia'
import AddEditPermissionDialog from './components/AddEditPermissionDialog.vue'
import LayoutTable from '@/components/CDF/LayoutTable.vue'
import type { ITerm } from '@/components/CDF/SearchBar.vue'
import type { IHeader, ITableAction } from '@/pages/types/layoutTable.types'
import { usePermissoesStore } from '@/pages/acesso/permissoes/store/usePermissoesStore'
import { avatarCor } from '@/utils/formatters'
import type { IPermission } from '@/pages/acesso/types'

const store = usePermissoesStore()

const {
  items,
  itemsPerPage,
  page,
  loading,
  searchTerm,
  isSearching,
  isPermissionDialogVisible,
  isEditing,
} = storeToRefs(store)

const {
  loadMore,
  search: onSearch,
  searchAgain: onSearchAgain,
  resetSearch,
  destroy,
  onOrderBy,
  getPermission,
  deletarAllPermission
} = store

const headers: ComputedRef<IHeader[]> = computed(() => {
  return [
    { title: 'Nome', key: 'name' },
    { title: 'Permissões', key: 'actions', sortable: false },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: 'Nome',
      value: 'name',
    },
  ]
})

const actions: ITableAction[] = [
  {
    icon: 'tabler-edit',
    color: 'primary',
    can: {
      action: 'edit',
      subject: 'user',
    },
    onClick: (item: IPermission) => editPermission(item),
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'user',
    },
    onClick: (item: IPermission) => deletarAllPermission(item),
  },
]

const addPermission = () => {
  isPermissionDialogVisible.value = true
  isEditing.value = false
}

const editPermission = (permission: IPermission) => {
  isPermissionDialogVisible.value = true
  isEditing.value = true
  getPermission(permission)
}
</script>

<template>
  <LayoutTable
    v-model:items="items"
    v-model:loading="loading.items"
    v-model:loading-destroy="loading.destroy"
    v-model:search="searchTerm"
    v-model:is-searching="isSearching"
    :destroy="destroy"
    title="Lista Permissões"

    :new-item="() => addPermission()"
    new-item-text="Adicionar Permissão"
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
    <template #item.actions="{ item }">
      <div class="d-flex gap-2">
        <VChip
          v-for="(text, index) in item.actions"
          :key="index"
          label
          :color="avatarCor[Math.floor(Math.random() * 6)]"
          class="font-weight-medium"
        >
          {{ capitalize(text?.toString()?.split(' ')[1]) }}
        </VChip>
      </div>
    </template>
  </LayoutTable>

  <AddEditPermissionDialog
    v-model:isDialogVisible="isPermissionDialogVisible"
    v-model:isEditing="isEditing"
  />
</template>
