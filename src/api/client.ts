// API abstraction layer

interface ApiResponse<T = any> {
  data?: T
  error?: string
}

class ApiClient {
  private baseURL: string

  constructor() {
    // Use relative URLs for development (proxied), absolute for production
    this.baseURL = '/api'
  }

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

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint)
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }
}

// Explicit API endpoint definitions
const API_ENDPOINTS = {
  hello: '/hello',
  // users: '/users',
  // profile: '/profile',
} as const

// Type-safe endpoint paths (ready for future use with dynamic routing)
// type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]

// Specific API endpoint response types
interface HelloResponse {
  message: string
}

// Example: UserResponse, ProfileResponse etc.

class ApiService {
  private client: ApiClient

  constructor() {
    this.client = new ApiClient()
  }

  // Explicit endpoint method - clearly shows which path is called
  async getHello(): Promise<ApiResponse<HelloResponse>> {
    return this.client.get<HelloResponse>(API_ENDPOINTS.hello)  // '/hello'
  }

  // Example for future endpoints:
  // async getUsers(): Promise<ApiResponse<UserResponse[]>>
  //   return this.client.get<UserResponse[]>(API_ENDPOINTS.users)  // '/users'

  // async getProfile(): Promise<ApiResponse<ProfileResponse>>
  //   return this.client.get<ProfileResponse>(API_ENDPOINTS.profile)  // '/profile'
}

// Export endpoints configuration for developer reference
export { API_ENDPOINTS }

// Export a singleton instance
export const api = new ApiService()
export default api

// Developer convenience: see all actual API paths
export const API_PATHS = Object.entries(API_ENDPOINTS).reduce((acc, [key, path]) => ({
  ...acc,
  [key]: `/api${path}`
}), {} as Record<keyof typeof API_ENDPOINTS, string>)
