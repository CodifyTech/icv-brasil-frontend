<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import { toRef } from 'vue'
import type { Actions } from '@/pages/types/global-types'
import CDFButton from '@/components/CDF/CDFButton.vue'

const props = withDefaults(defineProps<{
  title: string
  back: string
  actions?: Actions
  form: VForm
  isHeader: boolean
  isActions: boolean
  isEditing: boolean
  isReadOnly?: boolean
  loading: boolean
}>(), {
  isHeader: true,
  isActions: true,
  isReadOnly: false,
})

const emit = defineEmits<{
  (e: 'update:form', value: VForm): void
  (e: 'update:loading', value: boolean): void
}>()

const formBase = ref<VForm | null>(null)

const loading = toRef(props, 'loading')

onMounted(() => {
  if (formBase.value)
    emit('update:form', formBase.value)
})

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  if (formBase.value) {
    const { valid } = await formBase.value.validate()
    if (valid) {
      if (props.isEditing)
        props.actions?.update?.method()
      else
        props.actions?.save?.method()
    }
  }
}
</script>

<template>
  <!-- Header -->
  <VCard
    v-if="isHeader"
    class="mb-2"
  >
    <VCardItem>
      <VRow
        class="pa-4 pa-sm-6"
        align="center"
      >
        <VCardTitle>
          <template #default>
            <h2 class="header text-h6 text-lg-h4">
              {{ title }}
            </h2>
          </template>
        </VCardTitle>
        <VSpacer />
        <VCardActions class="py-0">
          <CDFButton
            icon="tabler-arrow-back"
            color="primary"
            variant="outlined"
            :to="back"
            :is-text="$vuetify.display.smAndUp"
            :size="$vuetify.display.smAndUp ? 'default' : 'small'"
            @click="() => {
              actions?.reset?.method()
              formBase?.reset()
              formBase?.resetValidation()
            }"
          >
            {{ $t('Voltar') }}
          </CDFButton>
        </VCardActions>
      </VRow>
    </VCardItem>
  </VCard>

  <VForm
    ref="formBase"
    @submit.prevent="handleSubmit"
  >
    <VCard>
      <VCardItem>
        <!-- Content -->
        <VRow class="layout-forms-content">
          <slot name="content" />
        </VRow>

        <!-- Actions -->
        <VCardItem
          v-if="isActions"
          class="pb-0 px-0"
        >
          <VDivider />
          <VRow
            class="pt-5 pb-0 my-2"
            align="center"
          >
            <VCardActions class="py-0">
              <CDFButton
                v-model:loading="loading"
                :icon="actions?.save?.icon ?? 'tabler-send'"
                :color="actions?.save?.color ?? 'success'"
                variant="elevated"
                type="submit"
              >
                {{ actions?.save?.text ?? $t('Salvar') }}
              </CDFButton>
              <CDFButton
                :icon="isEditing ? 'tabler-x' : actions?.reset?.icon ?? 'tabler-eraser'"
                :color="actions?.reset?.color ?? 'error'"
                variant="elevated"
                :to="isEditing ? back : null"
                @click="() => {
                  actions?.reset?.method()
                  formBase?.reset()
                  formBase?.resetValidation()
                }"
              >
                {{ isEditing ? $t('Cancelar') : actions?.reset?.text ?? $t('Limpar') }}
              </CDFButton>
            </VCardActions>
          </VRow>
        </VCardItem>
      </VCardItem>
    </VCard>
  </VForm>
</template>
