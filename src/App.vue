<script setup lang="ts">
import { ref } from "vue";
import WorkflowBoard from "@/components/WorkflowBoard.vue";

// new Date((Math.floor(Date.now()/100000000)*100000000)+(Math.round(Math.random()*1000000000))%100000000).toISOString()
const sampleData = ref({
  identifier1: {
    step1: {
      start: "2022-03-25T16:03:45.984",
      end: "2022-03-26T02:35:40.244Z",
    },
    step2: {
      start: "2022-03-27T16:13:40.244Z",
    },
  },
  identifier2: {
    step2: {
      start: "2022-03-26T21:29:43.560Z",
      end: "2022-03-27T15:53:08.769Z",
    },
    step4: {
      start: "2022-03-27T06:16:25.574Z",
    },
  },
});
</script>

<template>
  <WorkflowBoard :workflow_data="sampleData" />
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
