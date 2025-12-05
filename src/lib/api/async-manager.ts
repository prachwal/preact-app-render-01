// Async action manager for API calls - reusable across all endpoints

import type { IApiState, IApiService, AsyncActionResult } from './types'

// Generic async action creator - takes API call as dependency
export class AsyncActionManager {
  private apiService: IApiService

  constructor(apiService: IApiService) {
    this.apiService = apiService
  }

  // Generic async action - reusable for any API call
  async executeAsyncAction<T, K extends keyof IApiService>(
    apiMethod: K,
    stateManager: IApiState<T>,
    transformData?: (data: any) => T
  ): Promise<AsyncActionResult<T>> {
    // Reset state
    stateManager.clear()
    stateManager.setLoading(true)

    try {
      // Call API method dynamically - bind 'this' to preserve context
      const method = (this.apiService[apiMethod] as () => Promise<any>).bind(this.apiService)
      const response = await method()

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
