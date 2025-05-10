<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { type BulletLegendItemInterface, CurveType } from '@unovis/ts'
import { VisAxis, VisLine, VisXYContainer } from '@unovis/vue'
import { Axis, Line } from '@unovis/ts'
import { type Component, ref } from 'vue'
import { useMounted } from '@vueuse/core'

// Import local components instead of from chart library
import ChartCrosshair from './ChartCrosshair.vue'
import { cn } from '~/utils'

// Define all required props directly
const props = withDefaults(
    defineProps<{
        data: any[]
        categories: string[]
        index: string
        margin?: { top: number; bottom: number; left: number; right: number }
        filterOpacity?: number
        showXAxis?: boolean
        showYAxis?: boolean
        showTooltip?: boolean
        showLegend?: boolean
        showGridLine?: boolean
        xFormatter?: (tick: any) => string
        yFormatter?: (tick: any) => string
        /**
         * Render custom tooltip component.
         */
        customTooltip?: Component
        /**
         * Type of curve
         */
        curveType?: CurveType
        /**
         * Domain of the chart
         */
        yDomain?: [number, number]
        xDomain?: [number, number]
    }>(),
    {
        curveType: CurveType.MonotoneX,
        filterOpacity: 0.2,
        margin: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
        showXAxis: true,
        showYAxis: true,
        showTooltip: true,
        showLegend: true,
        showGridLine: true,
    },
)

type Data = any

// Use hardcoded colors like in the BarChart implementation
const colors = ref(['#ffffff'])

const legendItems = ref<BulletLegendItemInterface[]>(
    props.categories.map((category, i) => ({
        name: category,
        color: colors.value[i],
        inactive: false,
    })),
)

const isMounted = useMounted()
</script>

<template>
    <div :class="cn('w-full h-[400px] flex flex-col items-end')">
        <!-- <ChartLegend
      v-if="showLegend"
      v-model:items="legendItems"
      @legend-item-click="handleLegendItemClick"
    /> -->

        <VisXYContainer
            :data="data"
            :style="{ height: isMounted ? '100%' : 'auto', width: '100%' }"
            :y-domain="yDomain"
            :x-domain="xDomain"
        >
            <ChartCrosshair
                v-if="showTooltip"
                :colors="colors"
                :items="legendItems"
                :index="index"
                :custom-tooltip="customTooltip"
            />

            <template v-for="(category, i) in categories" :key="category">
                <VisLine
                    :x="(d: Data, i: number) => i"
                    :y="(d: Data) => d[category]"
                    :curve-type="curveType"
                    :color="colors[i]"
                    :attributes="{
                        [Line.selectors.line]: {
                            opacity: legendItems.find((item) => item.name === category)?.inactive
                                ? filterOpacity
                                : 1,
                        },
                    }"
                />
            </template>

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
