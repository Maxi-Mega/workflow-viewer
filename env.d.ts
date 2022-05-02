/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROMETHEUS_BASE_URL: string;
  readonly VITE_START_TIME_EVENT: string;
  readonly VITE_END_TIME_EVENT: string;
  readonly VITE_INTERFACE_REFRESH_PERIOD_IN_SECONDS: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
