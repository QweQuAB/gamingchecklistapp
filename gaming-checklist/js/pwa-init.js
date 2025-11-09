/*
  ============================================
  PWA INITIALIZATION
  ============================================
  
  This file handles:
  - Service Worker registration
  - Install prompt
  - Update notifications
  - Online/offline detection
  
  ============================================
*/

(function() {
  'use strict';
  
  let deferredPrompt = null;
  
  // ==================== REGISTER SERVICE WORKER ====================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('✅ Service Worker registered:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          });
          
          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, APP_CONFIG.PWA.UPDATE_CHECK_INTERVAL);
        })
        .catch(error => {
          console.log('❌ Service Worker registration failed:', error);
        });
    });
  }
  
  
  // ==================== INSTALL PROMPT ====================
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    
    // Save the event for later use
    deferredPrompt = e;
    
    // Check if user dismissed recently
    const dismissed = localStorage.getItem(APP_CONFIG.STORAGE.INSTALL_DISMISSED_KEY);
    const dismissTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismiss = (Date.now() - dismissTime) / (1000 * 60 * 60 * 24);
    
    // Show prompt after delay if not recently dismissed
    if (daysSinceDismiss > APP_CONFIG.UI.INSTALL_PROMPT_COOLDOWN) {
      setTimeout(() => {
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt) {
          installPrompt.classList.add('show');
        }
      }, APP_CONFIG.UI.INSTALL_PROMPT_DELAY);
    }
  });
  
  
  // ==================== INSTALL BUTTON ====================
  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        console.log('No install prompt available');
        return;
      }
      
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      
      // Clear the prompt
      deferredPrompt = null;
      
      // Hide the prompt UI
      const installPrompt = document.getElementById('installPrompt');
      if (installPrompt) {
        installPrompt.classList.remove('show');
      }
    });
  }
  
  
  // ==================== DISMISS BUTTON ====================
  const dismissBtn = document.getElementById('dismissBtn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      // Hide the prompt
      const installPrompt = document.getElementById('installPrompt');
      if (installPrompt) {
        installPrompt.classList.remove('show');
      }
      
      // Save dismiss time
      localStorage.setItem(
        APP_CONFIG.STORAGE.INSTALL_DISMISSED_KEY, 
        Date.now().toString()
      );
      
      console.log('Install prompt dismissed');
    });
  }
  
  
  // ==================== APP INSTALLED ====================
  window.addEventListener('appinstalled', () => {
    console.log('✅ App installed successfully');
    
    // Hide the prompt
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
      installPrompt.classList.remove('show');
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
    
    // Optional: Show thank you message
    alert('🎉 Thanks for installing the app!');
  });
  
  
  // ==================== CHECK IF ALREADY INSTALLED ====================
  window.addEventListener('load', () => {
    // Check if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('✅ Running as installed PWA');
      
      // Hide install prompt if showing
      const installPrompt = document.getElementById('installPrompt');
      if (installPrompt) {
        installPrompt.classList.remove('show');
      }
    }
    
    // Check iOS standalone mode
    if (('standalone' in window.navigator) && window.navigator.standalone) {
      console.log('✅ Running as iOS web app');
    }
  });
  
  
  // ==================== ONLINE/OFFLINE DETECTION ====================
  window.addEventListener('online', () => {
    console.log('🌐 Back online');
    
    // Optional: Show notification
    const notification = document.createElement('div');
    notification.textContent = '🌐 Back online';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 99999;
      font-weight: bold;
      animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  });
  
  window.addEventListener('offline', () => {
    console.log('📡 You are offline');
    
    // Optional: Show notification
    const notification = document.createElement('div');
    notification.textContent = APP_CONFIG.PWA.OFFLINE_MESSAGE;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ef4444;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 99999;
      font-weight: bold;
      animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    // Keep showing until back online
    window.addEventListener('online', () => {
      notification.remove();
    }, { once: true });
  });
  
  
  // ==================== PREVENT PULL-TO-REFRESH ====================
  let touchStartY = 0;
  
  document.body.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  document.body.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchStartY;
    
    // Prevent pull-to-refresh if at top of page and pulling down
    if (touchDiff > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
  
  console.log('PWA initialization complete');
  
})();

/*
  ============================================
  HOW THIS FILE WORKS:
  ============================================
  
  1. Registers service worker on page load
  2. Listens for install prompt event
  3. Shows install prompt after delay
  4. Handles install/dismiss button clicks
  5. Detects online/offline status
  6. Prevents pull-to-refresh on mobile
  
  ============================================
  CUSTOMIZATION:
  ============================================
  
  Change prompt delay:
  - Edit APP_CONFIG.UI.INSTALL_PROMPT_DELAY in config.js
  
  Change cooldown period:
  - Edit APP_CONFIG.UI.INSTALL_PROMPT_COOLDOWN in config.js
  
  Disable install prompt:
  - Comment out the beforeinstallprompt listener
  
  Customize online/offline messages:
  - Edit notification.textContent in event listeners
  
  Disable pull-to-refresh prevention:
  - Comment out touchstart/touchmove listeners
  
  ============================================
  TROUBLESHOOTING:
  ============================================
  
  Install prompt not showing?
  - Check if app is already installed
  - Check if dismissed recently
  - Make sure HTTPS is enabled
  - Check browser console for errors
  
  Service worker not registering?
  - Check file path is correct
  - Make sure service-worker.js exists
  - Check browser console for errors
  - Try clearing browser cache
  
  ============================================
*/