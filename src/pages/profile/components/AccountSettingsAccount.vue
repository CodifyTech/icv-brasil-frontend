<script lang="ts" setup>
import FormUsers from '@/pages/users/components/form-users.vue'
import { useUsersStore } from '@/pages/users/store/useUsersStore'
import type { IUser } from '@/pages/users/types'

const isConfirmDialogOpen = ref(false)
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [(v: string) => !!v || 'Please confirm account deactivation']

const store = useUsersStore()
const user = useCookie<IUser>('userData')

const {
  fetchItem,
} = store

onMounted(() => {
  fetchItem(user.value.id)
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <FormUsers
        :is-header="false"
        is-editing
        is-profile
      />
    </VCol>

    <VCol cols="12">
      <!-- 👉 Delete Account -->
      <VCard :title="$t('Delete Account')">
        <VCardText>
          <!-- 👉 Checkbox and Button  -->
          <div>
            <VCheckbox
              v-model="isAccountDeactivated"
              :rules="validateAccountDeactivation"
              :label="$t('I confirm my account deactivation')"
            />
          </div>

          <VBtn
            :disabled="!isAccountDeactivated"
            color="error"
            class="mt-6"
            @click="isConfirmDialogOpen = true"
          >
            {{ $t('Desativar conta') }}
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogOpen"
    confirmation-question="Are you sure you want to deactivate your account?"
    confirm-title="Deactivated!"
    confirm-msg="Your account has been deactivated successfully."
    cancel-title="Cancelled"
    cancel-msg="Account Deactivation Cancelled!"
  />
</template>
