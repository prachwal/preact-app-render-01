/**
 * Dedicated store slice for base64 encoding operations.
 * Encapsulates functionality for converting text to base64 format.
 * @packageDocumentation
 */

import { computed } from '@preact/signals'
import { BaseApiState, createApiAction } from '../lib'
import { api } from '../api'

/**
 * Request type for base64 encoding operation.
 */
export interface EncodeBase64Request {
  /** Text to be encoded to base64 */
  text: string
}

/**
 * Response type for base64 encoding operation.
 */
export interface EncodeBase64Response {
  /** Base64 encoded version of the input text */
  base64: string
}

/**
 * Base64 API endpoints configuration.
 */
export const BASE64_API_ENDPOINTS = {
  /** Endpoint for encoding text to base64 */
  encodeBase64: '/base64/encode',
} as const

/**
 * State manager instance for base64 operations.
 * Handles loading, error, and data states for base64 encoding.
 */
export const encodeBase64State = new BaseApiState<EncodeBase64Response>(null as any)

/**
 * Action function for encoding text to base64.
 * Takes a request object with text and returns base64 encoded result.
 * This creates a reusable function that accepts the payload at call time.
 * @param request - Request object containing text to encode
 * @returns Promise that resolves when encoding completes
 * @example
 * ```typescript
 * const result = await encodeBase64ToText({ text: 'Hello World' })
 * // result.data.base64 === 'SGVsbG8gV29ybGQ='
 * ```
 */
export function encodeBase64ToText(request: EncodeBase64Request) {
  return createApiAction(
    'encodeBase64' as keyof typeof api,
    encodeBase64State,
    request, // Pass the payload
    // Transform function to add original text to response for UI display
    (data: any) => ({
      ...data,
      originalText: request.text // Store original text for UI
    } as EncodeBase64Response & { originalText: string })
  )()
}

// Computed signals for component access

/** Computed signal providing the current base64 encoded result */
export const encodedBase64 = computed(() => encodeBase64State.data.value?.base64 || '')

/** Computed signal providing the original text that was encoded */
export const originalEncodedText = computed(() => (encodeBase64State.data.value as any)?.originalText || '')

/** Computed signal indicating if base64 encoding is currently in progress */
export const encodeBase64Loading = computed(() => encodeBase64State.loading.value)

/** Computed signal containing error message for base64 operations */
export const encodeBase64Error = computed(() => encodeBase64State.error.value)

/** Computed signal indicating whether base64 result is available */
export const hasBase64Result = computed(() => encodeBase64State.hasData.value)

// For easy testing and debugging, export the raw state
export const base64Debugging = { encodeBase64State }
