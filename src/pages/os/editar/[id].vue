<script setup lang="ts">
import FormOrdemServico from '../components/form-ordem-servico-v2.vue'
import { useInmetroStore } from '../store/useInmetroStore'

definePage({
  meta: {
    navActiveLink: 'inmetro',
    action: 'edit',
    subject: 'inmetro',
  },
})

const route = useRoute()
const { resetForm, fetchOrdemServico } = useInmetroStore()

onMounted(async () => {
  if (route.params.id)
    await fetchOrdemServico(route.params.id as string)
})

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormOrdemServico :is-editing="true" />
</template>
