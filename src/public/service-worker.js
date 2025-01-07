const CACHE_NAME = 'simple-login-cache-v7.2';
const ASSETS_TO_CACHE = [
    '/', // Root
    '/profile', // Profile page
    '/script.js', // Your main script
    '/tailwind.min.css', // Tailwind CSS file
    '/manifest.json', // Manifest file
    '/favicon.ico', // Favicon
    '/icons/vbc-180.png', // Icon for PWA
    '/icons/vbc-192.png', // Icon for PWA
    '/icons/vbc-512.png', // Icon for PWA
    '/icons/vbc-720.png', // Screenshot
    '/icons/vbc-1280.png', // Screenshot
    '/profile-pic.png' // Profile picture
];

// Install Event: Cache Assets
self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
                console.error('Failed to cache assets:', error);
            });
        })
    );
    self.skipWaiting(); // Activates the worker immediately
});

// Activate Event: Clean Up Old Caches
self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Ensures that the SW takes control immediately
});

// Fetch Event: Serve Cached Assets
self.addEventListener('fetch', (event) => {
    // console.log('Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Serve from cache if available
            if (cachedResponse) {
                // console.log('Serving from cache:', event.request.url);
                return cachedResponse;
            }

            // Fetch from network if not cached
            return fetch(event.request)
                .then((networkResponse) => {
                    if (event.request.url.includes('/profile')) {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    }
                    return networkResponse;
                })
                .catch((error) => {
                    console.error('Fetch failed:', error);
                });
        })
    );
});
