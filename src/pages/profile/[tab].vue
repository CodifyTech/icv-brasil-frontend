<script lang="ts" setup>
import AccountSettingsAccount from './components/AccountSettingsAccount.vue'

const route = useRoute('profile-tab')

definePage({
  meta: {
    action: 'list',
    subject: 'profile',
  },
})

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  { title: 'Conta', icon: 'tabler-users', tab: 'account' },
]

definePage({
  meta: {
    navActiveLink: 'profile-tab',
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
        :to="{ name: 'profile-tab', params: { tab: item.tab } }"
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
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <!--
        <VWindowItem value="security">
        <AccountSettingsSecurity />
        </VWindowItem>
      -->

      <!-- Billing -->
      <!--
        <VWindowItem value="billing-plans">
        <AccountSettingsBillingAndPlans />
        </VWindowItem>
      -->
    </VWindow>
  </div>
</template>
