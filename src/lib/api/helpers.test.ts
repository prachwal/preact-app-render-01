import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setDefaultApiService, createApiAction, createApiActionFactory } from './helpers'
import type { IApiState } from './types'

// Mock API service
const mockApiService = {
  getHello: vi.fn(),
  getUsers: vi.fn(),
}

describe('API Helpers', () => {
  beforeEach(() => {
    // Clear any previous default service
    vi.clearAllMocks()
  })

  describe('setDefaultApiService', () => {
    it('should set the default async manager', async () => {
      // This implicitly sets up the default manager
      setDefaultApiService(mockApiService)

      // Test by creating an action - should work without throwing
      const mockState = {
        clear: vi.fn(),
        setLoading: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        data: { value: null },
        loading: { value: false },
        error: { value: '' },
      } as any

      mockApiService.getHello.mockResolvedValue({ data: 'test' })

      const action = createApiAction('getHello', mockState as any)
      const result = await action()

      expect(result.success).toBe(true)
      expect(result.data).toBe('test')
    })


  })

  describe('createApiAction', () => {
    beforeEach(() => {
      setDefaultApiService(mockApiService)
    })

    it('should create a function that executes API action', async () => {
      const mockState = {
        clear: vi.fn(),
        setLoading: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        data: { value: null },
        loading: { value: false },
        error: { value: '' },
      }

      mockApiService.getHello.mockResolvedValue({ data: { message: 'Success' } })

      const action = createApiAction('getHello', mockState as any)
      const result = await action()

      expect(mockApiService.getHello).toHaveBeenCalled()
      expect(result).toEqual({ success: true, data: { message: 'Success' } })
      expect(mockState.clear).toHaveBeenCalled()
      expect(mockState.setLoading).toHaveBeenCalledWith(true)
      expect(mockState.setLoading).toHaveBeenCalledWith(false)
    })

    it('should apply data transformation', async () => {
      const mockState = {
        clear: vi.fn(),
        setLoading: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        data: { value: null },
        loading: { value: false },
        error: { value: '' },
      }

      mockApiService.getHello.mockResolvedValue({ data: { raw: 'data' } })

      const transformFn = vi.fn((data) => ({ transformed: data.raw.toUpperCase() }))

      const action = createApiAction('getHello', mockState as any, transformFn)
      const result = await action()

      expect(transformFn).toHaveBeenCalledWith({ raw: 'data' })
      expect(result).toEqual({ success: true, data: { transformed: 'DATA' } })
    })

    it('should handle API errors', async () => {
      const mockState = {
        clear: vi.fn(),
        setLoading: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        data: { value: null },
        loading: { value: false },
        error: { value: '' },
      }

      mockApiService.getHello.mockResolvedValue({ error: 'API failed' })

      const action = createApiAction('getHello', mockState as any)
      const result = await action()

      expect(result).toEqual({ success: false, error: 'API failed' })
      expect(mockState.setError).toHaveBeenCalledWith('API failed')
    })
  })

  describe('createApiActionFactory', () => {
    it('should create a factory function for actions', () => {
      const factory = createApiActionFactory(mockApiService)

      const mockState = {
        clear: vi.fn(),
        setLoading: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        data: { value: null },
        loading: { value: false },
        error: { value: '' },
      }

      mockApiService.getHello.mockResolvedValue({ data: 'factory result' })

      const action = factory('getHello', mockState as any)
      expect(typeof action).toBe('function')
    })

    it('should create actions that work independently', async () => {
      const factory = createApiActionFactory(mockApiService)

      const mockState = {
        clear: vi.fn(),
        setLoading: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        data: { value: null },
        loading: { value: false },
        error: { value: '' },
      }

      mockApiService.getHello.mockResolvedValue({ data: 'factory works' })

      const action = factory('getHello', mockState as any)
      const result = await action()

      expect(result).toEqual({ success: true, data: 'factory works' })
    })

    it('should isolate factory instances', () => {
      const factory1 = createApiActionFactory(mockApiService)
      const factory2 = createApiActionFactory({
        getHello: vi.fn(),
      } as any)

      // They should create different action functions
      const mockState = {
        data: { value: null },
        loading: { value: false },
        error: { value: '' },
      } as any

      const action1 = factory1('getHello', mockState)
      const action2 = factory2('getHello', mockState)

      expect(action1).not.toBe(action2) // Different instances
    })
  })
})
