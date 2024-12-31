<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { useAuthStore } from '@/pages/auth/login/store/useAuthStore'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import logoDark from '@images/logo-dark.svg?raw'
import logoLight from '@images/logo-light.svg?raw'
import { themeConfig } from '@themeConfig'
import ApiService from '@/services/ApiService'

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

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const logo = useGenerateImageVariant(logoDark, logoLight)

const a = new ApiService('/teste')

a.fetch('status')
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          class="auth-footer-mask"
          :src="authThemeMask"
        />
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
                  <a
                    class="text-primary ms-2 mb-1"
                    href="/auth/esqueceu-senha"
                  >
                    Esqueceu a senha?
                  </a>
                </div>

                <VBtn
                  block
                  :loading="loading"
                  @click="login(credentials)"
                >
                  Entrar
                </VBtn>
              </VCol>

              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>Novo por aqui?</span>

                <a
                  class="text-primary ms-2"
                  href="/auth/cadastrar"
                >
                  Crie uma conta
                </a>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />

                <span class="mx-4">ou</span>

                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
.logo svg{
  height: 40px;
}
</style>
