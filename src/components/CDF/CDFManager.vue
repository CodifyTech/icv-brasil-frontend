<script setup lang="ts">
// eslint-disable-next-line no-restricted-imports
import { VExpansionPanels } from 'vuetify/components'
import { useConfirmDialogStore } from '@/stores/useConfirmDialogStore'

const props = withDefaults(
  defineProps<{
    title: string
    items: any[]
    isEditing?: boolean
    isReadOnly?: boolean
    itemTitle?: string
    itemLabel?: string
    template: object
    messageEmpty?: string
    messageAdd?: string
  }>(),
  {
    title: '', // valor padrão para 'title'
    itemTitle: '', // valor padrão para 'itemTitle'
    itemLabel: 'Item', // valor padrão para 'itemLabel'
  },
)

const emit = defineEmits<{
  (e: 'update:items', value: never[]): void
}>()

const expansionPanels = ref()
const items = ref(props.items ?? [])
const loading = ref(false)

const add = () => {
  items.value.push({
    ...props.template,
  })

  setTimeout(() => {
    expansionPanels.value = items.value.length
  }, 700)
}

const obterExpansionTitle = (index: number) => {
  return props.items[index][props.itemTitle] ? `${props.itemLabel} ${props.items[index][props.itemTitle]}` : `${props.itemLabel} ${index + 1}`
}
</script>

<template>
  <VCard
    :title="title"
    variant="outlined"
  >
    <template #append>
      <VBtn
        v-if="!isReadOnly"
        prepend-icon="tabler-plus"
        :text="`Adicionar ${title ?? ''}`"
        variant="outlined"
        @click="add"
      />
    </template>

    <VDivider />

    <VCardText class="d-flex flex-column gap-2">
      <VExpansionPanels
        v-if="items?.length > 0"
        v-model="expansionPanels"
      >
        <VExpansionPanel
          v-for="(item, index) in items"
          :key="index"
          :value="index + 1"
        >
          <VExpansionPanelTitle>
            <VRow
              align="center"
              justify="space-between"
            >
              <span>{{ obterExpansionTitle(index) }}</span>
              <div class="pr-5">
                <IconBtn
                  icon="tabler-trash"
                  variant="text"
                  :readonly="isReadOnly"
                  @click="() => {
                    useConfirmDialogStore().showConfirmDialog(
                      'Deseja realmente excluir este item?',
                      'Sim',
                      'Não',
                      loading,
                      async () => {
                        items.splice(index, 1)
                        emit('update:items', items)
                      })
                  }"
                />
              </div>
            </VRow>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <VCard flat>
              <VDivider />
              <VCardText class="px-2">
                <slot
                  :item="item"
                  name="content"
                />
              </VCardText>
              <VDivider />
              <VCardActions class="mt-2">
                <CDFButton
                  v-if="!isReadOnly"
                  variant="outlined"
                  color="info"
                  @click="() => {
                    items[index] = item
                    expansionPanels = null
                    emit('update:items', items)
                  }"
                >
                  Salvar
                </CDFButton>
                <CDFButton
                  v-if="!isReadOnly"
                  text="Cancelar"
                  variant="outlined"
                  color="error"
                  @click="() => {
                    expansionPanels = null
                  }"
                >
                  Cancelar
                </CDFButton>
              </VCardActions>
            </VCard>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VCardText
        v-else
        class="cdf-manager"
      >
        <template v-if="isReadOnly">
          <p>{{ messageEmpty }}</p>
        </template>
        <template v-else>
          <p>{{ messageAdd }}</p>
          <small>Clique no botão <VIcon icon="tabler-plus text-success" /> para adicionar mais um.</small>
        </template>
      </VCardText>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.cdf-manager{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>
