<script setup lang="ts">
import { type IStep, BetweenStep, Step, StepUtils } from "@/Steps";
import StepItem from "@/components/StepItem.vue";
import BetweenStepItem from "@/components/BetweenStepItem.vue";
import { onMounted, ref, watch } from "vue";
import type { Timeline } from "@/Timeline";

const props = defineProps<{
  timeline: Timeline;
  originTime: Date;
  endTime: Date;
}>();

const steps = ref(new Array<Step>());
const endTime = ref(new Date());
const allSteps = ref(new Array<IStep>());

function setValues(newProps: typeof props) {
  steps.value = StepUtils.sortSteps(newProps.timeline.steps);
  endTime.value = newProps.endTime;
  allSteps.value = [];
  if ((steps.value[0].startPending as Date) > newProps.originTime) {
    // Add a BetweenStep before the first Step to fill the gap between the originTime and the start of the first Step
    console.info("First step:", steps.value[0].startPending);
    allSteps.value.push(
      new BetweenStep(newProps.originTime, steps.value[0].startPending as Date)
    );
  }
  allSteps.value.push(steps.value[0]);
  for (let i = 1; i < steps.value.length; i++) {
    const previousStep = steps.value[i - 1];
    const previousEnd = previousStep.isActive()
      ? previousStep.endActive || previousStep.startActive
      : previousStep.endPending || previousStep.startPending;
    const currentStep = steps.value[i];
    const currentStart = currentStep.isActive()
      ? currentStep.startActive || currentStep.endPending
      : currentStep.startPending;

    const bStep = new BetweenStep(previousEnd as Date, currentStart as Date);
    allSteps.value.push(bStep, steps.value[i]);
  }
  const lastStep = steps.value[steps.value.length - 1];
  if (lastStep.getCurrentEndTime() < endTime.value) {
    // Add a BetweenStep after the last Step to fill the gap between the end of the last Step and the endTime
    allSteps.value.push(
      new BetweenStep(lastStep.getCurrentEndTime(), endTime.value)
    );
  }

  let sum =
    allSteps.value.reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue.getTotalDuration(endTime.value),
      0
    ) / 1000;
  console.info("Timeline duration:", sum + "s");
}

watch(props, setValues);

onMounted(() => setValues(props));
</script>

<template>
  <div class="flex justify-between py-2 px-1 timeline">
    <div class="absolute top-0 left-1">
      <h3 id="timeline-name">{{ timeline.name }}</h3>
    </div>
    <template :key="id" v-for="(step, id) in allSteps">
      <BetweenStepItem
        v-if="step.isBetween()"
        :key="id + '_between'"
        :istep="step"
        :origin="originTime"
        :endTime="endTime"
      />
      <StepItem v-else :istep="step" :origin="originTime" :endTime="endTime" />
    </template>
  </div>
</template>

<style scoped>
.timeline:not(:last-of-type) {
  border-bottom: 1px dashed gray;
}

#timeline-name {
  font-size: 13px;
}
</style>
