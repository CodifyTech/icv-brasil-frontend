<script setup lang="ts">
const props = defineProps<{
  confirmationMsg: string
  isDialogVisible: boolean
  confirmButtonText: string
  cancelButtonText: string
  loading: boolean
  confirm: () => Promise<void> | null
}>()

const emit = defineEmits<{
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:loading', value: boolean): void
}>()

const loading = toRef(props, 'loading')

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  emit('update:loading', true)
  props.confirm()?.then(() => {
    emit('confirm')
    updateModelValue(false)
  }).catch(() => {
    updateModelValue(false)
  }).finally(() => {
    emit('update:loading', false)
  })
}

const onCancel = () => {
  emit('cancel')
  updateModelValue(false)
}
</script>

<template>
  <VDialog
    max-width="500"
    :model-value="isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <VCard class="text-center px-10 py-6">
      <VCardText>
        <VBtn
          icon
          variant="outlined"
          color="warning"
          class="mb-4"
          style="width: 88px; height: 88px; pointer-events: none;"
        >
          <VIcon
            icon="tabler-trash"
            :size="40"
          />
        </VBtn>

        <h6 class="text-lg font-weight-medium">
          {{ confirmationMsg }}
        </h6>
      </VCardText>

      <VCardActions class="align-center justify-center gap-2">
        <VBtn
          v-model:loading="loading"
          variant="elevated"
          @click="onConfirmation"
        >
          {{ confirmButtonText }}
        </VBtn>

        <VBtn
          color="secondary"
          variant="tonal"
          @click="onCancel"
        >
          {{ cancelButtonText }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
