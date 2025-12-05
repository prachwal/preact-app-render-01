/**
 * Main application component demonstrating reactive API integration with comprehensive debugging.
 * Features interactive counter, API call functionality, and real-time state visualization.
 * @packageDocumentation
 */

import { useState } from 'preact/hooks'
import preactLogo from '../assets/preact.svg'
import viteLogo from '/vite.svg'
import { CounterPage } from './counter'
import { HelloPage } from './hello'
import { Base64Page } from './base64'
import './App.css'

/**
 * Root application component that renders the entire UI.
 * Includes counter functionality, API operations for both Hello and Base64 services,
 * with navigation between different demo pages.
 * Demonstrates reactive state management using Preact Signals and API integration.
 *
 * @returns JSX element representing the complete application interface
 */
export function App() {
  const [currentPage, setCurrentPage] = useState<'counter' | 'hello' | 'base64'>('counter')
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

      {/* Navigation between demo pages */}
      <div class="navigation">
        <nav class="nav-tabs">
          <button
            class={currentPage === 'counter' ? 'nav-tab active' : 'nav-tab'}
            onClick={() => setCurrentPage('counter')}
          >
            Counter Demo
          </button>
          <button
            class={currentPage === 'hello' ? 'nav-tab active' : 'nav-tab'}
            onClick={() => setCurrentPage('hello')}
          >
            Hello API
          </button>
          <button
            class={currentPage === 'base64' ? 'nav-tab active' : 'nav-tab'}
            onClick={() => setCurrentPage('base64')}
          >
            Base64 Encoder
          </button>
        </nav>
      </div>

      {/* Page content based on current selection */}
      {currentPage === 'counter' && <CounterPage />}

      {currentPage === 'hello' && <HelloPage />}

      {currentPage === 'base64' && <Base64Page />}

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
