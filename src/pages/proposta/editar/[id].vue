<script setup lang="ts">
import FormProposta from '../components/form-proposta.vue'
import { usePropostaStore } from '../store/usePropostaStore'

definePage({
  meta: {
    navActiveLink: 'proposta',
    action: 'edit',
    subject: 'proposta',
  },
})

const store = usePropostaStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormProposta is-editing />
</template>
