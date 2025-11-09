(function () {
  /**
   * pwa-init.js
   * Registers service worker and captures install prompt to show custom button
   *
   * Exposes window.pwaInstallPrompt (the beforeinstallprompt event) so app.js can use it.
   */

  if (!("serviceWorker" in navigator)) {
    console.info("Service workers not supported in this browser.");
  } else {
    window.addEventListener("load", () => {
      const swPath = "/service-worker.js";
      navigator.serviceWorker.register(swPath).then((reg) => {
        console.log("Service worker registered:", reg.scope);
      }).catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
    });
  }

  // capture the beforeinstallprompt
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    window.pwaInstallPrompt = e;
    // Reveal install button if present
    const btn = document.getElementById("gc-install-btn");
    if (btn) btn.classList.remove("gc-hidden");
    console.log("PWA install prompt captured.");
  });

  // optional: detect appinstalled
  window.addEventListener("appinstalled", (evt) => {
    console.log("PWA installed.", evt);
    const btn = document.getElementById("gc-install-btn");
    if (btn) btn.classList.add("gc-hidden");
  });
})();
