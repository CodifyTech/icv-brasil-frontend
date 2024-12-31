<script lang="ts" setup>
import AccountSettingsAccount from './components/AccountSettingsAccount.vue'
import AccountSettingsBillingAndPlans from './components/AccountSettingsBillingAndPlans.vue'
import AccountSettingsSecurity from './components/AccountSettingsSecurity.vue'

const route = useRoute('profile-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  { title: 'Conta', icon: 'tabler-users', tab: 'account' },
  /*
    { title: 'Segurança', icon: 'tabler-lock', tab: 'security' },
    { title: 'Faturamento e planos', icon: 'tabler-file-text', tab: 'billing-plans' },
  */
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
