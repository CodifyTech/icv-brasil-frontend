<script setup lang="ts">
export interface PaginationProps {
  currentPage?: number
  totalItems?: number
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  showItemsPerPageSelector?: boolean
  showPageInfo?: boolean
  showFirstLastButtons?: boolean
  maxVisiblePages?: number
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 10,
  itemsPerPageOptions: () => [5, 10, 25, 50, 100],
  showItemsPerPageSelector: true,
  showPageInfo: true,
  showFirstLastButtons: true,
  maxVisiblePages: 5,
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:itemsPerPage': [itemsPerPage: number]
  'page-change': [page: number]
  'items-per-page-change': [itemsPerPage: number]
}>()

// Computed properties
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return Math.min(end, props.totalItems)
})

const hasNextPage = computed(() => props.currentPage < totalPages.value)
const hasPreviousPage = computed(() => props.currentPage > 1)

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = props.currentPage
  const maxVisible = props.maxVisiblePages

  if (total <= maxVisible) {
    // Se o total de páginas é menor que o máximo visível, mostra todas
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Lógica para mostrar páginas com ellipsis
    const halfVisible = Math.floor(maxVisible / 2)
    let start = Math.max(1, current - halfVisible)
    let end = Math.min(total, current + halfVisible)

    // Ajusta se estamos no início
    if (current <= halfVisible) {
      end = maxVisible
    }

    // Ajusta se estamos no final
    if (current > total - halfVisible) {
      start = total - maxVisible + 1
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

// Methods
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage || props.disabled || props.loading) {
    return
  }

  emit('update:currentPage', page)
  emit('page-change', page)
}

const goToFirstPage = () => goToPage(1)
const goToLastPage = () => goToPage(totalPages.value)
const goToNextPage = () => goToPage(props.currentPage + 1)
const goToPreviousPage = () => goToPage(props.currentPage - 1)

const updateItemsPerPage = (newItemsPerPage: number) => {
  if (newItemsPerPage === props.itemsPerPage || props.disabled || props.loading) {
    return
  }

  emit('update:itemsPerPage', newItemsPerPage)
  emit('items-per-page-change', newItemsPerPage)
  
  // Ajusta a página atual se necessário
  const newTotalPages = Math.ceil(props.totalItems / newItemsPerPage)
  if (props.currentPage > newTotalPages) {
    emit('update:currentPage', Math.max(1, newTotalPages))
    emit('page-change', Math.max(1, newTotalPages))
  }
}
</script>

<template>
  <div class="cdf-pagination">
    <!-- Informações da paginação -->
    <div v-if="showPageInfo" class="pagination-info">
      <span v-if="totalItems > 0">
        Mostrando {{ startItem }} a {{ endItem }} de {{ totalItems }} itens
      </span>
      <span v-else>
        Nenhum item encontrado
      </span>
    </div>

    <!-- Controles de paginação -->
    <div class="pagination-controls">
      <!-- Seletor de itens por página -->
      <div v-if="showItemsPerPageSelector" class="items-per-page">
        <span class="items-per-page-label">Itens por página:</span>
        <VSelect
          :model-value="itemsPerPage"
          :items="itemsPerPageOptions"
          :disabled="disabled || loading"
          variant="outlined"
          density="compact"
          hide-details
          class="items-per-page-select"
          @update:model-value="updateItemsPerPage"
        />
      </div>

      <!-- Navegação de páginas -->
      <div v-if="totalPages > 1" class="navigation-buttons">
        <!-- Primeira página -->
        <VBtn
          v-if="showFirstLastButtons"
          :disabled="!hasPreviousPage || disabled || loading"
          variant="text"
          icon="mdi-page-first"
          size="small"
          class="page-btn"
          @click="goToFirstPage"
        >
          <VTooltip activator="parent" location="top">
            Primeira página
          </VTooltip>
        </VBtn>

        <!-- Página anterior -->
        <VBtn
          :disabled="!hasPreviousPage || disabled || loading"
          variant="text"
          icon="mdi-chevron-left"
          size="small"
          class="page-btn"
          @click="goToPreviousPage"
        >
          <VTooltip activator="parent" location="top">
            Página anterior
          </VTooltip>
        </VBtn>

        <!-- Números das páginas -->
        <div class="page-numbers">
          <VBtn
            v-for="page in visiblePages"
            :key="page"
            :variant="page === currentPage ? 'elevated' : 'text'"
            :color="page === currentPage ? 'primary' : undefined"
            :disabled="disabled || loading"
            size="small"
            class="page-btn"
            @click="goToPage(page)"
          >
            {{ page }}
          </VBtn>
        </div>

        <!-- Próxima página -->
        <VBtn
          :disabled="!hasNextPage || disabled || loading"
          variant="text"
          icon="mdi-chevron-right"
          size="small"
          class="page-btn"
          @click="goToNextPage"
        >
          <VTooltip activator="parent" location="top">
            Próxima página
          </VTooltip>
        </VBtn>

        <!-- Última página -->
        <VBtn
          v-if="showFirstLastButtons"
          :disabled="!hasNextPage || disabled || loading"
          variant="text"
          icon="mdi-page-last"
          size="small"
          class="page-btn"
          @click="goToLastPage"
        >
          <VTooltip activator="parent" location="top">
            Última página
          </VTooltip>
        </VBtn>
      </div>

      <!-- Informação da página atual (para telas pequenas) -->
      <div v-if="totalPages > 1" class="page-info d-sm-none">
        Página {{ currentPage }} de {{ totalPages }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.cdf-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  gap: 16px;
  flex-wrap: wrap;
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  margin-top: 8px;
}

.pagination-info {
  flex-shrink: 0;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.items-per-page-label {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  white-space: nowrap;
}

.items-per-page-select {
  width: 80px;
}

.navigation-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-numbers {
  display: flex;
  gap: 2px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
}

.page-info {
  flex-shrink: 0;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.875rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .cdf-pagination {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .pagination-info,
  .page-info {
    text-align: center;
  }

  .items-per-page {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-numbers {
    max-width: 200px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .page-numbers::-webkit-scrollbar {
    display: none;
  }

  .items-per-page-label {
    display: none;
  }
}
</style>