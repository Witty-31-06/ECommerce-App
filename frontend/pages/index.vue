<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gray-100 dark:bg-gray-900 py-20">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to SidduBazar</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Your one-stop shop for everything you need.</p>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Featured Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Product Card -->
        <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Product {{ i }}</h3>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <UButton class="mt-4" color="primary">Add to Cart</UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// You can add logic here, such as fetching featured products from an API
</script>

<style scoped>
/* Add custom styles if needed */
</style>