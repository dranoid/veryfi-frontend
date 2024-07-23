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
      <div class="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 class="text-center text-xl font-bold text-gray-900 mb-4">
          Verify Your Number
        </h3>
        <input
          v-model="ownPhoneNumber"
          type="tel"
          required
          class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4"
          placeholder="Your Phone Number"
        />
        <div class="space-y-2 mb-4">
          <p class="text-sm font-medium text-gray-700">Verify with:</p>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="ownVerificationMethod"
                value="DROPPED_CALL"
                class="form-radio text-indigo-600"
              />
              <span class="ml-2">Dropped Call</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="ownVerificationMethod"
                value="SEND_SMS"
                class="form-radio text-indigo-600"
              />
              <span class="ml-2">Send SMS</span>
            </label>
          </div>
        </div>
        <button
          @click="verifyOwnNumber"
          :disabled="!isOwnVerificationValid || isOwnVerifying"
          class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isOwnVerifying ? "Verifying..." : "Verify" }}
        </button>
        <p v-if="!isOwnVerificationValid" class="mt-2 text-sm text-red-600">
          Please enter your phone number and select a verification method.
        </p>

        <!-- Own Verification Instructions -->
        <div v-if="ownVerificationResponse" class="mt-4 space-y-2">
          <h4 class="font-bold text-lg">Your Verification Instructions</h4>
          <p>
            Current Verification status for {{ ownPhoneNumber }}:
            <span class="font-bold text-indigo-600">
              {{ ownVerificationStatus }}
            </span>
          </p>
          <div v-if="ownVerificationMethod === 'DROPPED_CALL'">
            <p>Please call the following number:</p>
            <p class="font-bold">{{ ownPairedNumber }}</p>
            <p>The call will be automatically dropped after connecting.</p>
          </div>
          <div v-else-if="ownVerificationMethod === 'SEND_SMS'">
            <p>Please send the following OTP code:</p>
            <p class="font-bold">{{ ownOtpCode }}</p>
            <p>To {{ ownPairedNumber }}.</p>
          </div>
        </div>
      </div>

      <!-- Verify Other Numbers Section -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h3 class="text-center text-xl font-bold text-gray-900 mb-4">
          Verify Other Numbers
        </h3>
        <input
          v-model="otherPhoneNumber"
          type="tel"
          required
          class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4"
          placeholder="Other Phone Number"
        />
        <div class="space-y-2 mb-4">
          <p class="text-sm font-medium text-gray-700">Verify with:</p>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="otherVerificationMethod"
                value="DROPPED_CALL"
                class="form-radio text-indigo-600"
                :disabled="!userVerified"
              />
              <span class="ml-2">Dropped Call</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="otherVerificationMethod"
                value="SEND_SMS"
                class="form-radio text-indigo-600"
                :disabled="!userVerified"
              />
              <span class="ml-2">Send SMS</span>
            </label>
          </div>
        </div>
        <button
          @click="verifyOtherNumber"
          :disabled="!isOtherVerificationValid || isOtherVerifying"
          class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isOtherVerifying ? "Verifying..." : "Verify" }}
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

        <!-- Other Verification Instructions -->
        <div v-if="otherVerificationResponse" class="mt-4 space-y-2">
          <h4 class="font-bold text-lg">
            Other Number Verification Instructions
          </h4>
          <p>
            Current Verification status for {{ otherPhoneNumber }}:
            <span class="font-bold text-indigo-600">
              {{ otherVerificationStatus }}
            </span>
          </p>
          <div v-if="otherVerificationMethod === 'DROPPED_CALL'">
            <p>Please call the following number:</p>
            <p class="font-bold">{{ otherPairedNumber }}</p>
            <p>The call will be automatically dropped after connecting.</p>
          </div>
          <div v-else-if="otherVerificationMethod === 'SEND_SMS'">
            <p>Please send the following OTP code:</p>
            <p class="font-bold">{{ otherOtpCode }}</p>
            <p>To {{ otherPairedNumber }}.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
// import { useRouter } from "vue-router";
import { authService } from "../services/auth.service";
import { io } from "socket.io-client";
import { api, baseURL } from "../api/axios";

// WebSocket URL (replace with your actual server URL)
const socket = io(baseURL);

// const router = useRouter();
const userVerified = ref(false);
const ownPhoneNumber = ref("");
const otherPhoneNumber = ref("");
const ownVerificationMethod = ref("");
const otherVerificationMethod = ref("");

// New reactive variables
const ownVerificationResponse = ref(null);
const otherVerificationResponse = ref(null);
const ownPairedNumber = ref("");
const otherPairedNumber = ref("");
const ownOtpCode = ref("");
const otherOtpCode = ref("");
const isOwnVerifying = ref(false);
const isOtherVerifying = ref(false);

onMounted(() => {
  userVerified.value = authService.isVerified();
  const user = authService.getUser();
  if (user && user.number) {
    ownPhoneNumber.value = user.number;
  }

  // Listen for WebSocket events
  socket.on("verification-success", ({ data }) => {
    if (data.phoneNumber.trim() === ownPhoneNumber.value.trim()) {
      ownVerificationStatus.value = data.status;
      if (ownVerificationStatus.value === "SUCCESS") {
        authService.setVerified(true);
        userVerified.value = true;
      }
      ownVerificationResponse.value = data;
      ownPairedNumber.value = data.pairedNumber;
      ownOtpCode.value = data.otpCode;
    } else if (data.phoneNumber === otherPhoneNumber.value) {
      otherVerificationStatus.value = data.status;
      otherVerificationResponse.value = data;
      otherPairedNumber.value = data.pairedNumber;
      otherOtpCode.value = data.otpCode;
    }
  });
});

onUnmounted(() => {
  socket.disconnect();
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

const ownVerificationStatus = ref("");

const verifyOwnNumber = async () => {
  if (isOwnVerificationValid.value && !isOwnVerifying.value) {
    isOwnVerifying.value = true;
    try {
      const response = await api.verifyMe(
        ownPhoneNumber.value,
        ownVerificationMethod.value
      );

      ownVerificationResponse.value = response;
      ownPairedNumber.value = response.data.pairedNumber;
      ownOtpCode.value = response.data.otp;
      ownVerificationStatus.value = response.data.status;
      // userVerified.value = true;
    } catch (error) {
      console.error("Own number verification failed:", error);
    } finally {
      isOwnVerifying.value = false;
    }
  }
};

const otherVerificationStatus = ref("");

const verifyOtherNumber = async () => {
  if (isOtherVerificationValid.value && !isOtherVerifying.value) {
    isOtherVerifying.value = true;
    try {
      const response = await api.verifyOthers(
        "+234",
        otherPhoneNumber.value,
        otherVerificationMethod.value
      );

      otherVerificationResponse.value = response;
      otherPairedNumber.value = response.data.pairedNumber;
      otherOtpCode.value = response.data.otp;
      otherVerificationStatus.value = response.data.status;
    } catch (error) {
      console.error("Other number verification failed:", error);
    } finally {
      isOtherVerifying.value = false;
    }
  }
};

watch(userVerified, (newValue) => {
  if (newValue) {
    authService.setVerified(true);
  }
});
</script>
