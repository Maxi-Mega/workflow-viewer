<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  errors: Array<string>;
  showRetryButton: boolean;
}>();

const s = ref(props.errors.length > 1 ? "s" : "");

function retry() {
  location.reload();
}
</script>

<template>
  <div class="p-5 my-10 mx-auto w-max bg-red-700 rounded-md">
    <h3 class="font-bold text-white">Error{{ s }}:</h3>
    <ul class="pl-7 list-disc">
      <li v-for="(error, id) in errors" :key="id">{{ error }}</li>
    </ul>
    <template v-if="showRetryButton">
      <hr class="my-5 w-1/3" />
      <button
        v-on:click="retry"
        class="py-2 px-4 ml-2.5 font-bold text-white bg-red-500 hover:bg-red-400 rounded-md border-2 border-red-50 hover:border-red-100"
      >
        Retry
      </button>
    </template>
  </div>
</template>

<style scoped></style>
