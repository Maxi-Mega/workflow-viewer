<script setup lang="ts">
import TimelineItem from "@/components/TimelineItem.vue";

defineProps<{
  workflow_data: Record<string, Record<string, string>>; // sans doute pas comme ça en fait
}>();

class TODO {
  // TODO
}
</script>

<template>
  <div id="board">
    <TimelineItem
      v-for="(steps, id) in workflow_data"
      v-bind:key="id"
      id="id"
      :steps="steps"
    />
  </div>
</template>

<style scoped></style>
