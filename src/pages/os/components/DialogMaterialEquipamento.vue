<script setup lang="ts">
import { getOSStatusColor, getOSStatusLabel } from '@/enums/OSStatusEnum'
import type { IMaterialEquipamento, IOrdemServico } from '@/pages/inmetro/types/index'

const props = defineProps<{
  isDialogVisible: boolean
  os: IOrdemServico | null
  carregarMateriais: () => Promise<IMaterialEquipamento[]>
}>()

const emit = defineEmits<{
  (e: 'update:isDialogVisible', value: boolean): void
}>()

// Estados para carregamento
const loading = ref(false)
const materiaisEquipamentos = ref<IMaterialEquipamento[]>([])

// Computed que funciona como v-model
const isDialogVisible = computed({
  get: () => props.isDialogVisible,
  set: (value: boolean) => emit('update:isDialogVisible', value),
})

// Headers para a tabela de materiais
const headers = [
  { title: '#', key: 'index', width: '60px' },
  { title: 'Descrição', key: 'descricao' },
]

// Watch para carregar dados quando o dialog abrir
watch(() => props.isDialogVisible, (newValue: boolean) => {
  if (newValue && props.os) {
    props.carregarMateriais().then(materiais => {
      materiaisEquipamentos.value = materiais ?? []
      loading.value = false
    }).catch(error => {
      console.error('Erro ao carregar materiais:', error)
      loading.value = false
    })
  }
}, { immediate: true })
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="800"
    scrollable
  >
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span>Materiais e Equipamentos</span>
        <VIcon
          icon="tabler-x"
          @click="isDialogVisible = false"
        />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <div v-if="props.os">
          <!-- Informações da OS -->
          <div class="mb-4">
            <VCard
              variant="outlined"
              class="pa-4"
            >
              <VCardTitle class="text-subtitle-1 font-weight-bold mb-2 pa-0">
                Informações da Ordem de Serviço
              </VCardTitle>
              <VDivider class="mb-4" />
              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <p><strong>Código:</strong> {{ props.os.codigo || 'N/A' }}</p>
                  <p><strong>Cliente:</strong> {{ props.os.cliente?.nome_fantasia || 'N/A' }}</p>
                  <p><strong>Fornecedor:</strong> {{ props.os.fornecedor || 'N/A' }}</p>
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <p><strong>Nº Pedido:</strong> {{ props.os.num_pedido_compra || 'N/A' }}</p>
                  <p><strong>Responsável:</strong> {{ props.os.responsavel?.nome || 'N/A' }}</p>
                  <strong>Status atual:</strong> <VChip :color="getOSStatusColor(os.status)">
                    {{ getOSStatusLabel(os.status) || 'N/A' }}
                  </VChip>
                </VCol>
              </VRow>
            </VCard>
          </div>

          <!-- Lista de Materiais/Equipamentos -->
          <div class="mb-4">
            <h6 class="text-subtitle-1 mb-3">
              Lista de Materiais e Equipamentos
              <VChip
                size="small"
                color="primary"
                class="ms-2"
              >
                {{ materiaisEquipamentos.length }} {{ materiaisEquipamentos.length === 1 ? 'item' : 'itens' }}
              </VChip>
            </h6>

            <div
              v-if="loading"
              class="text-center py-8"
            >
              <VProgressCircular
                indeterminate
                color="primary"
                size="64"
                class="mb-4"
              />
              <p class="text-body-1">
                Carregando materiais e equipamentos...
              </p>
            </div>

            <div v-else-if="materiaisEquipamentos.length > 0">
              <VDataTable
                :headers="headers"
                :items="materiaisEquipamentos"
                :items-per-page="10"
                class="elevation-1"
                no-data-text="Nenhum material/equipamento encontrado"
              >
                <template #[`item.index`]="{ index }">
                  {{ index + 1 }}
                </template>

                <template #[`item.descricao`]="{ item }">
                  <div class="py-2">
                    <p class="mb-0">
                      {{ item.descricao }}
                    </p>
                  </div>
                </template>
              </VDataTable>
            </div>

            <div
              v-else
              class="text-center py-8"
            >
              <VIcon
                icon="tabler-package-off"
                size="64"
                color="grey-lighten-1"
                class="mb-4"
              />
              <p class="text-grey-lighten-1 text-body-1">
                Nenhum material ou equipamento cadastrado para esta ordem de serviço.
              </p>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center py-8"
        >
          <VIcon
            icon="tabler-alert-circle"
            size="64"
            color="warning"
            class="mb-4"
          />
          <p class="text-warning text-body-1">
            Não foi possível carregar as informações da ordem de serviço.
          </p>
        </div>
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn
          variant="outlined"
          @click="isDialogVisible = false"
        >
          Fechar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
