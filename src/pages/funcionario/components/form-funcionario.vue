<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFuncionarioStore } from '../store/useFuncionarioStore'
import CDFDialogManager from '@/components/CDF/CDFDialogManager.vue'
import CDFFileUpload from '@/components/CDF/CDFFileUpload.vue'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import type { IAtestadoOcupacional, IEPI, IFormacao, IFuncionarioAnexo, IHonorario, IQualificacao } from '@/pages/funcionario/types'
import { formatDate } from '@/utils/formatters'
import * as cdfRules from '@/validators/cdf-rules'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useFuncionarioStore()

const {
  form,
  data,
  loading,
  departamentos,
  tipoDocumentos,
} = storeToRefs(store)

const tab = ref('dados_pessoais')

const {
  save,
  update,
  resetForm,
  fetchDepartamentos,
  fetchTipoDocumentos,
} = store

onMounted(() => {
  // 👉 methods
  fetchDepartamentos()
  fetchTipoDocumentos()
})

onBeforeRouteLeave(() => {
  resetForm()
})

// Adicione este watcher para garantir que user sempre exista
watch(() => data.value, newData => {
  if (!newData.user) {
    newData.user = {
      email: '',
      password: '',
    }
  }
}, { immediate: true, deep: true })
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    :title="!isEditing ? 'Cadastrar Funcionário' : 'Editar Funcionário'"
    :is-editing="isEditing"
    :is-header="isHeader"
    :actions="{
      save: {
        method: () => save(true),
      },
      update: {
        method: () => update(true),
      },
      reset: {
        method: () => resetForm(),
      },
    }"
    back="/funcionario"
  >
    <template #content>
      <VCol cols="12">
        <VCard variant="outlined">
          <VCardText class="pa-2">
            <VRow>
              <VCol cols="12">
                <VCard
                  title="Dados Pessoais"
                  flat
                >
                  <VCardText class="pt-0 pb-2">
                    <VRow>
                      <VCol
                        cols="12"
                        class="d-flex justify-center"
                      >
                        <EnviarImagem
                          v-model="data.foto"
                          :placeholder="data.nome"
                        />
                      </VCol>
                      <VCol cols="12">
                        <CDFTextField
                          v-model="data.nome"
                          label="Nome Completo"
                          placeholder="Digite o nome completo"
                          :rules="[cdfRules.requiredValidator]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="6"
                      >
                        <CDFTextField
                          v-model="data.rg"
                          label="RG"
                          placeholder="Digite o número do RG"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="6"
                      >
                        <CDFTextField
                          v-model="data.cpf"
                          v-mask="'###.###.###-##'"
                          label="CPF"
                          placeholder="Digite o número do CPF"
                          :rules="[cdfRules.requiredValidator, cdfRules.cpfValidator]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <CDFTextField
                          v-model="data.telefone_1"
                          v-mask="'(##) #####-####'"
                          type="tel"
                          label="Telefone 1"
                          placeholder="Digite o número do telefone 1"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <CDFTextField
                          v-model="data.telefone_2"
                          v-mask="'(##) #####-####'"
                          type="tel"
                          label="Telefone 2"
                          placeholder="Digite o número do telefone 2"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <AppAutocomplete
                          v-model="data.departamento_id"
                          label="Departamento"
                          :items="departamentos"
                          placeholder="Selecione o departamento"
                          :rules="[cdfRules.requiredValidator]"
                          item-title="nome"
                          item-value="id"
                        />
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VCol>
              <VDivider />
              <VCol cols="12">
                <VCard
                  title="Endereço"
                  flat
                >
                  <VCardText class="pt-0 pb-2">
                    <VRow>
                      <VCol cols="12">
                        <Endereco v-model:data="data" />
                      </VCol>
                      <VCol cols="12">
                        <AppTextField
                          v-model="data.aeroporto_proximo"
                          label="Aeroporto Próximo"
                          placeholder="Digite o nome do aeroporto mais próximo"
                          :rules="[]"
                        />
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VCol>
              <VDivider />
              <VCol cols="12">
                <VTabs v-model="tab">
                  <VTab value="qualificacoes_pofissionais">
                    Qualificações Profissionais
                  </VTab>
                  <VTab value="atestados_ocupacionais_epi">
                    Atestado Ocupacionais/EPI
                  </VTab>
                  <VTab value="dados_empresariais">
                    Dados Empresariais
                  </VTab>
                  <VTab value="dados_bancarios">
                    Dados Bancários
                  </VTab>
                  <VTab value="honrarios">
                    Honorários
                  </VTab>
                  <VTab value="anexos">
                    Anexos
                  </VTab>
                  <VTab value="dados_usuario">
                    Usuário
                  </VTab>
                </VTabs>

                <VTabsWindow v-model="tab">
                  <VTabsWindowItem
                    value="qualificacoes_pofissionais"
                    class="pa-2"
                  >
                    <div class="d-flex flex-column gap-2">
                      <CDFDialogManager
                        v-model:items="data.formacoes"
                        title="Formação"
                        item-title="nome"
                        item-label="Formação"
                        message-add="Adicionar Formação"
                        :template="{
                          nome: '',
                          conselho_classe: '',
                          anexo: null,
                        }"
                      >
                        <template #header="{ item }: { item: IFormacao }">
                          <div class="d-flex flex-column gap-2 pa-4">
                            <VLabel v-if="item.nome">
                              {{ item.nome }}
                            </VLabel>
                          </div>
                        </template>
                        <template #content="{ item }: {item: IFormacao}">
                          <VRow>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.nome"
                                label="Formação"
                                placeholder="Digite a nome da formção"
                                :rules="[cdfRules.requiredValidator]"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.conselho_classe"
                                label="Conselho de Classe"
                                placeholder="Digite o conselho de classe"
                                :rules="[cdfRules.requiredValidator]"
                              />
                            </VCol>
                            <VCol cols="12">
                              <CDFFileUpload
                                v-model="item.anexo"
                                label="Anexo"
                                :rules="[]"
                              />
                            </VCol>
                          </VRow>
                        </template>
                      </CDFDialogManager>

                      <CDFDialogManager
                        v-model:items="data.qualificacoes"
                        title="Qualificação"
                        item-title="nome"
                        item-label="Qualificação"
                        message-add="Adicionar Qualificação"
                        :template="{
                          nome: '',
                          validate: '',
                          utilma_avaliacao: '',
                          validate_avaliacao: '',
                          anexo: null,
                        }"
                      >
                        <template #header="{ item }: { item: IQualificacao }">
                          <div class="d-flex flex-column gap-2 pa-4">
                            <VLabel v-if="item.nome">
                              Qualificação: {{ item.nome }}
                            </VLabel>
                            <VLabel v-if="item.validate">
                              Validade: {{ formatDate(item.validate) }}
                            </VLabel>
                            <VLabel v-if="item.utilma_avaliacao">
                              Ultima Avaliação: {{ formatDate(item.utilma_avaliacao) }}
                            </VLabel>
                            <VLabel v-if="item.validate_avaliacao">
                              Validade da Avaliação: {{ formatDate(item.validate_avaliacao) }}
                            </VLabel>
                          </div>
                        </template>
                        <template #content="{ item }: { item: IQualificacao }">
                          <VRow>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.nome"
                                label="Nome da Qualificação"
                                placeholder="Digite o nome da qualificação"
                                :rules="[cdfRules.requiredValidator]"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.validate"
                                label="Validade"
                                placeholder="Digite a Validade"
                                type="date"
                                :rules="[]"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.utilma_avaliacao"
                                label="Última Avaliação"
                                placeholder="Digite o ultima avaliação"
                                type="date"
                                :rules="[]"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.validate_avaliacao"
                                label="Validade Avaliação"
                                placeholder="Digite a validade da avaliação"
                                type="date"
                                :rules="[]"
                              />
                            </VCol>
                            <VCol cols="12">
                              <CDFFileUpload
                                v-model="item.anexo"
                                label="Anexo"
                                :rules="[]"
                              />
                            </VCol>
                          </VRow>
                        </template>
                      </CDFDialogManager>
                    </div>
                  </VTabsWindowItem>

                  <VTabsWindowItem
                    value="atestados_ocupacionais_epi"
                    class="pa-2"
                  >
                    <div class="d-flex flex-column gap-2">
                      <CDFDialogManager
                        v-model:items="data.atestado_ocupacionals"
                        title="Atestado Ocupacional"
                        item-title="nome"
                        item-label="Atestado Ocupacional"
                        message-add="Adicionar Atestado"
                        :template="{
                          nome: '',
                          validade: '',
                          exame: '',
                        }"
                      >
                        <template #header="{ item }: { item: IAtestadoOcupacional }">
                          <div class="d-flex flex-column gap-2 pa-4">
                            <VLabel v-if="item.nome">
                              Atestado: {{ item.nome }}
                            </VLabel>
                            <VLabel v-if="item.validade">
                              Validade: {{ formatDate(item.validade) }}
                            </VLabel>
                          </div>
                        </template>
                        <template #content="{ item }: {item: IAtestadoOcupacional}">
                          <VRow>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.nome"
                                label="Nome"
                                placeholder="Digite o nome"
                                :rules="[cdfRules.requiredValidator]"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.validade"
                                label="Validade"
                                placeholder="Digite a validade"
                                type="date"
                                :rules="[]"
                              />
                            </VCol>
                            <VCol cols="12">
                              <CDFFileUpload
                                v-model="item.exame"
                                label="Exame"
                                placeholder="Digite o exame"
                                :rules="[]"
                              />
                            </VCol>
                          </VRow>
                        </template>
                      </CDFDialogManager>

                      <CDFDialogManager
                        v-model:items="data.epis"
                        title="EPI"
                        item-title="nome"
                        item-label="EPI"
                        message-add="Adicionar EPI"
                        :template="{
                          nome: '',
                          ca: '',
                          validade: null,
                          anexo: null,
                        }"
                      >
                        <template #header="{ item }: { item: IEPI }">
                          <div class="d-flex flex-column gap-2 pa-4">
                            <VLabel v-if="item.nome">
                              Nome: {{ item.nome }}
                            </VLabel>
                            <VLabel v-if="item.ca">
                              CA: {{ item.ca }}
                            </VLabel>
                          </div>
                        </template>
                        <template #content="{ item }: {item: IEPI}">
                          <VRow>
                            <VCol cols="12">
                              <CDFTextField
                                v-model="item.nome"
                                label="Nome"
                                placeholder="Digite o nome do EPI"
                                :rules="[cdfRules.requiredValidator]"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.ca"
                                label="CA"
                                placeholder="Digite o certificado de autorização"
                                :rules="[cdfRules.requiredValidator]"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFTextField
                                v-model="item.validade"
                                label="Validade"
                                placeholder="Digite a validade"
                                type="date"
                                :rules="[]"
                              />
                            </VCol>
                            <VCol cols="12">
                              <CDFFileUpload
                                v-model="item.anexo"
                                label="Anexo"
                                :rules="[]"
                              />
                            </VCol>
                          </VRow>
                        </template>
                      </CDFDialogManager>
                    </div>
                  </VTabsWindowItem>

                  <VTabsWindowItem
                    value="dados_empresariais"
                    class="pa-2"
                  >
                    <VCard variant="outlined">
                      <VCardText>
                        <VRow>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <CDFTextField
                              v-model="data.razao_social"
                              label="Razão Social"
                              placeholder="Digite a razão social"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <CDFTextField
                              v-model="data.nome_fantasia"
                              label="Nome Fantasia"
                              placeholder="Digite o nome fantasia"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <CDFTextField
                              v-model="data.cnpj"
                              v-mask="'##.###.###/####-##'"
                              label="CNPJ"
                              placeholder="Digite o número do CNPJ"
                              :rules="[]"
                            />
                          </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </VTabsWindowItem>

                  <VTabsWindowItem
                    value="dados_bancarios"
                    class="pa-2"
                  >
                    <VCard variant="outlined">
                      <VCardText>
                        <VRow>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <CDFTextField
                              v-model="data.banco"
                              label="Banco"
                              placeholder="Digite o número do banco"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <CDFTextField
                              v-model="data.agencia"
                              label="Agência"
                              placeholder="Digite o número da agência"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <CDFTextField
                              v-model="data.conta"
                              label="Conta"
                              placeholder="Digite o número da conta"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol cols="12">
                            <CDFFileUpload
                              v-model="data.anexo_dados_bancarios"
                              label="Anexo"
                              :rules="[]"
                            />
                          </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </VTabsWindowItem>

                  <VTabsWindowItem
                    value="anexos"
                    class="pa-2"
                  >
                    <div class="d-flex flex-column gap-2">
                      <CDFDialogManager
                        v-model:items="data.anexos"
                        title="Anexo"
                        item-title="nome"
                        item-label="Anexo"
                        message-add="Novo Anexo"
                        :template="{
                          nome: '',
                          anexo: '',
                        }"
                      >
                        <template #header="{ item }: { item: IFuncionarioAnexo }">
                          <div class="d-flex flex-column gap-2 pa-4">
                            <VLabel v-if="item.nome">
                              {{ item.nome }}
                            </VLabel>
                          </div>
                        </template>
                        <template #content="{ item }: {item: IFuncionarioAnexo}">
                          <VRow>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <AppSelect
                                v-model="item.nome"
                                label="Tipo Documento"
                                placeholder="Selecione o tipo de documento"
                                :items="tipoDocumentos"
                                item-title="nome"
                                item-value="nome"
                                :rules="[cdfRules.requiredValidator]"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <CDFFileUpload
                                v-model="item.anexo"
                                label="Anexo"
                                :rules="[cdfRules.requiredValidator]"
                              />
                            </VCol>
                          </VRow>
                        </template>
                      </CDFDialogManager>
                    </div>
                  </VTabsWindowItem>

                  <VTabsWindowItem
                    value="honrarios"
                    class="pa-2"
                  >
                    <CDFDialogManager
                      v-model:items="data.honorarios"
                      title="Honorários"
                      item-title="perfil"
                      item-label="Honorário"
                      message-add="Novo Honorário"
                      :template="{
                        perfil: '',
                        valor_hh: 0,
                        valor_diaria: 0,
                        valor_demanda: 0,
                        valor_deslocamento: 0,
                        valor_refeicao: 0,
                        valor_pedagio: 0,
                        valor_hospedagem: 0,
                        valor_outros: 0,
                      }"
                    >
                      <template #header="{ item }: { item: IHonorario }">
                        <div class="d-flex flex-column gap-2 pa-4">
                          <VLabel v-if="item.perfil">
                            {{ item.perfil }}
                          </VLabel>
                        </div>
                      </template>
                      <template #content="{ item }: {item: IHonorario}">
                        <VRow>
                          <VCol cols="12">
                            <AppTextField
                              v-model="item.perfil"
                              label="Perfil"
                              placeholder="Digite o nome perfil"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <InputDinheiro
                              v-model="item.valor_hh"
                              label="Valor Hora Homem"
                              placeholder="Digite o valor da hora homem"
                              prepend-inner-icon="tabler-currency-real"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <InputDinheiro
                              v-model="item.valor_diaria"
                              label="Digite o Valor Diária"
                              placeholder="Digite o valor da diária"
                              prepend-inner-icon="tabler-currency-real"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <InputDinheiro
                              v-model="item.valor_demanda"
                              label="Valor Demanda"
                              placeholder="Digite o valor da demanda"
                              prepend-inner-icon="tabler-currency-real"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <InputDinheiro
                              v-model="item.valor_deslocamento"
                              label="Valor Deslocamento"
                              placeholder="Digite o valor do deslocamento"
                              prepend-inner-icon="tabler-currency-real"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <InputDinheiro
                              v-model="item.valor_refeicao"
                              label="Valor Refeição"
                              placeholder="Digite o valor da refeição"
                              prepend-inner-icon="tabler-currency-real"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <InputDinheiro
                              v-model="item.valor_pedagio"
                              label="Valor Pedágio"
                              placeholder="Digite o valor do pedágio"
                              prepend-inner-icon="tabler-currency-real"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <InputDinheiro
                              v-model="item.valor_hospedagem"
                              label="Valor Hospedagem"
                              placeholder="Digite o valor da hospedagem"
                              prepend-inner-icon="tabler-currency-real"
                              :rules="[]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                          >
                            <InputDinheiro
                              v-model="item.valor_outros"
                              label="Valor Outros"
                              placeholder="Digite o valor de outros"
                              prepend-inner-icon="tabler-currency-real"
                              :rules="[]"
                            />
                          </VCol>
                        </VRow>
                      </template>
                    </CDFDialogManager>
                  </VTabsWindowItem>

                  <VTabsWindowItem
                    value="dados_usuario"
                    class="pa-2"
                  >
                    <VCard variant="outlined">
                      <VCardText>
                        <VRow>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <CDFTextField
                              v-model="data.user.email"
                              label="E-mail"
                              placeholder="Digite o endereço de e-mail"
                              :rules="[cdfRules.emailValidator]"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <CDFTextField
                              v-model="data.user.password"
                              label="Senha"
                              placeholder="Digite o senha"
                              type="password"
                            />
                          </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </VTabsWindowItem>
                </VTabsWindow>
              </VCol>
            </vrow>
          </VCardText>
        </VCard>
      </VCol>
    </template>
  </LayoutForms>
</template>
