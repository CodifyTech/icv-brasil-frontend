<script setup lang="ts">
import LayoutForms from '@/components/CDF/LayoutForms.vue'
import { useUsersStore } from '@/pages/users/store/useUsersStore'
import type { IUser } from '@/pages/users/types'
import { confirmedValidator, emailValidator, lengthValidator, requiredValidator } from '@/validators/cdf-rules'
import { storeToRefs } from 'pinia'

const {
  isEditing = false,
  isHeader = true,
  isActions = true,
  isReadOnly = false,
  isProfile = false,
} = defineProps<{
  isEditing: boolean
  isHeader: boolean
  isActions: boolean
  isReadOnly: boolean
  isProfile: boolean
}>()

const store = useUsersStore()
const isPasswordVisible = ref(false)

const {
  form,
  data,
  roles,
  loading,
  funcionarios,
} = storeToRefs(store)

const {
  fetchPerfis,
  fetchFuncionarios,
  save,
  update,
  resetForm,
} = store

onMounted(() => {
  fetchPerfis()
  fetchFuncionarios()
})

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
        class="justify-center d-flex"
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
          <AppSelect
            v-model="data.role"
            :label="$t('users.form.role.label')"
            :placeholder="$t('users.form.role.placeholder')"
            :rules="[requiredValidator]"
            item-title="name"
            :items="roles"
            :loading="loading.roles"
            return-object
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
            v-model="data.email"
            :label="$t('users.form.email.label')"
            :placeholder="$t('users.form.email.placeholder')"
            :rules="[requiredValidator, emailValidator]"
            :loading="loading.item"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol
        v-if="data.role?.slug !== 'diretor' && !isProfile"
        cols="12"
        md="6"
      >
        <VSkeletonLoader
          :loading="loading.item"
          type="text"
        >
          <AppSelect
            v-model="data.funcionario_id"
            label="Funcionário"
            placeholder="Selecione um funcionário"
            item-title="nome"
            item-value="id"
            :items="funcionarios"
            :loading="loading.funcionarios"
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
            :rules="isEditing ? [lengthValidator(data.password, 8)] : [requiredValidator, lengthValidator(data.password, 8)]"
            :loading="loading.item"
            :type="isPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
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
            :rules="isEditing ? [confirmedValidator(data.password ?? '', data.password_confirmation ?? ''), lengthValidator(data.password, 8)] : [requiredValidator, confirmedValidator(data.password ?? '', data.password_confirmation ?? ''), lengthValidator(data.password, 8)]"
            :loading="loading.item"
            :type="isPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
          />
        </VSkeletonLoader>
      </VCol>
    </template>
  </LayoutForms>
</template>
