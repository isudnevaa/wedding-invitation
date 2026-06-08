/**
 * Service Worker for Wedding Invitation PWA
 * Provides offline functionality and caching strategies
 */

const CACHE_NAME = 'wedding-invitation-v1';
const OFFLINE_CACHE = 'wedding-offline-v1';

// Assets to cache on install
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/animations.css',
    '/css/responsive.css',
    '/js/utils.js',
    '/js/particles.js',
    '/js/animations.js',
    '/js/countdown.js',
    '/js/music.js',
    '/js/rsvp.js',
    '/js/main.js',
    '/manifest.json',
    '/assets/images/icon-192.png',
    '/assets/images/icon-512.png'
];

// Offline fallback page
const OFFLINE_FALLBACK = '/offline.html';

/**
 * Install event - cache critical assets
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                console.log('[SW] App shell cached');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('[SW] Cache failed:', error);
            })
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches
                        if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Service worker activated');
                return self.clients.claim(); // Take control immediately
            })
    );
});

/**
 * Fetch event - serve from cache with network fallback
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle POST requests (like RSVP form)
    if (request.method === 'POST') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone response before returning
                    return response.clone();
                })
                .catch((error) => {
                    console.error('[SW] POST request failed:', error);
                    // Return a failed response
                    return new Response(JSON.stringify({ error: 'Network error' }), {
                        headers: { 'Content-Type': 'application/json' },
                        status: 0
                    });
                })
        );
        return;
    }

    // Handle GET requests with cache strategies
    event.respondWith(handleRequest(request));
});

/**
 * Handle different request types with appropriate strategies
 */
async function handleRequest(request) {
    const url = new URL(request.url);

    // Same origin requests
    if (url.origin === self.location.origin) {
        // HTML pages - Network First, then Cache
        if (request.destination === 'document') {
            return await networkFirstStrategy(request);
        }

        // CSS and JS - Cache First, then Network
        if (request.url.match(/\.(css|js)$/)) {
            return await cacheFirstStrategy(request);
        }

        // Images - Cache First, then Network
        if (request.destination === 'image') {
            return await cacheFirstStrategy(request);
        }

        // Other assets - Cache First
        return await cacheFirstStrategy(request);
    }

    // External requests (like Google Fonts)
    // Use Cache First with network timeout
    return await staleWhileRevalidateStrategy(request);
}

/**
 * Cache First Strategy
 * Serves from cache, falls back to network
 */
async function cacheFirstStrategy(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        // Try cache first
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url);
            // Update cache in background
            fetch(request).then((response) => {
                if (response.ok) {
                    cache.put(request, response.clone());
                }
            }).catch(() => {
                // Ignore network errors
            });

            return cachedResponse;
        }

        // Not in cache, fetch from network
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            console.log('[SW] Caching new resource:', request.url);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache First failed:', error);
        return await getOfflineFallback(request);
    }
}

/**
 * Network First Strategy
 * Tries network first, falls back to cache
 */
async function networkFirstStrategy(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        // Try network first
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // Update cache
            cache.put(request, networkResponse.clone());
            console.log('[SW] Network response, caching:', request.url);
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);

        // Network failed, try cache
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Nothing in cache, return offline fallback
        return await getOfflineFallback(request);
    }
}

/**
 * Stale While Revalidate Strategy
 * Serves from cache immediately, then updates cache from network
 */
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(CACHE_NAME);

    const cachedResponse = await cache.match(request);

    // Fetch in background to update cache
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch((error) => {
        console.log('[SW] Background fetch failed:', error);
    });

    // Return cached response immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }

    // If no cache, wait for network
    return await fetchPromise;
}

/**
 * Get offline fallback response
 */
async function getOfflineFallback(request) {
    // For HTML requests, serve offline page
    if (request.destination === 'document') {
        const cache = await caches.open(OFFLINE_CACHE);
        const offlinePage = await cache.match(OFFLINE_FALLBACK);

        if (offlinePage) {
            return offlinePage;
        }

        // Return a basic offline response
        return new Response(
            '<html><body><h1>Вы оффлайн</h1><p>Проверьте подключение к интернету.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
        );
    }

    // For images, return a placeholder
    if (request.destination === 'image') {
        return new Response(
            '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Изображение недоступно</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }

    // For other requests, return error response
    return new Response('Offline', { status: 503 });
}

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }

    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        let totalSize = 0;

        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
        }

        event.ports[0].postMessage({ size: totalSize });
    }
});

/**
 * Push notification (optional - for future use)
 */
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Уведомление о свадьбе',
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/icon-96.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        },
        actions: [
            {
                action: 'open',
                title: 'Открыть',
                icon: '/assets/images/icon-96.png'
            },
            {
                action: 'close',
                title: 'Закрыть',
                icon: '/assets/images/icon-96.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Свадьба Ирины и Дмитрия', options)
    );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
    } else {
        // Default action - open app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Background sync (for RSVP form when offline)
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'rsvp-sync') {
        event.waitUntil(syncRSVPData());
    }
});

/**
 * Sync RSVP data when back online
 */
async function syncRSVPData() {
    // Get pending RSVP data from IndexedDB
    // This would integrate with a more complex offline-first solution
    console.log('[SW] Syncing RSVP data...');

    // Implementation would go here
    // For now, this is a placeholder
}

/**
 * Periodic background sync (optional)
 */
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'countdown-update') {
        event.waitUntil(updateCountdown());
    }
});

async function updateCountdown() {
    // Could fetch updated countdown data if needed
    console.log('[SW] Updating countdown...');
}

console.log('[SW] Service Worker loaded');
