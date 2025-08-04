<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import { useAuthStore } from '@/pages/auth/login/store/useAuthStore'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import logoDark from '@images/logo-dark.svg?raw'
import logoLight from '@images/logo-light.svg?raw'
import vitrine from '@images/pages/vitrine.webp'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const authStore = useAuthStore()

const {
  credentials,
  login,
} = authStore

const {
  form,
  loading,
  messages,
} = storeToRefs(authStore)

const isPasswordVisible = ref(false)

const logo = useGenerateImageVariant(logoDark, logoLight)
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            :src="vitrine"
            class="auth-illustration"
            cover
            rounded
          />
        </div>
      </div>
    </VCol>
    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="h('div', { innerHTML: logo })"
            class="mb-2 logo d-flex justify-center"
          />
          <h4 class="text-h4 text-center mb-1">
            Bem-vindo ao <span class="text-capitalize">{{ themeConfig.app.title }}</span>! 👋🏻
          </h4>
          <p class="text-center mb-0">
            Faça login em sua conta
          </p>
        </VCardText>

        <AlertDialog
          v-model:is-dialog-visible="messages.error.isError"
          :title="messages.error.messages"
        />
        <VCardText>
          <VForm ref="form">
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.email"
                  autofocus
                  label="E-mail"
                  type="email"
                  placeholder="Insira seu E-mail"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password"
                  label="Senha"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="credentials.remember"
                    label="Lembrar de mim"
                  />
                </div>

                <VBtn
                  block
                  :loading="loading"
                  @click="login(credentials)"
                >
                  Entrar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.logo svg {
  block-size: 40px;
}
</style>
