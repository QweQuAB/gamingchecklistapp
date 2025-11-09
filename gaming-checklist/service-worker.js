/*
  ============================================
  SERVICE WORKER
  ============================================
  
  This file enables offline functionality.
  It caches files so the app works without internet.
  
  IMPORTANT: This file must be in the ROOT folder,
  not in the js/ folder!
  
  ============================================
*/

const CACHE_NAME = 'gaming-checklist-v1';

// Files to cache immediately on install
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/config.js',
  '/js/data.js',
  '/js/storage.js',
  '/js/icons.js',
  '/js/ui-components.js',
  '/js/game-card.js',
  '/js/features.js',
  '/js/app.js',
  '/js/pwa-init.js',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// ==================== INSTALL EVENT ====================
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: All files cached');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed:', error);
      })
  );
});


// ==================== ACTIVATE EVENT ====================
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('Service Worker: Clearing old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});


// ==================== FETCH EVENT ====================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (CDN, etc.)
  const url = new URL(request.url);
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    // Try cache first
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        console.log('Service Worker: Fetching from network:', request.url);
        return fetch(request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response (can only read once)
            const responseToCache = response.clone();
            
            // Cache the new response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
                console.log('Service Worker: Cached new file:', request.url);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed:', error);
            
            // Return offline page if available
            return caches.match('/index.html');
          });
      })
  );
});


// ==================== MESSAGE EVENT ====================
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME)
        .then(() => {
          console.log('Service Worker: Cache cleared');
          event.ports[0].postMessage({ success: true });
        })
    );
  }
});


// ==================== BACKGROUND SYNC (OPTIONAL) ====================
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync:', event.tag);
  
  if (event.tag === 'sync-games') {
    event.waitUntil(
      // Add your sync logic here
      Promise.resolve()
        .then(() => {
          console.log('Service Worker: Sync complete');
        })
    );
  }
});


// ==================== PUSH NOTIFICATIONS (OPTIONAL) ====================
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Gaming Checklist';
  const options = {
    body: data.body || 'New notification',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-192.png',
    vibrate: [200, 100, 200],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


// ==================== NOTIFICATION CLICK ====================
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});


console.log('Service Worker: Loaded');

/*
  ============================================
  HOW THIS FILE WORKS:
  ============================================
  
  1. INSTALL: Caches all app files
  2. ACTIVATE: Cleans up old caches
  3. FETCH: Serves files from cache, falls back to network
  4. MESSAGE: Handles commands from app
  5. SYNC: Handles background sync (optional)
  6. PUSH: Handles push notifications (optional)
  
  ============================================
  CUSTOMIZATION:
  ============================================
  
  Change cache name (for updates):
  - Edit CACHE_NAME (e.g., 'gaming-checklist-v2')
  - This forces re-caching all files
  
  Add files to cache:
  - Add paths to urlsToCache array
  
  Change caching strategy:
  - Edit fetch event handler
  - Options: cache-first, network-first, cache-only
  
  Disable caching for specific files:
  - Add conditions in fetch event
  
  Enable background sync:
  - Implement logic in sync event
  
  Enable push notifications:
  - Implement backend for sending pushes
  
  ============================================
  TROUBLESHOOTING:
  ============================================
  
  App not working offline:
  - Check if service worker is registered
  - Check browser console for errors
  - Make sure all files are in urlsToCache
  - Try clearing cache and re-registering
  
  Old version still showing:
  - Increment CACHE_NAME version
  - Clear browser cache
  - Unregister old service worker
  
  Files not updating:
  - Service worker caches files forever
  - Change CACHE_NAME to force update
  - Or clear cache manually
  
  ============================================
  TESTING:
  ============================================
  
  Test offline mode:
  1. Open app in browser
  2. Open DevTools (F12)
  3. Go to Application > Service Workers
  4. Check "Offline" checkbox
  5. Reload page
  6. App should still work!
  
  Clear cache:
  1. Open DevTools
  2. Application > Storage
  3. Click "Clear site data"
  4. Reload page
  
  ============================================
  FILE LOCATION:
  ============================================
  
  This file MUST be in the root folder:
  
  ✅ CORRECT:
  /service-worker.js
  
  ❌ WRONG:
  /js/service-worker.js
  
  If in wrong location, it won't work!
  
  ============================================
*/