<script setup lang="ts">
import FormOrdemServico from '../components/form-ordem-servico.vue'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

definePage({
  meta: {
    navActiveLink: 'os',
    action: 'edit',
    subject: 'os',
  },
})

const route = useRoute()
const router = useRouter()
const store = useOrdemServicoStore()
const snackbarStore = useSnackbarStore()
const { resetForm, resetOrdemAtual, fetchOrdemServico } = store

onMounted(async () => {
  if (route.params.id) {
    try {
      await fetchOrdemServico(route.params.id as string)
    }
    catch (error) {
      snackbarStore.showSnackbar({
        text: 'Erro ao carregar ordem de serviço',
        color: 'error',
        timeout: 4000,
      })
      router.push('/os')
    }
  }
})

onBeforeRouteLeave(() => {
  resetForm()
  resetOrdemAtual()
})
</script>

<template>
  <FormOrdemServico
    is-editing
    is-header
  />
</template>
