<script setup lang="ts">
// eslint-disable-next-line no-restricted-imports
import { VExpansionPanels } from 'vuetify/components'
import { VForm } from 'vuetify/components/VForm'
import { useConfirmDialogStore } from '@/stores/useConfirmDialogStore'
import CDFButton from '@/components/CDF/CDFButton.vue'

const props = withDefaults(
  defineProps<{
    title: string
    items: any[]
    isEditing?: boolean
    isReadOnly?: boolean
    isAddDisabled?: boolean
    itemTitle?: string
    itemLabel?: string
    template: object
    buttonAdd?: string
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
const items = ref<any[]>(props.items)
const loading = ref<boolean>(false)

const add = () => {
  items.value.push({
    ...props.template,
  })

  setTimeout(() => {
    expansionPanels.value = items.value.length
  }, 300)
}

const formManagers = {} as Record<number, VForm> // Objeto simples, usado diretamente

const validateContentForm = async (index: number): Promise<boolean> => {
  const formRef = formManagers[index] // Busca referência do índice
  if (!formRef)
    return false

  const { valid } = await formRef.validate()

  return valid
}

const isEmptyItem = (item: any): boolean => {
  return Object.values(item).every(value => value === null || value === '' || value === undefined)
}

const save = async (item: any, index: number) => {
  const valid = await validateContentForm(index) // Valida APENAS o conteúdo do índice atual

  if (valid) {
    items.value[index] = item // Atualiza somente o item relacionado
    expansionPanels.value = null
    emit('update:items', items.value)
  }
}

const cancel = (index: number) => {
  const currentItem = items.value[index]

  if (isEmptyItem(currentItem)) {
    // Remove o item se ele estiver vazio
    items.value.splice(index, 1)
    emit('update:items', items.value)
  }

  // Fecha o painel sem remover
  expansionPanels.value = null
}

const obterExpansionTitle = (index: number) => {
  const item = items.value[index]
  if (!item)
    return `${props.itemLabel} ${index + 1}`

  const title = item[props.itemTitle]

  return title ? `${props.itemLabel} ${title}` : `${props.itemLabel} ${index + 1}`
}

onUpdated(() => {
  if (props.items)
    items.value = props.items

  nextTick()
})
</script>

<template>
  <VCard
    :title="title"
    variant="outlined"
    class="cdf-manager-card"
  >
    <template #append>
      <CDFButton
        v-if="!isReadOnly && !isAddDisabled"
        prepend-icon="tabler-plus"
        variant="outlined"
        :is-text="$vuetify.display.smAndUp"
        :size="$vuetify.display.smAndUp ? 'default' : 'small'"
        color="primary"
        @click="add"
      >
        Novo {{ buttonAdd ?? '' }}
      </CDFButton>
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
              <slot
                :item="item"
                :index="index"
                name="header"
              >
                <span>{{ obterExpansionTitle(index) }}</span>
              </slot>
              <div
                class="pr-5"
                @click.stop
              >
                <slot
                  :item="item"
                  :index="index"
                  name="actions"
                />
                <IconBtn
                  icon="tabler-trash"
                  variant="text"
                  :readonly="isReadOnly"
                  @click.stop="() => {
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
                <VForm
                  id="formManager"
                  :ref="el => {
                    if (el) {
                      formManagers[index] = el // Apenas registra o índice
                    }
                    else {
                      delete formManagers[index] // Remove referências inválidas
                    }
                  }"
                  :key="`form-${index}`"
                >
                  <slot
                    :item="item"
                    :index="index"
                    name="content"
                  />
                </VForm>
              </VCardText>
              <VDivider />
              <VCardActions class="mt-2">
                <CDFButton
                  v-if="!isReadOnly"
                  variant="outlined"
                  color="info"
                  @click="() => save(item, index)"
                >
                  Adicionar
                </CDFButton>
                <CDFButton
                  v-if="!isReadOnly"
                  text="Cancelar"
                  variant="outlined"
                  color="error"
                  @click="() => cancel(index)"
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
.cdf-manager-card {
  .v-card-item {
    padding: 12px;
  }
}

.cdf-manager {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  min-block-size: 120px;
}
</style>
