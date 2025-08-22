<!-- Exemplo de implementação da exportação CSV -->
<template>
  <div>
    <!-- Cabeçalho com botão de exportação -->
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span>Relatórios Finalizados</span>
        
        <!-- Botão de Exportação CSV -->
        <VBtn
          color="secondary"
          variant="outlined"
          prepend-icon="tabler-download"
          :loading="isExporting"
          :disabled="isExporting || ordens.length === 0"
          @click="exportarCSV"
        >
          {{ isExporting ? 'Exportando...' : 'Exportar CSV' }}
        </VBtn>
      </VCardTitle>
      
      <VCardText>
        <!-- Formulário de filtros aqui -->
        <VRow>
          <VCol
            cols="12"
            md="3"
          >
            <AppAutocomplete
              v-model="filtros.cliente_id"
              label="Cliente"
              :items="clientes"
              item-title="nome"
              item-value="id"
              clearable
            />
          </VCol>

          <VCol
            cols="12"
            md="3"
          >
            <AppDateTimePicker
              v-model="filtros.data_inicio"
              label="Data Início"
              clearable
            />
          </VCol>
          
          <!-- Mais filtros... -->
        </VRow>
        
        <!-- Ações -->
        <VRow class="mt-3">
          <VCol>
            <VBtn
              color="primary"
              @click="aplicarFiltros"
            >
              <VIcon icon="tabler-search" />
              Filtrar
            </VBtn>
            
            <VBtn
              color="secondary"
              variant="outlined"
              class="ms-2"
              @click="limparFiltros"
            >
              <VIcon icon="tabler-x" />
              Limpar
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    
    <!-- Tabela de dados -->
    <VCard class="mt-4">
      <VCardTitle>
        <span>Total: {{ ordens.length }} registros</span>
      </VCardTitle>
      
      <VDataTable
        :headers="headers"
        :items="ordens"
        :loading="loading"
        item-key="id"
        class="text-no-wrap"
        :items-per-page="25"
      >
        <!-- Slots para formatação customizada -->
        <template #[`item.data_inspecao`]="{ item }">
          {{ formatDate(item.data_inspecao) }}
        </template>
        
        <template #[`item.valor`]="{ item }">
          {{ formatCurrency(item.valor) }}
        </template>
        
        <template #no-data>
          <div class="text-center py-4">
            <VIcon icon="tabler-inbox" size="48" class="text-disabled mb-2" />
            <p class="text-disabled">Nenhum registro encontrado</p>
          </div>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCSVExport } from '@/composables/useCSVExport'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { InmetroService } from '@/pages/inmetro/services/InmetroService'

// Composables
const { exportBlobToCSV } = useCSVExport()
const snackbar = useSnackbarStore()

// Estados reativas
const loading = ref(false)
const isExporting = ref(false)
const ordens = ref([])
const clientes = ref([])

// Filtros
const filtros = ref({
  cliente_id: null,
  data_inicio: null,
  data_fim: null,
  responsavel_id: null,
  tipo_servico_id: null,
  escopo_id: null,
})

// Headers da tabela
const headers = [
  { title: 'OS', key: 'numero', width: '100px' },
  { title: 'Cliente', key: 'cliente.nome', width: '200px' },
  { title: 'Responsável', key: 'funcionario.nome', width: '150px' },
  { title: 'Data Inspeção', key: 'data_inspecao', width: '120px' },
  { title: 'Tipo Serviço', key: 'tipo_servico.nome', width: '150px' },
  { title: 'Escopo', key: 'escopo.nome', width: '200px' },
  { title: 'Valor', key: 'valor', width: '120px', align: 'end' },
]

// Computed
const filtrosLimpos = computed(() => {
  const obj = {}
  Object.entries(filtros.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      obj[key] = value
    }
  })
  return obj
})

// Métodos
const carregarDados = async () => {
  try {
    loading.value = true
    // Aqui você faria a requisição para carregar os dados
    // const response = await InmetroService.listarRelatorios(filtrosLimpos.value)
    // ordens.value = response.data
  } catch (error) {
    snackbar.showSnackbar({
      text: 'Erro ao carregar dados',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

const aplicarFiltros = () => {
  carregarDados()
}

const limparFiltros = () => {
  filtros.value = {
    cliente_id: null,
    data_inicio: null,
    data_fim: null,
    responsavel_id: null,
    tipo_servico_id: null,
    escopo_id: null,
  }
  carregarDados()
}

// Método principal de exportação CSV
const exportarCSV = async () => {
  try {
    isExporting.value = true
    
    // Validação básica
    if (ordens.value.length === 0) {
      snackbar.showSnackbar({
        text: 'Não há dados para exportar',
        color: 'warning',
      })
      return
    }
    
    // Requisição ao backend com filtros
    const blob = await InmetroService.exportarCSV(filtrosLimpos.value)
    
    // Download do arquivo
    const filename = `relatorios_${new Date().toISOString().split('T')[0]}.csv`
    await exportBlobToCSV(blob, { filename })
    
    // Feedback de sucesso
    snackbar.showSnackbar({
      text: `CSV exportado com sucesso! ${ordens.value.length} registros.`,
      color: 'success',
    })
    
  } catch (error) {
    console.error('Erro na exportação CSV:', error)
    
    snackbar.showSnackbar({
      text: 'Erro ao exportar CSV. Tente novamente.',
      color: 'error',
    })
  } finally {
    isExporting.value = false
  }
}

// Utilitários de formatação
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

const formatCurrency = (value: number) => {
  if (!value) return '-'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Lifecycle
onMounted(() => {
  carregarDados()
})
</script>

<style scoped>
/* Estilos específicos se necessário */
.v-btn--loading {
  pointer-events: none;
}
</style>
