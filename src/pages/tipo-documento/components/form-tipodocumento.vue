<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTipoDocumentoStore } from '../store/useTipoDocumentoStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useTipoDocumentoStore()

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
    :title="!isEditing ? 'Criar Tipo Documento' : 'Editar Tipo Documento'"
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
    back="/tipo-documento"
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
