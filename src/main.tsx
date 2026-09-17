import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/global/ErrorBoundary'
import 'lenis/dist/lenis.css'
import './index.css'

// Browsers may keep focus on a button after a pointer click. Track the user's
// actual input method so a focus ring appears for keyboard navigation only,
// while remaining intact for accessibility and forced-colour modes.
const inputRoot = document.documentElement
inputRoot.dataset.inputModality = 'pointer'

document.addEventListener(
  'keydown',
  (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return
    inputRoot.dataset.inputModality = 'keyboard'
  },
  true,
)

document.addEventListener(
  'pointerdown',
  () => {
    inputRoot.dataset.inputModality = 'pointer'
  },
  true,
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
