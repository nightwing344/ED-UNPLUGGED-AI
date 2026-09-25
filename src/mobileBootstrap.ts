import { Capacitor } from '@capacitor/core';
// The app already calls /api/... . A packaged WebView has another origin.
if (Capacitor.isNativePlatform()) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/'))
      input = `http://127.0.0.1:3000${input}`;
    else if (input instanceof URL && input.pathname.startsWith('/api/'))
      input = new URL(`${input.pathname}${input.search}`, 'http://127.0.0.1:3000');
    return originalFetch(input, init);
  }) as typeof window.fetch;
}
