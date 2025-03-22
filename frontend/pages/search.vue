<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Sort Dropdown -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <span class="text-gray-600">Sort by:</span>
        <USelect
          v-model="sortBy"
          :options="[
            { value: 'price', label: 'Price' },
            { value: 'rating', label: 'Rating' },
          ]"
          class="w-32"
        />
        <UButton
          @click="toggleSortOrder"
          variant="ghost"
          class="p-2"
        >
          <UIcon :name="sortOrder === 'asc' ? 'i-heroicons-arrow-up' : 'i-heroicons-arrow-down'" />
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <UButton loading size="xl" />
    </div>

    <!-- No Results Found -->
    <div v-else-if="results.length === 0" class="text-center py-8">
      <p class="text-gray-600">No results found.</p>
    </div>

    <!-- Search Results -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="result in sortedResults"
        :key="result.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateToProduct(result.id)"
      >
        <img :src="result.image" :alt="result.title" class="w-full h-48 object-cover rounded-t-lg" />
        <div class="p-4">
          <h2 class="font-semibold text-lg">{{ result.title }}</h2>
          <div class="mt-2">
            <p class="text-gray-500 line-through">${{ result.price }}</p>
            <p class="text-xl font-semibold text-gray-900">
              ${{ (result.price * (1 - (result.discount / 100))).toFixed(2) }}
            </p>
          </div>
          <div class="flex items-center mt-2">
            <span class="text-yellow-500">★</span>
            <span class="ml-2 text-gray-700">{{ result.rating }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script  setup>
import { useMySearchStore } from '#imports';
// import {useRou}
const route = useRoute();
const router = useRouter()
const searchStore = useMySearchStore();
const searchTerm = ref(route.query.q || "");

const sortBy = ref('price'); // Default sort by price
const sortOrder = ref('asc'); // Default sort order

const results = ref([]);
const error = ref(null);
const loading = ref(true);


try {
  const response = await searchStore.searchProducts(searchTerm.value);
  results.value = response.results; 
  error.value = response.error; 
} catch (err) {
  error.value = err.message;
} finally {
  loading.value = false; 
}


const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

const sortedResults = computed(() => {
  return results.value.slice().sort((a, b) => {
    if (sortBy.value === 'price') {
      return sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortBy.value === 'rating') {
      return sortOrder.value === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
    return 0;
  });
});

const navigateToProduct = (productId) => {
  router.push(`/product/${productId}`);
};


</script>

<style>

</style>