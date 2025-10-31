// Console Error Suppression Script
// This script suppresses harmless console errors that appear on all pages

// Suppress Permissions-Policy warnings (harmless warnings from GTM/Cookiebot)
if (console.warn) {
  const originalWarn = console.warn;
  console.warn = function(...args) {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Permissions-Policy')) {
      return; // Suppress Permissions-Policy warnings
    }
    originalWarn.apply(console, args);
  };
}

// Handle MutationObserver errors gracefully
window.addEventListener('error', function(e) {
  if (e.message && e.message.includes('MutationObserver') && e.message.includes('parameter 1 is not of type \'Node\'')) {
    e.preventDefault(); // Prevent error from showing in console
    return true; // Mark as handled
  }
}, true);

