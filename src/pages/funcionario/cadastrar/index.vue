<script setup lang="ts">
import FormFuncionario from '../components/form-funcionario.vue'
import { useFuncionarioStore } from '../store/useFuncionarioStore'

definePage({
  meta: {
    navActiveLink: 'funcionario',
    action: 'create',
    subject: 'funcionario',
  },
})

const { resetForm } = useFuncionarioStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormFuncionario />
</template>
