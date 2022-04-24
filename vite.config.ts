import { fileURLToPath, URL } from "url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  // setEnv(env);
  const promBaseUrl = env.VITE_PROMETHEUS_BASE_URL;
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 8080,
      proxy: {
        "/prometheus_target": {
          target: promBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/prometheus_target/, ""),
          timeout: 1000,
          proxyTimeout: 5000,
        },
      },
    },
  };
});
