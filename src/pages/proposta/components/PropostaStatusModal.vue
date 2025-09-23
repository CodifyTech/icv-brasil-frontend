<script setup lang="ts">
import { PropostaEnum } from '@/enums/PropostaStatusEnum'

const props = defineProps<{
  modelValue: boolean
  propostaId: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'statusChanged', data: { status: string; observacao?: string }): void
}>()

const formRef = ref()
const isFormValid = ref(false)
const selectedStatus = ref<PropostaEnum>(PropostaEnum.ANDAMENTO)
const observacao = ref('')

const isButtonDisabled = computed(() => {
  if (!selectedStatus.value)
    return true
  if (selectedStatus.value === PropostaEnum.ANDAMENTO && !observacao.value?.trim())
    return true

  return false
})

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const handleCancel = () => {
  selectedStatus.value = PropostaEnum.ANDAMENTO
  observacao.value = ''
  formRef.value?.reset()
  isOpen.value = false
}

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate()

  if (valid) {
    emit('statusChanged', {
      status: selectedStatus.value,
      observacao: selectedStatus.value === PropostaEnum.REPROVADA || selectedStatus.value === PropostaEnum.DECLINADA ? observacao.value : undefined,
    })
    handleCancel()
  }
}
</script>

<template>
  <VDialog
    v-model="isOpen"
    max-width="500"
    persistent
  >
    <VCard title="Alterar Status da Proposta">
      <VCardText class="px-4">
        <VForm
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="handleSubmit"
        >
          <VRadioGroup
            v-model="selectedStatus"
            :rules="[v => !!v || 'Selecione uma opção']"
          >
            <VRadio
              label="Aprovar Proposta"
              :value="PropostaEnum.APROVADA"
              color="success"
            />
            <VRadio
              label="Marcar como Reprovada"
              :value="PropostaEnum.REPROVADA"
              color="error"
            />
            <VRadio
              label="Marcar como Declinada"
              :value="PropostaEnum.DECLINADA"
              color="error"
            />
          </VRadioGroup>

          <AppTextarea
            v-if="selectedStatus === PropostaEnum.REPROVADA || selectedStatus === PropostaEnum.DECLINADA"
            v-model="observacao"
            label="Observação *"
            placeholder="Informe o motivo da reprovação ou declinação..."
            :rules="selectedStatus === PropostaEnum.REPROVADA || selectedStatus === PropostaEnum.DECLINADA ? [v => !!v || 'Observação é obrigatória'] : []"
            rows="3"
            class="mt-4"
          />
        </VForm>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn
          variant="outlined"
          @click="handleCancel"
        >
          Cancelar
        </VBtn>
        <VBtn
          :color="selectedStatus === PropostaEnum.APROVADA ? 'success' : 'error'"
          :disabled="isButtonDisabled"
          variant="flat"
          @click="handleSubmit"
        >
          {{ selectedStatus === PropostaEnum.APROVADA ? 'Aprovar' : selectedStatus === PropostaEnum.REPROVADA ? 'Marcar como Reprovada' : 'Marcar como Declinada' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
