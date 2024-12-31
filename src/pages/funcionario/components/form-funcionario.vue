<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFuncionarioStore } from '../store/useFuncionarioStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'
import { blurHandler } from '@/utils/generals'

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
    :title="!isEditing ? $t('funcionario.register') : $t('funcionario.edit')"
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
        <VTabs v-model="tab">
          <VTab value="dados_pessoais">
            Dados Pessoais
          </VTab>
          <VTab value="formacoes">
            Formações
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
          <VTabsWindowItem value="dados_pessoais">
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.nome"
                  :label="$t('funcionario.form.nome.label')"
                  :placeholder="$t('funcionario.form.nome.placeholder')"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.rg"
                  :label="$t('funcionario.form.rg.label')"
                  :placeholder="$t('funcionario.form.rg.placeholder')"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.cpf"
                  v-mask="'###.###.###-##'"
                  :label="$t('funcionario.form.cpf.label')"
                  :placeholder="$t('funcionario.form.cpf.placeholder')"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.telefone_1"
                  v-mask="'(##) ####-####'"
                  type="tel"
                  :label="$t('funcionario.form.telefone_1.label')"
                  :placeholder="$t('funcionario.form.telefone_1.placeholder')"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.telefone_2"
                  v-mask="'(##) ####-####'"
                  type="tel"
                  :label="$t('funcionario.form.telefone_2.label')"
                  :placeholder="$t('funcionario.form.telefone_2.placeholder')"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.email_1"
                  :label="$t('funcionario.form.email_1.label')"
                  :placeholder="$t('funcionario.form.email_1.placeholder')"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.email_2"
                  :label="$t('funcionario.form.email_2.label')"
                  :placeholder="$t('funcionario.form.email_2.placeholder')"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.logradouro"
                  :label="$t('funcionario.form.logradouro.label')"
                  :placeholder="$t('funcionario.form.logradouro.placeholder')"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.bairro"
                  :label="$t('funcionario.form.bairro.label')"
                  :placeholder="$t('funcionario.form.bairro.placeholder')"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.cidade"
                  :label="$t('funcionario.form.cidade.label')"
                  :placeholder="$t('funcionario.form.cidade.placeholder')"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppAutocomplete
                  v-model="data.uf"
                  :label="$t('funcionario.form.uf.label')"
                  :placeholder="$t('funcionario.form.uf.placeholder')"
                  :rules="[]"
                  :items="[]"
                  item-value=""
                  item-title=""
                  :return-object="false"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="data.aeroporto_proximo"
                  :label="$t('funcionario.form.aeroporto_proximo.label')"
                  :placeholder="$t('funcionario.form.aeroporto_proximo.placeholder')"
                  :rules="[]"
                />
              </VCol>
            </VRow>
          </VTabsWindowItem>

          <VTabsWindowItem value="formacoes" />

          <VTabsWindowItem value="atestados_ocupacionais_epi">
            <VRow>
              <VCol
                cols="12"
                md="4"
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
                md="4"
              >
                <CDFTextField
                  v-model="data.conselho_classe"
                  :label="$t('formacao.form.conselho_classe.label')"
                  :placeholder="$t('formacao.form.conselho_classe.placeholder')"
                  :rules="[]"
                />
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
    </template>
  </LayoutForms>
</template>
