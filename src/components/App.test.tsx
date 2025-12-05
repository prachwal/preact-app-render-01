import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { App } from './App'

// Mock the entire store (including counter store and hello store exports)
vi.mock('../store', () => {
  return {
    count: { value: 0 },
    doubleCount: { value: 0 },
    helloMessageState: {
      data: { value: null },
      loading: { value: false },
      error: { value: '' },
      hasData: { value: false },
      hasError: { value: false },
      status: { value: 'idle' },
    },
    fetchHelloMessage: vi.fn(),
    apiMessage: { value: '' },
    apiLoading: { value: false },
    apiError: { value: '' },
    hasApiData: { value: false },
    hasApiError: { value: false },
    apiStatus: { value: 'idle' },
    debugging: {
      helloMessageState: {
        data: { value: null },
      },
    },
  }
})

describe('App Component', () => {
  it('should render the app correctly', () => {
    render(<App />)

    expect(screen.getByText('Vite + Preact')).toBeInTheDocument()
    expect(screen.getByText('Counter Demo')).toBeInTheDocument()
    expect(screen.getByText('Hello API')).toBeInTheDocument()
    expect(screen.getByText('Base64 Encoder')).toBeInTheDocument()
  })



  it('should render all logos correctly', () => {
    render(<App />)

    const viteLogo = screen.getByAltText('Vite logo')
    const preactLogo = screen.getByAltText('Preact logo')

    expect(viteLogo).toBeInTheDocument()
    expect(preactLogo).toBeInTheDocument()
  })

  it('should have proper header structure', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Vite + Preact' })).toBeInTheDocument()
    expect(screen.getByText('Double count: 0')).toBeInTheDocument()
  })

  it('should display counter section by default', () => {
    render(<App />)

    // Counter section is shown by default
    expect(screen.getByText('count is 0')).toBeInTheDocument()
    expect(screen.getByText('Double count: 0')).toBeInTheDocument()
  })

  it('should display API section when navigating to Hello', () => {
    render(<App />)

    // Switch to Hello API page
    const helloTab = screen.getByText('Hello API')
    fireEvent.click(helloTab)

    // Now API section should be visible
    expect(screen.getByText('Call API')).toBeInTheDocument()
    expect(screen.getByText('Debug State:')).toBeInTheDocument()
  })

  it('should have footer with correct links', () => {
    render(<App />)

    const preactLink = screen.getByText('create-preact')
    expect(preactLink.closest('a')).toHaveAttribute(
      'href',
      'https://preactjs.com/guide/v10/getting-started#create-a-vite-powered-preact-app'
    )
  })

  it('should show loading state correctly', () => {
    render(<App />)

    // Switch to Hello API page
    const helloTab = screen.getByText('Hello API')
    fireEvent.click(helloTab)

    // Button should not be disabled initially
    const button = screen.getByText('Call API')
    expect(button).not.toBeDisabled()
  })

  it('should not show API response when message is empty', () => {
    render(<App />)

    // Switch to Hello API page
    const helloTab = screen.getByText('Hello API')
    fireEvent.click(helloTab)

    // Should not show the response paragraph when message is empty
    expect(screen.queryByText('API Response:')).not.toBeInTheDocument()
  })
})
