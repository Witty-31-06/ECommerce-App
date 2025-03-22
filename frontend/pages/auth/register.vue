<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Create an Account</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Enter your details to register</p>
      </template>

      <form @submit.prevent="handleRegister">
        <UFormGroup label="Full Name" class="mb-4">
          <UInput
            v-model="fullName"
            type="text"
            placeholder="John Doe"
            icon="i-heroicons-user"
            autofocus
          />
        </UFormGroup>

        <UFormGroup label="Email" class="mb-4">
          <UInput
            v-model="email"
            type="email"
            placeholder="m@example.com"
            icon="i-heroicons-envelope"
          />
          <p v-if="!isEmailValid && email" class="text-sm text-red-500 mt-1">
            Please enter a valid email address.
          </p>
        </UFormGroup>

        <UFormGroup label="Password" class="mb-4">
          <UInput
            v-model="password"
            type="password"
            placeholder="Enter your password"
            icon="i-heroicons-lock-closed"
          />
          <p v-if="!isPasswordValid && password" class="text-sm text-red-500 mt-1">
            Password must be at least 6 characters long.
          </p>
        </UFormGroup>

        <UFormGroup label="Confirm Password" class="mb-6">
          <UInput
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            icon="i-heroicons-lock-closed"
          />
          <p v-if="error" class="text-sm text-red-500 mt-1 bg-red-100 dark:bg-red-900 p-2 rounded">
            {{ error }}
          </p>
        </UFormGroup>

        <UButton type="submit" block class="mb-4"> Register </UButton>
      </form>

      <div class="mt-6 text-center">
        <UButton
          color="red"
          variant="solid"
          block
          icon="i-heroicons-logo-google"
          @click="handleGoogleRegister"
        >
          Register with Google
        </UButton>
      </div>

      <template #footer>
        <p class="text-center text-gray-600 dark:text-gray-300">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-primary-500 hover:underline"> Login </NuxtLink>
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

import { useUserStore } from '~/stores/userStore';

definePageMeta({
  layout: false, 
  middleware: 'redirect-if-authenticated'
});
const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref(null);
const colorMode = useColorMode();
const userStore = useUserStore();
const router = useRouter();

// Email validation
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

// Password validation
const isPasswordValid = computed(() => {
  return password.value.length >= 6;
});

const handleRegister = async () => {
  error.value = null; // Reset error

  // Frontend validation
  if (!isEmailValid.value) {
    error.value = 'Please enter a valid email address.';
    return;
  }

  if (!isPasswordValid.value) {
    error.value = 'Password must be at least 6 characters long.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.';
    return;
  }

  console.log('Registering with:', fullName.value, email.value, password.value);
  await userStore.register(email.value, password.value, fullName.value);
  if(userStore.error) {
    error.value = userStore.error;
    alert(userStore.error);
  } else {
    alert('Registration successful');
    router.push('/');
  }
};

const handleGoogleRegister = () => {
  console.log('Registering with Google');
};

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>