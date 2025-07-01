<script setup lang="ts">
import FormOrdemServico from '../components/FormOrdemServico.vue'
import { useInmetroStore } from '@/pages/inmetro/store/useInmetroStore'

definePage({
  meta: {
    navActiveLink: 'inmetro',
    action: 'create',
    subject: 'inmetro',
  },
})

const { resetForm } = useInmetroStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormOrdemServico />
</template>
