import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.kharchay',
  appName: 'kharchay',
  webDir: 'dist/kharchay/browser',
  plugins: {
    SystemBars: {
      insetsHandling: 'disable'
    }
  }
};

export default config;
