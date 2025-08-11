<script setup lang="ts">
import FormTipoDocumento from '../components/form-tipodocumento.vue'
import { useTipoDocumentoStore } from '../store/useTipoDocumentoStore'

definePage({
  meta: {
    navActiveLink: 'tipo-documento',
    action: 'edit',
    subject: 'tipo-documento',
  },
})

const store = useTipoDocumentoStore()
const router = useRouter()

const {
  fetchItem,
} = store

fetchItem(router.currentRoute.value.params.id)
</script>

<template>
  <FormTipoDocumento is-editing />
</template>
