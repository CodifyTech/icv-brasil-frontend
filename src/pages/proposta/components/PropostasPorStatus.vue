<script setup lang="ts">
interface PropostaItem {
  id: string
  pessoa_contato: string
  consultor: string
  telefone: string
  email: string
  status: string
  cliente: {
    id: string
    codigo_cliente: string
    razao_social: string
    nome_fantasia: string
  }
}

interface Props {
  status: string
  title: string
}

const props = defineProps<Props>()

// Dados fictícios para demonstração
const mockPropostas: PropostaItem[] = [
  {
    id: '1',
    pessoa_contato: 'João Silva',
    consultor: 'Maria Santos',
    telefone: '(11) 99999-9999',
    email: 'joao@empresa.com',
    status: 'aprovada',
    cliente: {
      id: '1',
      codigo_cliente: 'CLI001',
      razao_social: 'Empresa A Ltda',
      nome_fantasia: 'Empresa A',
    },
  },
  {
    id: '2',
    pessoa_contato: 'Ana Costa',
    consultor: 'Pedro Oliveira',
    telefone: '(21) 88888-8888',
    email: 'ana@empresab.com',
    status: 'perdida',
    cliente: {
      id: '2',
      codigo_cliente: 'CLI002',
      razao_social: 'Empresa B S.A.',
      nome_fantasia: 'Empresa B',
    },
  },
  {
    id: '3',
    pessoa_contato: 'Carlos Lima',
    consultor: 'Julia Fernandes',
    telefone: '(31) 77777-7777',
    email: 'carlos@empresac.com',
    status: 'aprovada',
    cliente: {
      id: '3',
      codigo_cliente: 'CLI003',
      razao_social: 'Empresa C Ltda',
      nome_fantasia: 'Empresa C',
    },
  },
  {
    id: '4',
    pessoa_contato: 'Roberto Santos',
    consultor: 'Ana Paula',
    telefone: '(41) 66666-6666',
    email: 'roberto@empresad.com',
    status: 'perdida',
    cliente: {
      id: '4',
      codigo_cliente: 'CLI004',
      razao_social: 'Empresa D Ltda',
      nome_fantasia: 'Empresa D',
    },
  },
]

// Dados específicos para cada status
const filteredItems = computed(() => {
  return mockPropostas.filter(item =>
    item.status?.toLowerCase() === props.status.toLowerCase())
})

// Função para obter a cor do status
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    rascunho: 'grey',
    enviada: 'info',
    aprovada: 'success',
    perdida: 'error',
    cancelada: 'warning',
  }

  return colors[status?.toLowerCase()] || 'grey'
}

// Função para obter o ícone do status
function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    rascunho: 'tabler-edit',
    enviada: 'tabler-send',
    aprovada: 'tabler-check',
    perdida: 'tabler-x',
    cancelada: 'tabler-ban',
  }

  return icons[status?.toLowerCase()] || 'tabler-circle'
}
</script>

<template>
  <div>
    <!-- Lista de propostas -->
    <div v-if="filteredItems.length > 0">
      <VRow>
        <VCol
          v-for="item in filteredItems"
          :key="item.id"
          cols="12"
          md="6"
          lg="4"
        >
          <VCard
            variant="outlined"
            hover
            class="cursor-pointer"
          >
            <VCardItem>
              <template #prepend>
                <VAvatar
                  :color="getStatusColor(status)"
                  variant="tonal"
                >
                  <VIcon :icon="getStatusIcon(status)" />
                </VAvatar>
              </template>

              <VCardTitle class="text-wrap">
                {{ item.cliente?.nome_fantasia || item.cliente?.razao_social || 'Cliente não informado' }}
              </VCardTitle>

              <VCardSubtitle>
                <template v-if="item.cliente?.codigo_cliente">
                  Cód: {{ item.cliente.codigo_cliente }}
                </template>
              </VCardSubtitle>
            </VCardItem>

            <VCardText>
              <VList
                density="compact"
                class="bg-transparent"
              >
                <VListItem
                  v-if="item.pessoa_contato"
                  prepend-icon="tabler-user"
                >
                  <VListItemTitle>{{ item.pessoa_contato }}</VListItemTitle>
                  <VListItemSubtitle>Pessoa de Contato</VListItemSubtitle>
                </VListItem>

                <VListItem
                  v-if="item.consultor"
                  prepend-icon="tabler-user-tie"
                >
                  <VListItemTitle>{{ item.consultor }}</VListItemTitle>
                  <VListItemSubtitle>Consultor Responsável</VListItemSubtitle>
                </VListItem>

                <VListItem
                  v-if="item.area"
                  prepend-icon="tabler-building-warehouse"
                >
                  <VListItemTitle>{{ item.area }}</VListItemTitle>
                  <VListItemSubtitle>Área de Atuação</VListItemSubtitle>
                </VListItem>
              </VList>
            </VCardText>

            <VCardActions>
              <VBtn
                color="info"
                variant="tonal"
                size="small"
                prepend-icon="tabler-eye"
              >
                Visualizar
              </VBtn>

              <VBtn
                color="primary"
                variant="tonal"
                size="small"
                prepend-icon="tabler-edit"
              >
                Editar
              </VBtn>

              <VSpacer />

              <VBtn
                color="error"
                variant="text"
                size="small"
                icon="tabler-trash"
              />
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <!-- Estado vazio -->
    <div
      v-else
      class="text-center py-12"
    >
      <VAvatar
        size="80"
        :color="getStatusColor(status)"
        variant="tonal"
        class="mb-4"
      >
        <VIcon
          :icon="getStatusIcon(status)"
          size="40"
        />
      </VAvatar>

      <h3 class="text-h6 mb-2">
        Nenhuma proposta {{ status.toLowerCase() }}
      </h3>

      <p class="text-body-2 text-medium-emphasis mb-4">
        <template v-if="status.toLowerCase() === 'aprovada'">
          Quando uma proposta for aprovada pelo cliente, ela aparecerá aqui.
        </template>
        <template v-else-if="status.toLowerCase() === 'perdida'">
          Propostas que não foram aceitas pelo cliente aparecerão aqui.
        </template>
        <template v-else>
          Não há propostas com status "{{ status }}" no momento.
        </template>
      </p>

      <VBtn
        color="primary"
        prepend-icon="tabler-plus"
        to="/proposta/cadastrar"
      >
        Nova Proposta
      </VBtn>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
