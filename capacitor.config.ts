import type { CapacitorConfig } from '@capacitor/cli';

// Set to true to use local development server, false for production
const useLocalServer = false;

const config: CapacitorConfig = {
  appId: 'com.helloforever.app',
  appName: 'HelloForever',
  webDir: 'out',
  server: useLocalServer ? {
    // Development: Point to local Next.js server
    url: 'http://10.0.2.2:3000', // Android emulator localhost alias
    cleartext: true,
  } : {
    // Production: Point to live Vercel deployment
    url: 'https://helloforever-main.vercel.app',
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      spinnerColor: '#3b82f6',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'HelloForever',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
