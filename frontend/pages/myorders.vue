<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">My Orders</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <p>Loading orders...</p>
    </div>

    <!-- No Orders -->
    <div v-if="!loading && orders.length === 0" class="text-center text-gray-500">
      <p>You have no orders yet.</p>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-6">
      <div v-for="order in orders" :key="order.id" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <!-- Order ID -->
        <h2 class="text-lg font-semibold mb-4">Order ID: {{ order.id }}</h2>

        <!-- Address -->
        <div class="mb-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">Delivery Address</h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ order.address.street }}, {{ order.address.city }}, {{ order.address.state }} {{ order.address.zip }}
          </p>
        </div>

        <!-- Payment Amount -->
        <div class="mb-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">Payment Amount</h3>
          <p class="text-gray-600 dark:text-gray-400">${{ order.paymentAmount }}</p>
        </div>

        <!-- Expected Delivery Date -->
        <div class="mb-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">Expected Delivery Date</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ order.expectedDeliveryDate }}</p>
        </div>

        <!-- Cart Items -->
        <div>
          <h3 class="font-medium text-gray-700 dark:text-gray-300">Items</h3>
          <div v-for="(quantity, productId) in order.cart" :key="productId" class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-2">
            <p class="text-gray-600 dark:text-gray-400">Product ID: {{ productId }}</p>
            <p class="text-gray-600 dark:text-gray-400">Quantity: {{ quantity }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { doc,getDoc } from "firebase/firestore";
definePageMeta({
  middleware: 'auth',
});

const userStore = useUserStore();
const orderIDs = ref(userStore.user?.orders || []);
const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
  const { $db } = useNuxtApp();
  try {
    const orderPromises = orderIDs.value.map(async (orderId) => {
      const orderDoc = await getDoc(doc($db, 'orders', orderId));
      if (orderDoc.exists()) {
        return { id: orderId, ...orderDoc.data() };
      }
      return null;
    });

    const fetchedOrders = await Promise.all(orderPromises);
    orders.value = fetchedOrders.filter((order) => order !== null);
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>