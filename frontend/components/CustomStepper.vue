<template>
    <div class="flex justify-between items-center mb-8">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="[
          'flex items-center space-x-2 cursor-pointer',
          currentStep === index + 1 ? 'text-primary-500 font-bold' : 'text-gray-500',
        ]"
        @click="currentStep = index + 1"
      >
        <span>{{ index + 1 }}.</span>
        <span>{{ step.title }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    steps: {
      type: Array as () => { title: string; description?: string; icon?: string }[],
      required: true,
    },
    currentStep: {
      type: Number,
      required: true,
    },
  });
  </script>