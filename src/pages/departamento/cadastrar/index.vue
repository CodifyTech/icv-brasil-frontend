<script setup lang="ts">
import FormDepartamento from '../components/form-departamento.vue'
import { useDepartamentoStore } from '../store/useDepartamentoStore'

definePage({
  meta: {
    navActiveLink: 'departamento',
    action: 'create',
    subject: 'departamento',
  },
})

const { resetForm } = useDepartamentoStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormDepartamento />
</template>
