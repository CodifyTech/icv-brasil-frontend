<script setup lang="ts">
import FormFuncionario from '../components/form-funcionario.vue'
import { useFuncionarioStore } from '../store/useFuncionarioStore'

definePage({
  meta: {
    navActiveLink: 'funcionario',
    action: 'edit',
    subject: 'funcionario',
  },
})

const store = useFuncionarioStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormFuncionario is-editing />
</template>
