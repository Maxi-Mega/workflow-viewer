<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import WorkflowBoard from "@/components/WorkflowBoard.vue";
import { PrometheusData, useFetchPrometheus } from "@/composables/prometheus";
import ErrorItem from "@/components/ErrorItem.vue";
import LoadingItem from "@/components/LoadingItem.vue";
import { getEnv } from "@/env";

// new Date((Math.floor(Date.now()/100000000)*100000000)+(Math.round(Math.random()*1000000000))%100000000).toISOString()
const sampleData = ref({
  identifier1: {
    step1: {
      start: "2022-03-25T16:03:45.984",
      end: "2022-03-26T02:35:40.244Z",
    },
    step2: {
      start: "2022-03-27T12:21:18.877Z",
      end: "2022-03-27T16:16:40.244Z",
    },
    step3: {
      start: "2022-03-28T09:50:11.884Z",
    },
  },
  identifier2: {
    step2: {
      start: "2022-03-26T21:29:43.560Z",
      end: "2022-03-27T15:53:08.769Z",
    },
    step4: {
      start: "2022-03-27T16:16:25.574Z",
      end: "2022-03-27T18:58:38.567Z",
    },
  },
});

const { fetchData } = useFetchPrometheus();

const loading = ref(true);
const error = ref(false);
const errors = ref(new Array<string>());
const data: Ref<PrometheusData | null> = ref(null);

async function setValues() {
  console.info("Settings values ...");
  const result = await fetchData(new Date(Date.now())); // 1h = 3600000
  loading.value = result.loading;
  error.value = result.asErrors();
  errors.value = result.errors;
  data.value = result.data;
}

setInterval(
  setValues,
  Number(getEnv().VITE_INTERFACE_REFRESH_PERIOD_IN_SECONDS) * 1000
);

onMounted(setValues);
</script>

<template>
  <LoadingItem v-if="loading" />
  <ErrorItem
    v-if="error"
    :errors="errors"
    :show-retry-button="!loading && error"
  />
  <WorkflowBoard v-else-if="!loading" :workflow_data="data" />
</template>

<style scoped></style>
