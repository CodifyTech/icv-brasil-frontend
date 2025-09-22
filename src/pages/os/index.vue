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

const { ordensServico, estatisticas, isDialogAprovarVisible, isDialogReprovarVisible } = storeToRefs(store)

const {
  menuList,
  ordemServicoAtual,
  confirmarFinalizacao,
  confirmarReprovacao,
} = store

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
            <VBtn
              variant="text"
              size="small"
              to="/inmetro"
            >
              Ver todas
            </VBtn>
          </VCardTitle>

          <VDivider />

          <VCardText class="pa-0">
            <VList v-if="ordensServico?.length > 0">
              <VListItem
                v-for="os in ordensServico?.slice(0, 10)"
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
                      v-if="os.status === OsStatusEnum.EM_ANALISE || os.status === OsStatusEnum.ANDAMENTO"
                      color="gray"
                      :menu-list="store.menuList(os)"
                    />
                  </div>
                </template>
              </VListItem>
            </VList>

            <div
              v-else
              class="py-8 text-center"
            >
              <VIcon
                size="64"
                class="mb-4 text-medium-emphasis"
              >
                tabler-file-x
              </VIcon>
              <p class="text-body-1 text-medium-emphasis">
                Nenhuma ordem de serviço encontrada
              </p>
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
