import './DebugPanel.css'

interface DebugPanelProps {
  title: string
  children: any
}

export function DebugPanel({ title, children }: DebugPanelProps) {
  return (
    <details class="debug-panel">
      <summary>{title}</summary>
      <div class="debug-content">
        {children}
      </div>
    </details>
  )
}
