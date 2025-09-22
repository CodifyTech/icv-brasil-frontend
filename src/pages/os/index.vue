<script setup lang="ts">
import moment from 'moment'
import {
  OsStatusEnum,
  getOSStatusColor,
  getOSStatusIcon,
  getOSStatusLabel,
} from '../../enums/OSStatusEnum'
import DialogFinalizarOs from '@/pages/os/components/DialogFinalizarOS.vue'
import DialogReprovarOs from '@/pages/os/components/DialogReprovarOS.vue'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'

definePage({
  meta: {
    action: 'read',
    subject: 'os',
  },
})

const store = useOrdemServicoStore()

const {
  page, total, filtros, itemsPerPage,
  ordensServico, estatisticas, isDialogAprovarVisible, isDialogReprovarVisible,
} = storeToRefs(store)

const {
  menuList,
  ordemServicoAtual,
  confirmarFinalizacao,
  confirmarReprovacao,
  nextPage,
  previousPage,
} = store

// Método para aplicar filtro
const aplicarFiltroStatus = async (status: string) => {
  page.value = 1
  total.value = 0
  filtros.value = {
    status,
  }
  await store.fetchOrdensServico()
}

// Método para limpar filtros
const limparFiltros = async () => {
  page.value = 1
  total.value = 0
  filtros.value = {}
  await store.fetchOrdensServico()
}

onMounted(async () => {
  await Promise.all([
    store.fetchOrdensServico(),
  ])
})
</script>

<template>
  <div>
    <!-- Estatísticas -->
    <VRow class="mb-6">
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar
                color="primary"
                variant="tonal"
                rounded
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-file" />
              </VAvatar>
              <div>
                <h3 class="text-h5 font-weight-bold">
                  {{ estatisticas?.total }}
                </h3>
                <p class="mb-0 text-body-2 text-medium-emphasis">
                  Total de OS
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar
                color="info"
                variant="tonal"
                rounded
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-clock" />
              </VAvatar>
              <div>
                <h3 class="text-h5 font-weight-bold">
                  {{ estatisticas.analise }}
                </h3>
                <p class="mb-0 text-body-2 text-medium-emphasis">
                  Em Análise
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar
                color="warning"
                variant="tonal"
                rounded
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-progress" />
              </VAvatar>
              <div>
                <h3 class="text-h5 font-weight-bold">
                  {{ estatisticas.andamento }}
                </h3>
                <p class="mb-0 text-body-2 text-medium-emphasis">
                  Em Andamento
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar
                color="success"
                variant="tonal"
                rounded
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-check" />
              </VAvatar>
              <div>
                <h3 class="text-h5 font-weight-bold">
                  {{ estatisticas.finalizado }}
                </h3>
                <p class="mb-0 text-body-2 text-medium-emphasis">
                  Finalizados
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Ordens de Serviço -->
    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <VCard>
          <VCardTitle class="d-flex align-center justify-space-between">
            <span>Ordens de Serviço</span>
          </VCardTitle>

          <VDivider />

          <VCardText class="pa-0">
            <VList v-if="ordensServico?.length > 0">
              <VListItem
                v-for="os in ordensServico"
                :key="os.id"
              >
                <template #prepend>
                  <VAvatar
                    size="40"
                    :color="getOSStatusColor(os.status)"
                    variant="tonal"
                  >
                    <VIcon :icon="getOSStatusIcon(os.status)" />
                  </VAvatar>
                </template>

                <RouterLink :to="`/os/visualizar/${os.id}`">
                  <VListItemTitle>
                    {{ os.codigo }}
                  </VListItemTitle>

                  <VListItemSubtitle>
                    {{ os.cliente?.razao_social || os.cliente?.nome_fantasia }} • {{ moment(os.created_at).format('DD/MM/YYYY') }}
                  </VListItemSubtitle>
                </RouterLink>

                <template #append>
                  <div class="d-flex align-center gap-2">
                    <VChip
                      :color="getOSStatusColor(os.status)"
                      variant="tonal"
                      size="small"
                      :text="getOSStatusLabel(os.status)"
                    />

                    <CDFMoreBtn
                      color="gray"
                      :menu-list="menuList(os)"
                    />
                  </div>
                </template>
              </VListItem>
            </VList>

            <VDivider class="py-2" />

            <div class="d-flex gap-2 pt-0 pa-6">
              <CDFButton
                icon="tabler-arrow-left"
                icon-direction="left"
                :disabled="page === 1"
                variant="outlined"
                @click="previousPage"
              >
                Anterior
              </CDFButton>
              <VSpacer />
              <CDFButton
                icon="tabler-arrow-right"
                icon-direction="right"
                variant="outlined"
                @click="nextPage"
              >
                Próximo
              </CDFButton>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Ações Rápidas -->
      <VCol
        cols="12"
        md="4"
      >
        <VCard>
          <VCardTitle>Ações Rápidas</VCardTitle>

          <VCardText>
            <VBtn
              block
              color="primary"
              class="mb-3"
              to="/os/cadastrar"
            >
              <VIcon start>
                tabler-plus
              </VIcon>
              Nova Ordem de Serviço
            </VBtn>

            <!-- Filtros por Status -->
            <VDivider class="mb-4" />

            <div class="mb-3">
              <h6 class="text-subtitle-2 font-weight-medium mb-2">
                Filtrar por Status
              </h6>

              <!-- Botão para mostrar todas -->
              <VBtn
                :variant="!filtros?.status ? 'flat' : 'outlined'"
                :color="!filtros?.status ? 'primary' : 'default'"
                size="small"
                class="mb-2 me-2"
                @click="limparFiltros"
              >
                <VIcon
                  start
                  size="16"
                >
                  tabler-list
                </VIcon>
                Todas
              </VBtn>
            </div>

            <!-- Filtros por status específico -->
            <div class="d-flex flex-column gap-2">
              <VBtn
                :variant="filtros?.status === OsStatusEnum.EM_ANALISE ? 'flat' : 'outlined'"
                :color="filtros?.status === OsStatusEnum.EM_ANALISE ? 'info' : 'default'"
                size="small"
                class="justify-start"
                @click="aplicarFiltroStatus(OsStatusEnum.EM_ANALISE)"
              >
                <VIcon
                  start
                  size="16"
                >
                  tabler-eye
                </VIcon>
                Em Análise
              </VBtn>

              <VBtn
                :variant="filtros?.status === OsStatusEnum.ANDAMENTO ? 'flat' : 'outlined'"
                :color="filtros?.status === OsStatusEnum.ANDAMENTO ? 'warning' : 'default'"
                size="small"
                class="justify-start"
                @click="aplicarFiltroStatus(OsStatusEnum.ANDAMENTO)"
              >
                <VIcon
                  start
                  size="16"
                >
                  tabler-progress
                </VIcon>
                Em Andamento
              </VBtn>

              <VBtn
                :variant="filtros?.status === OsStatusEnum.FINALIZADO ? 'flat' : 'outlined'"
                :color="filtros?.status === OsStatusEnum.FINALIZADO ? 'success' : 'default'"
                size="small"
                class="justify-start"
                @click="aplicarFiltroStatus(OsStatusEnum.FINALIZADO)"
              >
                <VIcon
                  start
                  size="16"
                >
                  tabler-check
                </VIcon>
                Finalizados
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <DialogFinalizarOs
      v-model:is-dialog-visible="isDialogAprovarVisible"
      :os="ordemServicoAtual"
      @confirm="confirmarFinalizacao"
    />

    <DialogReprovarOs
      v-model:is-dialog-visible="isDialogReprovarVisible"
      :os="ordemServicoAtual"
      @confirm="confirmarReprovacao"
    />
  </div>
</template>
