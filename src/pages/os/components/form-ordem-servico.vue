<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInmetroStore } from '@/pages/inmetro/store/useInmetroStore'
import { useOrdemServicoStore } from '@/pages/os/store/useOrdemServicoStore'
import * as rules from '@/validators/cdf-rules'

const { isEditing = false, isHeader = true } = defineProps<{
  isEditing?: boolean
  isHeader?: boolean
}>()

// Store de dados de apoio (escopos, tipos de serviço, responsáveis)
const inmetroStore = useInmetroStore()

// Store de operações de OS (CRUD, form, etc)
const osStore = useOrdemServicoStore()

onMounted(async () => {
  // Carregar dados de apoio sempre
  await Promise.all([
    osStore.loadClientes(),
    inmetroStore.fetchEscopo(),
    inmetroStore.fetchTipoServico(),
    inmetroStore.fetchResponsavel(),
  ])
})

// Watcher para reativo quando formData mudar (útil para edição)
watch(() => osStore.formData, (newFormData: any) => {
  if (newFormData && Object.keys(newFormData).length > 0)
    console.log('FormData atualizado:', newFormData)
}, { deep: true })

const {
  formRef,
  formData,
  loading,
  clientes,
} = storeToRefs(osStore)

const {
  escopos,
  tiposServico,
  responsaveis,
} = storeToRefs(inmetroStore)

const {
  save,
  update,
  resetForm,
} = osStore

onBeforeRouteLeave(() => {
  resetForm()
})

const perfilResponsavelOptions = ref([])
</script>

<template>
  <LayoutForms
    v-model:form="formRef"
    v-model:loading="loading.save"
    :title="!isEditing ? 'Criar Ordem de Serviço' : 'Editar Ordem de Serviço'"
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
    back="/os"
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
                <AppAutocomplete
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
                <AppTextField
                  v-model="formData.fornecedor"
                  label="Fornecedor"
                  placeholder="Digite o nome do fornecedor"
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
                <AppAutocomplete
                  v-model="formData.tipo_servico_id"
                  label="Tipo de Serviço"
                  placeholder="Digite o tipo de serviço"
                  :items="tiposServico"
                  item-title="nome"
                  item-value="id"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppAutocomplete
                  v-model="formData.responsavel_id"
                  label="Responsável pela Execução"
                  placeholder="Digite o nome do responsável pela execução"
                  :rules="[rules.requiredValidator]"
                  :items="responsaveis"
                  item-title="nome"
                  item-value="id"
                  @update:model-value="(value) => {
                    perfilResponsavelOptions = []
                    formData.perfil_responsavel_id = null

                    perfilResponsavelOptions = responsaveis
                      ?.find((item) => item.id === value)?.honorarios ?? []
                  }"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppAutocomplete
                  v-model="formData.perfil_responsavel_id"
                  label="Perfil do Responsável"
                  placeholder="Selecione o perfil"
                  :items="perfilResponsavelOptions"
                  item-title="perfil"
                  item-value="id"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppAutocomplete
                  v-model="formData.escopo_acreditacao_id"
                  label="Escopo de Acreditação"
                  placeholder="Selecione o escopo"
                  :items="escopos"
                  item-title="nome"
                  item-value="id"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
                  v-model="formData.num_pedido_compra"
                  label="Nº Pedido de Compra"
                  placeholder="Digite o número do pedido de compra"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="formData.descritivo"
                  label="Descritivo"
                  placeholder="Digite o descritivo"
                  textarea
                  rows="4"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <CDFManager
          v-model:items="formData.material_equipamentos"
          v-model:form="formRef"
          title="Material/Equipamento"
          item-title="descricao"
          item-label="Material/Equipamento"
          message-add="Adicionar Material/Equipamento"
          :template="{
            descricao: '',
          }"
        >
          <template #header="{ item }">
            {{ item.descricao || 'Novo Material/Equipamento' }}
          </template>
          <template #content="{ item }">
            <VRow>
              <VCol cols="12">
                <CDFTextField
                  v-model="item.descricao"
                  label="Descrição do Material/Equipamento"
                  placeholder="Digite a Descrição do Material/Equipamento"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
            </VRow>
          </template>
        </CDFManager>
      </VCol>

      <VCol cols="12">
        <CDFManager
          v-model:items="formData.anexos"
          v-model:form="formRef"
          title="Anexos"
          item-title="nome"
          item-label="Anexo"
          message-add="Adicionar Anexo"
          :template="{
            nome: '',
            anexo: '',
            inmetro_flag: false,
          }"
        >
          <template #header="{ item }">
            {{ item.nome || 'Novo Anexo' }}
          </template>
          <template #content="{ item }">
            <VRow>
              <VCol cols="4">
                <CDFTextField
                  v-model="item.nome"
                  label="Nome do Anexo"
                  placeholder="Digite o nome do anexo"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol cols="6">
                <CDFFileUpload
                  v-model="item.anexo"
                  label="Documentos e Imagens"
                  show-size
                />
              </VCol>
              <VCol cols="2">
                <CDFSwitch
                  v-model="item.inmetro_flag"
                  label="Inmetro"
                  color="primary"
                  :true-value="1"
                  :false-value="0"
                />
              </VCol>
            </VRow>
          </template>
        </CDFManager>
      </VCol>
    </template>
  </LayoutForms>
</template>
