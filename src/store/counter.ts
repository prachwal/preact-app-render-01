// Counter state management using Preact Signals

import { signal } from '@preact/signals'

// Counter state - reactive signal
export const count = signal(0)

// Helper function to increment (optional, for better API)
export const incrementCount = () => {
  count.value += 1
}

// Calculate derived values
import { computed } from '@preact/signals'
export const doubleCount = computed(() => count.value * 2)
