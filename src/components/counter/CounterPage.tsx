import { count, doubleCount } from '../../store'

export function CounterPage() {
  return (
    /* Counter section demonstrating basic reactive state */
    <div class="card">
      <button onClick={() => count.value += 1}>
        count is {count.value}
      </button>
      <p>
        Edit <code>src/components/App.tsx</code> and save to test HMR
      </p>
      <p>
        Double count: {doubleCount.value}
      </p>
    </div>
  )
}
