<script setup lang="ts">
import FormOrdemServico from '../components/form-ordem-servico.vue'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'

definePage({
  meta: {
    navActiveLink: 'os',
    action: 'create',
    subject: 'os',
  },
})

const store = useOrdemServicoStore()

const {
  data,
} = storeToRefs(store)

onBeforeRouteLeave(() => {
  store.resetForm()
  data.value = {}
})
</script>

<template>
  <FormOrdemServico />
</template>
