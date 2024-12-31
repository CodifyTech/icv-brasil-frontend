import 'pinia'
import { ISearch } from "@/components/CDF/SearchBar.vue"
import type { IOrderBy } from "@/pages/types/layoutTable.types"
import type { StateHandler } from "v3-infinite-loading/lib/types"
import { VForm } from "vuetify/components/VForm"

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    form: VForm | undefined
    formKey: number
    data: S['defaultValue']
    items: S['defaultValue'][]
    itemsPerPage: number
    page: number
    totalItems: number
    orderBy: IOrderBy
    isSearching: boolean
    searchTerm: ISearch
    searchPage: number
    destroyId: string
    loading: {
      save: boolean
      item: boolean
      items: boolean
      destroy: boolean
    }
  }

  export interface PiniaCustomProperties<A> {
    loadMore(state?: StateHandler, ...args: any[]): () => Promise<void>
    fetchItems(state?: StateHandler, ...args: any[]): () => Promise<void>
    fetchItem(id: string): () => Promise<any>
    save(formData?: boolean): () => Promise<any>
    update(formData?: boolean): () => Promise<any>
    destroy(): () => Promise<void>
    dialogDestroy(id: string): () => Promise<void>
    search(state?: StateHandler, ...args: any[]): () => Promise<void>
    onOrderBy(state?: StateHandler, value: IOrderBy[]): () => Promise<void>
    resetForm(): () => void
    resetSearch (state?: StateHandler): () => void
    searchAgain(state?: StateHandler): () => Promise<void>
  }
}
