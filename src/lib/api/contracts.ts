/**
 * API Service contracts and interfaces.
 * Defines the contracts for API services and their implementations.
 * @packageDocumentation
 */

import type { ApiResponse } from './types'
import type { EncodeBase64Request } from '../../store/base64'

/**
 * Interface for API services providing typed methods for API operations.
 * Used for dependency injection and type-safe API interactions.
 * Can be extended with additional API endpoint methods.
 *
 * @example
 * ```typescript
 * class MyApiService implements IApiService {
 *   async getHello(): Promise<ApiResponse<HelloResponse>> {
 *     // Implementation
 *   }
 * }
 * ```
 */
export interface IApiService {
  /** Fetches hello message from the API */
  getHello(): Promise<ApiResponse<any>>

  /** Encodes text to base64 format */
  encodeBase64(data: EncodeBase64Request): Promise<ApiResponse<any>>

  // Can be extended with more methods
}
