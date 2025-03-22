<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <button @click="prevMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
        &lt;
      </button>
      <span class="font-semibold">{{ currentMonth }} {{ currentYear }}</span>
      <button @click="nextMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
        &gt;
      </button>
    </div>
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="day in daysInMonth"
        :key="day"
        :class="[
          'text-center p-2 rounded',
          isSelected(day) ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700',
        ]"
        @click="selectDate(day)"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);

const currentMonth = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' });
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
});

const isSelected = (day: number) => {
  if (!selectedDate.value) return false;
  const selectedYear = selectedDate.value.getFullYear();
  const selectedMonth = selectedDate.value.getMonth();
  const selectedDay = selectedDate.value.getDate();
  return (
    selectedYear === currentDate.value.getFullYear() &&
    selectedMonth === currentDate.value.getMonth() &&
    selectedDay === day
  );
};

const selectDate = (day: number) => {
  selectedDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day
  );
};

const prevMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
};

const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
};
</script>