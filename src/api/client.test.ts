import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api, API_ENDPOINTS, API_PATHS } from './client'

// Mock fetch
const mockFetch = vi.fn()
;(globalThis as any).fetch = mockFetch

describe('API Client Exports', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('API Endpoints', () => {
    it('should export correct endpoints', () => {
      expect(API_ENDPOINTS).toEqual({
        hello: '/hello',
      })
    })

    it('should export correct API paths', () => {
      expect(API_PATHS).toEqual({
        hello: '/api/hello',
      })
    })
  })

  describe('Singleton API Instance', () => {
    it('should export the singleton api instance', () => {
      expect(api).toBeDefined()
      expect(typeof api.getHello).toBe('function')
    })

    describe('getHello method', () => {
      it('should call the correct endpoint and return response', async () => {
        const mockResponse = { message: 'Hello from Render with Fastify!' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })

        const result = await api.getHello()

        expect(mockFetch).toHaveBeenCalledWith('/api/hello', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        expect(result).toEqual({ data: mockResponse })
      })

      it('should handle API errors', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
        })

        const result = await api.getHello()

        expect(result).toEqual({
          error: 'HTTP error! status: 500'
        })
      })

      it('should handle network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network failure'))

        const result = await api.getHello()

        expect(result).toEqual({
          error: 'Network failure'
        })
      })
    })
  })

  describe('Request behavior', () => {
    it('should set correct headers for all requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'test' }),
      })

      await api.getHello()

      expect(mockFetch).toHaveBeenCalledWith('/api/hello', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })

    it('should use correct base URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'test' }),
      })

      await api.getHello()

      expect(mockFetch).toHaveBeenCalledWith('/api/hello', expect.any(Object))
    })
  })
})
