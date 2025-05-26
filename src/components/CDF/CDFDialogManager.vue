<script setup lang="ts">
import { VList } from 'vuetify/components'
import { VForm } from 'vuetify/components/VForm'
import CDFButton from '@/components/CDF/CDFButton.vue'
import { useConfirmDialogStore } from '@/stores/useConfirmDialogStore'

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
const dialog = ref(false)
const currentIndex = ref<number | null>(null)
const currentItem = ref<object>({})

const add = () => {
  currentIndex.value = items.value.length
  currentItem.value = {
    ...props.template,
  }
  dialog.value = true
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
  return Object.values(item).every(
    value => value === null || value === '' || value === undefined,
  )
}

const save = async (item: any, index: number) => {
  const valid = await validateContentForm(index) // Valida APENAS o conteúdo do índice atual

  if (valid) {
    items.value[index] = item // Atualiza somente o item relacionado
    dialog.value = false
    currentIndex.value = null
    currentItem.value = {}
    emit('update:items', items.value)
  }
}

const cancel = (index: number) => {
  dialog.value = false

  if (isEmptyItem(currentItem.value)) {
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

  return title
    ? `${props.itemLabel} ${title}`
    : `${props.itemLabel} ${index + 1}`
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
        Novo {{ buttonAdd ?? "" }}
      </CDFButton>
    </template>

    <VDivider />

    <VCardText
      class="d-flex flex-column gap-2 overflow-auto"
      style="max-block-size: 400px;"
    >
      <VList v-if="items?.length > 0">
        <VListItem
          v-for="(item, index) in items"
          :key="index"
          class="border rounded my-1"
          @click="{
            currentIndex = index;
            currentItem = item;
            dialog = true;
          }"
        >
          <template #title>
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
                  @click.stop="
                    () => {
                      useConfirmDialogStore().showConfirmDialog(
                        'Deseja realmente excluir este item?',
                        'Sim',
                        'Não',
                        loading,
                        async () => {
                          items.splice(index, 1);
                          emit('update:items', items);
                        },
                      );
                    }
                  "
                />
              </div>
            </VRow>
          </template>
        </VListItem>
      </VList>

      <VCardText
        v-else
        class="cdf-manager"
      >
        <template v-if="isReadOnly">
          <p>{{ messageEmpty }}</p>
        </template>
        <template v-else>
          <p>{{ messageAdd }}</p>
          <small>Clique no botão <VIcon icon="tabler-plus text-success" /> para
            adicionar mais um.</small>
        </template>
      </VCardText>
    </VCardText>
  </VCard>

  <VDialog
    v-model="dialog"
    max-width="800"
    scrollable
  >
    <VCard flat>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span>{{ currentItem?.id ? `Editar ${props.itemLabel}` : `Novo ${props.itemLabel}` }}</span>
        <VBtn
          icon="tabler-x"
          variant="text"
          @click="dialog = false"
        />
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VForm
          id="formManager"
          :ref="
            (el) => {
              if (el) {
                formManagers[currentIndex] = el; // Apenas registra o índice
              }
              else {
                delete formManagers[currentIndex]; // Remove referências inválidas
              }
            }
          "
          :key="`form-${currentIndex}`"
        >
          <slot
            :item="currentItem"
            :index="currentIndex"
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
          @click="() => save(currentItem, currentIndex)"
        >
          Adicionar
        </CDFButton>
        <CDFButton
          v-if="!isReadOnly"
          text="Cancelar"
          variant="outlined"
          color="error"
          @click="() => cancel(currentIndex)"
        >
          Cancelar
        </CDFButton>
      </VCardActions>
    </VCard>
  </VDialog>
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
