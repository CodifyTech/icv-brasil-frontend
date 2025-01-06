<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { VForm } from 'vuetify/components/VForm'
import { usePropostaStore } from '../store/usePropostaStore'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import * as rules from '@/validators/cdf-rules'
import { blurHandler, formatCurrency } from '@/utils/generals'
import NovoServicoModal from '@/pages/proposta/components/NovoServicoModal.vue'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
}>(), {
  isEditing: false,
  isHeader: true,
})

const store = usePropostaStore()

onMounted(() => {
  // 👉 methods
  fetchFilial()
})

const {
  data,
  loading,
  filiais,
  modal,
} = storeToRefs(store)

const {
  save,
  update,
  resetForm,
  fetchFilial,
} = store

onBeforeRouteLeave(() => {
  resetForm()
})

const step = ref()
const form = ref<VForm>({})

const headers = ref([
  {
    title: 'Dados do Cliente',
    subtitle: '',
    canEdit: false,
    hasError: false,
    hasCompleted: false,
    step: 1,
    icon: 'fa-regular fa-user',
  },
  {
    title: 'Serviços',
    subtitle: '',
    canEdit: false,
    hasError: false,
    hasCompleted: false,
    step: 2,
    icon: 'fa-regular fa-dollar-sign',
  },
])

const validateStep = async (step: number) => {
  let hasError = false

  // Validar o formulário e esperar a resolução do resultado
  const result = await form.value.validate()

  // Se o formulário for inválido, definir hasError como true
  hasError = !result.valid

  // Atualizar o estado do item no array `headers`
  const item = headers.value.find(i => i.step === step)
  if (item) {
    item.hasError = hasError
    item.hasCompleted = !hasError
    item.icon = hasError ? 'fa-regular fa-exclamation' : 'fa-regular fa-check'
    item.subtitle = hasError ? 'Com erros' : ''
  }

  return !hasError // Retornar o oposto de `hasError` para indicar sucesso ou fracasso
}

const handleNextStep = async () => {
  const isValid = await validateStep(step.value)
  if (isValid && step.value < 2)
    step.value += 1
}
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    :title="!isEditing ? 'Criar Proposta' : 'Editar Proposta'"
    :is-editing="isEditing"
    :is-header="isHeader"
    :is-actions="false"
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
    back="/proposta"
  >
    <template #content>
      <VCol cols="12">
        <AppAutocomplete
          v-model="data.filial_id"
          v-debounce:900="fetchFilial"
          :items="filiais"
          label="Empresa"
          :return-object="false"
          :loading="loading.filial"
          :rules="[rules.requiredValidator]"
          item-value="id"
          item-title="nome_fantasia"
        >
          <template #clear>
            <button
              @click="() => {
                fetchFilial()
                blurHandler()
              }"
            >
              <VIcon icon="tabler-x" />
            </button>
          </template>
        </AppAutocomplete>
      </VCol>

      <VCol
        v-if="data.filial_id"
        cols="12"
      >
        <VStepper
          v-model="step"
          show-actions
          next-text="Próximo"
          prev-text="Anterior"
        >
          <VStepperHeader>
            <template
              v-for="(item, index) in headers"
              :key="`step-${index}`"
            >
              <!-- Renderiza o step atual -->
              <VStepperItem
                :value="item.step"
                :title="item.title"
                :complete="item.hasCompleted"
                :error="item.hasError"
                :editable="item.canEdit"
                :subtitle="item.subtitle"
                @next="() => {
                  if (!validateStep(step)) {
                    return // Impedir avanço se houver erro
                  }
                }"
              >
                <template #icon>
                  <VIcon
                    :icon="item.icon"
                    :color="item.hasError ? 'red' : 'green'"
                    class="mt-2"
                  />
                </template>
              </VStepperItem>

              <!-- Renderiza o divisor APENAS se NÃO for o último item -->
              <VDivider
                v-if="index < headers.length - 1"
                :key="`divider-${index}`"
              />
            </template>
          </VStepperHeader>
          <VStepperWindow class="my-2 mx-0">
            <VStepperWindowItem :value="1">
              <VForm
                ref="form"
                :key="step"
              >
                <VRow>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <CDFTextField
                      v-model="data.consultor"
                      label="Consultor"
                      placeholder="Digite o Consultor"
                      :rules="[rules.requiredValidator]"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <CDFTextField
                      v-model="data.pessoa_contato"
                      label="Pessoa contato"
                      placeholder="Digite o Pessoa contato"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="4"
                  >
                    <CDFTextField
                      v-model="data.telefone"
                      v-mask="'(##) ####-####'"
                      type="tel"
                      label="Telefone"
                      placeholder="Digite o Telefone"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <CDFTextField
                      v-model="data.email"
                      label="Email"
                      placeholder="Digite o Email"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <AppAutocomplete
                      v-model="data.area"
                      label="Area"
                      placeholder="Digite o Area"
                      :items="[]"
                      item-value=""
                      item-title=""
                      :return-object="false"
                    />
                  </VCol>
                </VRow>
              </VForm>
            </VStepperWindowItem>
            <VStepperWindowItem :value="2">
              <VCard variant="outlined">
                <template #title>
                  Serviços
                </template>
                <template #append>
                  <CDFButton
                    icon="tabler-plus"
                    @click="() => modal.isDialogVisible = true"
                  >
                    Novo Serviço
                  </CDFButton>
                </template>
                <VDivider />

                <VCardText class="pa-0">
                  <VTable>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Serviço solicitado
                        </th>
                        <th class="text-left">
                          Total de Custos
                        </th>
                        <th class="text-left">
                          K Mínimo
                        </th>
                        <th class="text-left">
                          Diária Mínima
                        </th>
                        <th class="text-left">
                          Valor do Contrato
                        </th>
                        <th class="text-center">
                          *
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in data.servicos"
                        v-if="data.servicos.length > 0"
                        :key="index"
                      >
                        <td>{{ item?.nome }}</td>
                        <td>{{ formatCurrency(item?.valor_total_custos) }}</td>
                        <td>{{ formatCurrency(item?.valor_k_minimo) }}</td>
                        <td>{{ formatCurrency(item?.valor_diaria_minimo) }}</td>
                        <td>
                          <InputDinheiro
                            v-model="item.valor_contrato"
                            placeholder="Digite o valor contrato"
                            prepend-inner-icon="tabler-currency-real"
                            :rules="[]"
                          />
                        </td>
                        <td class="d-flex justify-center align-center gap-1">
                          <IconBtn
                            color="warning"
                            @click="() => {
                              modal.isDialogVisible = true
                              modal.servico = item
                            }"
                          >
                            <VIcon icon="fa-light fa-edit" />
                          </IconBtn>
                          <IconBtn
                            color="error"
                            @click="() => {
                              data.servicos.splice(index, 1)
                            }"
                          >
                            <VIcon icon="fa-light fa-trash" />
                          </IconBtn>
                        </td>
                      </tr>
                      <tr v-else>
                        <td colspan="5">
                          Ainda não possui nenhum serviço cadastrado.
                        </td>
                      </tr>
                    </tbody>
                  </VTable>
                </VCardText>
              </VCard>
            </VStepperWindowItem>
          </VStepperWindow>
          <template #actions>
            <VDivider class="mb-1" />
            <div class="d-flex pa-2">
              <VBtn
                v-if="step > 1"
                variant="outlined"
                @click="() => {
                  step -= 1
                }"
              >
                Anterior
              </VBtn>
              <VSpacer />
              <VBtn
                @click="() => {
                  step > 1 ? isEditing ? update() : save() : handleNextStep()
                }"
              >
                {{ step > 1 ? 'Finalizar' : 'Próximo' }}
              </VBtn>
            </div>
          </template>
        </VStepper>
      </VCol>

      <NovoServicoModal v-if="modal.isDialogVisible" />
    </template>
  </LayoutForms>
</template>
