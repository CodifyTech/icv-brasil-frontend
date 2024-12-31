<script lang="ts" setup>
import { VNumberInput } from 'vuetify/labs/VNumberInput'

defineOptions({
  name: 'CDFNumberInput',
  inheritAttrs: false,
})

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
    <VNumberInput
      v-bind="{
        ...$attrs,
        class: null,
        label: undefined,
        variant: 'outlined',
        id: elementId,
      }"
      density="comfortable"
      :reverse="false"
      :inset="false"
      class="cdf-number-input"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps || {}"
        />
      </template>
    </VNumberInput>
  </div>
</template>
<style lang="scss">
.cdf-number-input{
  .v-number-input__control{
    button:last-child{
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
}
</style>
