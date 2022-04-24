<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  errors: Array<string>;
}>();
console.info("Errors:", props.errors);
const s = ref(props.errors.length > 1 ? "s" : "");
</script>

<template>
  <div class="p-5 my-10 mx-auto w-max bg-red-700 rounded-md">
    <h3 class="font-bold">Error{{ s }}:</h3>
    <ul class="pl-7 list-disc">
      <li v-for="(error, id) in errors" :key="id">{{ error }}</li>
    </ul>
  </div>
</template>

<style scoped></style>
