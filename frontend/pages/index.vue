<template>
  <div>
    <!-- Latest Products Carousel -->
    <section class="my-8">
      <h1 class="text-2xl font-bold mb-4">Latest Products</h1>
      <UCarousel
        v-if="latestProducts.length > 0"
        v-slot="{ item }"
        loop
        dots
        arrows
        auto-scroll
        :items="latestProducts"
        :ui="{ item: 'basis-1/3' }"
      >
        <NuxtLink :to="`/product/${item.id}`">
          <img :src="item.image" :alt="item.title" width="234" height="234" class="rounded-lg" />
          <p class="mt-2 text-center">{{ item.title }}</p>
          <p class="text-center text-gray-600">${{ item.price }}</p>
        </NuxtLink>
      </UCarousel>
      <p v-else class="text-gray-600">{{ error }}</p>
    </section>

    <!-- Discounted Products Cards -->
    <section class="my-8">
      <h1 class="text-2xl font-bold mb-4">Top Discounts</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="product in discountProducts" :key="product.id" class="hover:shadow-lg transition-shadow">
          <NuxtLink :to="`/product/${product.id}`">
            <img :src="product.image" :alt="product.title" class="w-full h-48 object-cover rounded-t-lg" />
            <div class="p-4">
              <h2 class="font-semibold">{{ product.title }}</h2>
              <p class="text-gray-600">${{ product.price }}</p>
              <p class="text-sm text-green-600">Discount: {{ product.discount }}%</p>
            </div>
          </NuxtLink>
        </UCard>
      </div>
      <p v-if="discountProducts.length === 0" class="text-gray-600">{{ error }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGetSortedProducts } from '~/composables/useGetSortedProducts';

const { error, fetchProducts } = useGetSortedProducts();
const latestProducts = ref([]);
const discountProducts = ref([]);

onMounted(async () => {
  // Fetch latest products (sorted by addedOn date, descending)
  latestProducts.value = await fetchProducts('addedOn', 'desc', 10);

  // Fetch discounted products (sorted by discount percentage, descending)
  discountProducts.value = await fetchProducts('discount', 'desc', 9);

  console.log('Latest Products:', latestProducts.value);
  console.log('Discounted Products:', discountProducts.value);
});
</script>

<style scoped>
</style>