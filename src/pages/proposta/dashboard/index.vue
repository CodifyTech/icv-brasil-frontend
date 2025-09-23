<script setup lang="ts">
import type { ComputedRef } from 'vue'
import PropostasPorStatus from '../components/PropostasPorStatus.vue'
import { usePropostaStore } from '../store/usePropostaStore'

definePage({
  meta: {
    navActiveLink: 'proposta-dashboard',
    action: 'list',
    subject: 'proposta',
  },
})

const store = usePropostaStore()

// Estado da aba ativa
const activeTab = ref('aprovada')

// Contadores por status
const statusCounts: ComputedRef<Record<string, number>> = computed(() => {
  if (!store.items) {
    return {
      aprovada: 0,
      reprovada: 0,
      declinada: 0,
      rascunho: 0,
      enviada: 0,
    }
  }

  return {
    aprovada: store.items.filter((item: any) => item.status?.toLowerCase() === 'aprovada').length,
    reprovada: store.items.filter((item: any) => item.status?.toLowerCase() === 'reprovada').length,
    declinada: store.items.filter((item: any) => item.status?.toLowerCase() === 'declinada').length,
    rascunho: store.items.filter((item: any) => item.status?.toLowerCase() === 'rascunho').length,
    enviada: store.items.filter((item: any) => item.status?.toLowerCase() === 'enviada').length,
  }
})

// Abas disponíveis
const tabs = [
  {
    key: 'aprovada',
    title: 'Propostas Aprovadas',
    icon: 'tabler-check',
    color: 'success',
  },
  {
    key: 'reprovada',
    title: 'Propostas Reprovadas',
    icon: 'tabler-x',
    color: 'error',
  },
  {
    key: 'rascunho',
    title: 'Rascunhos',
    icon: 'tabler-edit',
    color: 'grey',
  },
  {
    key: 'enviada',
    title: 'Enviadas',
    icon: 'tabler-send',
    color: 'info',
  },
]

onMounted(() => {
  // Buscar propostas quando a página for carregada
  store.fetchItems()
})
</script>

<template>
  <div>
    <!-- Header da página -->
    <VCard class="mb-6">
      <VCardItem class="pa-6">
        <VRow align="center">
          <VCol>
            <VCardTitle class="text-h4 mb-2">
              <VIcon
                icon="tabler-chart-bar"
                class="me-3"
              />
              Dashboard de Propostas
            </VCardTitle>
            <VCardSubtitle class="text-body-1">
              Gerencie suas propostas organizadas por status
            </VCardSubtitle>
          </VCol>
          <VCol cols="auto">
            <VBtn
              color="primary"
              prepend-icon="tabler-plus"
              size="large"
              to="/proposta/cadastrar"
            >
              Nova Proposta
            </VBtn>
          </VCol>
        </VRow>
      </VCardItem>
    </VCard>

    <!-- Cards de resumo -->
    <VRow class="mb-6">
      <VCol
        v-for="tab in tabs"
        :key="tab.key"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard
          :color="tab.color"
          variant="tonal"
          class="cursor-pointer"
          :class="{ 'border-2': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <VCardText class="text-center pa-6">
            <VAvatar
              :color="tab.color"
              size="56"
              class="mb-4"
            >
              <VIcon
                :icon="tab.icon"
                size="32"
              />
            </VAvatar>

            <h2 class="text-h3 font-weight-bold mb-2">
              {{ statusCounts[tab.key] }}
            </h2>

            <p class="text-body-1 mb-0">
              {{ tab.title }}
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Tabs para navegação -->
    <VCard>
      <VTabs
        v-model="activeTab"
        bg-color="transparent"
        color="primary"
        grow
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.key"
          :value="tab.key"
          :prepend-icon="tab.icon"
        >
          {{ tab.title }}
          <VChip
            v-if="statusCounts[tab.key] > 0"
            :color="tab.color"
            size="small"
            class="ms-2"
          >
            {{ statusCounts[tab.key] }}
          </VChip>
        </VTab>
      </VTabs>

      <VDivider />

      <!-- Conteúdo das abas -->
      <VTabsWindow v-model="activeTab">
        <VTabsWindowItem
          v-for="tab in tabs"
          :key="tab.key"
          :value="tab.key"
        >
          <div class="pa-4">
            <PropostasPorStatus
              :status="tab.key"
              :title="tab.title"
            />
          </div>
        </VTabsWindowItem>
      </VTabsWindow>
    </VCard>

    <!-- Loading overlay -->
    <VOverlay
      v-model="store.loading.items"
      contained
      class="align-center justify-center"
    >
      <VProgressCircular
        color="primary"
        size="64"
        indeterminate
      />
    </VOverlay>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: all 0.3s ease;
}

.cursor-pointer:hover {
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}
</style>
