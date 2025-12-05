/**
 * Main API store aggregation and configuration.
 * Provides a centralized interface to all API-related state and actions.
 * Acts as a facade over individual store slices while maintaining backward compatibility.
 * @packageDocumentation
 */

import { setDefaultApiService } from '../lib'
import { api } from '../api'

// Initialize the default API service for the app
setDefaultApiService(api)

// Re-export everything from the hello store slice
// This maintains backward compatibility while consolidating implementation
export type { HelloResponse } from './hello'

export {
  helloMessageState,
  fetchHelloMessage,
  helloMessage as apiMessage,
  helloLoading as apiLoading,
  helloError as apiError,
  hasHelloData as hasApiData,
  hasHelloError as hasApiError,
  helloStatus as apiStatus,
  debugging,
} from './hello'

// Re-export base64 functionality
export type { EncodeBase64Request, EncodeBase64Response } from './base64'

export {
  encodeBase64State,
  encodeBase64ToText,
  encodedBase64,
  originalEncodedText,
  encodeBase64Loading,
  encodeBase64Error,
  hasBase64Result,
  base64Debugging,
} from './base64'

// Example: Add more API store slices by importing and re-exporting
// export * from './users'
// export * from './profile'

// Future API endpoints can be easily added here:
// export { userProfileState, fetchUserProfile, userMessage, userLoading } from './user'
