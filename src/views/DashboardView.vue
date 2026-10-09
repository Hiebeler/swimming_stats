<script setup lang="ts">
import SwimCard from '@/components/SwimCard.vue';
import { useSwimsStore } from '@/stores/swims';
import { storeToRefs } from 'pinia';

const store = useSwimsStore()
const { sortedSwims } = storeToRefs(store)
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <h1 class="pb-2 text-red-600">hola</h1>
    <RouterLink v-if="!sortedSwims.length" to="/upload">Upload File</RouterLink>
    <div class="grid grid-cols-4 gap-4">
      <SwimCard v-for="swim in sortedSwims" :swim="swim" />
    </div>
  </div>

</template>
