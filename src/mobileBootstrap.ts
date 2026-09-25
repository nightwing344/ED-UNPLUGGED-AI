import { Capacitor } from '@capacitor/core';

// Keep the APK's web assets inside the APK; forward only API requests to Termux.
if (Capacitor.isNativePlatform()) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/'))
      input = `http://127.0.0.1:3000${input}`;
    else if (input instanceof URL && input.pathname.startsWith('/api/'))
      input = new URL(`${input.pathname}${input.search}`, 'http://127.0.0.1:3000');
    return nativeFetch(input, init);
  }) as typeof window.fetch;
}
