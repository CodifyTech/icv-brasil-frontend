<script lang="ts" setup>
import AccountSettingsConnections from './components/AccountSettingsConnections.vue'
import AccountSettingsNotification from './components/AccountSettingsNotification.vue'

const route = useRoute('settings-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  { title: 'Notifications', icon: 'tabler-bell', tab: 'notification' },
  { title: 'Connections', icon: 'tabler-link', tab: 'connection' },
]

definePage({
  meta: {
    navActiveLink: 'settings-tab',
  },
})
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        :to="{ name: 'settings-tab', params: { tab: item.tab } }"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <!-- Notification -->
      <VWindowItem value="notification">
        <AccountSettingsNotification />
      </VWindowItem>

      <!-- Connections -->
      <VWindowItem value="connection">
        <AccountSettingsConnections />
      </VWindowItem>
    </VWindow>
  </div>
</template>
