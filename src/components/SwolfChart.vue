<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { Length } from '@/types/swim'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, MarkLineComponent])

const props = defineProps<{ lengths: Length[] }>()

const option = computed(() => {
  const text = '#94a3b8'
  const grid = '#1e293b'
  const line = '#0ea5e9'   // primary-500
  const avgColor = '#f97316' // accent-500

  const data = props.lengths.map((l) => l.swolf ?? null)
  const valid = data.filter((v): v is number => v !== null)
  const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null

  console.log(data)
  return {
    backgroundColor: 'transparent',
    grid: { left: 40, right: 16, top: 16, bottom: 32 },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (v: number | null) => (v === null ? '–' : v.toFixed(1)),
    },
    xAxis: {
      type: 'category',
      name: 'Length',
      nameLocation: 'middle',
      nameGap: 24,
      data: props.lengths.map((_, i) => i + 1),
      axisLine: { lineStyle: { color: grid } },
      axisLabel: { color: text },
      nameTextStyle: { color: text },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: { color: text },
      splitLine: { lineStyle: { color: grid } }
    },
    series: [
      {
        name: 'SWOLF',
        type: 'line',
        data,
        smooth: true,
        symbolSize: 6,
        connectNulls: false,
        lineStyle: { color: line, width: 2 },
        itemStyle: { color: line },
        markLine:
          avg === null
            ? undefined
            : {
              symbol: 'none',
              lineStyle: { color: avgColor, type: 'dashed' },
              label: { color: avgColor, formatter: 'avg {c}' },
              data: [{ yAxis: Math.round(avg * 10) / 10 }],
            },
      },
    ],
  }
})
</script>

<template>
  <div class="h-128">
    <VChart :option="option" autoresize />
  </div>
</template>
