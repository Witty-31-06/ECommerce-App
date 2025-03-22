<template>
  <div>
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <!-- Site Name and Location -->
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">AyushBazaar</h1>
          <p class="text-base text-gray-600 dark:text-gray-300">Location: India</p>
        </div>

        <div class="flex-1 mx-4 flex items-center">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass-20-solid"
            size="md"
            color="white"
            :trailing="false"
            placeholder="Search..."
            class="w-full max-w-lg"
            @keydown.enter="handleSearch"
          />
          <UButton color="primary" class="ml-2" @click="handleSearch"> Search </UButton>
        </div>

        <UDropdown :items="accountItems" :popper="{ placement: 'bottom-end' }">
          <UButton color="gray" variant="ghost">
            <UIcon name="i-heroicons-user-circle" class="w-6 h-6" />
            <span class="ml-2 text-base">Account</span>
          </UButton>

          <template #account>
            <div class="text-left" v-if="userStore.user">
              <p class="font-medium text-gray-900 dark:text-white">{{ userStore.user.displayName || 'User' }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ userStore.user.email }}</p>
            </div>
          </template>
        </UDropdown>

        <!-- Cart Icon -->
        <div class="relative">
          <UButton color="gray" variant="ghost" @click="navigateTo('/cart')">
            <UIcon name="i-heroicons-shopping-cart" class="w-6 h-6" />
            <span class="ml-2 text-base">Cart</span>
            <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{{ Object.keys(userStore.cart).length    }}</span>
          </UButton>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { useColorMode } from "@vueuse/core";

const userStore = useUserStore();
const router = useRouter();
const colorMode = useColorMode();
const searchQuery = ref("");

// Ensure authentication initializes
onMounted(() => {
  userStore.initAuth();
});

onUnmounted(() => {
  userStore.cleanupAuthListener()
});
// Make isLoggedIn reactive
const isLoggedIn = computed(() => !!userStore.user);

// Computed dropdown menu items
const accountItems = computed(() => [
  [
    {
      label: "Toggle Theme",
      icon: colorMode.value === "dark" ? "i-heroicons-moon" : "i-heroicons-sun",
      click: () => {
        colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
        colorMode.value = colorMode.preference; 
      },
    },
  ],
  [
    {
      label: "My Profile",
      icon: "i-heroicons-user",
      to: "/profile",
    },
    {
      label: "My Orders",
      icon: "i-heroicons-shopping-bag",
      to: "/myorders",
    },
  ],
  isLoggedIn.value
    ? [
        {
          label: "Sign Out",
          icon: "i-heroicons-arrow-right-on-rectangle",
          click: async () => {
            console.log("Signing Out...");
            await userStore.logout();
            router.push("/");
            console.log("Signed Out");
          },
        },
      ]
    : [
        {
          label: "Sign In",
          icon: "i-heroicons-arrow-right-on-rectangle",
          to: "/auth/login",
        },
      ],
]);

// Handle search functionality
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: "/search", query: { q: searchQuery.value } });
  } else {
    console.log("Please enter a search query.");
  }
};
</script>

<style scoped></style>
