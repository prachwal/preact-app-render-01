// Base API state manager class - reusable across all API endpoints

import { signal, type Signal } from '@preact/signals'
import { computed } from '@preact/signals'
import type { IApiState } from './types'

// Base API state manager - can be extended for specific use cases
export class BaseApiState<T = unknown> implements IApiState<T> {
  data: Signal<T>
  loading: Signal<boolean>
  error: Signal<string>

  constructor(initialData: T) {
    this.data = signal<T>(initialData)
    this.loading = signal<boolean>(false)
    this.error = signal<string>('')
  }

  // Computed properties for reactive state
  get hasData(): Signal<boolean> {
    return computed(() => this.data.value !== null && this.data.value !== undefined) as Signal<boolean>
  }

  get hasError(): Signal<boolean> {
    return computed(() => !!this.error.value) as Signal<boolean>
  }

  get status(): Signal<'idle' | 'loading' | 'success' | 'error'> {
    return computed(() => {
      if (this.loading.value) return 'loading'
      if (this.error.value) return 'error'
      if (this.hasData.value) return 'success'
      return 'idle'
    })
  }

  clear(): void {
    this.data.value = this.data.peek() // Keep same type, just reset
    this.loading.value = false
    this.error.value = ''
  }

  setLoading(loading: boolean): void {
    this.loading.value = loading
  }

  setData(data: T): void {
    this.data.value = data
  }

  setError(error: string): void {
    this.error.value = error
  }
}
