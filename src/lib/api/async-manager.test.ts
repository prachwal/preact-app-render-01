import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AsyncActionManager } from './async-manager'
import { BaseApiState } from './state-manager'

const mockApiService = {
  getHello: vi.fn(),
  encodeBase64: vi.fn(),
}

const mockFetch = vi.fn()
;(globalThis as any).fetch = mockFetch

describe('AsyncActionManager', () => {
  let manager: AsyncActionManager
  let state: BaseApiState<{ message: string }>

  beforeEach(() => {
    manager = new AsyncActionManager(mockApiService as any)
    state = new BaseApiState<{ message: string }>(null as any)
    vi.clearAllMocks()
  })

  describe('executeAsyncAction', () => {
    it('should execute successful API call', async () => {
      const mockResponse = { data: { message: 'Hello World' } }
      mockApiService.getHello.mockResolvedValue(mockResponse)

      const result = await manager.executeAsyncAction('getHello', state)

      expect(result).toEqual({ success: true, data: { message: 'Hello World' } })
      expect(state.loading.value).toBe(false) // Should be set back to false
      expect(state.data.value).toEqual({ message: 'Hello World' })
      expect(state.error.value).toBe('') // Should clear error on success
    })

    it('should bind this context correctly', async () => {
      // This test verifies that the fix we applied (using .bind()) works
      const mockResponse = { data: { message: 'Success' } }
      mockApiService.getHello.mockResolvedValue(mockResponse)

      // Create a service that would fail if 'this' context is wrong
      const problematicService = {
        client: { test: 'value' },
        getHello: function() {
          // This would fail if 'this' is not bound properly
          if (!this.client) {
            throw new Error('Client not available - context binding failed')
          }
          return { data: { message: 'Success' } }
        }
      }

      const manager2 = new AsyncActionManager(problematicService as any)
      const result = await manager2.executeAsyncAction('getHello', state)

      expect(result.success).toBe(true)
    })

    it('should handle API errors correctly', async () => {
      const mockResponse = { error: 'API Error occurred' }
      mockApiService.getHello.mockResolvedValue(mockResponse)

      const result = await manager.executeAsyncAction('getHello', state)

      expect(result).toEqual({ success: false, error: 'API Error occurred' })
      expect(state.loading.value).toBe(false)
      expect(state.error.value).toBe('API Error occurred')
      expect(state.data.value).toBeNull() // Data should remain unchanged on error
    })

    it('should handle network errors', async () => {
      mockApiService.getHello.mockRejectedValue(new Error('Network failure'))

      const result = await manager.executeAsyncAction('getHello', state)

      expect(result).toEqual({ success: false, error: 'Network failure' })
      expect(state.loading.value).toBe(false)
      expect(state.error.value).toBe('Network failure')
    })

    it('should clear state before executing action', async () => {
      // Set initial state
      state.setData({ message: 'Old data' })
      state.setError('Old error')
      state.setLoading(false)

      const mockResponse = { data: { message: 'New data' } }
      mockApiService.getHello.mockResolvedValue(mockResponse)

      await manager.executeAsyncAction('getHello', state)

      expect(state.data.value).toEqual({ message: 'New data' })
      expect(state.error.value).toBe('') // Should be cleared
      expect(state.loading.value).toBe(false)
    })

    it('should set loading state during execution', async () => {
      let loadingStateDuringExecution = false

      mockApiService.getHello.mockImplementation(async () => {
        loadingStateDuringExecution = state.loading.value
        return { data: { message: 'Hello' } }
      })

      await manager.executeAsyncAction('getHello', state)

      expect(loadingStateDuringExecution).toBe(true)
    })

    it('should apply data transformation if provided', async () => {
      const mockResponse = { data: { message: 'raw data' } }
      mockApiService.getHello.mockResolvedValue(mockResponse)

      const transformFn = vi.fn((data) => ({ message: data.message.toUpperCase() }))

      const result = await manager.executeAsyncAction('getHello', state, transformFn)

      expect(transformFn).toHaveBeenCalledWith({ message: 'raw data' })
      expect(result).toEqual({ success: true, data: { message: 'RAW DATA' } })
      expect(state.data.value).toEqual({ message: 'RAW DATA' })
    })

    it('should handle errors during data transformation', async () => {
      const mockResponse = { data: { message: 'raw data' } }
      mockApiService.getHello.mockResolvedValue(mockResponse)

      const transformFn = vi.fn(() => {
        throw new Error('Transform error')
      })

      const result = await manager.executeAsyncAction('getHello', state, transformFn)

      expect(result).toEqual({ success: false, error: 'Transform error' })
      expect(state.error.value).toBe('Transform error')
    })
  })

  describe('state management order', () => {
    it('should follow correct state transition sequence', async () => {
      const stateSequence: string[] = []

      // Mock API service with async behavior to capture state changes
      mockApiService.getHello.mockImplementation(async () => {
        stateSequence.push('during-api-call-' + state.status.value)
        return { data: { message: 'Success' } }
      })

      // Execute action
      const promise = manager.executeAsyncAction('getHello', state)

      // Check state during execution
      stateSequence.push('start-' + state.status.value)

      await promise

      stateSequence.push('end-' + state.status.value)

      // Should have started with idle, then loading during API call, then success
      expect(stateSequence).toContain('start-loading')
      expect(stateSequence).toContain('end-success')
    })
  })
})
