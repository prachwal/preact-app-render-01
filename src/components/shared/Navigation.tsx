import { memo } from 'preact/compat'

interface NavigationProps {
  currentPage: 'counter' | 'hello' | 'base64'
  setCurrentPage: (page: 'counter' | 'hello' | 'base64') => void
}

export const Navigation = memo(function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  return (
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
  )
})
