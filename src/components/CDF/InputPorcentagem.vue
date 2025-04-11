<script setup lang="ts">
import { CurrencyDisplay, useCurrencyInput } from 'vue-currency-input'
import { watch } from 'vue'

defineOptions({ name: 'InputPorcentagem', inheritAttrs: false })

const props = defineProps<{
  modelValue: number
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
  currency: undefined,
  currencyDisplay: CurrencyDisplay.hidden,
  valueRange: { min: 0 },
  precision: 2,
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: false,
  hideNegligibleDecimalDigitsOnFocus: false,
  autoDecimalDigits: true,
  useGrouping: true,
  accountingSign: false,
  locale: 'pt-BR',
})

watch(
  () => props.modelValue,
  value => {
    setValue(value)
  },
  { immediate: true },
)

watch(
  () => numberValue.value,
  value => {
    emit('update:modelValue', value || 0)
  },
)

const elementId = computed(() => {
  const attrs = useAttrs()
  const _elementIdToken = attrs.id || attrs.label

  return _elementIdToken ? `app-text-field-${_elementIdToken}-${Math.random().toString(36).slice(2, 7)}` : undefined
})

const label = computed(() => useAttrs().label as string | undefined)
</script>

<template>
  <div
    class="app-text-field flex-grow-1"
    :class="$attrs.class"
  >
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2 text-high-emphasis"
      :text="label"
    />
    <VTextField
      :id="elementId"
      ref="inputRef"
      v-model="formattedValue"
      :label="undefined"
      variant="outlined"
      :readonly="readonly"
      append-inner-content="%"
    />
  </div>
</template>
