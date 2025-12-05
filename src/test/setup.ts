import { beforeAll, afterAll, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/preact'
import '@testing-library/jest-dom'
import './types'

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Global test cleanup
afterEach(() => {
  cleanup()
})

// Mock fetch globally
const mockFetch = vi.fn()
;(globalThis as any).fetch = mockFetch

// Export fetch mock for tests
;(globalThis as any).mockFetch = mockFetch

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = vi.fn()
  console.warn = vi.fn()
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})
