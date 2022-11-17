/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP: string;
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_DEBUG: boolean;

  readonly VITE_TRPC_URL_HTTP: string;
  readonly VITE_TRPC_URL_WS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
