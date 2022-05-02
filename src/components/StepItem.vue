<script setup lang="ts">
import type { IStep } from "@/Steps";
import type { Step } from "@/Steps";
import { onMounted, ref, watch } from "vue";

const pendingColor = "#153f6f";
const activeColor = "#2989d8";

function calcPendingProportion(step: Step, endTime: Date): number {
  if (step.endPending === undefined || step.startActive === undefined) {
    return 100;
  }
  return (
    (step.getPendingDuration(endTime) / step.getTotalDuration(endTime)) * 100
  );
}

const props = defineProps<{
  istep: IStep;
  origin: Date;
  endTime: Date;
}>();

const step = ref(props.istep as Step);
const totalDuration = ref(0);
const width = ref(0);
const pendingProportion = ref(0);
const pP = ref(0);
const gradient = ref("");
const style = ref("");
const title = ref("");

function setValues(newProps: typeof props) {
  step.value = newProps.istep as Step;
  totalDuration.value = newProps.endTime.getTime() - newProps.origin.getTime();
  width.value =
    (step.value.getTotalDuration(newProps.endTime) * 100) / totalDuration.value;
  if (width.value < 1) {
    width.value = 1;
  }
  pendingProportion.value = calcPendingProportion(step.value, newProps.endTime);
  pP.value = pendingProportion.value * 2;
  gradient.value = `background: -webkit-linear-gradient(left, ${pendingColor} ${pendingProportion.value}%, ${activeColor} 0%);
background: -moz-linear-gradient(left, ${pendingColor} ${pendingProportion.value}%, ${activeColor} 0%);
background: -ms-linear-gradient(left, ${pendingColor} ${pendingProportion.value}%, ${activeColor} 0%);
background: linear-gradient(left, ${pendingColor} ${pendingProportion.value}%, ${activeColor} 0%);`;
  style.value = `width: ${width.value}%; ${gradient.value}`;
  title.value = `${step.value.name}\nPending duration: ${
    step.value.getPendingDuration(props.endTime) / 1000
  } s\nActive duration: ${
    step.value.getActiveDuration(props.endTime) / 1000
  } s`;
}

watch(props, setValues);

onMounted(() => setValues(props));
</script>

<template>
  <div
    class="mt-3 h-4 border-b-white border-solid border-1"
    :style="style"
    :title="title"
  >
    <!--    <h1
      id="step-title"
      class="text-white"
      :title="'Pending proportion: ' + pP / 2 + '%'"
    >
      {{ step.name }}
    </h1>-->
  </div>
</template>

<style scoped>
#step-title {
  white-space: nowrap;
  line-break: anywhere;
  font-size: 13px;
}
</style>
