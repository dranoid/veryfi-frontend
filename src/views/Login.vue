<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Veryfi
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input
          v-model="email"
          type="email"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Email"
        />
        <input
          v-model="password"
          type="password"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Password"
        />
        <button
          type="submit"
          :disabled="!isFormValid"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign In
        </button>
        <p v-if="!isFormValid" class="mt-2 text-sm text-red-600">
          Please enter a valid email address and password.
        </p>
      </form>
      <p class="mt-2 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link
          to="/signup"
          class="font-medium text-indigo-600 hover:text-indigo-500"
          >Sign Up</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../services/auth.service";

const router = useRouter();
const email = ref("");
const password = ref("");

const isFormValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value) && password.value.length > 0;
});

const handleLogin = () => {
  if (isFormValid.value) {
    // Simulate login
    authService.setUser({ email: email.value, isVerified: false, name: "" });
    router.push("/verify");
  }
};
</script>
