import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Swim } from '@/types/swim'

export const useSwimsStore = defineStore('swims', () => {
  const swims = ref<Swim[]>([])

  const sortedSwims = computed(() =>
    [...swims.value].sort((a, b) => b.startTime.localeCompare(a.startTime))
  )

  function setSwims(new_swims: Swim[]) {
    console.log(new_swims)
    swims.value = new_swims
  }

  return { swims, sortedSwims, setSwims }
})
