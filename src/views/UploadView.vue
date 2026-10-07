<script setup lang="ts">
import { parseSamsungHealth } from '@/parsers/samsungExercise'
import router from '@/router'
import { useSwimsStore } from '@/stores/counter'
const store = useSwimsStore()

async function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  store.setSwims(await parseSamsungHealth(files))
  router.push('/')
}

</script>

<template>
  <h1>Import Samsung Health data</h1>

  <input type="file" webkitdirectory multiple @change="onPick" />
</template>

<style scoped>
.swim-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 600px;
  margin-top: 1rem;
}

.swim-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 8px;
}
</style>
