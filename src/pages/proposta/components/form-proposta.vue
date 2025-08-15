<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { VForm } from 'vuetify/components/VForm'
import { usePropostaStore } from '../store/usePropostaStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import NovoServicoModal from '@/pages/proposta/components/NovoServicoModal.vue'
import { blurHandler } from '@/utils/generals'
import * as rules from '@/validators/cdf-rules'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = usePropostaStore()

const { data, loading, filiais, modal } = storeToRefs(store)

const { save, update, resetForm, fetchCliente } = store

onBeforeRouteLeave(() => {
  resetForm()
})

const form = ref<VForm>({} as VForm)

onMounted(() => {
  // 👉 methods
  fetchCliente()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    :title="!isEditing ? 'Criar Nova Proposta' : 'Editar Proposta'"
    :is-editing="isEditing"
    :is-header="isHeader"
    is-actions
    :actions="{
      save: {
        method: () => save(true)
          .then(() => {
            resetForm()
          }),
      },
      update: {
        method: () => update(true),
      },
      reset: {
        method: () => resetForm(),
      },
    }"
    back="/proposta"
  >
    <template #content>
      <!-- Breadcrumb de Progresso -->
      <VCol cols="12">
        <VCard
          variant="outlined"
          color="primary"
        >
          <VCardText class="py-3">
            <div class="d-flex align-center gap-4">
              <VChip
                :color="data.cliente_id ? 'success' : 'primary'"
                :variant="data.cliente_id ? 'elevated' : 'outlined'"
                size="small"
                prepend-icon="tabler-building"
              >
                1. Empresa
              </VChip>

              <VIcon
                icon="tabler-arrow-right"
                size="16"
                :color="data.cliente_id ? 'success' : 'grey'"
              />

              <VChip
                :color="data.consultor && data.pessoa_contato ? 'success' : data.cliente_id ? 'primary' : 'grey'"
                :variant="data.consultor && data.pessoa_contato ? 'elevated' : 'outlined'"
                size="small"
                prepend-icon="tabler-user"
              >
                2. Dados
              </VChip>

              <VIcon
                icon="tabler-arrow-right"
                size="16"
                :color="data.servicos.length > 0 ? 'success' : 'grey'"
              />

              <VChip
                :color="data.servicos.length > 0 ? 'success' : 'grey'"
                :variant="data.servicos.length > 0 ? 'elevated' : 'outlined'"
                size="small"
                prepend-icon="tabler-tools"
              >
                3. Serviços
              </VChip>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Seção de Seleção de Empresa -->
      <VCol cols="12">
        <VCard
          variant="outlined"
          :class="data.cliente_id ? 'border-success' : ''"
        >
          <VCardItem>
            <template #prepend>
              <VAvatar
                :color="data.cliente_id ? 'success' : 'primary'"
                size="40"
              >
                <VIcon
                  :icon="data.cliente_id ? 'tabler-check' : 'tabler-building'"
                  size="20"
                />
              </VAvatar>
            </template>

            <VCardTitle class="text-h6">
              Seleção da Empresa
            </VCardTitle>

            <VCardSubtitle>
              Escolha a empresa cliente para esta proposta
            </VCardSubtitle>
          </VCardItem>

          <VCardText>
            <AppAutocomplete
              v-model="data.cliente_id"
              v-debounce:900="fetchCliente"
              :items="filiais"
              label="Empresa Cliente"
              :return-object="false"
              :loading="loading.filial"
              :rules="[rules.requiredValidator]"
              item-value="id"
              item-title="nome_fantasia"
              hint="Digite para buscar empresas ou selecione da lista"
              persistent-hint
              prepend-inner-icon="tabler-search"
              clearable
              variant="outlined"
            >
              <template #item="{ props, item }">
                <VListItem
                  v-bind="props"
                  prepend-icon="tabler-building"
                  :title="item.raw.nome_fantasia"
                />
              </template>

              <template #clear>
                <VBtn
                  icon="tabler-x"
                  size="x-small"
                  variant="text"
                  @click="() => {
                    fetchCliente()
                    blurHandler()
                  }"
                />
              </template>
            </AppAutocomplete>

            <VAlert
              v-if="data.cliente_id"
              type="success"
              variant="tonal"
              class="mt-3"
              icon="tabler-check"
            >
              Empresa selecionada com sucesso! Continue preenchendo os dados da proposta.
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Seção de Dados da Proposta -->
      <VCol cols="12">
        <VCard
          variant="outlined"
          :class="(data.consultor && data.pessoa_contato) ? 'border-success' : ''"
        >
          <VCardItem>
            <template #prepend>
              <VAvatar
                :color="(data.consultor && data.pessoa_contato) ? 'success' : 'primary'"
                size="40"
              >
                <VIcon
                  :icon="(data.consultor && data.pessoa_contato) ? 'tabler-check' : 'tabler-user-edit'"
                  size="20"
                />
              </VAvatar>
            </template>

            <VCardTitle class="text-h6">
              Dados da Proposta
            </VCardTitle>

            <VCardSubtitle>
              Informações de contato e responsáveis pela proposta
            </VCardSubtitle>
          </VCardItem>

          <VCardText>
            <VRow>
              <!-- Consultor Responsável -->
              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="data.consultor"
                  label="Consultor Responsável"
                  placeholder="Nome do consultor"
                  :rules="[rules.requiredValidator]"
                  prepend-inner-icon="tabler-user-star"
                  variant="outlined"
                  hint="Nome do consultor que será responsável por esta proposta"
                  persistent-hint
                />
              </VCol>

              <!-- Pessoa de Contato -->
              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="data.pessoa_contato"
                  label="Pessoa de Contato"
                  placeholder="Nome da pessoa de contato"
                  prepend-inner-icon="tabler-user"
                  variant="outlined"
                  hint="Principal contato na empresa cliente"
                  persistent-hint
                />
              </VCol>

              <!-- Telefone -->
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.telefone"
                  v-mask="'(##) #####-####'"
                  type="tel"
                  label="Telefone de Contato"
                  placeholder="(00) 00000-0000"
                  prepend-inner-icon="tabler-phone"
                  variant="outlined"
                  hint="Telefone para contato direto"
                  persistent-hint
                />
              </VCol>

              <!-- Email -->
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.email"
                  label="E-mail"
                  placeholder="email@empresa.com"
                  prepend-inner-icon="tabler-mail"
                  variant="outlined"
                  hint="E-mail para comunicações oficiais"
                  persistent-hint
                  type="email"
                />
              </VCol>

              <!-- Área -->
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.area"
                  label="Área de Atuação"
                  placeholder="Ex: OIA - O&G"
                  prepend-inner-icon="tabler-building-warehouse"
                  variant="outlined"
                  hint="Área técnica de atuação da proposta"
                  persistent-hint
                />
              </VCol>
            </VRow>

            <!-- Indicador de Progresso -->
            <VAlert
              v-if="data.consultor && data.pessoa_contato"
              type="success"
              variant="tonal"
              class="mt-4"
              icon="tabler-check"
            >
              Dados principais preenchidos! Agora adicione os serviços da proposta.
            </VAlert>

            <VAlert
              v-else-if="data.consultor || data.pessoa_contato"
              type="info"
              variant="tonal"
              class="mt-4"
              icon="tabler-info-circle"
            >
              Preencha pelo menos o consultor responsável e pessoa de contato para continuar.
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Seção de Serviços -->
      <VCol cols="12">
        <VCard
          variant="outlined"
          :class="data.servicos.length > 0 ? 'border-success' : ''"
        >
          <VCardItem>
            <template #prepend>
              <VAvatar
                :color="data.servicos.length > 0 ? 'success' : 'primary'"
                size="40"
              >
                <VIcon
                  :icon="data.servicos.length > 0 ? 'tabler-check' : 'tabler-tools'"
                  size="20"
                />
              </VAvatar>
            </template>

            <VCardTitle class="text-h6">
              Serviços da Proposta
            </VCardTitle>

            <VCardSubtitle>
              Configure os serviços que serão oferecidos ao cliente ({{ data.servicos.length }} {{ data.servicos.length === 1 ? 'serviço' : 'serviços' }})
            </VCardSubtitle>

            <template #append>
              <VTooltip text="Adicionar novo serviço à proposta">
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    color="primary"
                    variant="elevated"
                    prepend-icon="tabler-plus"
                    @click="() => {
                      data.servicos.push({
                        nome: '',
                        valor_total_custos: 0,
                        valor_total_despesas: 0,
                        valor_total_tributos: 0,
                        valor_total_despesas_indiretas: 0,
                        valor_total_despesas_diretas: 0,
                        valor_total: 0,
                        valor_total_hd: 0,
                        valor_k_minimo: 0,
                        valor_diaria_minimo: 0,
                        valor_contrato: 0,
                        proposta_id: '',
                        custos: [],
                        despesas: [],
                        tributos: [],
                        despesas_indiretas: [],
                        despesas_diretas: [],
                      })
                    }"
                  >
                    Novo Serviço
                  </VBtn>
                </template>
              </VTooltip>
            </template>
          </VCardItem>

          <VDivider />

          <VCardText class="pa-0">
            <!-- Estado Vazio com Ilustração -->
            <template v-if="data.servicos.length === 0">
              <div class="text-center py-12">
                <VAvatar
                  size="80"
                  color="grey-lighten-3"
                  class="mb-4"
                >
                  <VIcon
                    icon="tabler-tools-off"
                    size="40"
                    color="grey"
                  />
                </VAvatar>

                <h3 class="text-h6 mb-2">
                  Nenhum serviço adicionado
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Comece adicionando o primeiro serviço para esta proposta.<br>
                  Você pode configurar custos, valores e detalhes específicos.
                </p>

                <CDFButton
                  color="primary"
                  variant="elevated"
                  prepend-icon="tabler-plus"
                  size="large"
                  @click="() => {
                    data.servicos.push({
                      nome: '',
                      valor_total_custos: 0,
                      valor_total_despesas: 0,
                      valor_total_tributos: 0,
                      valor_total_despesas_indiretas: 0,
                      valor_total_despesas_diretas: 0,
                      valor_total: 0,
                      valor_total_hd: 0,
                      valor_k_minimo: 0,
                      valor_diaria_minimo: 0,
                      valor_contrato: 0,
                      proposta_id: '',
                      custos: [],
                      despesas: [],
                      tributos: [],
                      despesas_indiretas: [],
                      despesas_diretas: [],
                    })
                  }"
                >
                  Adicionar Primeiro Serviço
                </CDFButton>
              </div>
            </template>

            <!-- Lista de Serviços -->
            <template v-else>
              <VList lines="two">
                <template
                  v-for="(item, index) in data.servicos"
                  :key="index"
                >
                  <VListItem class="px-4 py-3">
                    <template #prepend>
                      <VAvatar
                        color="primary"
                        size="32"
                        class="me-3"
                      >
                        <span class="font-weight-bold">
                          {{ index + 1 }}
                        </span>
                      </VAvatar>
                    </template>

                    <div class="flex-grow-1">
                      <VRow align="start">
                        <!-- Nome do Serviço -->
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <CDFTextField
                            v-model="item.nome"
                            label="Nome do Serviço"
                            placeholder="Ex: Inspeção de equipamentos"
                            :rules="[rules.requiredValidator]"
                            prepend-inner-icon="tabler-tool"
                            hint="Descreva o serviço a ser realizado"
                            persistent-hint
                          />
                        </VCol>

                        <!-- Valor dos Custos -->
                        <VCol
                          cols="12"
                          md="3"
                        >
                          <InputDinheiro
                            v-model="item.valor_total_custos"
                            label="Total de Custos"
                            placeholder="0,00"
                            prepend-inner-icon="tabler-currency-real"
                            :rules="[rules.requiredValidator]"
                            variant="outlined"
                            density="compact"
                            hint="Soma de todos os custos"
                            persistent-hint
                          />
                        </VCol>

                        <!-- Valor do Contrato -->
                        <VCol
                          cols="12"
                          md="3"
                        >
                          <InputDinheiro
                            v-model="item.valor_contrato"
                            label="Valor do Contrato"
                            placeholder="0,00"
                            prepend-inner-icon="tabler-file-dollar"
                            :rules="[rules.requiredValidator]"
                            variant="outlined"
                            density="compact"
                            hint="Valor final proposto"
                            persistent-hint
                          />
                        </VCol>

                        <!-- Ações -->
                        <VCol
                          cols="12"
                          md="2"
                          class="align-self-center text-end"
                        >
                          <VTooltip text="Remover este serviço">
                            <template #activator="{ props }">
                              <VBtn
                                v-bind="props"
                                color="error"
                                variant="text"
                                icon="tabler-trash"
                                size="small"
                                @click="() => {
                                  if (data.servicos.length === 1) {
                                    // Se for o último serviço, confirmar com dialog customizado
                                    const shouldRemove = globalThis.confirm?.('Tem certeza que deseja remover o último serviço?') ?? true
                                    if (shouldRemove) {
                                      data.servicos.splice(index, 1)
                                    }
                                  }
                                  else {
                                    data.servicos.splice(index, 1)
                                  }
                                }"
                              />
                            </template>
                          </VTooltip>
                        </VCol>
                      </VRow>
                    </div>
                  </VListItem>

                  <VDivider v-if="index < data.servicos.length - 1" />
                </template>
              </VList>
            </template>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Seção de Anexos -->
      <VCol cols="12">
        <VCard variant="outlined">
          <VCardItem>
            <template #prepend>
              <VAvatar
                :color="data.anexo ? 'success' : 'primary'"
                size="40"
              >
                <VIcon
                  :icon="data.anexo ? 'tabler-check' : 'tabler-paperclip'"
                  size="20"
                />
              </VAvatar>
            </template>

            <VCardTitle class="text-h6">
              Anexos da Proposta
            </VCardTitle>

            <VCardSubtitle>
              Anexe documentos técnicos, especificações ou referências (Opcional)
            </VCardSubtitle>
          </VCardItem>

          <VCardText>
            <VAlert
              type="info"
              variant="tonal"
              class="mb-4"
              icon="tabler-info-circle"
            >
              <div class="text-body-2">
                <strong>Tipos aceitos:</strong> PDF, DOC, DOCX, XLS, XLSX, TXT<br>
                <strong>Tamanho máximo:</strong> 10MB por arquivo<br>
                <strong>Exemplos:</strong> Especificações técnicas, normas, desenhos, etc.
              </div>
            </VAlert>

            <CDFFileUpload
              v-model="data.anexo"
              class="anexo-upload"
              placeholder="Clique aqui para selecionar um arquivo ou arraste e solte"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              variant="outlined"
            />

            <VAlert
              v-if="data.anexo"
              type="success"
              variant="tonal"
              class="mt-3"
              icon="tabler-check"
            >
              Arquivo anexado com sucesso! O documento será incluído na proposta.
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Resumo Final -->
      <VCol cols="12">
        <VCard
          variant="outlined"
          color="primary"
          class="text-center"
        >
          <VCardText class="py-6">
            <h3 class="text-h6 mb-2">
              <VIcon icon="tabler-target-arrow" /> Proposta Quase Pronta!
            </h3>

            <p class="text-body-2 text-medium-emphasis mb-4">
              Revise todas as informações antes de salvar.<br>
              Depois de salva, você poderá editar ou enviar a proposta para o cliente.
            </p>

            <!-- Checklist de Progresso -->
            <VList
              density="compact"
              class="bg-transparent"
            >
              <VListItem>
                <template #prepend>
                  <VIcon
                    :icon="data.cliente_id ? 'tabler-check' : 'tabler-circle'"
                    :color="data.cliente_id ? 'success' : 'grey'"
                  />
                </template>
                <VListItemTitle
                  class="text-start"
                  style="inline-size: 300px;"
                >
                  Empresa selecionada
                </VListItemTitle>
              </VListItem>

              <VListItem>
                <template #prepend>
                  <VIcon
                    :icon="(data.consultor && data.pessoa_contato) ? 'tabler-check' : 'tabler-circle'"
                    :color="(data.consultor && data.pessoa_contato) ? 'success' : 'grey'"
                  />
                </template>
                <VListItemTitle
                  class="text-start"
                  style="inline-size: 300px;"
                >
                  Dados da proposta preenchidos
                </VListItemTitle>
              </VListItem>

              <VListItem>
                <template #prepend>
                  <VIcon
                    :icon="data.servicos.length > 0 ? 'tabler-check' : 'tabler-circle'"
                    :color="data.servicos.length > 0 ? 'success' : 'grey'"
                  />
                </template>
                <VListItemTitle
                  class="text-start"
                  style="inline-size: 300px;"
                >
                  Serviços adicionados ({{ data.servicos.length }})
                </VListItemTitle>
              </VListItem>

              <VListItem>
                <template #prepend>
                  <VIcon
                    :icon="data.anexo ? 'tabler-check' : 'tabler-circle'"
                    :color="data.anexo ? 'success' : 'grey'"
                  />
                </template>
                <VListItemTitle
                  class="text-start"
                  style="inline-size: 300px;"
                >
                  Anexo incluído (opcional)
                </VListItemTitle>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>

      <NovoServicoModal v-if="modal.isDialogVisible" />
    </template>
  </LayoutForms>
</template>

<style lang="scss">
.anexo-upload {
  .v-field__input {
    overflow: hidden;
    white-space: nowrap;
  }
}

// Melhorias visuais para a tela de proposta
.border-success {
  border-width: 2px !important;
  border-color: rgb(var(--v-theme-success)) !important;
}

// Animação suave para cards
//.v-card {
//  transition: all 0.3s ease;
//
//  &:hover {
//    box-shadow: 0 4px 12px rgba(0, 0, 0, 15%);
//    transform: translateY(-2px);
//  }
//}

// Estilo para o breadcrumb de progresso
.v-chip {
  transition: all 0.3s ease;

  &.v-chip--variant-elevated {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 15%);
  }
}

// Melhorias para inputs
.v-field--variant-outlined {
  .v-field__outline {
    transition: all 0.3s ease;
  }

  &.v-field--focused {
    .v-field__outline {
      box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 20%);
    }
  }
}

// Estilo para alertas de feedback
.v-alert {
  &.v-alert--variant-tonal {
    backdrop-filter: blur(10px);
    background: rgba(var(--v-theme-surface), 0.8);
  }
}

// Animação para lista de serviços
//.v-list-item {
//  transition: all 0.3s ease;
//
//  &:hover {
//    background: rgba(var(--v-theme-primary), 5%);
//    transform: translateX(4px);
//  }
//}

// Estilo para o resumo de valores
.text-h5 {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 10%);
}

// Responsividade aprimorada
@media (max-width: 768px) {
  .v-chip {
    block-size: 28px;
    font-size: 0.75rem;

    .v-icon {
      font-size: 14px;
    }
  }

  .v-avatar {
    block-size: 32px !important;
    inline-size: 32px !important;

    .v-icon {
      font-size: 16px;
    }
  }
}
</style>
