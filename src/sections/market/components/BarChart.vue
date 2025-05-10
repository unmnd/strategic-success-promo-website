<script setup lang="ts" generic="T extends Record<string, any>">
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { BulletLegendItemInterface } from '@unovis/ts'
import { VisAxis, VisGroupedBar, VisStackedBar, VisXYContainer } from '@unovis/vue'
import { Axis, GroupedBar, StackedBar } from '@unovis/ts'
import { type Component, computed, ref } from 'vue'
import { useMounted } from '@vueuse/core'

import ChartCrosshair from './ChartCrosshair.vue'

// import { ChartCrosshair, defaultColors } from '~/components/ui/chart'
import { cn } from '~/utils'

// Define all required props based on MarketItemInfoDepthChart usage
const props = withDefaults(
  defineProps<{
    type: 'grouped' | 'stacked'
    data: any[]
    categories: string[]
    index: string
    margin?: { top: number; bottom: number; left: number; right: number }
    filterOpacity?: number
    roundedCorners?: number
    showXAxis?: boolean
    showYAxis?: boolean
    showTooltip?: boolean
    showLegend?: boolean
    showGridLine?: boolean
    xFormatter?: (tick: any) => string
    yFormatter?: (tick: any) => string
    customTooltip?: Component
  }>(),
  {
    type: 'grouped',
    margin: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    filterOpacity: 0.2,
    roundedCorners: 0,
    showXAxis: true,
    showYAxis: true,
    showTooltip: true,
    showLegend: true,
    showGridLine: true,
  },
)

type Data = any

const colors = ref(['#10b981', '#ffffff'])
const legendItems = ref<BulletLegendItemInterface[]>(
  props.categories.map((category, i) => ({
    name: category,
    color: colors.value[i],
    inactive: false,
  })),
)

const isMounted = useMounted()

const VisBarComponent = computed(() => (props.type === 'grouped' ? VisGroupedBar : VisStackedBar))
const selectorsBar = computed(() =>
  props.type === 'grouped' ? GroupedBar.selectors.bar : StackedBar.selectors.bar,
)
</script>

<template>
  <div :class="cn('w-full h-[400px] flex flex-col items-end', $attrs.class ?? '')">
    <!-- <ChartLegend
      v-if="showLegend"
      v-model:items="legendItems"
      @legend-item-click="handleLegendItemClick"
    /> -->

    <VisXYContainer :data="data" :style="{ height: isMounted ? '100%' : 'auto' }" :margin="margin">
      <ChartCrosshair
        v-if="showTooltip"
        :colors="colors"
        :items="legendItems"
        :custom-tooltip="customTooltip"
        :index="index"
      />

      <VisBarComponent
        :x="(d: Data, i: number) => i"
        :y="categories.map((category) => (d: Data) => d[category])"
        :color="colors"
        :rounded-corners="roundedCorners"
        :bar-padding="0.05"
        :attributes="{
          [selectorsBar]: {
            opacity: (d: Data, i: number) => {
              const pos = i % categories.length
              return legendItems[pos]?.inactive ? filterOpacity : 1
            },
          },
        }"
      />

      <VisAxis
        v-if="showXAxis"
        type="x"
        :tick-format="xFormatter ?? ((v: number) => data[v]?.[index])"
        :grid-line="false"
        :tick-line="false"
        tick-text-color="hsl(var(--vis-text-color))"
      />
      <VisAxis
        v-if="showYAxis"
        type="y"
        :tick-line="false"
        :tick-format="yFormatter"
        :domain-line="false"
        :grid-line="showGridLine"
        :attributes="{
          [Axis.selectors.grid]: {
            class: 'text-muted',
          },
        }"
        tick-text-color="white"
      />

      <slot />
    </VisXYContainer>
  </div>
</template>
