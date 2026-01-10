// @ts-ignore
import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      // Show a prompt to the user to refresh the page
      if (confirm('New content available; please refresh.')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('App is ready to work offline')
    },
  })
}
