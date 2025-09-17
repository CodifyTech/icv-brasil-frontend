<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePropostaStore } from '../store/usePropostaStore'
import { getPropostaStatusColor, getPropostaStatusLabel } from '@/enums/PropostaStatusEnum'
import { formatCurrency } from '@/utils/generals'

interface Props {
  modelValue: boolean
  proposta: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = usePropostaStore()
const { filiais, funcionarios, tipoServicos } = storeToRefs(store)

const isVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// Computed para obter dados formatados
const clienteNome = computed(() => {
  const cliente = filiais.value.find(f => f.id === props.proposta?.cliente_id)

  return cliente?.nome_fantasia || 'Cliente não encontrado'
})

const consultorNome = computed(() => {
  const consultor = funcionarios.value.find(f => f.id === props.proposta?.consultor_id)

  return consultor?.nome || 'Consultor não encontrado'
})

const getServicoNome = (tipoServicoId: string) => {
  const servico = tipoServicos.value.find(s => s.id === tipoServicoId)

  return servico?.nome || 'Serviço não encontrado'
}

const getUnidadeCustosLabel = (unidade: string) => {
  const unidades = {
    hh: 'Homem/Hora (HH)',
    hd: 'Homem/Dia (HD)',
    mensal: 'Mensal',
    eventos: 'Eventos',
  }

  return unidades[unidade as keyof typeof unidades] || unidade
}
</script>

<template>
  <VDialog
    v-model="isVisible"
    max-width="1200"
    persistent
    scrollable
  >
    <VCard>
      <VCardItem class="pb-2">
        <template #prepend>
          <VAvatar
            color="primary"
            size="40"
            rounded="sm"
          >
            <VIcon
              icon="tabler-file-text"
              size="20"
            />
          </VAvatar>
        </template>

        <VCardTitle class="text-h5">
          Visualizar Proposta
        </VCardTitle>

        <VCardSubtitle>
          {{ proposta?.codigo_proposta || 'Código não informado' }}
        </VCardSubtitle>

        <template #append>
          <VBtn
            icon="tabler-x"
            variant="text"
            color="default"
            @click="isVisible = false"
          />
        </template>
      </VCardItem>

      <VDivider />

      <VCardText class="pa-0">
        <VContainer fluid>
          <!-- Informações da Empresa -->
          <VRow>
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
                    Informações da Empresa
                  </VCardTitle>
                </VCardItem>

                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="6"
                    >
                      <div class="d-flex align-center mb-3">
                        <VIcon
                          icon="tabler-building"
                          size="20"
                          class="me-3"
                          color="primary"
                        />
                        <div>
                          <div class="text-body-2 text-medium-emphasis">
                            Empresa Cliente
                          </div>
                          <div class="font-weight-medium">
                            {{ clienteNome }}
                          </div>
                        </div>
                      </div>
                    </VCol>

                    <VCol
                      cols="12"
                      md="6"
                    >
                      <div class="d-flex align-center mb-3">
                        <VIcon
                          icon="tabler-building-warehouse"
                          size="20"
                          class="me-3"
                          color="primary"
                        />
                        <div>
                          <div class="text-body-2 text-medium-emphasis">
                            Área de Atuação
                          </div>
                          <div class="font-weight-medium">
                            {{ proposta?.area || 'Não informado' }}
                          </div>
                        </div>
                      </div>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <!-- Dados da Proposta -->
          <VRow class="mt-4">
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
                </VCardItem>

                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <div class="d-flex align-center mb-3">
                        <VIcon
                          icon="tabler-file"
                          size="20"
                          class="me-3"
                          color="primary"
                        />
                        <div>
                          <div class="text-body-2 text-medium-emphasis">
                            Código da Proposta
                          </div>
                          <div class="font-weight-medium">
                            {{ proposta?.codigo_proposta || 'Não informado' }}
                          </div>
                        </div>
                      </div>
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <div class="d-flex align-center mb-3">
                        <VIcon
                          icon="tabler-user-star"
                          size="20"
                          class="me-3"
                          color="primary"
                        />
                        <div>
                          <div class="text-body-2 text-medium-emphasis">
                            Responsável Comercial
                          </div>
                          <div class="font-weight-medium">
                            {{ consultorNome }}
                          </div>
                        </div>
                      </div>
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <div class="d-flex align-center mb-3">
                        <VIcon
                          icon="tabler-user"
                          size="20"
                          class="me-3"
                          color="primary"
                        />
                        <div>
                          <div class="text-body-2 text-medium-emphasis">
                            Pessoa de Contato
                          </div>
                          <div class="font-weight-medium">
                            {{ proposta?.pessoa_contato || 'Não informado' }}
                          </div>
                        </div>
                      </div>
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <div class="d-flex align-center mb-3">
                        <VIcon
                          icon="tabler-phone"
                          size="20"
                          class="me-3"
                          color="primary"
                        />
                        <div>
                          <div class="text-body-2 text-medium-emphasis">
                            Telefone
                          </div>
                          <div class="font-weight-medium">
                            {{ proposta?.telefone || 'Não informado' }}
                          </div>
                        </div>
                      </div>
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <div class="d-flex align-center mb-3">
                        <VIcon
                          icon="tabler-mail"
                          size="20"
                          class="me-3"
                          color="primary"
                        />
                        <div>
                          <div class="text-body-2 text-medium-emphasis">
                            E-mail
                          </div>
                          <div class="font-weight-medium">
                            {{ proposta?.email || 'Não informado' }}
                          </div>
                        </div>
                      </div>
                    </VCol>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <div class="text-body-2 text-medium-emphasis">
                        Status
                      </div>
                      <VChip
                        :color="getPropostaStatusColor(proposta?.status)"
                        size="x-small"
                      >
                        {{ getPropostaStatusLabel(proposta?.status) }}
                      </VChip>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <!-- Serviços da Proposta -->
          <VRow class="mt-4">
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
                    {{ proposta?.servicos?.length || 0 }} {{ (proposta?.servicos?.length || 0) === 1 ? 'serviço' : 'serviços' }} configurado(s)
                  </VCardSubtitle>
                </VCardItem>

                <VDivider />

                <VCardText class="pa-0">
                  <template v-if="!proposta?.servicos || proposta.servicos.length === 0">
                    <div class="py-8 text-center">
                      <VIcon
                        icon="tabler-tools-off"
                        size="60"
                        color="grey"
                        class="mb-3"
                      />
                      <div class="text-h6 mb-2">
                        Nenhum serviço configurado
                      </div>
                      <div class="text-body-2 text-medium-emphasis">
                        Esta proposta não possui serviços cadastrados.
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <VList lines="three">
                      <template
                        v-for="(servico, index) in proposta.servicos"
                        :key="index"
                      >
                        <VListItem class="px-4 py-4">
                          <template #prepend>
                            <VAvatar
                              color="primary"
                              size="40"
                              class="me-4"
                            >
                              <span class="font-weight-bold">
                                {{ index + 1 }}
                              </span>
                            </VAvatar>
                          </template>

                          <VListItemTitle class="font-weight-bold mb-2">
                            {{ getServicoNome(servico.tipo_servico_id) }}
                          </VListItemTitle>

                          <VListItemSubtitle>
                            <VRow class="mt-2">
                              <VCol
                                cols="12"
                                md="3"
                              >
                                <div class="d-flex align-center mb-2">
                                  <VIcon
                                    icon="tabler-calculator"
                                    size="16"
                                    class="me-2"
                                    color="primary"
                                  />
                                  <div>
                                    <div class="text-caption text-medium-emphasis">
                                      Unidade
                                    </div>
                                    <div class="text-body-2 font-weight-medium">
                                      {{ getUnidadeCustosLabel(servico.unidade_custos) }}
                                    </div>
                                  </div>
                                </div>
                              </VCol>

                              <VCol
                                cols="12"
                                md="3"
                              >
                                <div class="d-flex align-center mb-2">
                                  <VIcon
                                    icon="tabler-currency-real"
                                    size="16"
                                    class="me-2"
                                    color="success"
                                  />
                                  <div>
                                    <div class="text-caption text-medium-emphasis">
                                      Total de Custos
                                    </div>
                                    <div class="text-body-2 font-weight-medium">
                                      {{ formatCurrency(servico.valor_total_custos || 0) }}
                                    </div>
                                  </div>
                                </div>
                              </VCol>

                              <VCol
                                cols="12"
                                md="3"
                              >
                                <div class="d-flex align-center mb-2">
                                  <VIcon
                                    icon="tabler-file-dollar"
                                    size="16"
                                    class="me-2"
                                    color="success"
                                  />
                                  <div>
                                    <div class="text-caption text-medium-emphasis">
                                      Valor do Contrato
                                    </div>
                                    <div class="text-body-2 font-weight-bold text-success">
                                      {{ formatCurrency(servico.valor_contrato || 0) }}
                                    </div>
                                  </div>
                                </div>
                              </VCol>
                            </VRow>

                            <!-- Detalhes adicionais do serviço -->
                            <VExpansionPanels
                              v-if="servico.custos?.length || servico.despesas?.length || servico.tributos?.length"
                              variant="accordion"
                              class="mt-3"
                            >
                              <VExpansionPanel>
                                <VExpansionPanelTitle>
                                  <VIcon
                                    icon="tabler-list-details"
                                    class="me-2"
                                  />
                                  Detalhes do Serviço
                                </VExpansionPanelTitle>
                                <VExpansionPanelText>
                                  <VRow>
                                    <!-- Custos -->
                                    <VCol
                                      v-if="servico.custos?.length"
                                      cols="12"
                                      md="4"
                                    >
                                      <div class="mb-3">
                                        <div class="text-subtitle-2 mb-2 d-flex align-center">
                                          <VIcon
                                            icon="tabler-coins"
                                            size="16"
                                            class="me-2"
                                          />
                                          Custos
                                        </div>
                                        <VList density="compact">
                                          <VListItem
                                            v-for="custo in servico.custos"
                                            :key="custo.id"
                                            class="px-0"
                                          >
                                            <VListItemTitle class="text-body-2">
                                              {{ custo.nome }}
                                            </VListItemTitle>
                                            <VListItemSubtitle>
                                              {{ formatCurrency(custo.valor || 0) }}
                                            </VListItemSubtitle>
                                          </VListItem>
                                        </VList>
                                      </div>
                                    </VCol>

                                    <!-- Despesas -->
                                    <VCol
                                      v-if="servico.despesas?.length"
                                      cols="12"
                                      md="4"
                                    >
                                      <div class="mb-3">
                                        <div class="text-subtitle-2 mb-2 d-flex align-center">
                                          <VIcon
                                            icon="tabler-receipt"
                                            size="16"
                                            class="me-2"
                                          />
                                          Despesas
                                        </div>
                                        <VList density="compact">
                                          <VListItem
                                            v-for="despesa in servico.despesas"
                                            :key="despesa.id"
                                            class="px-0"
                                          >
                                            <VListItemTitle class="text-body-2">
                                              {{ despesa.nome }}
                                            </VListItemTitle>
                                            <VListItemSubtitle>
                                              {{ formatCurrency(despesa.valor || 0) }}
                                            </VListItemSubtitle>
                                          </VListItem>
                                        </VList>
                                      </div>
                                    </VCol>

                                    <!-- Tributos -->
                                    <VCol
                                      v-if="servico.tributos?.length"
                                      cols="12"
                                      md="4"
                                    >
                                      <div class="mb-3">
                                        <div class="text-subtitle-2 mb-2 d-flex align-center">
                                          <VIcon
                                            icon="tabler-percentage"
                                            size="16"
                                            class="me-2"
                                          />
                                          Tributos
                                        </div>
                                        <VList density="compact">
                                          <VListItem
                                            v-for="tributo in servico.tributos"
                                            :key="tributo.id"
                                            class="px-0"
                                          >
                                            <VListItemTitle class="text-body-2">
                                              {{ tributo.nome }}
                                            </VListItemTitle>
                                            <VListItemSubtitle>
                                              {{ tributo.aliquota }}%
                                            </VListItemSubtitle>
                                          </VListItem>
                                        </VList>
                                      </div>
                                    </VCol>
                                  </VRow>
                                </VExpansionPanelText>
                              </VExpansionPanel>
                            </VExpansionPanels>
                          </VListItemSubtitle>
                        </VListItem>

                        <VDivider v-if="index < proposta.servicos.length - 1" />
                      </template>
                    </VList>
                  </template>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <!-- Anexos -->
          <VRow
            v-if="proposta?.anexos?.length > 0"
            class="mt-4"
          >
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
                        icon="tabler-paperclip"
                        size="20"
                      />
                    </VAvatar>
                  </template>

                  <VCardTitle class="text-h6">
                    Anexos da Proposta
                  </VCardTitle>

                  <VCardSubtitle>
                    {{ proposta?.anexos?.length || 0 }} {{ (proposta?.anexos?.length || 0) === 1 ? 'arquivo anexado' : 'arquivos anexados' }}
                  </VCardSubtitle>
                </VCardItem>

                <VDivider />

                <VCardText>
                  <template v-if="!proposta?.anexos || proposta.anexos.length === 0">
                    <div class="py-6 text-center">
                      <VIcon
                        icon="tabler-file-off"
                        size="50"
                        color="grey"
                        class="mb-3"
                      />
                      <div class="text-h6 mb-2">
                        Nenhum anexo
                      </div>
                      <div class="text-body-2 text-medium-emphasis">
                        Esta proposta não possui arquivos anexados.
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <VList>
                      <VListItem
                        v-for="(anexo, index) in proposta.anexos"
                        :key="index"
                      >
                        <template #prepend>
                          <VIcon
                            icon="tabler-file"
                            color="primary"
                          />
                        </template>

                        <VListItemTitle>
                          {{ anexo.name || `Anexo ${index + 1}` }}
                        </VListItemTitle>

                        <VListItemSubtitle>
                          {{ anexo.type || 'Tipo não identificado' }} • {{ anexo.size ? `${(anexo.size / 1024).toFixed(1)} KB` : 'Tamanho não identificado' }}
                        </VListItemSubtitle>

                        <template #append>
                          <VBtn
                            icon="tabler-download"
                            variant="text"
                            size="small"
                            color="primary"
                            @click="() => {
                              // Implementar download do anexo
                              console.log('Download anexo:', anexo)
                            }"
                          />
                        </template>
                      </VListItem>
                    </VList>
                  </template>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-4">
        <VSpacer />
        <!--
          <VBtn
          color="primary"
          variant="elevated"
          prepend-icon="tabler-printer"
          class="me-2"
          @click="() => {
          // Implementar impressão
          console.log('Imprimir proposta')
          }"
          >
          Imprimir
          </VBtn>
        -->

        <VBtn
          color="secondary"
          variant="outlined"
          @click="isVisible = false"
        >
          Fechar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.v-expansion-panel-text__wrapper {
  padding-block: 8px;
  padding-inline: 0;
}

.v-list-item__prepend > .v-avatar {
  margin-inline-end: 16px;
}

.v-card-item__prepend {
  padding-inline-end: 16px;
}
</style>
