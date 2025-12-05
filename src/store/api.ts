// Specific API store implementation using reusable lib

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
export const apiMessage = computed(() => helloMessageState.data.value?.message || '')
export const apiLoading = computed(() => helloMessageState.loading.value)
export const apiError = computed(() => helloMessageState.error.value)
export const hasApiData = computed(() => helloMessageState.hasData.value)
export const hasApiError = computed(() => helloMessageState.hasError.value)
export const apiStatus = computed(() => helloMessageState.status.value)

// For easy testing and debugging, export the local state
export const debugging = { helloMessageState }

// Example: Add more API endpoints easily
// export const userProfileState = new BaseApiState<UserProfile>({ name: '', email: '' })
// export const fetchUserProfile = createApiAction('getUserProfile' as keyof typeof api, userProfileState)</content>
