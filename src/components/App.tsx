/**
 * Main application component demonstrating reactive API integration with comprehensive debugging.
 * Features interactive counter, API call functionality, and real-time state visualization.
 * @packageDocumentation
 */

import preactLogo from '../assets/preact.svg'
import viteLogo from '/vite.svg'
import '../app.css'
import { count, doubleCount, apiMessage, apiLoading, apiError, hasApiData, hasApiError, apiStatus, debugging, fetchHelloMessage } from '../store'

/**
 * Root application component that renders the entire UI.
 * Includes counter functionality, API operations, and comprehensive debug information display.
 * Demonstrates reactive state management using Preact Signals and API integration.
 *
 * @returns JSX element representing the complete application interface
 */
export function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Vite + Preact</h1>

      {/* Counter section demonstrating basic reactive state */}
      <div class="card">
        <button onClick={() => count.value += 1}>
          count is {count.value}
        </button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
        <p>
          Double count: {doubleCount.value}
        </p>
      </div>

      {/* API section demonstrating reactive API integration */}
      <div class="card">
        <button onClick={fetchHelloMessage} disabled={apiLoading.value}>
          {apiLoading.value ? 'Loading...' : 'Call API'}
        </button>

        {/* Comprehensive Debug Info - Real-time API state visualization */}
        <div style="font-size: 12px; color: #666; margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          <h4 style="margin: 0 0 5px 0; color: #333;">Debug State:</h4>
          <div><strong>Loading:</strong> {String(apiLoading.value)}</div>
          <div><strong>Error:</strong> "{apiError.value}"</div>
          <div><strong>Message:</strong> "{apiMessage.value}"</div>
          <div><strong>Has Data:</strong> {String(hasApiData.value)}</div>
          <div><strong>Has Error:</strong> {String(hasApiError.value)}</div>
          <div><strong>Status:</strong> {apiStatus.value}</div>
          <div><strong>Data Value:</strong> {JSON.stringify(debugging.helloMessageState.data.value)}</div>
        </div>

        {/* Conditional rendering of API results - only shown when data exists */}
        {apiMessage.value && apiMessage.value.trim() && (
          <p>
            API Response: <code>{apiMessage.value}</code>
          </p>
        )}

        {/* Conditional rendering of errors - only shown when error exists */}
        {apiError.value && apiError.value.trim() && (
          <p style="color: red;">
            Error: {apiError.value}
          </p>
        )}
      </div>

      {/* Footer with documentation links */}
      <p>
        Check out{' '}
        <a
          href="https://preactjs.com/guide/v10/getting-started#create-a-vite-powered-preact-app"
          target="_blank"
        >
          create-preact
        </a>
        , the official Preact + Vite starter
      </p>
      <p class="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
    </>
  )
}
