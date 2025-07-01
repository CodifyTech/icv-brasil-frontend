<script setup lang="ts">
import FormTipoServico from '../components/form-tiposervico.vue'
import { useTipoServicoStore } from '../store/useTipoServicoStore'

definePage({
  meta: {
    navActiveLink: 'tiposervico',
    action: 'create',
    subject: 'tiposervico',
  },
})

const { resetForm } = useTipoServicoStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormTipoServico />
</template>
