<script setup lang="ts">
import FormTipoServico from '../components/form-tiposervico.vue'
import { useTipoServicoStore } from '../store/useTipoServicoStore'

definePage({
  meta: {
    navActiveLink: 'tiposervico',
    action: 'edit',
    subject: 'tiposervico',
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
