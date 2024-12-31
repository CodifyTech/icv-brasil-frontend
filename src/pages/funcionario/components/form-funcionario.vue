<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFuncionarioStore } from '../store/useFuncionarioStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'
import {blurHandler} from "@/utils/generals";

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useFuncionarioStore()

onMounted(() => {
  // 👉 methods
})

const {
  form,
  data,
  loading,
} = storeToRefs(store)

const tab = ref('dados_pessoais')

const {
  save,
  update,
  resetForm,
} = store

onBeforeRouteLeave(() => {
  resetForm()
})
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
        method: () => save(),
      },
      update: {
        method: () => update(),
      },
      reset: {
        method: () => resetForm(),
      },
    }"
    back="/funcionario"
  >
    <template #content>
      <VCol cols="12">
        <VCard flat>
          <VCardText class="px-0">
            <VRow>
              <VCol cols="12">
                <CDFTextField
                  v-model="data.nome"
                  label="Nome Completo"
                  placeholder="Digite o nome completo"
                  :rules="[rules.requiredValidator]"
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
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="data.telefone_1"
                  v-mask="'(##) ####-####'"
                  type="tel"
                  label="Telefone 1"
                  placeholder="Digite o número do telefone 1"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="data.telefone_2"
                  v-mask="'(##) ####-####'"
                  type="tel"
                  label="Telefone 2"
                  placeholder="Digite o número do telefone 2"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="data.email_1"
                  label="E-mail 1"
                  placeholder="Digite o endereço de e-mail 1"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="data.email_2"
                  label="E-mail 2"
                  placeholder="Digite o endereço de e-mail 2"
                  :rules="[]"
                />
              </VCol>
              <VCol cols="12">
                <Endereco v-model:data="data" />
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="data.aeroporto_proximo"
                  label="Aeroporto Próximo"
                  placeholder="Digite o nome do aeroporto mais próximo"
                  :rules="[]"
                />
              </VCol>
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
                </VTabs>

                <VTabsWindow v-model="tab">
                  <VTabsWindowItem value="qualificacoes_pofissionais" />

                  <VTabsWindowItem value="atestados_ocupacionais_epi">
                    <VRow>
                      <VCol
                        cols="12"
                        md="6"
                      >
                        <CDFTextField
                          v-model="data.nome"
                          :label="$t('formacao.form.nome.label')"
                          :placeholder="$t('formacao.form.nome.placeholder')"
                          :rules="[rules.requiredValidator]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="6"
                      >
                        <CDFTextField
                          v-model="data.conselho_classe"
                          :label="$t('formacao.form.conselho_classe.label')"
                          :placeholder="$t('formacao.form.conselho_classe.placeholder')"
                          :rules="[rules.requiredValidator]"
                        />
                      </VCol>

                      <VCol
                          cols="12"
                          md="4"
                      >
                        <CDFTextField
                            v-model="data.nome"
                            label="Nome"
                            :placeholder="{{placeholder}"
                            :rules="[rules.requiredValidator]"
                        />
                      </VCol>
                      <VCol
                          cols="12"
                          md="4"
                      >
                        <CDFTextField
                            v-model="data.ca"
                            :label="Ca"
                            :placeholder="{{placeholder}"
                            :rules="[rules.requiredValidator]"
                        />
                      </VCol>
                      <VCol
                          cols="12"
                          md="4"
                      >
                        <AppAutocomplete
                            v-model="data.funcionario_id"
                            v-debounce:900="fetchFuncionario"
                            :items="funcionarios"
                            label="Funcionario"
                            :return-object="false"
                            :loading="loading.funcionario"
                            :rules="[rules.requiredValidator]"
                            item-value="id"
                            item-title="id"
                        >
                          <template #clear>
                            <button
                                @click="() => {
                fetchFuncionario()
                blurHandler()
              }"
                            >
                              <VIcon icon="tabler-x" />
                            </button>
                          </template>
                        </AppAutocomplete>
                      </VCol>
                    </VRow>
                  </VTabsWindowItem>

                  <VTabsWindowItem value="dados_empresariais">
                    <VRow>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <CDFTextField
                          v-model="data.razao_social"
                          :label="$t('funcionario.form.razao_social.label')"
                          :placeholder="$t('funcionario.form.razao_social.placeholder')"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <CDFTextField
                          v-model="data.nome_fantasia"
                          :label="$t('funcionario.form.nome_fantasia.label')"
                          :placeholder="$t('funcionario.form.nome_fantasia.placeholder')"
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
                          :label="$t('funcionario.form.cnpj.label')"
                          :placeholder="$t('funcionario.form.cnpj.placeholder')"
                          :rules="[]"
                        />
                      </VCol>
                    </VRow>
                  </VTabsWindowItem>

                  <VTabsWindowItem value="dados_bancarios">
                    <VRow>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <CDFTextField
                          v-model="data.banco"
                          :label="$t('funcionario.form.banco.label')"
                          :placeholder="$t('funcionario.form.banco.placeholder')"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <CDFTextField
                          v-model="data.agencia"
                          :label="$t('funcionario.form.agencia.label')"
                          :placeholder="$t('funcionario.form.agencia.placeholder')"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <CDFTextField
                          v-model="data.conta"
                          :label="$t('funcionario.form.conta.label')"
                          :placeholder="$t('funcionario.form.conta.placeholder')"
                          :rules="[]"
                        />
                      </VCol>
                    </VRow>
                  </VTabsWindowItem>

                  <VTabsWindowItem value="honrarios">
                    <VRow>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <InputDinheiro
                          v-model="data.valor_hh"
                          :label="$t('funcionario.form.valor_hh.label')"
                          :placeholder="$t('funcionario.form.valor_hh.placeholder')"
                          prepend-inner-icon="tabler-currency-real"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <InputDinheiro
                          v-model="data.valor_diaria"
                          :label="$t('funcionario.form.valor_diaria.label')"
                          :placeholder="$t('funcionario.form.valor_diaria.placeholder')"
                          prepend-inner-icon="tabler-currency-real"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <InputDinheiro
                          v-model="data.valor_demanda"
                          :label="$t('funcionario.form.valor_demanda.label')"
                          :placeholder="$t('funcionario.form.valor_demanda.placeholder')"
                          prepend-inner-icon="tabler-currency-real"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <InputDinheiro
                          v-model="data.valor_deslocamento"
                          :label="$t('funcionario.form.valor_deslocamento.label')"
                          :placeholder="$t('funcionario.form.valor_deslocamento.placeholder')"
                          prepend-inner-icon="tabler-currency-real"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <InputDinheiro
                          v-model="data.valor_refeicao"
                          :label="$t('funcionario.form.valor_refeicao.label')"
                          :placeholder="$t('funcionario.form.valor_refeicao.placeholder')"
                          prepend-inner-icon="tabler-currency-real"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <InputDinheiro
                          v-model="data.valor_pedagio"
                          :label="$t('funcionario.form.valor_pedagio.label')"
                          :placeholder="$t('funcionario.form.valor_pedagio.placeholder')"
                          prepend-inner-icon="tabler-currency-real"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <InputDinheiro
                          v-model="data.valor_hospedagem"
                          :label="$t('funcionario.form.valor_hospedagem.label')"
                          :placeholder="$t('funcionario.form.valor_hospedagem.placeholder')"
                          prepend-inner-icon="tabler-currency-real"
                          :rules="[]"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <InputDinheiro
                          v-model="data.valor_outros"
                          :label="$t('funcionario.form.valor_outros.label')"
                          :placeholder="$t('funcionario.form.valor_outros.placeholder')"
                          prepend-inner-icon="tabler-currency-real"
                          :rules="[]"
                        />
                      </VCol>
                    </VRow>
                  </VTabsWindowItem>
                </VTabsWindow>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </template>
  </LayoutForms>
</template>
