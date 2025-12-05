/**
 * Async action manager for handling API calls with comprehensive state management.
 * Provides a generic way to execute API operations with proper loading states, error handling, and data transformation.
 * @packageDocumentation
 */

import type { IApiState, AsyncActionResult } from './types'
import type { IApiService } from './contracts'

/**
 * Generic async action manager that coordinates API calls with state management.
 * Handles the complete lifecycle of API operations including loading states, error handling, and data transformation.
 */
export class AsyncActionManager {
  /** The API service instance used for making HTTP requests */
  private apiService: IApiService

  /**
   * Creates a new AsyncActionManager instance.
   * @param apiService - The API service implementation to use for making requests
   */
  constructor(apiService: IApiService) {
    this.apiService = apiService
  }

  /**
   * Executes an async API action with comprehensive state management.
   * This method handles the complete API operation lifecycle:
   * 1. Clears and sets loading state
   * 2. Calls the API method dynamically with proper context binding
   * 3. Handles success and error responses with optional payload for mutations (POST/PUT)
   * 4. Applies data transformation if provided
   * 5. Updates state manager and returns result
   *
   * @template T - The type of data returned by the operation
   * @template K - The type of API method key
   * @param apiMethod - The name of the API method to call
   * @param stateManager - The state manager instance to update during the operation
   * @param transformData - Optional function to transform the raw API response data
   * @param payload - Optional payload to pass to the API method (for POST/PUT operations)
   * @returns Promise resolving to the operation result (success with data or failure with error)
   *
   * @example
   * ```typescript
   * // GET request (no payload)
   * const result = await manager.executeAsyncAction(
   *   'getHello',
   *   helloState
   * )
   *
   * // POST request (with payload)
   * const result = await manager.executeAsyncAction(
   *   'encodeBase64',
   *   encodeState,
   *   undefined, // no transform
   *   { text: 'Hello World' } // payload
   * )
   * ```
   */
  async executeAsyncAction<T, K extends keyof IApiService>(
    apiMethod: K,
    stateManager: IApiState<T>,
    transformData?: (data: any) => T,
    payload?: Parameters<IApiService[K]>[0]
  ): Promise<AsyncActionResult<T>> {
    // Reset state
    stateManager.clear()
    stateManager.setLoading(true)

    try {
      // Call API method dynamically - bind 'this' to preserve context
      const method = (this.apiService[apiMethod] as (...args: any[]) => Promise<any>).bind(this.apiService)
      const response = payload ? await method(payload) : await method()

      if (response.data) {
        const processedData = transformData ? transformData(response.data) : (response.data as T)
        stateManager.setData(processedData)
        stateManager.setError('') // Clear any previous error on success
        return { success: true, data: processedData }
      } else {
        const error = response.error || 'Unknown error'
        stateManager.setError(error)
        return { success: false, error }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Network error'
      stateManager.setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      stateManager.setLoading(false)
    }
  }
}
