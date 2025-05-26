<script setup lang="ts">
import FormCargo from '../components/form-cargo.vue'
import { useCargoStore } from '../store/useCargoStore'

definePage({
  meta: {
    navActiveLink: 'cargo',
    action: 'create',
    subject: 'cargo',
  },
})

const { resetForm } = useCargoStore()

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <FormCargo />
</template>
