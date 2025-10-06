<script setup lang="ts">
import moment from 'moment'
import {
  OsStatusEnum,
  getOSStatusColor,
  getOSStatusIcon,
  getOSStatusLabel,
} from '../../enums/OSStatusEnum'
import { useAuth } from '@/composables/useAuth'
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
const { hasRole } = useAuth()

const {
  page, total, filtros,
  ordensServico, estatisticas, isDialogAprovarVisible, isDialogReprovarVisible,
} = storeToRefs(store)

const {
  menuList,
  ordemServicoAtual,
  confirmarFinalizacao,
  confirmarReprovacao,
  nextPage,
  previousPage,
  enviarEmailCliente,
  enviarSolicitacaoResponsavel,
} = store

// Método para aplicar filtro
const aplicarFiltroStatus = async (status: string) => {
  page.value = 1
  total.value = 0
  filtros.value = {
    ...filtros.value,
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

// Estado para controle de loading do email
const loadingEmailCliente = ref(false)
const loadingEmailResponsavel = ref(false)

// Função para enviar email ao cliente
const enviarEmailParaCliente = async (os: any) => {
  try {
    loadingEmailCliente.value = true
    await enviarEmailCliente(os.id)

    // Recarregar a lista para atualizar o status
    await store.fetchOrdensServico()
  }
  catch (error) {
    console.error('Erro ao enviar e-mail para o cliente:', error)
  }
  finally {
    loadingEmailCliente.value = false
  }
}

// Função para enviar email ao responsável
const enviarEmailParaResponsavel = async (os: any) => {
  try {
    loadingEmailResponsavel.value = true
    await enviarSolicitacaoResponsavel(os.id)

    // Recarregar a lista para atualizar o status
    await store.fetchOrdensServico()
  }
  catch (error) {
    console.error('Erro ao enviar e-mail para o responsável:', error)
  }
  finally {
    loadingEmailResponsavel.value = false
  }
}

// Função para verificar se o email já foi enviado hoje
const emailJaEnviadoHoje = (os: any) => {
  if (!os.email_cliente_enviado_em)
    return false

  const dataEnvio = new Date(os.email_cliente_enviado_em)
  const hoje = new Date()

  return dataEnvio.toDateString() === hoje.toDateString()
}

// Função para verificar se o email para o responsável já foi enviado hoje
const emailResponsavelJaEnviadoHoje = (os: any) => {
  if (!os.email_responsavel_enviado_em)
    return false

  const dataEnvio = new Date(os.email_responsavel_enviado_em)
  const hoje = new Date()

  return dataEnvio.toDateString() === hoje.toDateString()
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
                    :color="getOSStatusColor(os.status || null)"
                    variant="tonal"
                  >
                    <VIcon :icon="getOSStatusIcon(os.status || null)" />
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
                      :color="getOSStatusColor(os.status || null)"
                      variant="tonal"
                      size="small"
                      :text="getOSStatusLabel(os.status || null)"
                    />

                    <!-- Botão para enviar email ao responsável (apenas pleno ou admin) -->
                    <CDFButton
                      v-if="(hasRole('pleno') || hasRole('admin')) && os.responsavel && !emailResponsavelJaEnviadoHoje(os)"
                      icon="tabler-mail"
                      size="small"
                      color="secondary"
                      variant="text"
                      :loading="loadingEmailResponsavel"
                      title="Enviar e-mail para o responsável"
                      @click="enviarEmailParaResponsavel(os)"
                    />

                    <!-- Indicador de email já enviado para responsável (apenas pleno ou admin) -->
                    <VTooltip
                      v-else-if="(hasRole('pleno') || hasRole('admin')) && emailResponsavelJaEnviadoHoje(os)"
                      text="E-mail já enviado hoje para o responsável"
                      location="top"
                    >
                      <template #activator="{ props: tooltipProps }">
                        <VBtn
                          v-bind="tooltipProps"
                          icon="tabler-mail-check"
                          size="small"
                          color="success"
                          variant="text"
                          disabled
                        />
                      </template>
                    </VTooltip>

                    <!-- Botão para enviar email ao cliente (apenas pleno ou admin) -->
                    <CDFButton
                      v-if="(hasRole('pleno') || hasRole('admin')) && os.cliente?.email && !emailJaEnviadoHoje(os)"
                      icon="tabler-mail"
                      size="small"
                      color="info"
                      variant="text"
                      :loading="loadingEmailCliente"
                      title="Enviar e-mail para o cliente"
                      @click="enviarEmailParaCliente(os)"
                    />

                    <!-- Indicador de email já enviado para cliente (apenas pleno ou admin) -->
                    <VTooltip
                      v-else-if="(hasRole('pleno') || hasRole('admin')) && emailJaEnviadoHoje(os)"
                      text="E-mail já enviado hoje para o cliente"
                      location="top"
                    >
                      <template #activator="{ props: tooltipProps }">
                        <VBtn
                          v-bind="tooltipProps"
                          icon="tabler-mail-check"
                          size="small"
                          color="success"
                          variant="text"
                          disabled
                        />
                      </template>
                    </VTooltip>

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
                :variant="!(filtros as any)?.status ? 'flat' : 'outlined'"
                :color="!(filtros as any)?.status ? 'primary' : 'default'"
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
                :variant="(filtros as any)?.status === OsStatusEnum.EM_ANALISE ? 'flat' : 'outlined'"
                :color="(filtros as any)?.status === OsStatusEnum.EM_ANALISE ? 'info' : 'default'"
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
                :variant="(filtros as any)?.status === OsStatusEnum.ANDAMENTO ? 'flat' : 'outlined'"
                :color="(filtros as any)?.status === OsStatusEnum.ANDAMENTO ? 'warning' : 'default'"
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
                :variant="(filtros as any)?.status === OsStatusEnum.CERTIFICADO_PENDENTE ? 'flat' : 'outlined'"
                :color="(filtros as any)?.status === OsStatusEnum.CERTIFICADO_PENDENTE ? 'deep-orange' : 'default'"
                size="small"
                class="justify-start"
                @click="aplicarFiltroStatus(OsStatusEnum.CERTIFICADO_PENDENTE)"
              >
                <VIcon
                  start
                  size="16"
                >
                  tabler-certificate
                </VIcon>
                Certificado Pendente
              </VBtn>

              <VBtn
                :variant="(filtros as any)?.status === OsStatusEnum.FINALIZADO ? 'flat' : 'outlined'"
                :color="(filtros as any)?.status === OsStatusEnum.FINALIZADO ? 'success' : 'default'"
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
