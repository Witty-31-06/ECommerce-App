<template>
  <div class="max-w-2xl mx-auto p-4">
    <!-- Reka UI Stepper -->
    <StepperRoot :default-value="currentStep" class="flex gap-2 w-full max-w-[32rem] mb-8">
      <StepperItem
        v-for="item in steps"
        :key="item.step"
        class="w-full flex justify-center gap-2 cursor-pointer group relative px-4"
        :step="item.step"
      >
        <StepperTrigger
          class="inline-flex border-2 shadow-sm items-center text-white bg-green9 border-green9 group-data-[state=inactive]:border-gray-200 group-data-[state=inactive]:bg-white group-data-[state=inactive]:text-stone-700 group-data-[disabled]:opacity-50 group-data-[disabled]:cursor-not-allowed justify-center rounded-full w-10 h-10 shrink-0 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
        >
          <StepperIndicator>
            <Icon :icon="item.icon" class="w-5 h-5" />
          </StepperIndicator>
        </StepperTrigger>

        <StepperSeparator
          v-if="item.step !== steps[steps.length - 1].step"
          class="absolute block top-5 left-[calc(50%+30px)] right-[calc(-50%+20px)] h-0.5 rounded-full bg-stone-300/50 shrink-0"
        />

        <div class="absolute text-center top-full left-0 w-full mt-2 text-stone-700 dark:text-white group-data-[disabled]:opacity-50">
          <StepperTitle class="font-medium">
            {{ item.title }}
          </StepperTitle>
          <StepperDescription class="hidden sm:block text-xs">
            {{ item.description }}
          </StepperDescription>
        </div>
      </StepperItem>
    </StepperRoot>

    <!-- Step 1: Enter Address -->
    <div v-if="currentStep === 1" class="space-y-4">
      <h2 class="text-xl font-bold mb-4">Enter Your Address</h2>
      <UInput v-model="address.street" placeholder="Street Address" class="w-full" />
      <UInput v-model="address.city" placeholder="City" class="w-full" />
      <UInput v-model="address.state" placeholder="State" class="w-full" />
      <UInput v-model="address.zip" placeholder="ZIP Code" class="w-full" />
      <UButton @click="currentStep++" color="primary" class="mt-4">
        Next: Payment Method
      </UButton>
    </div>

    <!-- Step 2: Payment Method -->
    <div v-if="currentStep === 2" class="space-y-4">
      <h2 class="text-xl font-bold mb-4">Select Payment Method</h2>
      <div class="space-y-2">
        <URadio
          v-model="paymentMethod"
          value="card"
          label="Credit/Debit Card"
        />
        <URadio
          v-model="paymentMethod"
          value="cod"
          label="Cash on Delivery"
        />
      </div>

      <!-- Card Details (Conditional) -->
      <div v-if="paymentMethod === 'card'" class="space-y-4">
        <UInput v-model="cardDetails.number" placeholder="Card Number" class="w-full" />
        <div class="grid grid-cols-2 gap-4">
          <UInput v-model="cardDetails.expiry" placeholder="MM/YY" />
          <UInput v-model="cardDetails.cvv" placeholder="CVV" />
        </div>
      </div>

      <!-- Preferred Delivery Date -->
      <div class="mt-4">
        <h3 class="text-lg font-semibold mb-2">Preferred Delivery Date</h3>
        <CalendarRoot
          v-slot="{ weekDays, grid }"
          :is-date-unavailable="isDateUnavailable"
          :default-value="deliveryDate"
          class="mt-6 rounded-xl bg-white p-4 shadow-sm border"
          fixed-weeks
        >
          <CalendarHeader class="flex items-center justify-between">
            <CalendarPrev
              class="inline-flex items-center cursor-pointer text-black justify-center rounded-md bg-transparent w-7 h-7 hover:bg-stone-50 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
            >
              <Icon icon="radix-icons:chevron-left" class="w-4 h-4" />
            </CalendarPrev>
            <CalendarHeading class="text-sm text-black font-medium" />
            <CalendarNext
              class="inline-flex items-center cursor-pointer justify-center text-black rounded-md bg-transparent w-7 h-7 hover:bg-stone-50 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
            >
              <Icon icon="radix-icons:chevron-right" class="w-4 h-4" />
            </CalendarNext>
          </CalendarHeader>
          <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <CalendarGrid
              v-for="month in grid"
              :key="month.value.toString()"
              class="w-full border-collapse select-none space-y-1"
            >
              <CalendarGridHead>
                <CalendarGridRow class="mb-1 grid w-full grid-cols-7">
                  <CalendarHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="rounded-md text-xs text-green8"
                  >
                    {{ day }}
                  </CalendarHeadCell>
                </CalendarGridRow>
              </CalendarGridHead>
              <CalendarGridBody class="grid">
                <CalendarGridRow
                  v-for="(weekDates, index) in month.rows"
                  :key="`weekDate-${index}`"
                  class="grid grid-cols-7"
                >
                  <CalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                    class="relative text-center text-sm"
                  >
                    <CalendarCellTrigger
                      :day="weekDate"
                      :month="month.value"
                      class="relative flex items-center justify-center rounded-full whitespace-nowrap text-sm font-normal text-black w-8 h-8 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[outside-view]:text-black/30 data-[selected]:!bg-green10 data-[selected]:text-white hover:bg-green5 data-[highlighted]:bg-green5 data-[unavailable]:pointer-events-none data-[unavailable]:text-black/30 data-[unavailable]:line-through before:absolute before:top-[5px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-green9"
                    />
                  </CalendarCell>
                </CalendarGridRow>
              </CalendarGridBody>
            </CalendarGrid>
          </div>
        </CalendarRoot>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-6">
        <UButton @click="currentStep--" color="gray" variant="ghost">
          Back
        </UButton>
        <UButton @click="currentStep++" color="primary">
          Next: Confirm Order
        </UButton>
      </div>
    </div>

    <!-- Step 3: Checkout Confirmation -->
    <div v-if="currentStep === 3" class="space-y-4">
      <h2 class="text-xl font-bold mb-4">Order Confirmation</h2>
      <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Delivery Address</h3>
        <p>{{ address.street }}</p>
        <p>{{ address.city }}, {{ address.state }} {{ address.zip }}</p>
      </div>

      <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Payment Method</h3>
        <p>{{ paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery" }}</p>
        <p v-if="paymentMethod === 'card'">Card: **** **** **** {{ cardDetails.number.slice(-4) }}</p>
      </div>

      <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Delivery Date</h3>
        <p>{{ deliveryDate?.toString() }}</p>
      </div>

      <UButton @click="placeOrder" color="green" class="w-full mt-6">
        Place Order
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useUserStore } from '#imports';
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui';
import { CalendarDate } from '@internationalized/date';
import {
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperRoot,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from 'reka-ui';

const currentStep = ref(1);

const userStore = useUserStore();
// Stepper Items
const steps = [
  {
    step: 1,
    title: 'Address',
    description: 'Add your address here',
    icon: 'radix-icons:home',
  },
  {
    step: 2,
    title: 'Payment',
    description: 'Select your payment method',
    icon: 'radix-icons:archive',
  },
  {
    step: 3,
    title: 'Checkout',
    description: 'Confirm your order',
    icon: 'radix-icons:check',
  },
];

// Address Form
const address = ref({
  street: '',
  city: '',
  state: '',
  zip: '',
});

// Payment Method
const paymentMethod = ref('card'); // Default to Card
const cardDetails = ref({
  number: '',
  expiry: '',
  cvv: '',
});

// Delivery Date
const deliveryDate = ref(new CalendarDate(2024, 10, 3));

// Date Unavailable Logic
const isDateUnavailable = (date: CalendarDate) => {
  return date.day === 17 || date.day === 18;
};

// Place Order
const placeOrder = async () => {

  await userStore.placeOrder(
     address.value,
     paymentMethod.value,
     deliveryDate.value,
  );
  alert('Order placed successfully! Thank you for shopping with us.');
  currentStep.value = 1;
  address.value = { street: '', city: '', state: '', zip: '' };
  paymentMethod.value = 'card';
  cardDetails.value = { number: '', expiry: '', cvv: '' };
  deliveryDate.value = new CalendarDate(2024, 10, 3);
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>