<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Veryfi
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">Create your account</p>
      <form class="mt-8 space-y-6" @submit.prevent="handleSignUp">
        <input
          v-model="name"
          type="text"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Full Name"
        />
        <input
          v-model="email"
          type="email"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Email"
        />
        <input
          v-model="password"
          type="password"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Password"
        />
        <input
          v-model="confirmPassword"
          type="password"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Confirm Password"
        />
        <input
          v-model="phoneNumber"
          type="tel"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Phone Number (Optional)"
        />
        <button
          type="submit"
          :disabled="!isFormValid"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign Up
        </button>
        <p v-if="!isFormValid" class="mt-2 text-sm text-red-600">
          Please fill in all required fields correctly. Ensure your password is
          at least 8 characters long and matches the confirmation.
        </p>
      </form>
      <p class="mt-2 text-center text-sm text-gray-600">
        Already have an account?
        <router-link
          to="/"
          class="font-medium text-indigo-600 hover:text-indigo-500"
          >Login</router-link
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
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const phoneNumber = ref("");

const isFormValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordMinLength = 8;
  return (
    name.value.trim().length > 0 &&
    emailRegex.test(email.value) &&
    password.value.length >= passwordMinLength &&
    password.value === confirmPassword.value
  );
});

const handleSignUp = () => {
  if (isFormValid.value) {
    authService.setUser({
      name: name.value,
      email: email.value,
      isVerified: false,
      number: phoneNumber.value,
    });
    router.push("/verify");
  }
};
</script>
