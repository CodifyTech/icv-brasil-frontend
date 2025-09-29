<script setup lang="ts">
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { getOSStatusColor, getOSStatusLabel } from '@/enums/OSStatusEnum'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

definePage({
  meta: {
    navActiveLink: 'os',
    action: 'read',
    subject: 'os',
  },
})

const route = useRoute()
const store = useOrdemServicoStore()
const snackbarStore = useSnackbarStore()

const { ordemServicoAtual, loading } = storeToRefs(store)
const { fetchOrdemServico, resetOrdemAtual, enviarEmailCliente } = store

onMounted(async () => {
  if (route.params.id && typeof route.params.id === 'string')
    await fetchOrdemServico(route.params.id)
})

onBeforeRouteLeave(() => {
  resetOrdemAtual()
})

// Estado para controle de loading do email
const loadingEmail = ref(false)
const loadingEmailCliente = ref(false)

// Função para enviar solicitação para responsável
const enviarSolicitacaoResponsavel = async () => {
  if (!ordemServicoAtual.value?.id)
    return

  try {
    loadingEmail.value = true

    await store.enviarSolicitacaoResponsavel(ordemServicoAtual.value.id)

    snackbarStore.showSnackbar({
      text: 'E-mail enviado para o responsável com sucesso!',
      color: 'success',
    })

    // Recarregar a OS para atualizar o status
    if (route.params.id && typeof route.params.id === 'string')
      await fetchOrdemServico(route.params.id)
  }
  catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    snackbarStore.showSnackbar({
      text: 'Erro ao enviar e-mail para o responsável',
      color: 'error',
    })
  }
  finally {
    loadingEmail.value = false
  }
}

// Função para verificar se o email já foi enviado hoje
const emailJaEnviadoHoje = computed(() => {
  if (!ordemServicoAtual.value?.email_responsavel_enviado_em)
    return false

  const dataEnvio = new Date(ordemServicoAtual.value.email_responsavel_enviado_em)
  const hoje = new Date()

  return dataEnvio.toDateString() === hoje.toDateString()
})

// Função para enviar email ao cliente
const enviarEmailParaCliente = async () => {
  if (!ordemServicoAtual.value?.id)
    return

  try {
    loadingEmailCliente.value = true

    await enviarEmailCliente(ordemServicoAtual.value.id)

    snackbarStore.showSnackbar({
      text: 'E-mail enviado para o cliente com sucesso!',
      color: 'success',
    })

    // Recarregar a OS para atualizar o status
    if (route.params.id && typeof route.params.id === 'string')
      await fetchOrdemServico(route.params.id)
  }
  catch (error) {
    console.error('Erro ao enviar e-mail para o cliente:', error)
    snackbarStore.showSnackbar({
      text: 'Erro ao enviar e-mail para o cliente',
      color: 'error',
    })
  }
  finally {
    loadingEmailCliente.value = false
  }
}

// Função para verificar se o email para o cliente já foi enviado hoje
const emailClienteJaEnviadoHoje = computed(() => {
  if (!ordemServicoAtual.value?.email_cliente_enviado_em)
    return false

  const dataEnvio = new Date(ordemServicoAtual.value.email_cliente_enviado_em)
  const hoje = new Date()

  return dataEnvio.toDateString() === hoje.toDateString()
})

// Verificar se pode enviar email
const podeEnviarEmail = computed(() => {
  return ordemServicoAtual.value?.responsavel && !emailJaEnviadoHoje.value
})

// Verificar se pode enviar email para o cliente
const podeEnviarEmailCliente = computed(() => {
  return ordemServicoAtual.value?.cliente?.email && !emailClienteJaEnviadoHoje.value
})
</script>

<template>
  <div>
    <!-- Header -->
    <VRow>
      <VCol cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="mb-2 text-h4 font-weight-bold">
              Visualizar Ordem de Serviço
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              Detalhes da ordem de serviço {{ ordemServicoAtual?.codigo }}
            </p>
          </div>

          <div class="gap-3 d-flex">
            <!-- Botão de enviar para responsável -->
            <VBtn
              v-if="podeEnviarEmail"
              color="secondary"
              variant="outlined"
              prepend-icon="tabler-mail"
              :loading="loadingEmail"
              @click="enviarSolicitacaoResponsavel"
            >
              Enviar para Responsável
            </VBtn>

            <!-- Indicador de email já enviado para responsável -->
            <VTooltip
              v-else-if="emailJaEnviadoHoje"
              text="E-mail já enviado hoje para o responsável"
              location="top"
            >
              <template #activator="{ props: tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  color="success"
                  variant="text"
                  prepend-icon="tabler-mail-check"
                  disabled
                >
                  E-mail Enviado
                </VBtn>
              </template>
            </VTooltip>

            <!-- Botão de enviar para cliente -->
            <VBtn
              v-if="podeEnviarEmailCliente"
              color="info"
              variant="outlined"
              prepend-icon="tabler-mail"
              :loading="loadingEmailCliente"
              @click="enviarEmailParaCliente"
            >
              Enviar para Cliente
            </VBtn>

            <!-- Indicador de email já enviado para cliente -->
            <VTooltip
              v-else-if="emailClienteJaEnviadoHoje"
              text="E-mail já enviado hoje para o cliente"
              location="top"
            >
              <template #activator="{ props: tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  color="success"
                  variant="text"
                  prepend-icon="tabler-mail-check"
                  disabled
                >
                  E-mail Cliente Enviado
                </VBtn>
              </template>
            </VTooltip>

            <VBtn
              color="primary"
              variant="outlined"
              prepend-icon="tabler-arrow-left"
              to="/inmetro"
            >
              Voltar
            </VBtn>
          </div>
        </div>
      </VCol>
    </VRow>

    <!-- Loading -->
    <VRow v-if="loading.item">
      <VCol
        cols="12"
        class="text-center"
      >
        <VProgressCircular
          indeterminate
          color="primary"
        />
      </VCol>
    </VRow>

    <!-- Content -->
    <VRow v-else-if="ordemServicoAtual">
      <!-- Informações Básicas -->
      <VCol
        cols="12"
        md="8"
      >
        <VCard>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <h2 class="text-h5">
                  Informações da Ordem de Serviço
                </h2>
              </VCol>

              <VCol
                cols="12"
                md="6"
                class="pb-0"
              >
                <label class="text-body-2 text-medium-emphasis">Número da OS</label>
                <div class="text-body-1 font-weight-medium">
                  {{ ordemServicoAtual.codigo }}
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
                class="pb-0"
              >
                <label class="text-body-2 text-medium-emphasis">Código da Proposta</label>
                <div class="text-body-1 font-weight-medium">
                  {{ (ordemServicoAtual as any)?.proposta?.codigo_proposta }}
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
                class="pb-0"
              >
                <label class="text-body-2 text-medium-emphasis">Cliente</label>
                <div class="text-body-1 font-weight-medium">
                  {{ ordemServicoAtual.cliente?.razao_social || ordemServicoAtual.cliente?.nome_fantasia }}
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
                class="pb-0"
              >
                <label class="text-body-2 text-medium-emphasis">Data de Abertura</label>
                <div class="text-body-1 font-weight-medium">
                  {{ moment(ordemServicoAtual.created_at).format('DD/MM/YYYY') }}
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
                class="pb-0"
              >
                <label class="text-body-2 text-medium-emphasis">Status</label>
                <div>
                  <VChip
                    :color="getOSStatusColor(ordemServicoAtual.status || null)"
                    variant="tonal"
                    size="small"
                  >
                    {{ getOSStatusLabel(ordemServicoAtual.status || null) }}
                  </VChip>
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
                class="pb-0"
              >
                <label class="text-body-2 text-medium-emphasis">Tipo de Serviço</label>
                <div class="text-body-1 font-weight-medium">
                  {{ ordemServicoAtual.tipo_servico?.nome || '-' }}
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
                class="pb-0"
              >
                <label class="text-body-2 text-medium-emphasis">Responsável</label>
                <div class="text-body-1 font-weight-medium">
                  {{ ordemServicoAtual.responsavel?.nome || '-' }}
                </div>
              </VCol>

              <VCol
                v-if="ordemServicoAtual.descritivo"
                cols="12"
                class="pb-0"
              >
                <label class="text-body-2 text-medium-emphasis">Observações</label>
                <div class="text-body-1">
                  {{ ordemServicoAtual.descritivo }}
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Actions -->
      <VCol
        cols="12"
        md="4"
      >
        <VCard>
          <VCardTitle>Ações</VCardTitle>
          <VCardText>
            <VBtn
              block
              color="primary"
              variant="outlined"
              class="mb-3"
              :to="`/os/editar/${ordemServicoAtual.id}`"
            >
              <VIcon start>
                tabler-edit
              </VIcon>
              Editar
            </VBtn>

            <!--
              <VBtn
              v-if="ordemServicoAtual.status === 'finalizado'"
              block
              color="success"
              variant="outlined"
              class="mb-3"
              >
              <VIcon start>
              tabler-download
              </VIcon>
              Download Relatório
              </VBtn>

              <VBtn
              block
              color="info"
              variant="outlined"
              >
              <VIcon start>
              tabler-upload
              </VIcon>
              Upload Anexos
              </VBtn>
            -->
          </VCardText>
        </VCard>
      </VCol>

      <!-- Anexos -->
      <VCol
        v-if="ordemServicoAtual.anexos?.length"
        cols="12"
      >
        <VCard>
          <VCardTitle>Anexos</VCardTitle>
          <VCardText>
            <VRow>
              <VCol
                v-for="anexo in ordemServicoAtual.anexos"
                :key="anexo.id"
                cols="2"
              >
                <VCard
                  :href="anexo.anexo"
                  target="_blank"
                  variant="outlined"
                >
                  <VCardText class="text-center">
                    <VIcon
                      size="48"
                      class="mb-2"
                    >
                      tabler-file
                    </VIcon>
                    <p class="mb-1 text-body-2">
                      {{ anexo.nome }}
                    </p>
                    <VChip
                      v-if="anexo.inmetro_flag"
                      color="success"
                      size="x-small"
                    >
                      Inmetro
                    </VChip>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard>
          <VCardTitle>Fotos</VCardTitle>
          <VCardText>
            <VDataIterator
              :items="ordemServicoAtual.fotos"
              :items-per-page="9"
            >
              <template #default="{ items }">
                <VRow>
                  <VCol
                    v-for="foto in items"
                    :key="foto.raw.id"
                    cols="12"
                    sm="6"
                    md="3"
                  >
                    <VCard>
                      <VImg
                        :src="foto.raw.file as string"
                        :lazy-src="foto.raw.file as string"
                        height="200"
                        cover
                        class="cursor-pointer"
                        @click="() => (window as any).open(foto.raw.file, '_blank')"
                      />
                    </VCard>
                  </VCol>
                </VRow>
              </template>

              <template #footer="{ page, pageCount, prevPage, nextPage }">
                <div
                  v-if="(ordemServicoAtual?.fotos?.length || 0) > 0"
                  class="justify-center d-flex align-center pa-4"
                >
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
                <div class="text-center">
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
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Not Found -->
    <VRow v-else>
      <VCol
        cols="12"
        class="text-center"
      >
        <VIcon
          size="64"
          class="mb-4 text-medium-emphasis"
        >
          tabler-file-x
        </VIcon>
        <h2 class="mb-2 text-h6">
          Ordem de serviço não encontrada
        </h2>
        <p class="mb-4 text-body-2 text-medium-emphasis">
          A ordem de serviço que você está procurando não existe ou foi removida.
        </p>
        <VBtn
          color="primary"
          to="/inmetro"
        >
          Voltar para lista
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
