import { describe, it, expect } from 'vitest'
import type { ApiResponse, AsyncActionResult } from './types'
import type { HelloResponse } from '../../store/hello'

describe('API Types', () => {
  it('should have proper type definitions', () => {
    // Type validity checks
    const apiResponse: ApiResponse<string> = { data: 'test' }
    expect(apiResponse.data).toBe('test')

    const helloResponse: HelloResponse = { message: 'Hello' }
    expect(helloResponse.message).toBe('Hello')

    const asyncResult: AsyncActionResult<string> = { success: true, data: 'data' }
    expect(asyncResult.success).toBe(true)
    expect(asyncResult.data).toBe('data')
  })

  it('should handle error responses', () => {
    const errorResponse: ApiResponse<string> = { error: 'Error occurred' }
    expect(errorResponse.error).toBe('Error occurred')
    expect(errorResponse.data).toBeUndefined()
  })

  it('should handle successful async results', () => {
    const successResult: AsyncActionResult<number> = { success: true, data: 42 }
    expect(successResult.success).toBe(true)
    expect(successResult.data).toBe(42)
    expect(successResult.error).toBeUndefined()
  })

  it('should handle failed async results', () => {
    const failedResult: AsyncActionResult<any> = { success: false, error: 'Network error' }
    expect(failedResult.success).toBe(false)
    expect(failedResult.error).toBe('Network error')
    expect(failedResult.data).toBeUndefined()
  })
})
