<script setup lang="ts">
export type VariantButton = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
export type ColorButton = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'secondary'
export type StringOrNumber = string | number

withDefaults(defineProps<{
  loading?: boolean
  variant?: VariantButton
  color?: ColorButton
  tooltipText?: string
  size?: StringOrNumber
  rounded?: string | number | boolean
  disabled?: boolean
  to?: string
  density?: 'prominent' | 'default' | 'comfortable' | 'compact'
  isText?: boolean
  type?: 'button' | 'submit' | 'reset'

  isIcon?: boolean
  icon?: string
  iconDirection?: 'left' | 'right'
  iconSize?: StringOrNumber

  progressWidth?: string | number
  progressSize?: string | number
  progressColor?: string
  progressIndeterminate?: boolean
}>(), {
  color: 'primary',
  variant: 'elevated',
  rounded: true,
  iconSize: 18,
  iconDirection: 'left',
  progressWidth: 3,
  progressSize: 24,
  progressColor: 'white',
  progressIndeterminate: true,
  loading: false,
  isText: true,
  type: 'button',
})

const elementButton = ref(null)

const _elementIdToken = `app-button-${Math.random().toString(36).slice(2, 7)}`
</script>

<template>
  <VBtn
    :id="_elementIdToken"
    :ref="elementButton"
    class="cdf-button"
    :color="color"
    :variant="variant"
    :size="size"
    :disabled="disabled || loading"
    :class="rounded ? 'rounded' : ''"
    :to="to"
    :loading="loading"
    :rounded="rounded"
    :icon="isIcon"
    :density="density"
    :type="type"
  >
    <div class="d-flex align-center gap-2">
      <!-- Tooltip -->
      <VTooltip
        v-if="tooltipText"
        location="top"
        activator="parent"
      >
        {{ tooltipText }}
      </VTooltip>

      <!-- Button Icon : Left -->
      <VIcon
        v-if="!loading && icon && iconDirection === 'left'"
        :size="iconSize"
        :icon="icon"
      />

      <!-- Button Text -->
      <slot v-if="!loading && isText" />

      <!-- Button Icon : Right -->
      <VIcon
        v-if="!loading && icon && iconDirection === 'right'"
        :size="iconSize"
        :icon="icon"
      />
    </div>
  </VBtn>
</template>

<style lang="scss">
.cdf-button{
  .v-btn__prepend{
    margin: 0;
  }
}
</style>
