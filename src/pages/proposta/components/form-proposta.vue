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

const { data, loading, filiais, funcionarios, tipoServicos, departamentos, modal } = storeToRefs(store)

const { save, update, resetForm, fetchCliente, fetchFuncionarios, fetchTipoServico, fetchDepartamentos } = store

onBeforeRouteLeave(() => {
  resetForm()
})

const form = ref<VForm>({} as VForm)

onMounted(() => {
  // 👉 methods
  fetchCliente()
  fetchFuncionarios()
  fetchTipoServico()
  fetchDepartamentos()
})

const getDepartamentos = (departamento_id: string) => {
  return departamentos.value.find(departamento => departamento.departamento_id === departamento_id)
}
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
        <VCard variant="outlined">
          <VCardText class="py-3">
            <div class="gap-4 d-flex align-center">
              <VChip
                :color="data.cliente_id ? 'primary' : 'grey'"
                :variant="data.cliente_id ? 'elevated' : 'outlined'"
                size="small"
                :prepend-icon="data.cliente_id ? 'tabler-check' : 'tabler-building'"
              >
                1. Empresa
              </VChip>

              <VIcon
                icon="tabler-arrow-right"
                size="16"
                :color="data.cliente_id ? 'primary' : 'grey'"
              />

              <VChip
                :color="data.consultor_id && data.pessoa_contato ? 'primary' : 'grey'"
                :variant="data.consultor_id && data.pessoa_contato ? 'elevated' : 'outlined'"
                size="small"
                :prepend-icon="data.consultor_id && data.pessoa_contato ? 'tabler-check' : 'tabler-user'"
              >
                2. Dados
              </VChip>

              <VIcon
                icon="tabler-arrow-right"
                size="16"
                :color="data.servicos.length > 0 ? 'primary' : 'grey'"
              />

              <VChip
                :color="data.servicos.length > 0 ? 'primary' : 'grey'"
                :variant="data.servicos.length > 0 ? 'elevated' : 'outlined'"
                size="small"
                :prepend-icon="data.servicos.length > 0 ? 'tabler-check' : 'tabler-tools'"
              >
                3. Serviços
              </VChip>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Seção de Seleção de Empresa -->
      <VCol cols="12">
        <VCard variant="outlined">
          <VCardItem>
            <template #prepend>
              <VAvatar
                color="primary"
                size="40"
                rounded="sm"
              >
                <VIcon
                  icon="tabler-building"
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
          </VCardText>
        </VCard>
      </VCol>

      <!-- Seção de Dados da Proposta -->
      <VCol cols="12">
        <VCard variant="outlined">
          <VCardItem>
            <template #prepend>
              <VAvatar
                color="primary"
                size="40"
                rounded="sm"
              >
                <VIcon
                  icon="tabler-user-edit"
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
              <!-- Codigo da Proposta -->
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.codigo_proposta"
                  label="Código da Proposta"
                  placeholder="Código da proposta"
                  prepend-inner-icon="tabler-file"
                  variant="outlined"
                  hint="Código identificador da proposta"
                  persistent-hint
                  :rules="[rules.requiredValidator]"
                />
              </VCol>

              <!-- Consultor Responsável -->
              <VCol
                cols="12"
                md="4"
              >
                <AppAutocomplete
                  v-model="data.consultor_id"
                  label="Responsável Comercial"
                  placeholder="Nome do responsável"
                  :rules="[rules.requiredValidator]"
                  :items="funcionarios"
                  item-value="id"
                  item-title="nome"
                  prepend-inner-icon="tabler-user-star"
                  variant="outlined"
                  hint="Nome do responsável por esta proposta"
                  persistent-hint
                />
              </VCol>

              <!-- Pessoa de Contato -->
              <VCol
                cols="12"
                md="4"
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
                <AppAutocomplete
                  v-model="data.departamentos"
                  label="Departamento"
                  placeholder="Ex: OIA OG"
                  :rules="[rules.requiredValidator]"
                  :items="departamentos"
                  item-title="nome"
                  item-value="departamento_id"
                  prepend-inner-icon="tabler-building-skyscraper"
                  variant="outlined"
                  persistent-hint
                  multiple
                  return-object
                >
                  <template #selection="{ item }">
                    <VChip
                      :key="item.id"
                      color="primary"
                      variant="outlined"
                      size="x-small"
                    >
                      {{ getDepartamentos(item.raw?.departamento_id)?.nome }}
                    </VChip>
                  </template>
                </AppAutocomplete>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Seção de Serviços -->
      <VCol cols="12">
        <VCard variant="outlined">
          <VCardItem>
            <template #prepend>
              <VAvatar
                color="primary"
                size="40"
                rounded="sm"
              >
                <VIcon
                  icon="tabler-tools"
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
                        tipo_servico_id: null,
                        unidade_custos: 'hh',
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
              <div class="py-12 text-center">
                <VIcon
                  icon="tabler-tools-off"
                  size="70"
                  color="grey"
                  class="mb-4"
                />

                <h3 class="mb-2 text-h6">
                  Nenhum serviço adicionado
                </h3>
                <p class="mb-4 text-body-2 text-medium-emphasis">
                  Comece adicionando o primeiro serviço para esta proposta.<br>
                  Você pode configurar custos, valores e detalhes específicos.
                </p>

                <CDFButton
                  color="primary"
                  variant="elevated"
                  prepend-icon="tabler-plus"
                  @click="() => {
                    data.servicos.push({
                      tipo_servico_id: null,
                      unidade_custos: 'hh',
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
                          md="5"
                        >
                          <AppAutocomplete
                            v-model="item.tipo_servico_id"
                            label="Tipo de Serviço"
                            placeholder="Ex: Inspeção de equipamentos"
                            :rules="[rules.requiredValidator]"
                            prepend-inner-icon="tabler-tool"
                            hint="Selecione o serviço a ser realizado"
                            persistent-hint
                            :items="tipoServicos"
                            item-value="id"
                            item-title="nome"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="2"
                        >
                          <AppAutocomplete
                            v-model="item.unidade_custos"
                            label="Unidade de Custos"
                            placeholder="Selecione a unidade"
                            :rules="[rules.requiredValidator]"
                            :items="[
                              { value: 'hh', title: 'HH' },
                              { value: 'hd', title: 'HD' },
                              { value: 'mensal', title: 'Mensal' },
                              { value: 'eventos', title: 'Eventos' },
                            ]"
                            variant="outlined"
                            persistent-hint
                          />
                        </VCol>

                        <!-- Valor dos Custos -->
                        <VCol
                          cols="12"
                          md="2"
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
                          md="2"
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
                          md="1"
                          class="align-self-center"
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
                                  data.servicos.splice(index, 1)
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
                rounded="sm"
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

            <AttachmentUpload
              v-model:model-value="data.anexos"
              :max-files="50"
              :max-file-size="200"
              :disabled="loading.save"
            />
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
