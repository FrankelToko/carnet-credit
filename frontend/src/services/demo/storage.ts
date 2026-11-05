export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export const memoryStorage = (): StorageLike => {
  const store = new Map<string, string>()
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value)
    },
  }
}

/** localStorage si disponible (navigation privée, stockage bloqué...), sinon mémoire. */
export const browserStorage = (): StorageLike => {
  try {
    const storage = window.localStorage
    storage.setItem('__carnet_test__', '1')
    storage.removeItem('__carnet_test__')
    return storage
  } catch {
    return memoryStorage()
  }
}
