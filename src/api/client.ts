/**
 * API abstraction layer providing HTTP client functionality and typed API services.
 * Implements a clean separation between low-level HTTP operations and high-level API business logic.
 * @packageDocumentation
 */

import { HELLO_API_ENDPOINTS, type HelloResponse } from '../store/hello'
import { BASE64_API_ENDPOINTS, type EncodeBase64Request, type EncodeBase64Response } from '../store/base64'

/**
 * Generic API response interface for client-level operations.
 * Note: This is separate from the app-level ApiResponse interface and focuses on HTTP responses.
 * @template T - The type of data returned on success
 */
interface ApiResponse<T = any> {
  /** Data returned from the HTTP request */
  data?: T
  /** Error message from failed HTTP requests */
  error?: string
}

/**
 * Low-level HTTP client providing common REST operations.
 * Handles request/response transformation, headers, and error handling.
 * Configured for relative URLs that work with development proxying.
 */
class ApiClient {
  /** Base URL for all API requests (configured for development proxying) */
  private baseURL: string

  /**
   * Creates a new ApiClient instance with default configuration.
   * Uses relative URLs for development (works with Vite proxy) and absolute URLs for production.
   */
  constructor() {
    // Use relative URLs for development (proxied), absolute for production
    this.baseURL = '/api'
  }

  /**
   * Internal request method that handles the common HTTP request/response cycle.
   * Adds standard headers, handles JSON parsing, and provides consistent error handling.
   * @template T - The expected return type of the response data
   * @param endpoint - API endpoint path (relative to baseURL)
   * @param options - Additional fetch options (method, body, headers, etc.)
   * @returns Promise resolving to ApiResponse with data or error
   * @private
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Performs a GET request to the specified endpoint.
   * @template T - The expected return type of the response data
   * @param endpoint - API endpoint path
   * @returns Promise resolving to ApiResponse
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint)
  }

  /**
   * Performs a POST request to the specified endpoint with optional data.
   * @template T - The expected return type of the response data
   * @param endpoint - API endpoint path
   * @param data - Optional request body data (will be JSON stringified)
   * @returns Promise resolving to ApiResponse
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * Performs a PUT request to the specified endpoint with optional data.
   * @template T - The expected return type of the response data
   * @param endpoint - API endpoint path
   * @param data - Optional request body data (will be JSON stringified)
   * @returns Promise resolving to ApiResponse
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * Performs a DELETE request to the specified endpoint.
   * @template T - The expected return type of the response data
   * @param endpoint - API endpoint path
   * @returns Promise resolving to ApiResponse
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }
}

/**
 * Configuration object defining all available API endpoints.
 * Centralizes endpoint path management for consistency and maintainability.
 * Paths are relative to the API base URL and should not include the '/api' prefix.
 * Built from feature-specific endpoint configurations.
 */
const API_ENDPOINTS = {
  ...HELLO_API_ENDPOINTS,
  ...BASE64_API_ENDPOINTS,
  // users: '/users',
  // profile: '/profile',
} as const

/**
 * Type-safe endpoint access - creates union type of all endpoint paths.
 * Useful for type-safe endpoint parameter validation.
 * @internal
 */
// type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]

// HelloResponse now imported from store/hello

/**
 * Specific API endpoint response types (for future expansion).
 * @example
 * ```typescript
 * interface UserResponse extends Array<User> {}
 * interface ProfileResponse extends UserProfile {}
 * ```
 */
// Example: UserResponse, ProfileResponse etc.

/**
 * High-level API service class providing business logic methods for API operations.
 * Implements the IApiService interface and provides typed methods that correspond to API endpoints.
 * Acts as the primary interface between the application and the HTTP client.
 */
class ApiService {
  /** Internal HTTP client instance for making requests */
  private client: ApiClient

  /**
   * Creates a new ApiService instance with its own ApiClient.
   * The service is initialized with a fresh HTTP client configuration.
   */
  constructor() {
    this.client = new ApiClient()
  }

  /**
   * Fetches the hello message from the API.
   * Makes a GET request to the hello endpoint and returns typed response.
   * @returns Promise resolving to ApiResponse containing HelloResponse data
   * @example
   * ```typescript
   * const response = await api.getHello()
   * if (response.data) {
   *   console.log(response.data.message) // "Hello from Render with Fastify!"
   * }
   * ```
   */
  async getHello(): Promise<ApiResponse<HelloResponse>> {
    return this.client.get<HelloResponse>(API_ENDPOINTS.hello)  // '/hello'
  }

  /**
   * Encodes text to base64 format.
   * Makes a POST request to the base64 encode endpoint with text data.
   * @param data - Request data containing the text to encode
   * @returns Promise resolving to ApiResponse containing EncodeBase64Response
   * @example
   * ```typescript
   * const response = await api.encodeBase64({ text: 'Hello World' })
   * if (response.data) {
   *   console.log(response.data.base64) // "SGVsbG8gV29ybGQ="
   * }
   * ```
   */
  async encodeBase64(data: EncodeBase64Request): Promise<ApiResponse<EncodeBase64Response>> {
    return this.client.post<EncodeBase64Response>(API_ENDPOINTS.encodeBase64, data)
  }

  /**
   * Future API methods can be added here following the same pattern.
   * @example
   * ```typescript
   * async getUsers(): Promise<ApiResponse<UserResponse[]>>
   *   return this.client.get<UserResponse[]>(API_ENDPOINTS.users)  // '/users'
   *
   * async getProfile(): Promise<ApiResponse<ProfileResponse>>
   *   return this.client.get<ProfileResponse>(API_ENDPOINTS.profile)  // '/profile'
   * ```
   */
  // Example for future endpoints:
  // async getUsers(): Promise<ApiResponse<UserResponse[]>>
  //   return this.client.get<UserResponse[]>(API_ENDPOINTS.users)  // '/users'

  // async getProfile(): Promise<ApiResponse<ProfileResponse>>
  //   return this.client.get<ProfileResponse>(API_ENDPOINTS.profile)  // '/profile'
}

/**
 * API endpoints configuration for developer reference.
 * Exported to allow other parts of the application to access endpoint definitions.
 */
export { API_ENDPOINTS }

/**
 * Singleton instance of ApiService for application-wide use.
 * Provides a consistent API interface throughout the application.
 * @example
 * ```typescript
 * import { api } from '../api/client'
 *
 * const response = await api.getHello()
 * ```
 */
export const api = new ApiService()

/**
 * Default export of the singleton API instance for convenience.
 * @example
 * ```typescript
 * import api from '../api/client'
 *
 * const response = await api.getHello()
 * ```
 */
export default api

/**
 * Computed API paths object showing the full URLs for each endpoint.
 * Useful for documentation, debugging, and external API documentation generation.
 * @example
 * ```typescript
 * console.log(API_PATHS.hello) // "/api/hello"
 * ```
 */
export const API_PATHS = Object.entries(API_ENDPOINTS).reduce((acc, [key, path]) => ({
  ...acc,
  [key]: `/api${path}`
}), {} as Record<keyof typeof API_ENDPOINTS, string>)
