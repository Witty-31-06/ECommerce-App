<script setup>
import { useProductStore } from '~/stores/productStore';
import { useUserStore } from '#imports';
import { useRoute } from 'vue-router';
import { doc, setDoc, updateDoc, arrayUnion, collection, addDoc, deleteField, getDoc, Timestamp } from "firebase/firestore";

const productStore = useProductStore();
const userStore = useUserStore();
const { id } = useRoute().params;

const product = ref(null);
const reviews = ref([]);
const pincode = ref('');
const isDeliveryAvailable = ref(true); // Always true in this case

// Review Form State
const reviewRating = ref(0);
const reviewComment = ref('');
const isSubmittingReview = ref(false);

onMounted(async () => {
  product.value = await productStore.getProduct(id);
  reviews.value = product.value.reviews || [];
});

async function addToCart() {
  console.log('Adding to cart:', product.value.title);
  await userStore.addToCart(id);
  alert('Added to cart');
}

// Submit Review Function
async function submitReview() {
  if (!userStore.user) {
    alert('Please log in to leave a review.');
    return;
  }

  if (!reviewRating.value || !reviewComment.value) {
    alert('Please provide a rating and comment.');
    return;
  }

  isSubmittingReview.value = true;

  try {
    const { $db } = useNuxtApp();

    // Create the review object
    const newReview = {
      comment: reviewComment.value,
      rating: reviewRating.value,
      reviewerName: userStore.user.displayName,
      timestamp: new Date().toISOString(),
    };

    // Add the review to the product's reviews array in Firestore
    const productRef = doc($db, 'products', id);
    await updateDoc(productRef, {
      reviews: arrayUnion(newReview),
    });

    // Update the local state to reflect the new review
    reviews.value.push(newReview);

    // Reset the form
    reviewRating.value = 0;
    reviewComment.value = '';
  } catch (error) {
    console.error('Error submitting review:', error);
    alert('Failed to submit review. Please try again.');
  } finally {
    isSubmittingReview.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Product Details -->
    <div v-if="product" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product Image -->
        <div>
          <img :src="product.image" :alt="product.title" class="w-full h-auto rounded-lg" />
        </div>

        <!-- Product Info -->
        <div>
          <!-- Today's Deal Badge -->
          <div v-if="product.isOnDeal" class="mb-4">
            <UBadge color="purple" variant="solid" class="text-sm font-semibold">
              Today's Deal
            </UBadge>
          </div>

          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ product.title }}</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">{{ product.description }}</p>

          <!-- Price Section -->
          <div class="mt-4">
            <p v-if="product.discount" class="text-gray-500 line-through">${{ product.price }}</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              ${{ (product.price * (1 - product.discount / 100)).toFixed(2) }}
              <span class="text-sm text-green-600 ml-2">{{ product.discount }}% off</span>
            </p>
          </div>

          <!-- Rating -->
          <div class="flex items-center mt-4">
            <span class="text-yellow-500">★</span>
            <span class="ml-2 text-gray-700 dark:text-gray-300">{{ product.rating }} ({{ reviews.length }} reviews)</span>
          </div>

          <!-- Pincode Delivery Check -->
          <div class="mt-6">
            <UInput
              v-model="pincode"
              placeholder="Enter your pincode"
              class="w-full max-w-xs"
            />
            <p v-if="pincode" class="text-green-600 mt-2">Yes, it can be delivered.</p>
          </div>

          <!-- Add to Cart Button -->
          <div class="mt-6">
            <UButton @click="addToCart" class="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white">
              Add to Cart
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>

    <!-- Reviews Section -->
    <div class="mt-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h2>

      <!-- Review Form (Logged In Users) -->
      <div v-if="userStore.user" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave a Review</h3>
        <div class="space-y-4">
          <!-- Rating Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
            <select
              v-model="reviewRating"
              class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="0">Select a rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          <!-- Comment Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Comment</label>
            <textarea
              v-model="reviewComment"
              rows="3"
              class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your review here..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <UButton
            @click="submitReview"
            :disabled="isSubmittingReview"
            class="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white"
          >
            {{ isSubmittingReview ? 'Submitting...' : 'Submit Review' }}
          </UButton>
        </div>
      </div>

      <!-- Prompt to Log In (Logged Out Users) -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <p class="text-gray-600 dark:text-gray-300">
          Please <a href="/auth/login" class="text-blue-500 hover:underline">log in</a> to leave a review.
        </p>
      </div>

      <!-- Reviews List -->
      <div v-if="reviews.length > 0" class="space-y-6">
        <div v-for="review in reviews" :key="review.timestamp" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <span class="text-yellow-500">★</span>
            <span class="ml-2 text-gray-700 dark:text-gray-300">{{ review.rating }}</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mt-2">{{ review.comment }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">- {{ review.reviewerName }}</p>
        </div>
      </div>

      <!-- No Reviews Message -->
      <div v-else>
        <p class="text-gray-600 dark:text-gray-300">No reviews yet.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>