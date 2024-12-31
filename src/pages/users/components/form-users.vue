<script setup lang="ts">
import { storeToRefs } from 'pinia'
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import { useUsersStore } from '@/pages/users/store/useUsersStore'
import { confirmedValidator, emailValidator, requiredValidator } from '@/validators/cdf-rules'
import type { IUser } from '@/pages/users/types'

const { isEditing } = withDefaults(defineProps<{
  isEditing: boolean
  isHeader: boolean
  isActions: boolean
  isReadOnly: boolean
  isProfile: boolean
}>(), {
  isEditing: false,
  isHeader: true,
  isActions: true,
  isReadOnly: false,
  isProfile: false,
})

const store = useUsersStore()
const user = useCookie<IUser>('userData')

const {
  form,
  data,
  roles,
  loading,
} = storeToRefs(store)

const {
  fetchPerfis,
  save,
  update,
  resetForm,
} = store

onBeforeRouteLeave(() => {
  resetForm()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:loading="loading.save"
    :title="!isEditing ? $t('users.register') : $t('users.edit')"
    :is-editing="isEditing"
    :is-header="isHeader"
    :is-actions="isActions"
    :is-read-only="isReadOnly"
    :actions="{
      save: {
        method: () => save(true),
      },
      update: {
        method: () => {
          update(true)
            .then((data: IUser) => {
              if (useCookie<IUser>('userData').value.id === data.id)
                useCookie<IUser>('userData').value = data
            })
        },
      },
      reset: {
        method: () => resetForm(),
      },
    }"
    back="/users"
  >
    <template #content>
      <VCol
        cols="12"
        class="d-flex justify-center"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="avatar"
        >
          <EnviarImagem
            v-model="data.foto"
            :placeholder="data.name"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <AppTextField
            v-model="data.name"
            :label="$t('users.form.name.label')"
            :placeholder="$t('users.form.name.placeholder')"
            :rules="[requiredValidator]"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <CDFAutoComplete
            v-model="data.role"
            :label="$t('users.form.role.label')"
            :placeholder="$t('users.form.role.placeholder')"
            :rules="[requiredValidator]"
            item-title="name"
            :items="roles"
            :loading="loading.roles"
            return-object
            :fetch-items="() => fetchPerfis()"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol cols="12">
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <CDFTextField
            v-model="data.email"
            :label="$t('users.form.email.label')"
            :placeholder="$t('users.form.email.placeholder')"
            :rules="[requiredValidator, emailValidator]"
            :loading="loading.item"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <CDFTextField
            v-model="data.password"
            :label="$t('users.form.password.label')"
            :placeholder="$t('users.form.password.placeholder')"
            :rules="isEditing ? [] : [requiredValidator]"
            type="password"
            :loading="loading.item"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <CDFTextField
            v-model="data.password_confirmation"
            :label="$t('users.form.password_confirmation.label')"
            :placeholder="$t('users.form.password_confirmation.placeholder')"
            :rules="isEditing ? [] : [requiredValidator, confirmedValidator(data.password, data.password_confirmation)]"
            type="password"
            :loading="loading.item"
          />
        </VSkeletonLoader>
      </VCol>
    </template>
  </LayoutForms>
</template>
