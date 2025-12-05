/**
 * Dedicated store slice for hello message API operations.
 * Encapsulates all state management for hello-related functionality.
 * @packageDocumentation
 */

import { computed } from '@preact/signals'
import { BaseApiState, createApiAction } from '../lib'
import { api } from '../api'

/**
 * Response type for the hello API endpoint.
 * Contains the message returned by the greeting service.
 * This type is feature-specific and defined here alongside the hello functionality.
 */
export interface HelloResponse {
  /** The greeting message text */
  message: string
}

/**
 * API endpoint configuration for the hello feature.
 * Defines the relative URL path for hello API operations.
 */
export const HELLO_API_ENDPOINTS = {
  /** Endpoint for fetching hello message */
  hello: '/hello',
} as const

/**
 * State manager instance for hello message operations.
 * Handles loading, error, and data states for hello API calls.
 */
export const helloMessageState = new BaseApiState<HelloResponse>(null as any)

/**
 * Action function for fetching hello messages from the API.
 * Triggers API call with proper state management and error handling.
 * @returns Promise that resolves when the API call completes
 * @example
 * ```typescript
 * await fetchHelloMessage()
 * ```
 */
export const fetchHelloMessage = createApiAction(
  'getHello' as keyof typeof api,
  helloMessageState,
  // No transformation needed - data comes as HelloResponse
  (data) => data
)

// Computed signals for component access

/** Computed signal providing the current hello message text, or empty string if no data */
export const helloMessage = computed(() => helloMessageState.data.value?.message || '')

/** Computed signal indicating if hello API operation is currently in progress */
export const helloLoading = computed(() => helloMessageState.loading.value)

/** Computed signal containing current error message for hello operations, or empty string if no error */
export const helloError = computed(() => helloMessageState.error.value)

/** Computed signal indicating whether hello API response data is available */
export const hasHelloData = computed(() => helloMessageState.hasData.value)

/** Computed signal indicating whether an error occurred in the last hello API operation */
export const hasHelloError = computed(() => helloMessageState.hasError.value)

/** Computed signal providing the overall hello operation status: 'idle', 'loading', 'success', or 'error' */
export const helloStatus = computed(() => helloMessageState.status.value)

// For easy testing and debugging, export the raw state
export const debugging = { helloMessageState }
