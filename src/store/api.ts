/**
 * Specific API store implementation using reusable library components.
 * Provides reactive state management for API operations with computed helpers for component access.
 * @packageDocumentation
 */

import { computed } from '@preact/signals'
import { BaseApiState, setDefaultApiService, createApiAction } from '../lib'
import type { HelloResponse } from '../lib'
import { api } from '../api'

// Initialize the default API service for the app
setDefaultApiService(api)

// Create state manager for hello message
export const helloMessageState = new BaseApiState<HelloResponse>(null as any)

// Create the fetch action using the generic creator
export const fetchHelloMessage = createApiAction(
  'getHello' as keyof typeof api,
  helloMessageState,
  // No transformation needed - data comes as HelloResponse
  (data) => data
)

// Computed helpers for easy component access
/** Computed signal providing the current API message text, or empty string if no data */
export const apiMessage = computed(() => helloMessageState.data.value?.message || '')
/** Computed signal indicating if API operation is currently in progress */
export const apiLoading = computed(() => helloMessageState.loading.value)
/** Computed signal containing current error message, or empty string if no error */
export const apiError = computed(() => helloMessageState.error.value)
/** Computed signal indicating whether API response data is available */
export const hasApiData = computed(() => helloMessageState.hasData.value)
/** Computed signal indicating whether an error occurred in the last API operation */
export const hasApiError = computed(() => helloMessageState.hasError.value)
/** Computed signal providing the overall status: 'idle', 'loading', 'success', or 'error' */
export const apiStatus = computed(() => helloMessageState.status.value)

// For easy testing and debugging, export the local state
export const debugging = { helloMessageState }

// Example: Add more API endpoints easily
// export const userProfileState = new BaseApiState<UserProfile>({ name: '', email: '' })
// export const fetchUserProfile = createApiAction('getUserProfile' as keyof typeof api, userProfileState)
