<script setup lang="ts">
import TimelineItem from "@/components/TimelineItem.vue";
import { Step } from "@/Steps";
import { onMounted, ref, watch } from "vue";
import type { PrometheusData } from "@/composables/prometheus";
import ErrorItem from "@/components/ErrorItem.vue";
import { Timeline } from "@/Timeline";

const timezoneOffsetMillis = new Date().getTimezoneOffset() * 60 * 1000;

const props = defineProps<{
  workflow_data: PrometheusData;
}>();

const timelines = ref(new Array<Timeline>());
const oldestTime = ref(new Date(Date.now() + timezoneOffsetMillis));
const endTime = ref(new Date(Date.now() + timezoneOffsetMillis - 20000000));
const totalMillis = ref(0);
const errors = ref(new Array<string>());

function setValues(newProps: typeof props) {
  timelines.value = [];
  oldestTime.value = new Date(Date.now() + timezoneOffsetMillis);
  endTime.value = new Date(Date.now() + timezoneOffsetMillis - 20000000);
  totalMillis.value = 0;
  errors.value = [];

  const starts = newProps.workflow_data?.start;
  // console.info("Starts:", starts);
  const ends = newProps.workflow_data?.end;
  // console.info("Ends:", ends);
  if (
    !starts ||
    !ends ||
    starts.status !== "success" ||
    ends.status !== "success"
  ) {
    errors.value.push("Invalid data");
    return;
  }

  const startResults = starts.data?.result;
  const endResults = ends.data?.result;
  if (!startResults || !endResults) {
    errors.value.push("No usable data");
    return;
  }

  /*console.info("Starts:", startResults);
  console.info("Ends:", endResults);*/
  for (const startResult of startResults) {
    const metric = startResult.metric;
    if (!metric || !startResult.value) {
      errors.value.push("No results available");
      return;
    }
    const datastripId = metric.datastripId;
    const task = metric.task;
    const active = metric.state === "active";
    if (!datastripId || !task) {
      errors.value.push("Metric is missing properties");
      return;
    }
    const start = startResult.value[1];
    const startDate = new Date(Number(start) + timezoneOffsetMillis);
    // console.info(datastripId, task, startDate.toISOString());
    const halfStep = (function (): Step {
      if (active) {
        return new Step(task, undefined, undefined, startDate, undefined);
      }
      if (startDate < oldestTime.value) {
        oldestTime.value = startDate;
      }
      return new Step(task, startDate, undefined, undefined, undefined);
    })();
    const timelineIndex = timelines.value.findIndex(
      (timeline) => timeline.name === datastripId
    );
    if (timelineIndex !== -1) {
      const timeline = timelines.value[timelineIndex];
      const step = timeline.getStep(task);
      if (step !== undefined) {
        // Adding start data to an existing step
        if (active) {
          step.startActive = startDate;
        } else {
          step.startPending = startDate;
        }
      } else {
        // Adding a new step to an existing timeline
        timeline.addStep(halfStep);
      }
    } else {
      // Creating a new timeline with a step
      timelines.value.push(new Timeline(datastripId, halfStep));
    }
  }

  for (const endResult of endResults) {
    const metric = endResult.metric;
    if (!metric || !endResult.value) {
      errors.value.push("No results available");
      return;
    }
    const datastripId = metric.datastripId;
    const task = metric.task;
    const active = metric.state === "active";
    if (!datastripId || !task) {
      errors.value.push("Metric is missing properties");
      return;
    }
    const end = endResult.value[1];
    const endDate = new Date(Number(end) + timezoneOffsetMillis);
    // console.info(datastripId, task, startDate.toISOString());
    const timelineIndex = timelines.value.findIndex(
      (timeline) => timeline.name === datastripId
    );
    if (timelineIndex !== -1) {
      // Adding a new step to an existing timeline
      const timeline = timelines.value[timelineIndex];
      const halfStep = timeline.getStep(task);
      if (halfStep !== undefined) {
        // Adding end data to an existing step
        if (active) {
          halfStep.endActive = endDate;
        } else {
          halfStep.endPending = endDate;
        }
      } else {
        // Step not found ...
        console.warn(
          "Start of step",
          task,
          "in timeline",
          datastripId,
          "not found !"
        );
      }
    } else {
      // What ?
      console.warn("Timeline", datastripId, "not found !");
    }
  }

  totalMillis.value = endTime.value.getTime() - oldestTime.value.getTime();

  // console.info("Timelines:", timelines);
  console.info(
    `Total time: ${Math.round(
      totalMillis.value / 1000
    )}s (oldest=${oldestTime.value.toISOString()} / endTime=${endTime.value.toISOString()})`
  );
}

watch(props, setValues);

onMounted(() => setValues(props));
</script>

<template>
  <ErrorItem
    v-if="errors.length > 0"
    :errors="errors"
    :show-retry-button="false"
  />
  <template v-else>
    <div class="py-10">
      <!-- Settings here -->
      <div id="board" class="py-0.5 mx-auto w-screen border">
        <h3 v-if="timelines.size === 0" class="text-center">
          No data at this moment !
        </h3>
        <TimelineItem
          v-else
          v-for="(timeline, id) in timelines"
          :key="id"
          :id="`timeline-${timeline.name}`"
          :timeline="timeline"
          :originTime="oldestTime"
          :endTime="endTime"
        />
      </div></div
  ></template>
</template>

<style>
@import "@/assets/workflows.scss";
</style>
