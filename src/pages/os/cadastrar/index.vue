<script setup lang="ts">
import FormOrdemServico from '../components/form-ordem-servico.vue'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'

definePage({
  meta: {
    navActiveLink: 'inmetro',
    action: 'create',
    subject: 'inmetro',
  },
})

const { resetForm } = useOrdemServicoStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormOrdemServico />
</template>
