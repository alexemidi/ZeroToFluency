export const ADMIN_EMAIL = 'almeidaalex.cs@gmail.com';

export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
}

export function readFirebaseConfig(): FirebaseWebConfig | null {
  const env = import.meta.env;
  const config = {
    apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    appId: env.VITE_FIREBASE_APP_ID as string | undefined,
  };
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    return null;
  }
  return config as FirebaseWebConfig;
}
