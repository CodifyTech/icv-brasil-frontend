<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInmetroStore } from '../store/useInmetroStore'
import CDFTextField from '@/components/CDF/CDFTextField.vue'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useInmetroStore()

onMounted(async () => {
  await store.loadClientes()
})

const {
  formRef,
  formData,
  loading,
  clientes,
  statusOptions,
  escopoOptions,
  tipoInspecaoOptions,
} = storeToRefs(store)

const {
  save,
  update,
  resetForm,
} = store

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <LayoutForms
    v-model:form="formRef"
    v-model:loading="loading.save"
    :title="!isEditing ? 'Criar Ordem de Serviço - Inmetro' : 'Editar Ordem de Serviço - Inmetro'"
    :is-editing="isEditing"
    :is-header="isHeader"
    is-actions
    :actions="{
      save: {
        method: () => save(),
      },
      update: {
        method: () => update(),
      },
      reset: {
        method: () => resetForm(),
      },
    }"
    back="/inmetro"
  >
    <template #content>
      <VCol cols="12">
        <VCard
          title="Informações da Ordem de Serviço"
          variant="outlined"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="formData.numero_os"
                  label="Número da OS"
                  placeholder="Digite o número da OS"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VSelect
                  v-model="formData.cliente_id"
                  label="Cliente"
                  placeholder="Selecione o cliente"
                  :items="clientes"
                  item-title="razao_social"
                  item-value="id"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="formData.data_abertura"
                  label="Data de Abertura"
                  placeholder="Data de abertura"
                  type="date"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VSelect
                  v-model="formData.status"
                  label="Status"
                  placeholder="Selecione o status"
                  :items="statusOptions"
                  item-title="title"
                  item-value="value"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="formData.tipo_servico"
                  label="Tipo de Serviço"
                  placeholder="Digite o tipo de serviço"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="formData.responsavel"
                  label="Responsável"
                  placeholder="Digite o nome do responsável"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard
          title="Detalhes da Inspeção"
          variant="outlined"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.escopo_inspecao"
                  label="Escopo de Inspeção"
                  placeholder="Selecione o escopo"
                  :items="escopoOptions"
                  item-title="title"
                  item-value="value"
                  multiple
                  chips
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.tipo_inspecao"
                  label="Tipo de Inspeção"
                  placeholder="Selecione o tipo"
                  :items="tipoInspecaoOptions"
                  item-title="title"
                  item-value="value"
                  multiple
                  chips
                />
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="formData.observacoes"
                  label="Observações"
                  placeholder="Digite as observações"
                  rows="4"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard
          title="Anexos"
          variant="outlined"
        >
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VFileInput
                  v-model="formData.anexos"
                  label="Documentos e Imagens"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                  show-size
                  chips
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </template>
  </LayoutForms>
</template>
