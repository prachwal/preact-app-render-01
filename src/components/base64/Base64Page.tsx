/**
 * Base64 encoding component demonstrating reactive API integration.
 * Allows users to input text and see it encoded to base64 format.
 * @packageDocumentation
 */

import { useState } from 'preact/hooks'
import {
  encodeBase64ToText,
  encodedBase64,
  originalEncodedText,
  encodeBase64Loading,
  encodeBase64Error,
  hasBase64Result,
  encodeBase64State,
} from '../../store'
import { DebugPanel } from '../shared'
import './Base64Page.css'

/**
 * Component for base64 text encoding functionality.
 * Provides a simple UI to input text, encode it to base64,
 * and display the results with proper error handling.
 *
 * @returns JSX element representing the base64 encoding interface
 */
export function Base64Page() {
  const [inputText, setInputText] = useState('')

  const handleEncode = async () => {
    if (!inputText.trim()) return

    await encodeBase64ToText({ text: inputText.trim() })
  }

  const handleClear = () => {
    setInputText('')
  }

  const SAMPLE_TEXTS = [
    'Hello World',
    'Lorem ipsum dolor sit amet',
    'TypeScript + Preact = ❤️',
    '123456789',
    'Special chars: @#$%^&*()_+',
  ]

  return (
    <div class="base64-page">
      <h2>Base64 Encoder</h2>
      <p class="description">
        Convert text to base64 format using the API endpoint. This demonstrates
        POST requests with JSON payloads and response processing.
      </p>

      {/* Input Section */}
      <section class="input-section">
        <h3>Input Text</h3>

        <textarea
          value={inputText}
          onInput={(e) => setInputText(e.currentTarget.value)}
          placeholder="Enter text to encode..."
          rows={3}
          class="text-input"
        />

        <div class="input-controls">
          <button
            onClick={handleEncode}
            disabled={encodeBase64Loading.value || !inputText.trim()}
            class="encode-btn"
          >
            {encodeBase64Loading.value ? 'Encoding...' : 'Encode to Base64'}
          </button>

          <button
            onClick={handleClear}
            class="clear-btn"
          >
            Clear
          </button>
        </div>

        {/* Sample Texts */}
        <details class="sample-texts">
          <summary>Try these sample texts</summary>
          <div class="sample-buttons">
            {SAMPLE_TEXTS.map(text => (
              <button
                key={text}
                onClick={() => setInputText(text)}
                class="sample-btn"
              >
                {text}
              </button>
            ))}
          </div>
        </details>
      </section>

      {/* Error Display */}
      {encodeBase64Error.value && (
        <div class="error-message">
          <strong>Error:</strong> {encodeBase64Error.value}
        </div>
      )}

      {/* Results Section */}
      {hasBase64Result.value && (
        <section class="results-section">
          <h3>Results</h3>

          <div class="result-card">
            <div class="result-item">
              <label>Original Text:</label>
              <code class="original-text">{originalEncodedText.value}</code>
            </div>

            <div class="result-item">
              <label>Base64 Encoded:</label>
              <code class="base64-result">{encodedBase64.value}</code>
            </div>

            <div class="result-meta">
              <div>Original length: {originalEncodedText.value?.length || 0} chars</div>
              <div>Encoded length: {encodedBase64.value?.length || 0} chars</div>
              <div>Encoding ratio: ~{((encodedBase64.value?.length || 0) / (originalEncodedText.value?.length || 1) * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div class="actions">
            <button
              onClick={() => navigator.clipboard.writeText(encodedBase64.value)}
              class="copy-btn"
            >
              Copy Base64
            </button>

            <button
              onClick={() => {
                const url = `data:text/plain;base64,${encodedBase64.value}`
                const a = document.createElement('a')
                a.href = url
                a.download = 'base64-encoded.txt'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }}
              class="download-btn"
            >
              Download as File
            </button>
          </div>
        </section>
      )}

      {/* Debug Panel */}
      <DebugPanel title="Debug Information">
        <h4>Base64 State</h4>
        <div>Loading: {String(encodeBase64Loading.value)}</div>
        <div>Error: "{encodeBase64Error.value}"</div>
        <div>Has Result: {String(hasBase64Result.value)}</div>
        <div>Input Length: {inputText.length}</div>

        {originalEncodedText.value && (
          <>
            <h4>Data Details</h4>
            <div>Original: "{originalEncodedText.value}"</div>
            <div>Encoded: "{encodedBase64.value}"</div>
          </>
        )}
      </DebugPanel>
    </div>
  )
}
