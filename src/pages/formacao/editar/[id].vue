<script setup lang="ts">
import FormFormacao from '../components/form-formacao.vue'
import { useFormacaoStore } from '../store/useFormacaoStore'

definePage({
  meta: {
    navActiveLink: 'formacao',
    action: 'edit',
    subject: 'formacao',
  },
})

const store = useFormacaoStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormFormacao is-editing />
</template>
