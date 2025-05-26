<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCargoStore } from '../store/useCargoStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useCargoStore()

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
    :title="!isEditing ? 'Criar Cargo' : 'Editar Cargo'"
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
    back="/cargo"
  >
    <template #content>
      <VCol cols="12">
        <CDFTextField
          v-model="data.nome"
          label="Nome"
          placeholder="Digite o Nome"
          :rules="[]"
        />
      </VCol>
      <VCol cols="12">
        <AppTextarea
          v-model="data.descricao"
          label="Descrição"
          placeholder="Digite o Descrição"
          :rules="[]"
        />
      </VCol>
    </template>
  </LayoutForms>
</template>
