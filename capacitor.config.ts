import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.edunplugged.beta',
  appName: 'ED Unplugged AI',
  webDir: 'dist',
  server: { androidScheme: 'http', cleartext: true },
};
export default config;
