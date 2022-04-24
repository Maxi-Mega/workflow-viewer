<script setup lang="ts">
import type { BetweenStep } from "@/Steps";

const props = defineProps<{
  step: BetweenStep;
}>();
</script>

<template>
  <div>{{ step.getDuration() }}</div>
</template>

<style scoped></style>
