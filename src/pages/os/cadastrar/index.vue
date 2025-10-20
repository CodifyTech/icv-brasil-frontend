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

const { resetForm, fetchOrdemServico } = store

const {
  formData,
} = storeToRefs(store)

const route = useRoute()

onMounted(async () => {
  if (route.query.duplicar) {
    await fetchOrdemServico(route.query.duplicar as string)

    formData.value.id = null
    formData.value.codigo = ''
    formData.value.num_pedido_compra = ''
    formData.value.anexos = []
    formData.value.fotos = []

    formData.value.material_equipamentos?.forEach(item => {
      item.id = null
    })
  }
})

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormOrdemServico />
</template>
