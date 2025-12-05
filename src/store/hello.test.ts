/**
 * Tests for the hello store slice.
 * Verifies the hello message state management and computed signals.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { helloMessageState, fetchHelloMessage, helloMessage, helloLoading, helloError, helloStatus, debugging } from './hello'

// Mock the API and library dependencies
vi.mock('../api', () => ({
  api: {
    getHello: vi.fn(),
  },
}))

vi.mock('../lib', () => ({
  BaseApiState: class {
    data = { value: null }
    loading = { value: false }
    error = { value: '' }

    hasData = { value: false }
    hasError = { value: false }
    status = { value: 'idle' }

    clear = vi.fn()
    setLoading = vi.fn()
    setData = vi.fn()
    setError = vi.fn()

    constructor() {
      this.data = { value: null }
      this.loading = { value: false }
      this.error = { value: '' }
    }
  },
  createApiAction: vi.fn(() => vi.fn()),
}))

describe('Hello Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('helloMessageState', () => {
    it('should be initialized', () => {
      expect(helloMessageState).toBeDefined()
      expect(helloMessageState.data).toBeDefined()
      expect(helloMessageState.loading).toBeDefined()
      expect(helloMessageState.error).toBeDefined()
    })
  })

  describe('fetchHelloMessage', () => {
    it('should be defined', () => {
      expect(fetchHelloMessage).toBeDefined()
      expect(typeof fetchHelloMessage).toBe('function')
    })
  })

  describe('Computed signals', () => {
    it('helloMessage should be defined', () => {
      expect(helloMessage).toBeDefined()
      expect(helloMessage.value).toBeDefined()
    })

    it('helloLoading should be defined', () => {
      expect(helloLoading).toBeDefined()
      expect(typeof helloLoading.value).toBe('boolean')
    })

    it('helloError should be defined', () => {
      expect(helloError).toBeDefined()
      expect(helloError.value).toBeDefined()
    })

    it('helloStatus should be defined', () => {
      expect(helloStatus).toBeDefined()
      expect(helloStatus.value).toBeDefined()
    })
  })

  describe('debugging exports', () => {
    it('should export debugging object', () => {
      expect(debugging).toBeDefined()
      expect(debugging.helloMessageState).toBeDefined()
      expect(debugging.helloMessageState).toBe(helloMessageState)
    })
  })
})
