<script setup lang="ts">
import FormEscopo from '../components/form-escopo.vue'
import { useEscopoStore } from '../store/useEscopoStore'

definePage({
  meta: {
    navActiveLink: 'escopo',
    action: 'create',
    subject: 'escopo',
  },
})

const { resetForm } = useEscopoStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormEscopo />
</template>
