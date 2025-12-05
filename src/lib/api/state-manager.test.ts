import { describe, it, expect, beforeEach } from 'vitest'
import { BaseApiState } from './state-manager'

describe('BaseApiState', () => {
  let state: BaseApiState<{ message: string }>

  beforeEach(() => {
    state = new BaseApiState<{ message: string }>(null as any)
  })

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      expect(state.data.value).toBeNull()
      expect(state.loading.value).toBe(false)
      expect(state.error.value).toBe('')
      expect(state.hasData.value).toBe(false) // null/undefined data should not count as "has data"
      expect(state.hasError.value).toBe(false)
      expect(state.status.value).toBe('idle')
    })

    it('should handle null initial data', () => {
      const nullState = new BaseApiState<string>(null as any)
      expect(nullState.data.value).toBeNull()
      expect(nullState.hasData.value).toBe(false)
      expect(nullState.status.value).toBe('idle')
    })
  })

  describe('setLoading', () => {
    it('should set loading state', () => {
      state.setLoading(true)
      expect(state.loading.value).toBe(true)
      expect(state.status.value).toBe('loading')

      state.setLoading(false)
      expect(state.loading.value).toBe(false)
      expect(state.status.value).toBe('idle')
    })
  })

  describe('setData', () => {
    it('should set data and update status', () => {
      const testData = { message: 'Hello World' }
      state.setData(testData)

      expect(state.data.value).toEqual(testData)
      expect(state.hasData.value).toBe(true)
      expect(state.status.value).toBe('success')
    })

    it('should handle null data', () => {
      state.setData(null as any)
      expect(state.data.value).toBeNull()
      expect(state.hasData.value).toBe(false)
      expect(state.status.value).toBe('idle')
    })

    it('should handle undefined data', () => {
      state.setData(undefined as any)
      expect(state.data.value).toBeUndefined()
      expect(state.hasData.value).toBe(false)
      expect(state.status.value).toBe('idle')
    })
  })

  describe('setError', () => {
    it('should set error and update status', () => {
      const errorMessage = 'Network error'
      state.setError(errorMessage)

      expect(state.error.value).toBe(errorMessage)
      expect(state.hasError.value).toBe(true)
      expect(state.status.value).toBe('error')
    })

    it('should clear error', () => {
      state.setError('Error')
      expect(state.hasError.value).toBe(true)

      state.setError('')
      expect(state.error.value).toBe('')
      expect(state.hasError.value).toBe(false)
      expect(state.status.value).toBe('idle')
    })
  })

  describe('clear', () => {
    it('should reset loading and error but preserve data', () => {
      // Set some data
      state.setData({ message: 'Hello' })
      state.setLoading(true)
      state.setError('Error')

      expect(state.data.value).toEqual({ message: 'Hello' })
      expect(state.loading.value).toBe(true)
      expect(state.error.value).toBe('Error')

      // Clear
      state.clear()

      expect(state.data.value).toEqual({ message: 'Hello' }) // Data should be preserved
      expect(state.loading.value).toBe(false)
      expect(state.error.value).toBe('')
      expect(state.hasData.value).toBe(true)
      expect(state.hasError.value).toBe(false)
      expect(state.status.value).toBe('success')
    })
  })

  describe('computed properties', () => {
    describe('hasData', () => {
      it('should be false for null data', () => {
        const nullState = new BaseApiState<string>(null as any)
        expect(nullState.hasData.value).toBe(false)
      })

      it('should be false for undefined data', () => {
        const undefinedState = new BaseApiState<string>(undefined as any)
        expect(undefinedState.hasData.value).toBe(false)
      })

      it('should be true for valid data', () => {
        state.setData({ message: 'Hello' })
        expect(state.hasData.value).toBe(true)
      })

      it('should be false for empty object initially', () => {
        expect(state.hasData.value).toBe(false)
      })
    })

    describe('hasError', () => {
      it('should be false for empty error string', () => {
        expect(state.hasError.value).toBe(false)
      })

      it('should be true for non-empty error string', () => {
        state.setError('Error occurred')
        expect(state.hasError.value).toBe(true)
      })
    })

    describe('status', () => {
      it('should be idle initially', () => {
        expect(state.status.value).toBe('idle')
      })

      it('should be loading when loading is true', () => {
        state.setLoading(true)
        expect(state.status.value).toBe('loading')
      })

      it('should be error when error exists', () => {
        state.setError('Error')
        expect(state.status.value).toBe('error')
      })

      it('should be success when has data and no error', () => {
        state.setData({ message: 'Success' })
        expect(state.status.value).toBe('success')
      })

      it('should prioritize loading over error', () => {
        state.setError('Error')
        state.setLoading(true)
        expect(state.status.value).toBe('loading')
      })

      it('should prioritize loading over success', () => {
        state.setData({ message: 'Data' })
        state.setLoading(true)
        expect(state.status.value).toBe('loading')
      })
    })
  })
})
