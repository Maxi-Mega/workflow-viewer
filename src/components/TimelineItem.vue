<script setup lang="ts">
import { Step, type IStep, BetweenStep } from "@/Steps";
import StepItem from "@/components/StepItem.vue";
import BetweenStepItem from "@/components/BetweenStepItem.vue";

const props = defineProps<{
  name: string;
  steps: Array<Step>;
}>();

// const betweenSteps = new Array<BetweepStep>();
const allSteps = new Array<IStep>(props.steps[0]);
for (let i = 1; i < props.steps.length; i++) {
  const bStep = new BetweenStep(
    props.steps[i - 1].end as Date,
    props.steps[i].start
  );
  allSteps.push(bStep, props.steps[i]);
}
</script>

<template>
  <div class="flex justify-between py-2 px-0.5 timeline">
    <div class="">
      <h3>{{ name }}</h3>
    </div>
    <template :key="id" v-for="(step, id) in allSteps">
      <BetweenStepItem
        v-if="step instanceof BetweenStep"
        :key="id + '_between'"
        :step="step"
      />
      <StepItem v-else :istep="step" />
    </template>
  </div>
</template>

<style scoped>
.timeline:not(:last-of-type) {
  border-bottom: 1px dashed gray;
}
</style>
