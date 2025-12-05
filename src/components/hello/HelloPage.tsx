import { apiMessage, apiLoading, apiError, hasApiData, hasApiError, apiStatus, debugging, fetchHelloMessage } from '../../store'
import { DebugPanel } from '../shared'
import './HelloPage.css'

export function HelloPage() {
  return (
    /* API section demonstrating reactive API integration */
    <div class="card">
      <button onClick={fetchHelloMessage} disabled={apiLoading.value}>
        {apiLoading.value ? 'Loading...' : 'Call API'}
      </button>

      {/* Comprehensive Debug Info - Real-time API state visualization */}
      <DebugPanel title="Debug State">
        <div><strong>Loading:</strong> {String(apiLoading.value)}</div>
        <div><strong>Error:</strong> "{apiError.value}"</div>
        <div><strong>Message:</strong> "{apiMessage.value}"</div>
        <div><strong>Has Data:</strong> {String(hasApiData.value)}</div>
        <div><strong>Has Error:</strong> {String(hasApiError.value)}</div>
        <div><strong>Status:</strong> {apiStatus.value}</div>
        <div><strong>Data Value:</strong> {JSON.stringify(debugging.helloMessageState.data.value)}</div>
      </DebugPanel>

      {/* Conditional rendering of API results - only shown when data exists */}
      {apiMessage.value && apiMessage.value.trim() && (
        <p>
          API Response: <code>{apiMessage.value}</code>
        </p>
      )}

      {/* Conditional rendering of errors - only shown when error exists */}
      {apiError.value && apiError.value.trim() && (
        <p class="error-message">
          Error: {apiError.value}
        </p>
      )}
    </div>
  )
}
