<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4 dark:text-gray-100">Shopping Cart</h1>

    <div v-if="cartItems.length > 0" class="space-y-4">
      <!-- Cart Items -->
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow rounded-lg"
      >
        <div class="flex items-center space-x-4">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h2 class="text-lg font-semibold dark:text-gray-100">
              {{ item.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              ${{ item.price }} x {{ item.quantity }} = ${{ item.total }}
            </p>
          </div>
        </div>

        <!-- Quantity Controls -->
        <div class="flex items-center space-x-2">
          <UButton
            icon="i-heroicons-minus-circle"
            color="gray"
            variant="ghost"
            @click="updateQuantity(item.id, item.quantity - 1)"
          />
          <span class="text-lg font-medium dark:text-gray-100">{{ item.quantity }}</span>
          <UButton
            icon="i-heroicons-plus-circle"
            color="gray"
            variant="ghost"
            @click="updateQuantity(item.id, item.quantity + 1)"
          />
        </div>

        <!-- Delete Button -->
        <UButton
          icon="i-heroicons-trash"
          color="red"
          variant="ghost"
          @click="removeFromCart(item.id)"
        />
      </div>

      <!-- Checkout Section -->
      <div class="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <h2 class="text-xl font-bold mb-2 dark:text-gray-100">Order Summary</h2>
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="flex justify-between text-gray-700 dark:text-gray-300"
        >
          <span>{{ item.title }}</span>
          <span>${{ item.total }}</span>
        </div>
        <hr class="my-2 border-gray-200 dark:border-gray-700" />
        <div class="flex justify-between text-lg font-semibold dark:text-gray-100">
          <span>Total:</span>
          <span>${{ totalPrice }}</span>
        </div>
        <UButton to="/checkout" color="primary" class="mt-4 w-full">
          Proceed to Checkout
        </UButton>
      </div>
    </div>

    <!-- Empty Cart Message -->
    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      <p>Your cart is empty. Start shopping!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "#imports";
import { useProductStore } from "#imports";

const userStore = useUserStore();
const productStore = useProductStore();
const cartItems = ref([]);

// Fetch cart items on mount
const fetchCartItems = async () => {
  // Ensure the cart data is available in the store
  if (!userStore.cart) return;

  cartItems.value = await Promise.all(
    Object.entries(userStore.cart).map(async ([productId, quantity]) => {
      const product = await productStore.getProduct(productId); // ✅ Await the async function
      return {
        id: productId,
        title: product?.title || "Unknown Product",
        image: product?.image || "/placeholder.png",
        price: product?.price || 0,
        quantity: quantity,
        total: (product?.price || 0) * (quantity),
      };
    })
  );
};

// Watch for changes in the cart and refetch items
watch(
  () => userStore.cart,
  async () => {
    await fetchCartItems();
  },
  { deep: true }
);
const price = ref(0);
// Fetch cart items when the component is mounted
onMounted(fetchCartItems);

// Computed property to get total price
const totalPrice = computed(() => {
  userStore.price = cartItems.value.reduce((sum, item) => sum + item.total, 0);
  return userStore.price;
});

// Update cart quantity
const updateQuantity = async (productId, newQuantity) => {
  if (newQuantity > 0) {
    await userStore.updateCart(productId, newQuantity); // ✅ Await the async function
  } else {
    await removeFromCart(productId);
  }
};

// Remove item from cart
const removeFromCart = async (productId) => {
  await userStore.deleteFromCart(productId); // ✅ Await the async function
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>