<script setup lang="ts">
import FormFormacao from '../components/form-formacao.vue'
import { useFormacaoStore } from '../store/useFormacaoStore'

definePage({
  meta: {
    navActiveLink: 'formacao',
    action: 'create',
    subject: 'formacao',
  },
})

const { resetForm } = useFormacaoStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormFormacao />
</template>
