<script setup lang="ts">
import FormTipoDocumento from '../components/form-tipodocumento.vue'
import { useTipoDocumentoStore } from '../store/useTipoDocumentoStore'

definePage({
  meta: {
    navActiveLink: 'tipo-documento',
    action: 'create',
    subject: 'tipo-documento',
  },
})

const { resetForm } = useTipoDocumentoStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormTipoDocumento />
</template>
