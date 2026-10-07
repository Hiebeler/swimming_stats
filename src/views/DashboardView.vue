<script setup lang="ts">
import { useSwimsStore } from '@/stores/counter';
import type { Swim } from '@/types/swim';
import { storeToRefs } from 'pinia';

const store = useSwimsStore()
const { sortedSwims } = storeToRefs(store)

function formatDate(swim: Swim): string {
  // shift by the offset saved in the swim, then read it as UTC
  const local = new Date(new Date(swim.startTime).getTime() + swim.utcOffsetMinutes * 60000)
  return local.toLocaleString('en-GB', {
    timeZone: 'UTC',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function formatDistance(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`
}
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <h1 class="pb-2 text-red-600">hola</h1>
    <RouterLink v-if="!sortedSwims.length" to="/upload">Upload File</RouterLink>
    <div class="swim-grid">
      <div v-for="swim in sortedSwims" :key="swim.id" class="swim-row">
        <span class="date">{{ formatDate(swim) }}</span>
        <span class="distance">{{ formatDistance(swim.distanceM) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.swim-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.swim-row {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.swim-row:hover {
  background: rgba(128, 128, 128, 0.1);
}

.date {
  opacity: 0.8;
}

.distance {
  font-weight: 600;
}
</style>
