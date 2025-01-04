<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useClienteStore } from '../store/useClienteStore'
import type { IFilial } from '@/pages/cliente/types'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useClienteStore()

onMounted(() => {
  // 👉 methods

})

const {
  form,
  data,
  loading,
  messages,

} = storeToRefs(store)

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
    :title="!isEditing ? 'Criar Cliente' : 'Editar Cliente'"
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
    back="/cliente"
  >
    <template #content>
      <VCol
        cols="12"
        md="4"
      >
        <CDFTextField
          v-model="data.razao_social"
          label="Razao social"
          placeholder="Digite o Razao social"
          :rules="[rules.requiredValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <CDFTextField
          v-model="data.nome_fantasia"
          label="Nome fantasia"
          placeholder="Digite o Nome fantasia"
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
          label="Cnpj"
          placeholder="Digite o Cnpj"
          :rules="[rules.requiredValidator]"
        />
      </VCol>

      <VCol cols="12">
        <CDFManager
          v-model:items="data.filiais"
          title="Filial"
          item-title="razao_social"
          item-label="Filial"
          message-add="Adicionar Filial"
          :template="{ razao_social: '', nome_fantasia: '', cnpj: '' }"
        >
          <template #content="{ item }: { item: IFilial }">
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="item.razao_social"
                  label="Razao social"
                  placeholder="Digite o Razao social"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="item.nome_fantasia"
                  label="Nome fantasia"
                  placeholder="Digite o Nome fantasia"
                  :rules="[]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="item.cnpj"
                  v-mask="'##.###.###/####-##'"
                  label="Cnpj"
                  placeholder="Digite o Cnpj"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
            </VRow>
          </template>
        </CDFManager>
      </VCol>
    </template>
  </LayoutForms>
</template>
