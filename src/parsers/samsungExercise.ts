import type { Length, Swim } from "@/types/swim";
import Papa from 'papaparse'


const EXERCISE_CSV = /^com\.samsung\.shealth\.exercise\.\d+\.csv$/
const PREFIX = 'com.samsung.health.exercise.'
const POOL_SWIM = 14001
const SAMSUNG_HEALTH = 'com.sec.android.app.shealth'

type Row = Record<string, string>

export interface ParsedSwim {
  swim: Swim
  detailFileName?: string
}

const col = (row: Row, name: string): string => row[PREFIX + name] ?? ''

const num = (value: string): number | undefined => {
  if (value === '') return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

function parseOffset(value: string): number {
  const m = /UTC([+-])(\d{2})(\d{2})/.exec(value)
  if (!m) return 0
  const minutes = Number(m[2]) * 60 + Number(m[3])
  return m[1] === '-' ? -minutes : minutes
}

export function parseExerciseCsv(fileContent: string): ParsedSwim[] {
  const withoutMeta = fileContent.slice(fileContent.indexOf('\n') + 1)
  const { data } = Papa.parse<Row>(withoutMeta, {
    header: true,
    skipEmptyLines: true,
  })
  return data
    .filter((row) => Number(col(row, 'exercise_type')) === POOL_SWIM)
    .filter((row) => col(row, 'pkg_name') === SAMSUNG_HEALTH)
    .map((row) => ({
      swim: {
        id: col(row, 'datauuid'),
        startTime: new Date(col(row, 'start_time').replace(' ', 'T') + 'Z').toISOString(),
        utcOffsetMinutes: parseOffset(row['com.samsung.health.exercise.time_offset'] ?? col(row, 'time_offset')),
        durationSec: (num(col(row, 'duration')) ?? 0) / 1000,
        distanceM: num(col(row, 'distance')) ?? 0,
        avgHeartRate: num(col(row, 'mean_heart_rate')),
        maxHeartRate: num(col(row, 'max_heart_rate')),
        minHeartRate: num(col(row, 'min_heart_rate')),
        calories: num(col(row, 'calorie')),
      }, detailFileName: col(row, 'additional')
    }))
}

export type SwimDetail = Partial<Swim>

export function parseDetailJson(text: string): SwimDetail {
  const raw = JSON.parse(text)

  let lengths: Length[] = raw.lengths
  lengths = lengths.map((length: Length) => {
    const swolf = length.duration / 1000 + length.stroke_count
    return { ...length, swolf }
  })

  const detail: SwimDetail = {}

  if (lengths.length > 0) detail.lengths = lengths

  if (typeof raw.pool_length === 'number') {
    detail.poolLength = raw.pool_length
  }

  return detail
}

export async function parseSamsungHealth(files: File[]): Promise<Swim[]> {
  const byName = new Map(files.map((f) => [f.name, f]))

  const csv = files.find((f) => EXERCISE_CSV.test(f.name))
  if (!csv) return []

  const parsed = parseExerciseCsv(await csv.text())

  return Promise.all(
    parsed.map(async ({ swim, detailFileName }) => {
      const file = detailFileName ? byName.get(detailFileName) : undefined
      if (!file) return swim

      try {
        const detail = parseDetailJson(await file.text())
        return { ...swim, ...detail }
      } catch (e) {
        console.warn('Detail file failed for', swim.id, e)
        return swim
      }
    }),
  )
}
