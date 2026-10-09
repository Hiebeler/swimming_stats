import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Swim } from '@/types/swim'

const SWIMS_KEY = "SWIMS"
function loadSwims(): Swim[] {
  try {
    const raw = localStorage.getItem(SWIMS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useSwimsStore = defineStore('swims', () => {
  const swims = ref<Swim[]>(loadSwims())

  const sortedSwims = computed(() =>
    [...swims.value].sort((a, b) => b.startTime.localeCompare(a.startTime))
  )

  function getSwimById(id: string): Swim | undefined {
    return swims.value.find((swim) => swim.id === id)
  }

  function setSwims(new_swims: Swim[]) {
    swims.value = new_swims
  }

  watch(swims, (value) => {
    try {
      localStorage.setItem(SWIMS_KEY, JSON.stringify(value))
    } catch (e) {
      console.error('could not save swims in local storage', e)
    }
  })

  return { swims, sortedSwims, getSwimById, setSwims }
})
