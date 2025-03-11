<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <UCard class="w-full max-w-md">
        <template #header>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Login</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-300">Enter your email below to login to your account</p>
        </template>
  
        <form @submit.prevent="handleLogin">
          <UFormGroup label="Email" class="mb-4">
            <UInput
              v-model="email"
              type="email"
              placeholder="m@example.com"
              icon="i-heroicons-envelope"
              autofocus
            />
          </UFormGroup>
  
          <UFormGroup label="Password" class="mb-6">
            <UInput
              v-model="password"
              type="password"
              placeholder="Enter your password"
              icon="i-heroicons-lock-closed"
            />
          </UFormGroup>
  
          <UButton type="submit" block class="mb-4"> Login </UButton>
        </form>
  
        <div class="mt-6 text-center">
          <UButton
            color="red"
            variant="solid"
            block
            icon="i-heroicons-logo-google"
            @click="handleGoogleLogin"
          >
            Login with Google
          </UButton>
        </div>
  
        <template #footer>
          <p class="text-center text-gray-600 dark:text-gray-300">
            Don't have an account?
            <NuxtLink to="/auth/register" class="text-primary-500 hover:underline"> Register </NuxtLink>
          </p>
        </template>
      </UCard>
  
      <!-- Color Mode Toggle -->
      <UButton
        color="gray"
        variant="ghost"
        class="fixed bottom-4 right-4"
        @click="toggleColorMode"
      >
        <UIcon
          :name="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          class="w-5 h-5"
        />
      </UButton>
    </div>
  </template>
  
  <script setup>
  const email = ref('');
  const password = ref('');
  const colorMode = useColorMode();
  
  const handleLogin = () => {
    // Handle login logic here
    console.log('Logging in with:', email.value, password.value);
  };
  
  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Logging in with Google');
  };
  
  const toggleColorMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  };
  </script>
  
  <style scoped>
  /* Add custom styles if needed */
  </style>