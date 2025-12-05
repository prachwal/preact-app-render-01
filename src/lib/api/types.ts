/**
 * Core types and interfaces for API management.
 * Contains generic API response types and state management interfaces.
 * @packageDocumentation
 */

import { type Signal } from '@preact/signals'

/**
 * Generic API response interface that encapsulates API call results.
 * Responses either contain data (success) or an error message (failure).
 * @template T - The type of data returned on success
 */
export interface ApiResponse<T = unknown> {
  /** Data returned from a successful API call */
  data?: T
  /** Error message returned from a failed API call */
  error?: string
}

/**
 * Result of an async action execution, either success with data or failure with error.
 * This provides a unified way to handle the outcomes of state management operations.
 * @template T - The type of data returned on success
 */
export interface AsyncActionResult<T = unknown> {
  /** Whether the async operation succeeded */
  success: boolean
  /** Data returned from a successful operation */
  data?: T
  /** Error message from a failed operation */
  error?: string
}

/**
 * Interface for reactive API state management.
 * Provides signals for tracking API operation states and methods for state manipulation.
 * Used for dependency injection and consistent state management across API operations.
 * @template T - The type of data being managed
 */
export interface IApiState<T = unknown> {
  /** Signal containing the current data, null if no data has been loaded */
  readonly data: Signal<T>
  /** Signal indicating if an API operation is currently in progress */
  readonly loading: Signal<boolean>
  /** Signal containing the current error message, empty string if no error */
  readonly error: Signal<string>
  /** Computed signal indicating whether data is present (not null/undefined) */
  readonly hasData: Signal<boolean>
  /** Computed signal indicating whether an error is present */
  readonly hasError: Signal<boolean>
  /** Computed signal providing the overall status: 'idle', 'loading', 'success', or 'error' */
  readonly status: Signal<'idle' | 'loading' | 'success' | 'error'>
  /** Clears loading and error states while preserving data */
  clear(): void
  /** Sets the loading state */
  setLoading(loading: boolean): void
  /** Sets the data and transitions to 'success' status */
  setData(data: T): void
  /** Sets the error message and transitions to 'error' status */
  setError(error: string): void
}
