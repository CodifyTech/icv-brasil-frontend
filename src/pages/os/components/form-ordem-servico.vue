<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useOrdemServicoStore } from '../store/useOrdemServicoStore'
import CDFButton from '@/components/CDF/CDFButton.vue'
import CDFManager from '@/components/CDF/CDFManager.vue'
import CDFTextField from '@/components/CDF/CDFTextField.vue'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import PhotoUpload from '@/components/PhotoUpload.vue'
import { useInmetroStore } from '@/pages/inmetro/store/useInmetroStore'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import * as rules from '@/validators/cdf-rules'

const { isEditing = false, isHeader = true } = defineProps<{
  isEditing?: boolean
  isHeader?: boolean
}>()

// Store de dados de apoio (escopos, tipos de serviço, responsáveis)
const inmetroStore = useInmetroStore()

// Store de operações de OS (CRUD, form, etc)
const osStore = useOrdemServicoStore()

// Store de notificações
const snackbarStore = useSnackbarStore()

const perfilResponsavelOptions = ref([])

onMounted(async () => {
  // Carregar dados de apoio sempre
  await Promise.all([
    osStore.loadClientes(),
    inmetroStore.fetchEscopo(),
    inmetroStore.fetchResponsavel(),
  ])
})

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
  propostas,
} = storeToRefs(inmetroStore)

watch(formData, () => {
  if (isEditing) {
    perfilResponsavelOptions.value = []
    perfilResponsavelOptions.value = responsaveis.value
      ?.find(item => item.id === formData.value.responsavel_id)?.honorarios ?? []
    inmetroStore.fetchPropostas(formData.value.cliente_id)
    inmetroStore.fetchTipoServico(formData.value.proposta_id)
  }
})

const {
  save,
  update,
  resetForm,
  gerarCodigoOS,
} = osStore

// Estado para controle de loading do email
const loadingEmail = ref(false)

// Função para enviar solicitação para responsável
const enviarSolicitacaoResponsavel = async () => {
  if (!formData.value?.id || !isEditing)
    return

  try {
    loadingEmail.value = true

    await osStore.enviarSolicitacaoResponsavel(formData.value.id)

    snackbarStore.showSnackbar({
      text: 'E-mail enviado para o responsável com sucesso!',
      color: 'success',
    })

    // Recarregar a OS para atualizar o status
    if (formData.value.id)
      await osStore.fetchOrdemServico(formData.value.id)
  }
  catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    snackbarStore.showSnackbar({
      text: 'Erro ao enviar e-mail para o responsável',
      color: 'error',
    })
  }
  finally {
    loadingEmail.value = false
  }
}

// Função para verificar se o email já foi enviado hoje
const emailJaEnviadoHoje = computed(() => {
  if (!formData.value?.email_responsavel_enviado_em)
    return false

  const dataEnvio = new Date(formData.value.email_responsavel_enviado_em)
  const hoje = new Date()

  return dataEnvio.toDateString() === hoje.toDateString()
})

// Verificar se pode enviar email
const podeEnviarEmail = computed(() => {
  return isEditing && formData.value?.responsavel && !emailJaEnviadoHoje.value
})

watch(() => formData.value.cliente_id, () => {
  propostas.value = []
  formData.value.proposta_id = null
  inmetroStore.fetchPropostas(formData.value.cliente_id)
})

watch(() => formData.value.proposta_id, () => {
  formData.value.tipo_servico_id = null
  inmetroStore.fetchTipoServico(formData.value.proposta_id)
})
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
    <template #actions>
      <CDFButton
        v-if="podeEnviarEmail"
        :loading="loadingEmail"
        icon="tabler-mail"
        color="info"
        variant="elevated"
        @click="enviarSolicitacaoResponsavel"
      >
        Enviar para Responsável
      </CDFButton>

      <VTooltip
        v-else-if="isEditing && formData?.responsavel && emailJaEnviadoHoje"
        text="E-mail já enviado hoje"
      >
        <template #activator="{ props }">
          <VIcon
            v-bind="props"
            icon="tabler-mail-check"
            color="success"
            size="24"
          />
        </template>
      </VTooltip>
    </template>
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
                  v-model="formData.codigo"
                  label="Código"
                  placeholder="Digite o código da OS"
                  :rules="[rules.requiredValidator]"
                >
                  <template #append-inner>
                    <CDFButton
                      variant="outlined"
                      color="primary"
                      size="small"
                      icon="tabler-wand"
                      @click="gerarCodigoOS"
                    />
                  </template>
                </CDFTextField>
              </VCol>
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
                <AppAutocomplete
                  v-model="formData.proposta_id"
                  label="Proposta"
                  placeholder="Selecione a proposta"
                  :items="propostas"
                  item-title="codigo_proposta"
                  item-value="id"
                  :rules="[rules.requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <CDFTextField
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

      <!-- Seção de Fotos -->
      <VCol cols="12">
        <VCard
          title="Fotos"
          variant="outlined"
        >
          <VDivider />
          <VCardText>
            <PhotoUpload
              v-model="formData.fotos"
              label="Fotos da OS"
              placeholder="Arraste fotos aqui ou clique para selecionar"
              :max-files="20"
              :max-file-size="10"
              :disabled="loading.save"
              :loading="loading.upload"
            />
          </VCardText>
        </VCard>
      </VCol>
    </template>
  </LayoutForms>
</template>
