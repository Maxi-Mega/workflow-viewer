import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/base.css";
import { getEnv } from "@/env";

if (checkEnv()) {
  const app = createApp(App);

  app.use(router);

  await router.isReady();

  app.mount("#app");
}

function checkEnv(): boolean {
  const env = getEnv();
  let ok = true;
  const promBaseUrl = env.VITE_PROMETHEUS_BASE_URL;
  try {
    new URL(promBaseUrl);
  } catch (TypeError) {
    console.error("Invalid Prometheus base URL:", promBaseUrl);
    ok = false;
  }

  const startTimeEvent = env.VITE_START_TIME_EVENT;
  if (!startTimeEvent) {
    console.error("No start time event specified.");
    ok = false;
  }
  const endTimeEvent = env.VITE_END_TIME_EVENT;
  if (!endTimeEvent) {
    console.error("No end time event specified.");
    ok = false;
  }

  const refreshPeriod = Number(env.VITE_INTERFACE_REFRESH_PERIOD_IN_SECONDS);
  if (isNaN(refreshPeriod)) {
    console.error(
      "Invalid interface refresh period:",
      env.VITE_INTERFACE_REFRESH_PERIOD_IN_SECONDS
    );
    ok = false;
  } else if (refreshPeriod < 1) {
    console.error(
      "Too small interface refresh period:",
      env.VITE_INTERFACE_REFRESH_PERIOD_IN_SECONDS
    );
    ok = false;
  }

  return ok;
}
