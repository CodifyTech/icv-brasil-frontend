<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTipoServicoStore } from '../store/useTipoServicoStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useTipoServicoStore()

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
    :title="!isEditing ? 'Criar Tipo servico' : 'Editar Tipo servico'"
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
    back="/tiposervico"
  >
    <template #content>
      <VCol
        cols="12"
        md="4"
      >
        <CDFTextField
          v-model="data.nome"
          label="Nome"
          placeholder="Digite o Nome"
          :rules="[]"
        />
      </VCol>
    </template>
  </LayoutForms>
</template>
