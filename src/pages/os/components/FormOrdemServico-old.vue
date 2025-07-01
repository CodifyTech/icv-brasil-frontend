<script setup lang="ts">
import { useInmetroStore } from '@/pages/inmetro/store/useInmetroStore'
import * as rules from '@/validators/cdf-rules'

const props = withDefaults(defineProps<{
  isEditing?: boolean
  isHeader?: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useInmetroStore()

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

// Validação quando marca flag Inmetro
const onInmetroFlagChange = (index: number) => {
  const anexo = anexosPreview.value[index]
  if (anexo.inmetroFlag) {
    const extension = anexo.file.name.split('.').pop()?.toLowerCase()
    if (extension !== 'jpg' && extension !== 'jpeg')
      alert(`Atenção: O arquivo "${anexo.file.name}" marcado para Inmetro não é .jpg. Por favor, revise.`)
  }
}

// Submit do formulário
const submitForm = async () => {
  // Validar arquivos marcados como Inmetro
  const invalidFiles = anexosPreview.value.filter(anexo => {
    if (anexo.inmetroFlag) {
      const extension = anexo.file.name.split('.').pop()?.toLowerCase()

      return extension !== 'jpg' && extension !== 'jpeg'
    }

    return false
  })

  if (invalidFiles.length > 0) {
    alert('Erro: Arquivos marcados para Inmetro devem ser .jpg. Corrija antes de enviar.')

    return
  }

  // Preparar dados para envio
  const dados = {
    ...formData.value,
    anexos: anexosPreview.value.map(anexo => anexo.file),
    inmetro_flags: anexosPreview.value.reduce((flags, anexo) => {
      flags[anexo.file.name] = anexo.inmetroFlag

      return flags
    }, {} as Record<string, boolean>),
  }

  try {
    if (isEditing)
      await update()
    else
      await save()

    // Redirecionar para dashboard após sucesso
    await navigateTo('/inmetro/dashboard')
  }
  catch (error) {
    console.error('Erro ao salvar OS:', error)
  }
}

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    :title="!isEditing ? 'Nova Ordem de Serviço - Inmetro' : 'Editar Ordem de Serviço'"
    :is-editing="isEditing"
    :is-header="isHeader"
    :actions="{
      save: {
        method: handleSave,
      },
      update: {
        method: handleSave,
      },
      reset: {
        method: resetForm,
      },
    }"
    back="/inmetro"
  >
    <template #content>
      <!-- Informações Básicas -->
      <VCol cols="12">
        <VCard
          title="Informações Básicas"
          variant="outlined"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <CDFTextField
                  v-model="formData.numero_os"
                  label="Número da OS"
                  placeholder="Será gerado automaticamente"
                  :readonly="true"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <CDFSelectField
                  v-model="formData.cliente_id"
                  label="Cliente"
                  placeholder="Selecione o cliente"
                  :items="clienteOptions"
                  item-title="razao_social"
                  item-value="id"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <CDFDateField
                  v-model="formData.data_abertura"
                  label="Data de Abertura"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <CDFSelectField
                  v-model="formData.tipo_servico"
                  label="Tipo de Serviço"
                  placeholder="Selecione o tipo"
                  :items="tipoServicoOpts"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <CDFSelectField
                  v-model="formData.status"
                  label="Status"
                  placeholder="Selecione o status"
                  :items="statusOpts"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <CDFSelectField
                  v-model="formData.prioridade"
                  label="Prioridade"
                  placeholder="Selecione a prioridade"
                  :items="prioridadeOpts"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="formData.responsavel"
                  label="Responsável"
                  placeholder="Nome do responsável"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <CDFDateField
                  v-model="formData.data_prevista"
                  label="Data Prevista"
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <CDFDateField
                  v-model="formData.data_conclusao"
                  label="Data de Conclusão"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Informações do Serviço -->
      <VCol cols="12">
        <VCard
          title="Informações do Serviço"
          variant="outlined"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="formData.equipamento"
                  label="Equipamento"
                  placeholder="Nome/modelo do equipamento"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="formData.numero_serie"
                  label="Número de Série"
                  placeholder="Número de série do equipamento"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="formData.marca"
                  label="Marca"
                  placeholder="Marca do equipamento"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <CDFTextField
                  v-model="formData.modelo"
                  label="Modelo"
                  placeholder="Modelo do equipamento"
                />
              </VCol>

              <VCol cols="12">
                <CDFTextareaField
                  v-model="formData.descricao_servico"
                  label="Descrição do Serviço"
                  placeholder="Descreva detalhadamente o serviço a ser realizado"
                  :rows="4"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <CDFTextareaField
                  v-model="formData.observacoes"
                  label="Observações"
                  placeholder="Observações adicionais"
                  :rows="3"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Upload de Anexos -->
      <VCol cols="12">
        <VCard
          title="Anexos"
          variant="outlined"
        >
          <VCardText>
            <VRow>
              <VCol cols="12">
                <CDFFileUpload
                  v-model="anexos"
                  label="Anexar Documentos"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  @update:model-value="handleFileUpload"
                />
                <VChip
                  class="mt-2"
                  color="info"
                  size="small"
                  variant="outlined"
                >
                  Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                </VChip>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </template>
  </LayoutForms>
</template>
