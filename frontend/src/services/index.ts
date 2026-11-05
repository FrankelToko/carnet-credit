import type { DataSource } from './dataSource'
import { DemoDataSource } from './demo/DemoDataSource'
import { browserStorage } from './demo/storage'

/** `VITE_DATA_SOURCE` : "demo" (par défaut) ou, plus tard, "api". */
export const createDataSource = (): DataSource => {
  const mode: string = import.meta.env.VITE_DATA_SOURCE ?? 'demo'
  if (mode === 'api') {
    throw new Error("La source « api » n'est pas encore branchée.")
  }
  return new DemoDataSource(browserStorage())
}
