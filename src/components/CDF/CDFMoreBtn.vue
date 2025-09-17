<script lang="ts" setup>
interface MenuList {
  title?: string
  click?: void | Promise<void>
  class?: string
  type?: string
  icon?: string
  color?: string
}

const props = defineProps<{
  menuList?: MenuList[]
  color?: string
  itemProps?: boolean
}>()
</script>

<template>
  <VMenu>
    <template #activator="{ props }">
      <IconBtn
        density="compact"
        :color="color || 'primary'"
        v-bind="props"
      >
        <VIcon icon="tabler-dots-vertical" />
      </IconBtn>
    </template>
    <VList :item-props="props.itemProps">
      <VListItem
        v-for="(item, i) in props.menuList"
        v-bind="item"
        :key="i"
        :style="item.type === 'divider' ? 'min-height: 0px !important' : null"
        :prepend-icon="item?.icon"
        :color="item?.color"
        @click.stop="item.click"
      >
        <template #title>
          <span v-if="item?.type !== 'divider'">{{ item.title }}</span>
          <VDivider v-else />
        </template>
      </VListItem>
    </VList>
  </VMenu>
</template>
