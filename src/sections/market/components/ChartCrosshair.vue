<script setup lang="ts">
import { VisCrosshair, VisTooltip } from '@unovis/vue'
import type { BulletLegendItemInterface } from '@unovis/ts'
import { omit } from '@unovis/ts'
import { type Component, createApp } from 'vue'

import ChartTooltip from './ChartTooltip.vue'

const props = withDefaults(
    defineProps<{
        colors: string[]
        index: string
        items: BulletLegendItemInterface[]
        customTooltip?: Component
    }>(),
    {
        colors: () => [],
    },
)

// Use weakmap to store reference to each datapoint for Tooltip
const wm = new WeakMap()
function template(
    d: any, // eslint-disable-line @typescript-eslint/no-explicit-any
) {
    if (!d) return ''

    if (wm.has(d)) {
        return wm.get(d)
    } else {
        const componentDiv = document.createElement('div')
        const omittedData = Object.entries(omit(d, [props.index])).map(([key, value]) => {
            const legendReference = props.items.find((i) => i.name === key)
            return {
                name: key,
                color: legendReference?.color || 'white',
                value,
            }
        })

        // Add index to the data
        omittedData.push({
            name: props.index,
            color: 'transparent',
            value: d[props.index],
        })

        const TooltipComponent = props.customTooltip ?? ChartTooltip
        const title = d[props.index]?.toString() || ''

        createApp(TooltipComponent, {
            title,
            data: omittedData,
        }).mount(componentDiv)

        wm.set(d, componentDiv.innerHTML)
        return componentDiv.innerHTML
    }
}

function color(d: unknown, i: number) {
    return props.colors[i] ?? 'transparent'
}
</script>

<template>
    <VisTooltip :horizontal-shift="20" :vertical-shift="20" />
    <VisCrosshair :template="template" :color="color" />
</template>
