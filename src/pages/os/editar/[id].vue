<script setup lang="ts">
import FormOrdemServico from '../components/form-ordem-servico.vue'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

definePage({
  meta: {
    navActiveLink: 'inmetro',
    action: 'edit',
    subject: 'inmetro',
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
      console.log('Carregando OS com ID:', route.params.id)
      await fetchOrdemServico(route.params.id as string)
      console.log('OS carregada com sucesso')
    }
    catch (error) {
      console.error('Erro ao carregar ordem de serviço:', error)
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
