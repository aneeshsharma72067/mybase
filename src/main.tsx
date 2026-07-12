import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initDataEncryptionFlag } from './lib/encryptedStorage'

initDataEncryptionFlag('mybase-settings')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register the service worker for offline support and installability. Scoped to
// the Vite base path so it works under GitHub Pages (/mybase/). Dev is skipped
// to avoid the SW interfering with HMR.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.error('Service worker registration failed:', error)
    })
  })
}
