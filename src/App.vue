<script setup lang="ts">
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'
import { useSuccessDialogStore } from '@/stores/useSuccessDialogStore'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { useConfirmDialogStore } from '@/stores/useConfirmDialogStore'
import { useValidationDialogStore } from '@/stores/useValidationDialogStore'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()

const snackbar = useSnackbarStore()
const useSuccessDialog = useSuccessDialogStore()
const useValidationDialog = useValidationDialogStore()
const useConfirmDialog = useConfirmDialogStore()

const {
  show: snackBarShow,
  color: snackBarColor,
  timeout: snackBarTimeout,
  location: snackBarLocation,
  multiline: snackBarMultiline,
  rounded: snackBarRounded,
  variant: snackBarVariant,
  text: snackBarText,
} = storeToRefs(snackbar)

const {
  show: successDialogShow,
  title: successDialogTitle,
  message: successDialogMessage,
  confirmText: successDialogConfirmText,
} = storeToRefs(useSuccessDialog)

const {
  show: validationDialogShow,
  status: validationDialogStatus,
  messages: validationDialogMessages,
} = storeToRefs(useValidationDialog)

const {
  show: confirmDialogShow,
  message: confirmDialogMessage,
  confirmButtonText: confirmDialogConfirmButtonText,
  cancelButtonText: confirmDialogCancelButtonText,
  loading: confirmDialogLoading,
  onConfirm: confirmDialogOnConfirm,
} = storeToRefs(useConfirmDialog)
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />

      <VSnackbar
        v-model="snackBarShow"
        :color="snackBarColor"
        :timeout="snackBarTimeout"
        :location="snackBarLocation"
        :multiline="snackBarMultiline"
        :rounded="snackBarRounded"
        :variant="snackBarVariant"
      >
        {{ snackBarText }}
      </VSnackbar>

      <ValidationDialog
        v-model:is-dialog-visible="validationDialogShow"
        v-model:error-status="validationDialogStatus"
        v-model:errors="validationDialogMessages"
      />

      <SuccessDialog
        v-model:is-dialog-visible="successDialogShow"
        v-model:title="successDialogTitle"
        v-model:confirmation-msg="successDialogMessage"
        v-model:confirmation-button-text="successDialogConfirmText"
      />

      <CDFConfirmDialog
        v-model:isDialogVisible="confirmDialogShow"
        v-model:loading="confirmDialogLoading"
        v-model:confirm-button-text="confirmDialogConfirmButtonText"
        v-model:cancel-button-text="confirmDialogCancelButtonText"
        v-model:confirmation-msg="confirmDialogMessage"
        :confirm="confirmDialogOnConfirm ?? null"
      />

      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>
