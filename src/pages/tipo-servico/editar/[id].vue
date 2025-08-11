<script setup lang="ts">
import FormTipoServico from '../components/form-tiposervico.vue'
import { useTipoServicoStore } from '../store/useTipoServicoStore'

definePage({
  meta: {
    navActiveLink: 'tipo-servico',
    action: 'edit',
    subject: 'tipo-servico',
  },
})

const store = useTipoServicoStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormTipoServico is-editing />
</template>
