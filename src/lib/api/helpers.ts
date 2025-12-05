// API action helpers - utilities for creating generic API actions

import type { IApiState, IApiService, AsyncActionResult } from './types'
import { AsyncActionManager } from './async-manager'

// Global instance - can be replaced for testing or different configurations
let defaultAsyncManager: AsyncActionManager | null = null

function getDefaultAsyncManager() {
  if (!defaultAsyncManager) {
    throw new Error('Default AsyncActionManager not initialized. Call setDefaultApiService() first.')
  }
  return defaultAsyncManager
}

// Initialize the default async manager
export function setDefaultApiService(apiService: IApiService) {
  defaultAsyncManager = new AsyncActionManager(apiService)
}

// Generic action that can be reused for any API call
export function createApiAction<T, K extends keyof IApiService>(
  apiMethod: K,
  stateManager: IApiState<T>,
  transformData?: (data: any) => T
) {
  return async (): Promise<AsyncActionResult<T>> => {
    return getDefaultAsyncManager().executeAsyncAction(apiMethod, stateManager, transformData)
  }
}

// Alternative: Create a configured factory function
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
