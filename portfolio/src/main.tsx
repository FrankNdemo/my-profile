import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const renderApp = () => {
  createRoot(document.getElementById("root")!).render(<App />);
};

const clearLocalDevBrowserState = async () => {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return false;
  }

  const localhostHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
  const reloadFlagKey = "portfolio-dev-cache-reset";

  if (!localhostHosts.has(window.location.hostname)) {
    sessionStorage.removeItem(reloadFlagKey);
    return false;
  }

  let clearedBrowserState = false;

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (registrations.length > 0) {
      await Promise.all(registrations.map((registration) => registration.unregister()));
      clearedBrowserState = true;
    }
  }

  if ("caches" in window) {
    const cacheKeys = await caches.keys();

    if (cacheKeys.length > 0) {
      await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)));
      clearedBrowserState = true;
    }
  }

  if (clearedBrowserState && navigator.serviceWorker.controller && !sessionStorage.getItem(reloadFlagKey)) {
    sessionStorage.setItem(reloadFlagKey, "1");
    window.location.reload();
    return true;
  }

  sessionStorage.removeItem(reloadFlagKey);
  return false;
};

void (async () => {
  const isReloading = await clearLocalDevBrowserState();

  if (!isReloading) {
    renderApp();
  }
})();
