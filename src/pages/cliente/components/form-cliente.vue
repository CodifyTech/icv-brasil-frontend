<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getPropostaStatusColor, getPropostaStatusLabel } from '../../../enums/PropostaStatusEnum'
import { useClienteStore } from '../store/useClienteStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import { usePropostaStore } from '@/pages/proposta/store/usePropostaStore'
import type { IProposta } from '@/pages/proposta/types'
import * as rules from '@/validators/cdf-rules'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = useClienteStore()
const propostaStore = usePropostaStore()

const {
  form,
  data,
  loading,
} = storeToRefs(store)

const {
  save,
  update,
  resetForm,
} = store

const tab = ref('matriz')
const propostasCliente = ref<any[]>([])
const loadingPropostas = ref(false)
const search = ref('')

const headers = ref([
  { title: 'Cliente', key: 'cliente_nome', sortable: true },
  { title: 'Código', key: 'codigo_proposta', sortable: true },
  { title: 'Pessoa de Contato', key: 'pessoa_contato', sortable: true },
  { title: 'Consultor', key: 'consultor.nome', sortable: true },
  { title: 'Área', key: 'area', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Data de Criação', key: 'created_at', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false },
])

const fetchPropostasCliente = async () => {
  loadingPropostas.value = true
  try {
    const propostas = await propostaStore.buscarPropostasPorCliente(data.value.id)

    propostasCliente.value = propostas
  }
  catch (error) {
    console.error('Erro ao buscar propostas:', error)

    propostasCliente.value = []
  }
  finally {
    loadingPropostas.value = false
  }
}

watch(() => data.value, (data: IProposta) => {
  if (data.id && isEditing)
    fetchPropostasCliente()

  if (!data.filiais)
    data.filiais = []
})

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    :title="!isEditing ? 'Criar Cliente' : 'Editar Cliente'"
    :is-editing="isEditing"
    :is-header="isHeader"
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
    back="/cliente"
  >
    <template #content>
      <VCol cols="12">
        <VCard flat>
          <VTabs
            v-model="tab"
            class="mb-2"
          >
            <VTab value="matriz">
              Matriz
            </VTab>
            <VTab value="filial">
              Filiais
            </VTab>
            <VTab value="propostas">
              Propostas
            </VTab>
          </VTabs>
          <VTabsWindow v-model="tab">
            <VTabsWindowItem value="matriz">
              <VCard
                title="Matriz"
                variant="outlined"
              >
                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <CDFTextField
                        v-model="data.codigo_cliente"
                        label="Código do Cliente"
                        placeholder="Ex: CLI001"
                        :rules="[]"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <CDFTextField
                        v-model="data.razao_social"
                        label="Razão Social"
                        placeholder="Digite o Razao social"
                        :rules="[rules.requiredValidator]"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <CDFTextField
                        v-model="data.nome_fantasia"
                        label="Nome Fantasia"
                        placeholder="Digite o nome fantasia"
                        :rules="[]"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <CDFTextField
                        v-model="data.cnpj"
                        v-mask="'##.###.###/####-##'"
                        label="CNPJ"
                        placeholder="Digite o CNPJ"
                        :rules="[rules.requiredValidator]"
                      />
                    </VCol>

                    <!-- Novos campos de contato -->
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <CDFTextField
                        v-model="data.email"
                        label="E-mail"
                        placeholder="Digite o e-mail"
                        type="email"
                        :rules="[]"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <CDFTextField
                        v-model="data.telefone"
                        v-mask="'(##) #####-####'"
                        label="Telefone"
                        placeholder="Digite o telefone"
                        :rules="[]"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <CDFTextField
                        v-model="data.contato_responsavel"
                        label="Contato Responsável"
                        placeholder="Nome do responsável"
                        :rules="[]"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VTabsWindowItem>
            <VTabsWindowItem value="filial">
              <CDFManager
                v-model:items="data.filiais"
                v-model:form="form"
                title="Filiais"
                item-title="razao_social"
                item-label="Filial"
                message-add="Adicionar Filial"
                :template="{
                  codigo_cliente: '',
                  razao_social: '',
                  nome_fantasia: '',
                  cnpj: '',
                  logradouro: '',
                  numero: '',
                  complemento: '',
                  bairro: '',
                  cep: '',
                  cidade: '',
                  estado: '',
                }"
              >
                <template #content="{ item, index }">
                  <VRow>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <CDFTextField
                        v-model="item.codigo_cliente"
                        label="Código da Filial"
                        placeholder="Ex: FIL001"
                        :rules="[]"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <CDFTextField
                        v-model="item.razao_social"
                        label="Razão Social"
                        placeholder="Digite o Razão Social"
                        :rules="[rules.requiredValidator]"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <CDFTextField
                        v-model="item.nome_fantasia"
                        label="Nome Fantasia"
                        placeholder="Digite o Nome Fantasia"
                        :rules="[]"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <CDFTextField
                        v-model="item.cnpj"
                        v-mask="'##.###.###/####-##'"
                        label="CNPJ"
                        placeholder="Digite o CNPJ"
                        :rules="[rules.requiredValidator]"
                      />
                    </VCol>
                    <VCol cols="12">
                      <Endereco v-model:data="data.filiais[index]" />
                    </VCol>
                  </VRow>
                </template>
              </CDFManager>
            </VTabsWindowItem>
            <VTabsWindowItem value="propostas">
              <VRow v-if="loadingPropostas">
                <VCol
                  cols="12"
                  class="text-center"
                >
                  <VProgressCircular
                    indeterminate
                    color="primary"
                    size="40"
                  />
                  <p class="mt-2">
                    Carregando propostas...
                  </p>
                </VCol>
              </VRow>

              <div v-else-if="propostasCliente.length === 0">
                <VIcon
                  icon="tabler-file-x"
                  size="64"
                  color="grey"
                  class="mx-auto mb-4 d-block"
                />
                <h3 class="mb-2 text-center text-h6">
                  Nenhuma proposta encontrada
                </h3>
                <p class="text-center text-body-2 text-medium-emphasis">
                  Não há propostas com status aprovado ou perdido para este cliente.
                </p>
              </div>

              <div v-else>
                <VDataTable
                  :headers="headers"
                  :items="propostasCliente"
                  :items-per-page="10"
                  :search="search"
                  class="elevation-1"
                >
                  <template #top>
                    <div class="justify-end w-100 d-flex">
                      <VSpacer />
                      <div>
                        <AppTextField
                          v-model="search"
                          append-inner-icon="tabler-search"
                          label="Buscar"
                          single-line
                          hide-details
                          density="compact"
                          width="300"
                        />
                      </div>
                    </div>
                  </template>

                  <template #item.status="{ item }">
                    <VChip
                      :color="getPropostaStatusColor(item.status)"
                      variant="tonal"
                      size="small"
                    >
                      {{ getPropostaStatusLabel(item.status) }}
                    </VChip>
                  </template>

                  <template #item.cliente_nome="{ item }">
                    <div>
                      <div class="font-weight-medium">
                        {{ item.cliente?.nome_fantasia || item.cliente?.razao_social || 'Cliente não informado' }}
                      </div>
                      <div
                        v-if="item.cliente?.codigo_cliente"
                        class="text-caption text-medium-emphasis"
                      >
                        Cód: {{ item.cliente.codigo_cliente }}
                      </div>
                    </div>
                  </template>

                  <template #item.created_at="{ item }">
                    {{ item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-' }}
                  </template>

                  <template #item.actions="{ item }">
                    <VBtn
                      color="info"
                      variant="tonal"
                      size="small"
                      prepend-icon="tabler-eye"
                      :to="`/proposta/editar/${item.id}`"
                      class="me-2"
                    >
                      Visualizar
                    </VBtn>
                  </template>
                </VDataTable>
              </div>
            </VTabsWindowItem>
          </VTabsWindow>
        </VCard>
      </VCol>
    </template>
  </LayoutForms>
</template>
