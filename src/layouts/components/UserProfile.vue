<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import CDFAvatar from '@/components/CDF/CDFAvatar.vue'
import { useAuthStore } from '@/pages/auth/login/store/useAuthStore'
import type { IUser } from '@/pages/users/types'
import { can } from '@layouts/plugins/casl'

// TODO: Get type from backend
const { logout } = useAuthStore()
const userData = useCookie<IUser>('userData')

const userProfileList = [
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'tabler-user',
    title: 'Perfil',
    subject: 'profile',
    action: 'read',
    to: { name: 'profile-tab', params: { tab: 'account' } },
  },
  {
    type: 'navItem',
    icon: 'tabler-settings',
    title: 'Configuração',
    subject: 'config',
    action: 'read',
    to: { name: 'settings-tab', params: { tab: 'notification' } },
  },
]
</script>

<template>
  <VBadge
    v-if="userData"
    dot
    bordered
    location="bottom right"
    offset-x="1"
    offset-y="2"
    color="success"
  >
    <VAvatar
      size="38"
      class="cursor-pointer"
      :color="!(userData && userData.foto) ? 'primary' : undefined"
      :variant="!(userData && userData.foto) ? 'tonal' : undefined"
    >
      <VImg
        v-if="userData && userData.foto"
        :src="userData.foto"
      />
      <VIcon
        v-else
        icon="tabler-user"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="240"
        location="bottom end"
        offset="12px"
      >
        <VList>
          <VListItem>
            <div class="d-flex gap-2 align-center">
              <VListItemAction>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  bordered
                >
                  <CDFAvatar
                    :name="userData.name"
                    :foto="userData.foto"
                    :color="!(userData && userData.foto) ? 'primary' : undefined"
                    :variant="!(userData && userData.foto) ? 'tonal' : undefined"
                  />
                </VBadge>
              </VListItemAction>

              <div>
                <h6 class="text-h6 font-weight-medium">
                  {{ userData?.name }}
                </h6>
                <VListItemSubtitle class="text-capitalize text-disabled">
                  {{ userData?.role?.name }}
                </VListItemSubtitle>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template
              v-for="item in userProfileList"
              :key="item.title"
            >
              <VListItem
                v-if="item.type === 'navItem' && can(item.action, item.subject)"
                :to="item.to"
              >
                <template #prepend>
                  <VIcon
                    :icon="item.icon"
                    size="22"
                  />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>
              </VListItem>

              <VDivider
                v-else
                class="my-2"
              />
            </template>

            <div class="px-4 py-2">
              <VBtn
                block
                size="small"
                color="error"
                append-icon="tabler-logout"
                @click="logout"
              >
                Sair
              </VBtn>
            </div>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
