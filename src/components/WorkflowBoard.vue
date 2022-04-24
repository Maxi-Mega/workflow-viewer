<script setup lang="ts">
import TimelineItem from "@/components/TimelineItem.vue";
import { Step } from "@/Steps";
import { ref } from "vue";

const props = defineProps<{
  workflow_data: Record<string, Record<string, Record<string, string>>>; // sans doute pas comme ça en fait
}>();

const timelines = ref(new Map<string, Array<Step>>());

for (const t in props.workflow_data) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  const rawSteps = props.workflow_data[t]; // whut
  const steps = new Array<Step>();
  for (const s in rawSteps) {
    steps.push(new Step(s, rawSteps[s] as Record<string, string>));
  }
  timelines.value.set(t, steps);
}

/*const beginingTime = stepsObjs.reduce((min: Date, step: Step) => { // TODO: remove and get min date in above loops
  return step.start < min ? step.start : min;
}, new Date());*/
</script>

<template>
  <div class="py-10">
    <!-- Settings here -->
    <div id="board" class="mx-auto w-screen border">
      <TimelineItem
        v-for="[timeline_name, workflow_steps] in timelines"
        :key="timeline_name"
        :id="`timeline-${timeline_name}`"
        :name="timeline_name"
        :steps="workflow_steps"
      />
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/workflows.scss";
</style>
