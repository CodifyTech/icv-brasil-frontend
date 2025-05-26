<script setup lang="ts">
import FormCargo from '../components/form-cargo.vue'
import { useCargoStore } from '../store/useCargoStore'

definePage({
  meta: {
    navActiveLink: 'cargo',
    action: 'edit',
    subject: 'cargo',
  },
})

const store = useCargoStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormCargo is-editing />
</template>
