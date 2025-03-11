<template>
  <div>
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <!-- Site Name and Location -->
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">SidduBazar</h1>
          <p class="text-sm text-gray-600 dark:text-gray-300">Location: India</p>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 mx-8">
          <UInput
            icon="i-heroicons-magnifying-glass-20-solid"
            size="sm"
            color="white"
            :trailing="false"
            placeholder="Search..."
            class="max-w-md"
          />
        </div>

        <!-- Account Dropdown -->
        <UDropdown :items="accountItems" :popper="{ placement: 'bottom-end' }">
          <UButton color="gray" variant="ghost">
            <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
            <span class="ml-2">Account</span>
          </UButton>

          <template #account>
            <div class="text-left">
              <p class="font-medium text-gray-900 dark:text-white">John Doe</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
            </div>
          </template>
        </UDropdown>

        <!-- Cart Icon -->
        <div class="relative">
          <UButton color="gray" variant="ghost">
            <UIcon name="i-heroicons-shopping-cart" class="w-5 h-5" />
            <span class="ml-2">Cart</span>
            <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
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
const colorMode = useColorMode();

const accountItems = [
  [
    {
      label: 'Toggle Theme',
      icon: colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun',
      click: () => {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
      },
    },
  ],
  [
    {
      label: 'My Profile',
      icon: 'i-heroicons-user',
      to: '/profile',
    },
    {
      label: 'My Orders',
      icon: 'i-heroicons-shopping-bag',
      to: '/orders',
    },
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: () => {
        // Handle sign out logic here
        console.log('Signing out...');
      },
    },
  ],
];
</script>

<style scoped>
/* Add custom styles if needed */
</style>