/**
 * Main application component demonstrating reactive API integration with comprehensive debugging.
 * Features interactive counter, API call functionality, and real-time state visualization.
 * @packageDocumentation
 */

import { useState } from 'preact/hooks'
import { lazy, Suspense } from 'preact/compat'
import preactLogo from '../assets/preact.svg'
import viteLogo from '/vite.svg'
import { Navigation } from './shared'
import './App.css'

// Lazy load components
const CounterPage = lazy(() => import('./counter').then(module => ({ default: module.CounterPage })))
const HelloPage = lazy(() => import('./hello').then(module => ({ default: module.HelloPage })))
const Base64Page = lazy(() => import('./base64').then(module => ({ default: module.Base64Page })))

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
    <div class="dashboard">
      <header class="header">
        <div class="logo-section">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} class="logo" alt="Vite logo" />
          </a>
          <a href="https://preactjs.com" target="_blank">
            <img src={preactLogo} class="logo preact" alt="Preact logo" />
          </a>
        </div>
        <h1>Vite + Preact</h1>
      </header>

      <div class="navigation">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      <aside class="sidebar">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </aside>

      <main class="main-content">
        <Suspense fallback={<div class="loading">Loading...</div>}>
          {currentPage === 'counter' && <CounterPage />}
          {currentPage === 'hello' && <HelloPage />}
          {currentPage === 'base64' && <Base64Page />}
        </Suspense>
      </main>

      <footer class="footer">
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
      </footer>
    </div>
  )
}
