
// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((reg) => {
      if (reg.installing) {
        console.log('Service worker installing.');
      } else if (reg.waiting) {
        console.log('Service worker installed and waiting.');
      } else if (reg.active) {
        console.log('Service worker already active.');
      }
    })
    .catch((err) => console.error('Service worker registration failed:', err));
} else {
  console.warn('Service workers are not supported in this browser.');
}

// Listen for the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event triggered');
});


