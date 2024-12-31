import { createPinia } from 'pinia'
import type { App } from 'vue'
import { CodifyTechStorePlugin } from '@/stores/CodifyTechStore'

export const store = createPinia()

export default function (app: App) {
  app.use(store)
  store.use(CodifyTechStorePlugin)
}
