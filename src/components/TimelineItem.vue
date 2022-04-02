<script setup lang="ts">
const props = defineProps<{
  steps: Record<string, Record<string, string>>;
}>();

class Step {
  public start: Date;
  public end: Date | undefined;

  constructor(stepName: string, rawStep: Record<string, string>) {
    this.start = new Date(rawStep.start);
    // eslint-disable-next-line no-prototype-builtins
    if (rawStep.hasOwnProperty("end")) {
      this.end = new Date(rawStep.end);
    }
  }
}

const steps = new Array<Step>();
for (const s in props.steps) {
  steps.push(new Step(s, props.steps[s] as Record<string, string>));
}
const beginingTime = steps.reduce((min: Date, step: Step) => {
  return step.start < min ? step.start : min;
}, new Date());
</script>

<template>
  <h1>{{ beginingTime }}</h1>
  <div v-for="(step, id) in steps" v-bind:key="id">
    <h3>
      {{ step.start }}<span v-if="step.end"> &rarr; {{ step.end }}</span>
    </h3>
  </div>
</template>

<style scoped></style>
