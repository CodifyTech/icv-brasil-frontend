<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDepartamentoStore } from '../store/useDepartamentoStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'

const { isEditing } = withDefaults(defineProps<{
    isEditing: boolean
    isHeader: boolean
  }>(), {
    isEditing: false,
    isHeader: true,
  })

const store = useDepartamentoStore()

const {
  form,
  data,
  loading,
  gestores,
} = storeToRefs(store)

const {
  save,
  update,
  resetForm,
  fetchGestor
} = store

onMounted(() => {
  // 👉 methods
  fetchGestor()
})

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    :title="!isEditing ? 'Criar Departamento' : 'Editar Departamento'"
    :is-editing="isEditing"
    :is-header="isHeader"
    :actions=" {
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
    back="/departamento"
  >
    <template #content>
      <VCol cols="12">
        <CDFTextField
          v-model="data.nome"
          label="Nome do Departamento"
          placeholder="Digite o nome do departamento"
          :rules="[rules.requiredValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <CDFTextField
          v-model="data.email"
          label="E-mail"
          placeholder="Digite um e-mail padrão"
          :rules="[]"
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <AppAutocomplete
          v-model="data.gestores"
          label="Gestores"
          :items="gestores"
          placeholder="Selecione os gestores"
          :rules="[rules.requiredValidator]"
          chips
          closable-chips
          multiple
          :loading="loading.gestores"
          item-title="name"
          item-value="id"
          return-object
        >
          <template #chip=" { props, item }">
            <VChip
              v-bind="props"
              :text="item.raw.name"
            />
          </template>

          <template #item=" { props, item }">
            <VListItem
              v-bind="props"
              :subtitle="item.raw.email"
              :title="item.raw.name"
            />
          </template>
        </AppAutocomplete>
      </VCol>
    </template>
  </LayoutForms>
</template>
