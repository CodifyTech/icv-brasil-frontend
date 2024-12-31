<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFormacaoStore } from '../store/useFormacaoStore'
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

const store = useFormacaoStore()

onMounted(() => {
  // 👉 methods
  fetchFuncionario()
})

const {
  form,
  data,
  loading,
  messages,
  funcionarios,
} = storeToRefs(store)

const {
  save,
  update,
  resetForm,
  fetchFuncionario,
} = store

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    :title="!isEditing ? $t('formacao.register') : $t('formacao.edit')"
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
    back="/formacao"
  >
    <template #content>
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
    </template>
  </LayoutForms>
</template>
