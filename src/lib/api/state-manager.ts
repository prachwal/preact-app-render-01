/**
 * Base API state manager class providing reactive state management for API operations.
 * Implements the IApiState interface and provides computed properties for easy status tracking.
 * @packageDocumentation
 */

import { signal, type Signal } from '@preact/signals'
import { computed } from '@preact/signals'
import type { IApiState } from './types'

/**
 * Base API state manager providing reactive state management for API operations.
 * Can be extended for specific use cases and implements the IApiState interface.
 * @template T - The type of data being managed by this state instance
 */
export class BaseApiState<T = unknown> implements IApiState<T> {
  /** Signal containing the current data, null if no data has been loaded */
  data: Signal<T>
  /** Signal indicating if an API operation is currently in progress */
  loading: Signal<boolean>
  /** Signal containing the current error message, empty string if no error */
  error: Signal<string>

  /**
   * Creates a new BaseApiState instance with initial data.
   * @param initialData - The initial data value, typically null for API states
   */
  constructor(initialData: T) {
    this.data = signal<T>(initialData)
    this.loading = signal<boolean>(false)
    this.error = signal<string>('')
  }

  // Computed properties for reactive state

  /**
   * Computed signal indicating whether data is present (not null/undefined).
   * Returns true when data.value is neither null nor undefined.
   */
  get hasData(): Signal<boolean> {
    return computed(() => this.data.value !== null && this.data.value !== undefined) as Signal<boolean>
  }

  /**
   * Computed signal indicating whether an error is present.
   * Returns true when error.value is a non-empty string.
   */
  get hasError(): Signal<boolean> {
    return computed(() => !!this.error.value) as Signal<boolean>
  }

  /**
   * Computed signal providing the overall status of the API operation.
   * Logic: loading takes priority, then error, then success (if data present), finally idle.
   */
  get status(): Signal<'idle' | 'loading' | 'success' | 'error'> {
    return computed(() => {
      if (this.loading.value) return 'loading'
      if (this.error.value) return 'error'
      if (this.hasData.value) return 'success'
      return 'idle'
    })
  }

  /**
   * Clears loading and error states while preserving existing data.
   * Used before starting new API operations to reset transient state.
   */
  clear(): void {
    this.data.value = this.data.peek() // Keep same type, just reset
    this.loading.value = false
    this.error.value = ''
  }

  /**
   * Sets the loading state to indicate an API operation is in progress.
   * @param loading - Whether an operation is currently loading
   */
  setLoading(loading: boolean): void {
    this.loading.value = loading
  }

  /**
   * Sets the data and implicitly clears any previous error.
   * Typically called when an API operation succeeds.
   * @param data - The data returned from the API operation
   */
  setData(data: T): void {
    this.data.value = data
  }

  /**
   * Sets the error message to indicate an API operation failed.
   * @param error - The error message describing what went wrong
   */
  setError(error: string): void {
    this.error.value = error
  }
}
