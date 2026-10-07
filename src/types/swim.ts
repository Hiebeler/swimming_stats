export interface Swim {
  id: string
  startTime: string
  utcOffsetMinutes: number
  durationSec: number
  distanceM: number
  avgHeartRate?: number
  maxHeartRate?: number
  minHeartRate?: number
  calories?: number
  poolLength?: number
  lengths?: Length[]
}

export interface Length {
  index: number
  startTime?: string
  durationSec: number
  strokes?: number
  strokeType?: string
  distanceM?: number
}
