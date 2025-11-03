/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string; // 'development' | 'production'
  // readonly VITE_API_URL: string;
  // readonly VITE_BASENAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
