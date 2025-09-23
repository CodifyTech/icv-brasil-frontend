import type { PiniaPluginContext } from 'pinia'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import type { VForm } from 'vuetify/components/VForm'
import type { ISearch } from '@/components/CDF/SearchBar.vue'
import type { IOrderBy } from '@/pages/types/layoutTable.types'
import { useConfirmDialogStore } from '@/stores/useConfirmDialogStore'
import { useSuccessDialogStore } from '@/stores/useSuccessDialogStore'

const loadedServices = {}

const preloadServices = () => {
  // Utilize import.meta.glob para buscar arquivos correspondentes
  const modules = import.meta.glob('@/pages/**/services/*.ts')
  const keys = Object.keys(modules)

  if (keys.length === 0)
    throw new Error('Nenhum serviço encontrado.')

  // Carregar todos os módulos de serviço
  const loadPromises = keys.map(key =>
    modules[key]().then(ServiceModule => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const serviceName = key.split('/').pop().replace('.ts', '')

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      loadedServices[serviceName] = ServiceModule.default
    }),
  )

  return Promise.all(loadPromises)
}

const getService = (serviceName: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const service = loadedServices[serviceName]

  if (!service)
    throw new Error(`Serviço ${serviceName} não encontrado.`)

  return service
}

// Durante a inicialização da aplicação, pré-carregar todos os serviços
preloadServices().then(() => {
  console.log('Todos os serviços foram pré-carregados.')
}).catch(error => {
  console.error('Erro ao pré-carregar os serviços:', error)
})

export async function CodifyTechStorePlugin({ store }: PiniaPluginContext) {
  if (store.$id.includes('crud')) {
    const successDialog = useSuccessDialogStore()
    const confirmDialog = useConfirmDialogStore()

    const service = getService(store.serviceName)

    const form = ref<VForm | undefined>(undefined)
    const formKey = ref<number>(Math.random())

    const data = ref<typeof store.$state.defaultValue>({
      ...store.$state.defaultValue,
    })

    const items = ref<any[]>([])
    const itemsPerPage = ref<number>(0)
    const page = ref<number>(1)
    const totalItems = ref<number>(0)

    const orderBy = ref<IOrderBy>({
      key: store.$state.sortKeyDefault,
      order: 'asc',
    })

    const isSearching = ref<boolean>(false)

    const searchTerm = ref<ISearch>({
      field: '',
      search: '',
      relationship: '',
    })

    const searchPage = ref<number>(1)
    const destroyId = ref<string>('')

    const loading = ref({
      save: false,
      item: false,
      items: false,
      destroy: false,
    })

    // Definir a variável na `$state`, permite que esta seja
    // serializada durante a interpretação do lado do servidor
    store.$state.form = form.value
    store.$state.formKey = formKey.value
    store.$state.data = data.value
    store.$state.items = items.value
    store.$state.itemsPerPage = itemsPerPage.value
    store.$state.page = page.value
    store.$state.totalItems = totalItems.value
    store.$state.orderBy = orderBy.value
    store.$state.isSearching = isSearching.value
    store.$state.searchTerm = searchTerm.value
    store.$state.searchPage = searchPage.value
    store.$state.destroyId = destroyId.value
    store.$state.loading = loading.value

    // Criar uma referência reativa para `data` no store
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.form = toRef(store.$state, 'form')

    store.formKey = toRef(store.$state, 'formKey')

    store.data = toRef(store.$state, 'data')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.items = toRef(store.$state, 'items')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.itemsPerPage = toRef(store.$state, 'itemsPerPage')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.page = toRef(store.$state, 'page')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.totalItems = toRef(store.$state, 'totalItems')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.orderBy = toRef(store.$state, 'orderBy')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.isSearching = toRef(store.$state, 'isSearching')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.searchTerm = toRef(store.$state, 'searchTerm')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.searchPage = toRef(store.$state, 'searchPage')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.destroyId = toRef(store.$state, 'destroyId')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.loading = toRef(store.$state, 'loading')

    const originalReset = store.$reset.bind(store)

    const actions = {
      async loadMore(state: StateHandler) {
        if (store.isSearching)
          await store.search(state)
        else await store.fetchItems(state)
      },
      async fetchItems(state: StateHandler) {
        if (store.isSearching) {
          store.items = []
          store.totalItems = 0
          store.page = 1
        }

        if (store.page === 1)
          store.loading.items = true

        store.isSearching = false

        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const res = await service.fetchAll<IItemsResponse<T>>({
            page: store.page,
            sort_by: store.orderBy.key,
            sort_order: store.orderBy.order,
          })

          if (res.data.length === 0) {
            state.complete()
          }
          else {
            if (res.page === store.page) {
              store.items.push(...res.data)
              state.loaded()
            }
          }
          store.totalItems = res.total
          store.page = res.page + 1
        }
        catch (error) {
          store.items = []
        }
        finally {
          store.loading.items = false
        }
      },
      async fetchItem(id: string) {
        store.loading.item = true

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await service.fetch<T>(id)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          .then(item => {
            store.data = item

            return item
          })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          .catch(err => {
            return err
          })
          .finally(() => {
            store.loading.item = false
          })
      },
      async save(formData?: boolean) {
        store.loading.save = true

        try {
          await service.create(store.data, null, formData)
          store.resetForm()
          store.formKey = Math.random()

          successDialog.showSuccessDialog({
            title: 'Informação',
            message: 'Foi criado com sucesso!',
            confirmText: 'OK',
          })

          return data
        }
        catch (error) {
          console.log('Passou aqui 2')

          // return (error as AxiosError).response?.data
        }
        finally {
          store.loading.save = false
        }
      },
      async update(formData?: boolean) {
        if (store.data.id) {
          store.loading.save = true

          return await service.update(store.data, store.data.id, formData)
            .then(data => {
              if (data)
                store.data = data

              successDialog.showSuccessDialog({
                title: 'Informação',
                message: 'Foi atualizado com sucesso!',
                confirmText: 'OK',
              })

              return data
            })
            .catch(err => {
              return err.response.data
            })
            .finally(() => {
              store.loading.save = false
            })
        }
      },
      async destroy() {
        store.loading.destroy = true
        try {
          await service.destroy(store.destroyId)

          const index = store.items.findIndex(item => item.id === store.destroyId)

          store.items.splice(index, 1)

          successDialog.showSuccessDialog({
            title: 'Informação',
            message: 'Foi excluído com sucesso!',
            confirmText: 'OK',
          })
        }
        finally {
          store.loading.destroy = false
        }
      },
      async dialogDestroy(id: string) {
        confirmDialog.showConfirmDialog('Deseja realmente excluir este item?', 'Sim', 'Não', store.loading.destroy, async () => {
          await store.destroy()
        })
        store.destroyId = id
      },
      async search(state: StateHandler) {
        if (!store.isSearching) {
          store.items = []
          store.totalItems = 0
          store.searchPage = 1
        }

        if (store.searchPage === 1)
          store.loading.items = true

        store.isSearching = true

        if (store.$state.searchTerm.field && String(store.$state.searchTerm.search).length > 0) {
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const res = await service.search<IItemsResponse<T>>(
              store.$state.searchTerm.field,
              store.$state.searchTerm.search,
              store.searchPage,
              store.$state.searchTerm.relationship,
              store.orderBy,
            )

            if (res.data.length === 0) {
              state.complete()
            }
            else {
              if (res.page === store.searchPage) {
                store.items.push(...res.data)
                state.loaded()
              }
            }
            store.totalItems = res.total
            store.searchPage = res.page + 1
          }
          catch {
            store.items = []
          }
          finally {
            store.loading.items = false
          }
        }
      },
      async onOrderBy(state: StateHandler, value: IOrderBy[]) {
        store.orderBy = value.length > 0
          ? { key: value[0].key, order: value[0].order }
          : { key: store.sortKeyDefault, order: 'asc' }

        store.items = []
        store.searchPage = 1
        store.page = 1
        store.loading.items = false

        await store.loadMore(state)
      },
      $reset() {
        originalReset()
      },
      reset() {
        store.items = []
        store.searchPage = 1
        store.page = 1
      },
      resetForm() {
        store?.form?.reset()
        store?.form?.resetValidation()

        store.data = { ...store.defaultValue }
        for (const key in store.defaultValue) {
          if (Array.isArray(store.defaultValue[key]))
            store.data[key] = []
        }
        store.reset()
      },
      resetSearch(state: StateHandler) {
        store.searchTerm = {
          field: '',
          search: '',
          relationship: '',
        }
        store.searchPage = 1
        store.isSearching = false
        store.page = 1
        store.items = []
        store.fetchItems(state)
      },
      searchAgain(state: StateHandler) {
        store.items = []
        store.searchPage = 1
        store.search(state)
      },
    }

    store = Object.assign(store, actions)

    return store
  }

  return store
}
