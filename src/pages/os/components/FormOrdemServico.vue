<script setup lang="ts">
import { useInmetroStore } from '@/pages/inmetro/store/useInmetroStore'

const props = withDefaults(defineProps<{
  isEditing?: boolean
  isHeader?: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useInmetroStore()
const router = useRouter()

const {
  formData,
  loading,
  clientes,
} = storeToRefs(store)

const {
  save,
  update,
  resetForm,
  fetchClientes,
} = store

const { isEditing } = props

// Lista de arquivos selecionados para preview
const anexosPreview = ref<Array<{ file: File; inmetroFlag: boolean }>>([])

// Opções para o select de clientes
const clienteOptions = computed(() => {
  return clientes.value.map((cliente: any) => ({
    title: cliente.razao_social || cliente.nome_fantasia,
    value: cliente.id,
  }))
})

onMounted(async () => {
  await fetchClientes()

  // Definir código da OS automaticamente se não estiver editando
  if (!isEditing && !formData.value.codigo)
    formData.value.codigo = `OS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
})

// Função para preview dos anexos selecionados
const previewAnexos = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files) {
    anexosPreview.value = Array.from(files).map(file => ({
      file,
      inmetroFlag: false,
    }))
  }
}

// Validação se arquivo marcado como Inmetro é .jpg
const validarAnexosInmetro = (anexo: { file: File; inmetroFlag: boolean }) => {
  if (anexo.inmetroFlag) {
    const extension = anexo.file.name.split('.').pop()?.toLowerCase()

    if (extension !== 'jpg' && extension !== 'jpeg') {
      // eslint-disable-next-line no-alert
      alert(`Atenção: O arquivo "${anexo.file.name}" marcado para Inmetro não é .jpg. Por favor, revise.`)
    }
  }
}

// Função para enviar o formulário
const submitForm = async () => {
  // Validar arquivos marcados como Inmetro
  const invalidFiles = anexosPreview.value.filter((anexo: { file: File; inmetroFlag: boolean }) => {
    if (anexo.inmetroFlag) {
      const extension = anexo.file.name.split('.').pop()?.toLowerCase()

      return extension !== 'jpg' && extension !== 'jpeg'
    }

    return false
  })

  if (invalidFiles.length > 0) {
    // eslint-disable-next-line no-alert
    alert('Erro: Arquivos marcados para Inmetro devem ser .jpg. Corrija antes de enviar.')

    return
  }

  const dados = {
    ...formData.value,
    anexos: anexosPreview.value.map((anexo: { file: File; inmetroFlag: boolean }) => anexo.file),
    inmetro_flags: anexosPreview.value.reduce((flags: any, anexo: { file: File; inmetroFlag: boolean }) => {
      flags[anexo.file.name] = anexo.inmetroFlag

      return flags
    }, {}),
  }

  try {
    if (isEditing)
      await update()
    else
      await save()

    // Redirecionar para dashboard
    await router.push('/inmetro/dashboard')
  }
  catch (error) {
    console.error('Erro ao salvar OS:', error)
  }
}
</script>

<template>
  <VCard>
    <VCardTitle
      v-if="isHeader"
      class="d-flex align-center"
    >
      <VIcon class="me-2">
        tabler-file
      </VIcon>
      {{ isEditing ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço' }}
    </VCardTitle>

    <VCardText>
      <VForm @submit.prevent="submitForm">
        <!-- Dados básicos da OS -->
        <VRow>
          <VCol cols="12">
            <h2 class="text-h6 mb-4 pb-2 border-b">
              Dados da OS
            </h2>
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.codigo"
              label="Código OS"
              readonly
              variant="outlined"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppSelect
              v-model="formData.cliente_id"
              label="Cliente (Obrigatório)"
              :items="clienteOptions"
              variant="outlined"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.fornecedor"
              label="Fornecedor (Obrigatório)"
              variant="outlined"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.pedido_compra"
              label="Nº Pedido de Compra"
              variant="outlined"
            />
          </VCol>

          <VCol cols="12">
            <AppTextarea
              v-model="formData.descritivo"
              label="Descritivo"
              variant="outlined"
              rows="3"
            />
          </VCol>

          <VCol cols="12">
            <VCheckbox
              v-model="formData.disponivel_inmetro"
              label="Disponível para Inmetro (Geral da OS)"
            />
          </VCol>
        </VRow>

        <!-- Seção de Anexos -->
        <VRow class="mt-6">
          <VCol cols="12">
            <h3 class="text-h6 mb-4">
              Anexos
            </h3>

            <VFileInput
              multiple
              label="Selecionar Arquivos"
              variant="outlined"
              @change="previewAnexos"
            />

            <div class="text-caption text-medium-emphasis mt-2">
              Validação: Apenas .jpg se a flag "Inmetro" do anexo estiver marcada.
            </div>
          </VCol>

          <!-- Lista de arquivos selecionados -->
          <VCol
            v-if="anexosPreview.length > 0"
            cols="12"
          >
            <h4 class="text-subtitle-1 mb-3">
              Arquivos Selecionados:
            </h4>

            <VList>
              <VListItem
                v-for="(anexo, index) in anexosPreview"
                :key="index"
                class="border rounded mb-2"
              >
                <template #prepend>
                  <VIcon>mdi-file</VIcon>
                </template>

                <VListItemTitle>{{ anexo.file.name }}</VListItemTitle>

                <template #append>
                  <VCheckbox
                    v-model="anexo.inmetroFlag"
                    label="Inmetro?"
                    hide-details
                    @change="validarAnexosInmetro(anexo)"
                  />
                </template>
              </VListItem>
            </VList>
          </VCol>
        </VRow>

        <!-- Botões de ação -->
        <VRow class="mt-6">
          <VCol class="d-flex gap-3 justify-end">
            <VBtn
              variant="outlined"
              color="default"
              @click="resetForm"
            >
              Limpar
            </VBtn>

            <VBtn
              type="submit"
              color="primary"
              :loading="loading.save"
            >
              {{ isEditing ? 'Atualizar' : 'Criar' }} OS
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style scoped>
.border-b {
  border-block-end: 1px solid rgb(var(--v-border-color));
}
</style>
