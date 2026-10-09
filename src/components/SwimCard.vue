<script setup lang="ts">
import type { Swim } from '@/types/swim';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  swim: Swim
}>()

function formatDate(swim: Swim): string {
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
  <RouterLink :to="{ name: 'swim-detail', params: { id: swim.id } }">
    <div class="card">
      <div class="flex flex-row gap-4 items-center">
        <div>
          <Icon icon="fa6-solid:person-swimming" class="size-6" />
        </div>
        <div class="flex flex-col">
          <span class="card-title">{{ formatDistance(swim.distanceM) }}</span>
          <div>
            <span class="date">{{ formatDate(swim) }}</span>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
