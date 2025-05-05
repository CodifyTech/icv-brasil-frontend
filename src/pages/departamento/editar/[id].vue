<script setup lang="ts">
import FormDepartamento from '../components/form-departamento.vue'
import { useDepartamentoStore } from '../store/useDepartamentoStore'

definePage({
  meta: {
    navActiveLink: 'departamento',
    action: 'edit',
    subject: 'departamento',
  },
})

const store = useDepartamentoStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormDepartamento is-editing/>
</template>
