/**
 * API action helpers providing utilities for creating generic API actions.
 * Includes global state management and factory functions for type-safe API operations.
 * @packageDocumentation
 */

import type { IApiState, AsyncActionResult } from './types'
import type { IApiService } from './contracts'
import { AsyncActionManager } from './async-manager'

// Global instance - can be replaced for testing or different configurations
/** Global AsyncActionManager instance, can be replaced for testing */
let defaultAsyncManager: AsyncActionManager | null = null

/**
 * Gets the default AsyncActionManager instance.
 * Throws an error if no default service has been initialized.
 * @returns The default AsyncActionManager instance
 * @throws Error if no default service is set
 * @internal
 */
function getDefaultAsyncManager() {
  if (!defaultAsyncManager) {
    throw new Error('Default AsyncActionManager not initialized. Call setDefaultApiService() first.')
  }
  return defaultAsyncManager
}

/**
 * Initializes the default AsyncActionManager with an API service.
 * This sets up the global API manager that will be used for all createApiAction calls.
 * Call this once at application startup or when changing API configurations.
 * @param apiService - The API service implementation to use globally
 * @example
 * ```typescript
 * import { api } from '../api/client'
 * setDefaultApiService(api)
 * ```
 */
export function setDefaultApiService(apiService: IApiService) {
  defaultAsyncManager = new AsyncActionManager(apiService)
}

/**
 * Creates a reusable API action function that can be called to execute API operations.
 * Uses the globally configured AsyncActionManager and provides type-safe operation execution.
 * Supports both GET operations (with optional data transformation) and POST/PUT operations (with payload).
 * @template T - The type of data returned by the API operation
 * @template K - The type of API method key (constrained to available methods)
 * @param apiMethod - The name of the API method to call (must exist on the API service)
 * @param stateManager - The state manager instance to update during the operation
 * @param transformOrPayload - Optional: either transform function (for GET) or payload (for POST/PUT)
 * @param payload - Optional payload to send with POST/PUT requests (separated for clarity)
 * @returns A function that can be called to execute the API action
 * @throws Error if no default API service is configured
 * @example
 * ```typescript
 * import { createApiAction } from './helpers'
 *
 * // GET without transform
 * export const fetchHello = createApiAction('getHello', helloState)
 *
 * // GET with transform
 * export const fetchHelloUpper = createApiAction(
 *   'getHello',
 *   helloState,
 *   (data) => ({ message: data.message.toUpperCase() })
 * )
 *
 * // POST with payload
 * export const encodeBase64 = createApiAction(
 *   'encodeBase64',
 *   encodeState,
 *   { text: 'Hello World' }, // payload
 *   (data) => ({ ...data, originalText: 'Hello World' })
 * )
 * ```
 */
export function createApiAction<T, K extends keyof IApiService>(
  apiMethod: K,
  stateManager: IApiState<T>,
  transformOrPayload?: ((data: any) => T) | Parameters<IApiService[K]>[0],
  maybeTransform?: (data: any) => T
): () => Promise<AsyncActionResult<T>> {
  // Determine if transformOrPayload is a transform function or a payload
  const isTransformFunction = typeof transformOrPayload === 'function'
  const transformData = isTransformFunction ? transformOrPayload : maybeTransform
  const payload = isTransformFunction ? undefined : transformOrPayload

  return async (): Promise<AsyncActionResult<T>> => {
    return getDefaultAsyncManager().executeAsyncAction(apiMethod, stateManager, transformData, payload)
  }
}

/**
 * Creates a factory function that can generate multiple API actions with a shared configuration.
 * Useful for creating multiple related API actions or for testing scenarios.
 * @param apiService - The API service implementation to configure the factory with
 * @returns A function that creates API actions similar to createApiAction
 * @template T - The type of data returned by the API operation
 * @template K - The type of API method key (constrained to available methods)
 * @example
 * ```typescript
 * import { createApiActionFactory } from './helpers'
 * import { api } from '../api/client'
 *
 * const createAction = createApiActionFactory(api)
 * const fetchUsers = createAction('getUsers', usersState)
 * const fetchProfile = createAction('getProfile', profileState)
 * ```
 */
export function createApiActionFactory(apiService: IApiService) {
  const manager = new AsyncActionManager(apiService)

  return function <T, K extends keyof IApiService>(
    apiMethod: K,
    stateManager: IApiState<T>,
    transformData?: (data: any) => T
  ) {
    return async (): Promise<AsyncActionResult<T>> => {
      return manager.executeAsyncAction(apiMethod, stateManager, transformData)
    }
  }
}
