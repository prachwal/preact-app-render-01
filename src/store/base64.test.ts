/**
 * Tests for the base64 store slice.
 * Verifies the base64 encoding state management and computed signals.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  encodeBase64State,
  encodeBase64ToText,
  encodedBase64,
  originalEncodedText,
  encodeBase64Loading,
  encodeBase64Error,
  hasBase64Result,
  base64Debugging
} from './base64'

// Mock the API and library dependencies
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

describe('Base64 Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('encodeBase64State', () => {
    it('should be initialized', () => {
      expect(encodeBase64State).toBeDefined()
      expect(encodeBase64State.data).toBeDefined()
      expect(encodeBase64State.loading).toBeDefined()
      expect(encodeBase64State.error).toBeDefined()
    })
  })

  describe('encodeBase64ToText', () => {
    it('should be defined', () => {
      expect(encodeBase64ToText).toBeDefined()
      expect(typeof encodeBase64ToText).toBe('function')
    })
  })

  describe('Computed signals', () => {
    it('encodedBase64 should be defined', () => {
      expect(encodedBase64).toBeDefined()
      expect(encodedBase64.value).toBe('')
    })

    it('originalEncodedText should be defined', () => {
      expect(originalEncodedText).toBeDefined()
      expect(originalEncodedText.value).toBe('')
    })

    it('encodeBase64Loading should be defined', () => {
      expect(encodeBase64Loading).toBeDefined()
      expect(typeof encodeBase64Loading.value).toBe('boolean')
    })

    it('encodeBase64Error should be defined', () => {
      expect(encodeBase64Error).toBeDefined()
      expect(encodeBase64Error.value).toBe('')
    })

    it('hasBase64Result should be defined', () => {
      expect(hasBase64Result).toBeDefined()
      expect(typeof hasBase64Result.value).toBe('boolean')
      expect(hasBase64Result.value).toBe(false)
    })
  })

  describe('debugging exports', () => {
    it('should export debugging object', () => {
      expect(base64Debugging).toBeDefined()
      expect(base64Debugging.encodeBase64State).toBeDefined()
      expect(base64Debugging.encodeBase64State).toBe(encodeBase64State)
    })
  })
})
