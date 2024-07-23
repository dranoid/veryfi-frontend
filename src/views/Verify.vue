<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Veryfi
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">Phone Verification</p>

      <!-- Verify Own Number Section -->
      <div class="mt-8 space-y-6">
        <h3 class="text-center text-xl font-bold text-gray-900">
          Verify Your Number
        </h3>
        <input
          v-model="ownPhoneNumber"
          type="tel"
          required
          class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Your Phone Number"
        />
        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-700">Verify with:</p>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="ownVerificationMethod"
                value="dropped_call"
                class="form-radio text-indigo-600"
              />
              <span class="ml-2">Dropped Call</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="ownVerificationMethod"
                value="send_sms"
                class="form-radio text-indigo-600"
              />
              <span class="ml-2">Send SMS</span>
            </label>
          </div>
        </div>
        <button
          @click="verifyOwnNumber"
          :disabled="!isOwnVerificationValid"
          class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify
        </button>
        <p v-if="!isOwnVerificationValid" class="mt-2 text-sm text-red-600">
          Please enter your phone number and select a verification method.
        </p>
      </div>

      <!-- Verify Other Numbers Section -->
      <div class="mt-8 space-y-6">
        <h3 class="text-center text-xl font-bold text-gray-900">
          Verify Other Numbers
        </h3>
        <input
          v-model="otherPhoneNumber"
          type="tel"
          required
          class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Other Phone Number"
        />
        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-700">Verify with:</p>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="otherVerificationMethod"
                value="dropped_call"
                class="form-radio text-indigo-600"
                :disabled="!userVerified"
              />
              <span class="ml-2">Dropped Call</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="otherVerificationMethod"
                value="send_sms"
                class="form-radio text-indigo-600"
                :disabled="!userVerified"
              />
              <span class="ml-2">Send SMS</span>
            </label>
          </div>
        </div>
        <button
          @click="verifyOtherNumber"
          :disabled="!isOtherVerificationValid"
          class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify
        </button>
        <p v-if="!userVerified" class="mt-2 text-sm text-red-600">
          Please verify your own number first before verifying other numbers.
        </p>
        <p
          v-else-if="!isOtherVerificationValid"
          class="mt-2 text-sm text-red-600"
        >
          Please enter the other phone number and select a verification method.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../services/auth.service";

const router = useRouter();
const userVerified = ref(false);
const ownPhoneNumber = ref("");
const otherPhoneNumber = ref("");
const ownVerificationMethod = ref("");
const otherVerificationMethod = ref("");

const verificationResponse = ref(null);
const pairedNumber = ref("");
const otpCode = ref("");

onMounted(() => {
  // if (!authService.isLoggedIn()) {
  //   router.push("/login");
  // }
  userVerified.value = authService.isVerified();
  const user = authService.getUser();
  if (user && user.number) {
    ownPhoneNumber.value = user.number;
  }
});

const isOwnVerificationValid = computed(
  () => ownPhoneNumber.value.trim() !== "" && ownVerificationMethod.value !== ""
);

const isOtherVerificationValid = computed(
  () =>
    userVerified.value &&
    otherPhoneNumber.value.trim() !== "" &&
    otherVerificationMethod.value !== ""
);

const verifyOwnNumber = async () => {
  if (isOwnVerificationValid.value) {
    try {
      const response = await authService.verifyNumber(
        ownPhoneNumber.value,
        ownVerificationMethod.value
      );
      verificationResponse.value = response;
      pairedNumber.value = response.pairedNumber;
      otpCode.value = response.otpCode;
      userVerified.value = true;
    } catch (error) {
      console.error("Verification failed:", error);
    }
  }
};

const verifyOtherNumber = async () => {
  if (isOtherVerificationValid.value) {
    try {
      const response = await authService.verifyNumber(
        otherPhoneNumber.value,
        otherVerificationMethod.value
      );
      verificationResponse.value = response;
      pairedNumber.value = response.pairedNumber;
      otpCode.value = response.otpCode;
    } catch (error) {
      console.error("Verification failed:", error);
    }
  }
};
</script>
