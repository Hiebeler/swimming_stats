<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useSwimsStore } from '@/stores/swims'
import type { Length } from '@/types/swim'
import { Icon } from '@iconify/vue'
import SwolfChart from '@/components/SwolfChart.vue'

const route = useRoute()
const store = useSwimsStore()

const swim = computed(() => store.getSwimById(route.params.id as string))

function formatDuration(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.round(sec % 60)
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`
}

const dateLabel = computed(() => {
  if (!swim.value) return ''
  const local = new Date(Date.parse(swim.value.startTime) + swim.value.utcOffsetMinutes * 60000)
  return local.toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'UTC',
  })
})

const stats = computed(() => {
  const s = swim.value
  if (!s) return []

  const totalLengthSec = (s.lengths?.reduce((sum, l) => sum + l.duration, 0) ?? 0) / 1000
  const totalStrokes = s.lengths?.reduce((sum, l) => sum + l.stroke_count, 0) ?? 0
  const pacePer100 = s.distanceM > 0 ? (totalLengthSec / s.distanceM) * 100 : null
  const swolfSum = s.lengths?.reduce((sum, l) => sum + l.swolf, 0) ?? 0
  const averageSwolf = swolfSum / (s.lengths?.length ?? 1)
  const swolfs = s.lengths?.map((length: Length) => length.swolf)
  const minSwolf = Math.min(...swolfs ?? [0])

  const list = [
    { label: 'Distance', value: `${s.distanceM.toLocaleString()} m`, icon: 'ph:ruler-light' },
    { label: 'Duration', value: formatDuration(s.durationSec), icon: 'ph:timer-light' },
    { label: 'Moving Time', value: formatDuration(totalLengthSec), icon: 'ph:timer-light' },
    {
      label: 'Pace / 100 m',
      value: pacePer100 ? formatDuration(pacePer100) : '–',
      icon: 'ph:speedometer-light',
    },
    {
      label: 'Average SWOLF',
      value: Math.round(averageSwolf),
      icon: 'ph:speedometer-light',
    },
    {
      label: 'Minimum SWOLF',
      value: Math.round(minSwolf),
      icon: 'ph:speedometer-light',
    },
    {
      label: 'Total Strokes',
      value: totalStrokes,
      icon: 'ph:speedometer-light',
    },
    { label: 'Avg heart rate', value: s.avgHeartRate && `${s.avgHeartRate} bpm`, icon: 'ph:heartbeat-light' },
    { label: 'Max heart rate', value: s.maxHeartRate && `${s.maxHeartRate} bpm`, icon: 'ph:heart-light' },
    { label: 'Min heart rate', value: s.minHeartRate && `${s.minHeartRate} bpm`, icon: 'ph:heart-break-light' },
    { label: 'Calories', value: s.calories && `${s.calories} kcal`, icon: 'ph:fire-light' },
    { label: 'Total lengths', value: s.lengths?.length, icon: 'ph:swimming-pool-light' },
  ]

  return list.filter((item) => item.value)
})
</script>

<template>
  <div v-if="swim" class="space-y-4">
    <RouterLink to="/" class="text-primary-600 hover:underline">&larr; Back</RouterLink>

    <div>
      <h1 class="text-2xl font-semibold">Swim</h1>
      <p class="card-label">{{ dateLabel }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="card">
        <p class="card-label flex items-center gap-1">
          <Icon :icon="stat.icon" class="size-4" />
          {{ stat.label }}
        </p>
        <p class="mt-1 text-2xl font-bold text-primary-600">{{ stat.value }}</p>
      </div>
    </div>
    <div v-if="swim.lengths?.length" class="card">
      <h2 class="card-title mb-2">SWOLF per length</h2>
      <SwolfChart :lengths="swim.lengths" />
    </div>
  </div>

  <div v-else class="card">
    <p>Swim not found.</p>
    <RouterLink to="/" class="text-primary-600 hover:underline">Back to overview</RouterLink>
  </div>
</template>
