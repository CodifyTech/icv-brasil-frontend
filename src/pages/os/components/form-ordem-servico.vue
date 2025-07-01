<script setup lang="ts">
import { storeToRefs } from 'pinia'
import CDFTextField from '@/components/CDF/CDFTextField.vue'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import { useInmetroStore } from '@/pages/inmetro/store/useInmetroStore'
import type { IMaterialEquipamento, IOrdemServicoAnexo } from '@/pages/inmetro/types'
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
  await store.fetchEscopo()
  await store.fetchTipoServico()
  await store.fetchResponsavel()
})

const {
  formRef,
  formData,
  loading,
  clientes,
  statusOptions,
  escopos,
  tiposServico,
  responsaveis,
} = storeToRefs(store)

const {
  save,
  update,
  resetForm,
} = store

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
          v-model:items="formData.materialEquipamentos"
          v-model:form="formRef"
          title="Material/Equipamento"
          item-title="descricao"
          item-label="Material/Equipamento"
          message-add="Adicionar Material/Equipamento"
          :template="{
            descricao: '',
          }"
        >
          <template #header="{ item }: { item: IMaterialEquipamento }">
            {{ item.descricao || 'Novo Material/Equipamento' }}
          </template>
          <template #content="{ item }: { item: IMaterialEquipamento }">
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
          <template #header="{ item }: { item: IOrdemServicoAnexo }">
            {{ item.nome || 'Novo Anexo' }}
          </template>
          <template #content="{ item }: { item: IOrdemServicoAnexo }">
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
                <VFileInput
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
