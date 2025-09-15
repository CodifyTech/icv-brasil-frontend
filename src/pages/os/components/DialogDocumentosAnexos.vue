<script setup lang="ts">
import { getOSStatusColor, getOSStatusLabel } from '@/enums/OSStatusEnum'
import type { IOrdemServico, IOrdemServicoAnexo, IOrdemServicoFoto } from '@/pages/inmetro/types/index'

const props = defineProps<{
  isDialogVisible: boolean
  os: IOrdemServico | null
  carregarAnexos: () => Promise<IOrdemServicoAnexo[]>
  carregarFotos: () => Promise<IOrdemServicoFoto[]>
}>()

const emit = defineEmits<{
  (e: 'update:isDialogVisible', value: boolean): void
}>()

// Estados para carregamento
const loading = ref(false)
const anexos = ref<IOrdemServicoAnexo[]>([])
const fotos = ref<IOrdemServicoFoto[]>([])
const tab = ref(1)

// Computed que funciona como v-model
const isDialogVisible = computed({
  get: () => props.isDialogVisible,
  set: (value: boolean) => emit('update:isDialogVisible', value),
})

// Watch para carregar dados quando o dialog abrir
watch(() => props.isDialogVisible, async (newValue: boolean) => {
  if (newValue && props.os) {
    console.log('Carregando anexos para OS:', props.os.id)
    loading.value = true
    try {
      const resultadoAnexos = await props.carregarAnexos()
      const resultadoFotos = await props.carregarFotos()

      console.log('Anexos carregados:', resultadoAnexos)
      console.log('Fotos carregadas:', resultadoFotos)

      anexos.value = resultadoAnexos || []
      fotos.value = resultadoFotos || []
    }
    catch (error) {
      console.error('Erro ao carregar anexos:', error)
      anexos.value = []
    }
    finally {
      loading.value = false
    }
  }
}, { immediate: true })

// Headers para a tabela de anexos
const headers = [
  { title: '#', key: 'index', width: '60px' },
  { title: 'Nome do Arquivo', key: 'nome' },
  { title: 'INMETRO', key: 'inmetro_flag', width: '100px' },
  { title: 'Ações', key: 'actions', width: '120px', sortable: false },
]

// Função para download/visualização do anexo
const visualizarAnexo = (anexo: IOrdemServicoAnexo) => {
  window.open(anexo.anexo as string, '_blank')
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="900"
    scrollable
  >
    <VCard title="Documentos e Anexos">
      <template #append>
        <VIcon
          icon="tabler-x"
          @click="isDialogVisible = false"
        />
      </template>

      <VCardText>
        <div v-if="props.os">
          <!-- Informações da OS -->
          <div class="mb-4">
            <VCard
              variant="outlined"
              class="pa-4"
            >
              <VCardTitle class="mb-2 text-subtitle-1 font-weight-bold pa-0">
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
                  <strong>Status atual:</strong> <VChip
                    size="small"
                    density="comfortable"
                    :color="getOSStatusColor(os.status)"
                  >
                    {{ getOSStatusLabel(os.status) || 'N/A' }}
                  </VChip>
                </VCol>
              </VRow>
            </VCard>
          </div>

          <VTabs
            v-model="tab"
            align-tabs="center"
          >
            <VTab :value="1">
              Anexos
            </VTab>
            <VTab :value="2">
              Fotos
            </VTab>
          </VTabs>

          <VTabsWindow v-model="tab">
            <VTabsWindowItem :value="1">
              <!-- Lista de Anexos -->
              <div>
                <h6 class="my-3 d-flex align-center text-subtitle-1">
                  <span>Documentos Anexados</span>
                  <VSpacer />
                  <VChip
                    size="small"
                    color="primary"
                    class="ms-2"
                  >
                    {{ anexos?.length }} {{ anexos?.length === 1 ? 'documento' : 'documentos' }}
                  </VChip>
                </h6>

                <div
                  v-if="loading"
                  class="py-8 text-center"
                >
                  <VProgressCircular
                    indeterminate
                    color="primary"
                    size="64"
                    class="mb-4"
                  />
                  <p class="text-body-1">
                    Carregando documentos e anexos...
                  </p>
                </div>

                <div v-else-if="anexos?.length > 0">
                  <VDataTable
                    :headers="headers"
                    :items="anexos"
                    :items-per-page="10"
                    class="elevation-1"
                    no-data-text="Nenhum documento encontrado"
                  >
                    <template #[`item.index`]="{ index }">
                      {{ index + 1 }}
                    </template>

                    <template #[`item.nome`]="{ item }">
                      <div class="py-2 d-flex align-center">
                        <VIcon
                          icon="tabler-file"
                          class="me-2"
                          size="20"
                        />
                        <div>
                          <p class="mb-0 font-weight-medium">
                            {{ item.nome }}
                          </p>
                          <p class="mb-0 text-caption text-grey">
                            ID: {{ item.id }}
                          </p>
                        </div>
                      </div>
                    </template>

                    <template #[`item.inmetro_flag`]="{ item }">
                      <VChip
                        size="small"
                        :color="item.inmetro_flag ? 'success' : 'default'"
                        :variant="item.inmetro_flag ? 'flat' : 'outlined'"
                      >
                        <VIcon
                          :icon="item.inmetro_flag ? 'tabler-check' : 'tabler-x'"
                          size="14"
                          class="me-1"
                        />
                        {{ item.inmetro_flag ? 'Sim' : 'Não' }}
                      </VChip>
                    </template>

                    <template #[`item.actions`]="{ item }">
                      <div class="gap-1 d-flex">
                        <VBtn
                          size="small"
                          color="secondary"
                          variant="text"
                          icon="tabler-download"
                          @click="visualizarAnexo(item)"
                        />
                      </div>
                    </template>
                  </VDataTable>
                </div>

                <div
                  v-else
                  class="py-8 text-center"
                >
                  <VIcon
                    icon="tabler-file-off"
                    size="64"
                    color="grey-lighten-1"
                    class="mb-4"
                  />
                  <p class="text-grey-lighten-1 text-body-1">
                    Nenhum documento anexado para esta ordem de serviço.
                  </p>
                </div>
              </div>
            </VTabsWindowItem>
            <VTabsWindowItem :value="2">
              <div>
                <h6 class="my-3 d-flex align-center text-subtitle-1">
                  <span>Fotos Anexadas</span>
                  <VSpacer />
                  <VChip
                    size="small"
                    color="primary"
                    class="ms-2"
                  >
                    {{ fotos?.length }} {{ fotos?.length === 1 ? 'foto' : 'fotos' }}
                  </VChip>
                </h6>

                <div
                  v-if="loading"
                  class="py-8 text-center"
                >
                  <VProgressCircular
                    indeterminate
                    color="primary"
                    size="64"
                    class="mb-4"
                  />
                  <p class="text-body-1">
                    Carregando fotos...
                  </p>
                </div>

                <div v-else-if="fotos?.length > 0">
                  <VDataIterator
                    :items="fotos"
                    :items-per-page="9"
                  >
                    <template #default="{ items }">
                      <VRow>
                        <VCol
                          v-for="foto in items"
                          :key="foto.raw.id"
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <VCard>
                            <VImg
                              :src="foto.raw.file"
                              :lazy-src="foto.raw.file"
                              height="200"
                              cover
                              class="cursor-pointer"
                              @click="() => window.open(foto.raw.file, '_blank')"
                            />
                          </VCard>
                        </VCol>
                      </VRow>
                    </template>

                    <template #footer="{ page, pageCount, prevPage, nextPage }">
                      <div class="justify-center d-flex align-center pa-4">
                        <VBtn
                          :disabled="page === 1"
                          icon="tabler-chevron-left"
                          variant="text"
                          @click="prevPage"
                        />
                        <div class="mx-2 text-caption">
                          Página {{ page }} de {{ pageCount }}
                        </div>
                        <VBtn
                          :disabled="page >= pageCount"
                          icon="tabler-chevron-right"
                          variant="text"
                          @click="nextPage"
                        />
                      </div>
                    </template>

                    <template #no-data>
                      <div class="py-8 text-center">
                        <VIcon
                          icon="tabler-photo-off"
                          size="64"
                          color="grey-lighten-1"
                          class="mb-4"
                        />
                        <p class="text-grey-lighten-1 text-body-1">
                          Nenhuma foto encontrada.
                        </p>
                      </div>
                    </template>
                  </VDataIterator>
                </div>

                <div
                  v-else
                  class="py-8 text-center"
                >
                  <VIcon
                    icon="tabler-photo-off"
                    size="64"
                    color="grey-lighten-1"
                    class="mb-4"
                  />
                  <p class="text-grey-lighten-1 text-body-1">
                    Nenhuma foto anexada para esta ordem de serviço.
                  </p>
                </div>
              </div>
            </VTabsWindowItem>
          </VTabsWindow>
        </div>

        <div
          v-else
          class="py-8 text-center"
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
    </VCard>
  </VDialog>
</template>
