<script setup lang="ts">
import type { IStep } from "@/Steps";
import type { Step } from "@/Steps";

const props = defineProps<{
  istep: IStep;
}>();

const step = props.istep as Step;
</script>

<template>
  <div class="px-5 border-1 border-b-white border-solid">
    <h1>{{ step.name }}</h1>
  </div>
</template>

<style scoped>
.border-1 {
  border-width: 1px;
}
</style>
