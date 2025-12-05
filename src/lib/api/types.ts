// Generic types and interfaces for API management

import { type Signal } from '@preact/signals'

// Generic API response interface
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
}

// Generic async action result
export interface AsyncActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// API State interface for dependency injection
export interface IApiState<T = unknown> {
  readonly data: Signal<T>
  readonly loading: Signal<boolean>
  readonly error: Signal<string>
  readonly hasData: Signal<boolean>
  readonly hasError: Signal<boolean>
  readonly status: Signal<'idle' | 'loading' | 'success' | 'error'>
  clear(): void
  setLoading(loading: boolean): void
  setData(data: T): void
  setError(error: string): void
}

// API Service interface for dependency injection
export interface IApiService {
  getHello(): Promise<ApiResponse<any>>
  // Can be extended with more methods
}

// Specific API types
export interface HelloResponse {
  message: string
}
