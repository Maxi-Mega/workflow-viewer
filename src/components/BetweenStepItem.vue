<script setup lang="ts">
import type { BetweenStep, IStep } from "@/Steps";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  istep: IStep;
  origin: Date;
  endTime: Date;
}>();

const step = ref(props.istep as BetweenStep);
const totalDuration = ref(0);
const width = ref(0);
const style = ref("");

function setValues(newProps: typeof props) {
  totalDuration.value = step.value.getTotalDuration(newProps.endTime);
  width.value =
    (step.value.getTotalDuration(newProps.endTime) * 100) / totalDuration.value;
  if (width.value < 0) {
    width.value = 0;
  }
  style.value = `width: ${width.value}%;`;
}

watch(props, setValues);

onMounted(() => setValues(props));
</script>

<template>
  <div class="self-center mt-3 text-center" :style="style">
    {{ totalDuration / 1000 }}s
  </div>
</template>

<style scoped></style>
