<script setup lang="ts">
import FormProposta from '../components/form-proposta.vue'
import { usePropostaStore } from '../store/usePropostaStore'

definePage({
  meta: {
    navActiveLink: 'proposta',
    action: 'create',
    subject: 'proposta',
  },
})

const { resetForm } = usePropostaStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormProposta />
</template>
