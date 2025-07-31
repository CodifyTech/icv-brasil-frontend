<script setup lang="ts">
import FormEscopo from '../components/form-escopo.vue'
import { useEscopoStore } from '../store/useEscopoStore'

definePage({
  meta: {
    navActiveLink: 'escopo',
    action: 'edit',
    subject: 'escopo',
  },
})

const store = useEscopoStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormEscopo is-editing />
</template>
