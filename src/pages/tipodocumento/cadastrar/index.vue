<script setup lang="ts">
import FormTipoDocumento from '../components/form-tipodocumento.vue'
import { useTipoDocumentoStore } from '../store/useTipoDocumentoStore'

definePage({
  meta: {
    navActiveLink: 'tipodocumento',
    action: 'create',
    subject: 'tipodocumento',
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
