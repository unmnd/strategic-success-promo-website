<template>
    <Card class="w-full relative p-0">
        <div ref="chart" class="w-full h-full">
            <svg
                :viewBox="viewBox"
                preserve-aspect-ratio="none"
                width="100%"
                ref="svg"
                class="relative overflow-clip h-[32rem]"
            >
                <g class="relative" :transform="zoomTransform ? zoomTransform.toString() : ''">
                    <SkillTreeLink v-for="(link, idx) in links" :key="idx" :link="link" />

                    <SkillTreeNode
                        v-for="node in nodes"
                        :key="node.id"
                        :node="node"
                        @clickEffect="infoNode = node"
                    />
                </g>
            </svg>

            <EffectInfo
                :info="infoNode?.info"
                :active="infoNode?.active"
                :selectable="infoNode?.selectable"
                @close="infoNode = undefined"
            />
        </div>
    </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import * as d3 from 'd3'

import SkillTreeNode from './SkillTreeNode.vue'
import SkillTreeLink from './SkillTreeLink.vue'

import { Card } from '~/components/ui/card'
import {
    SKILL_TREE_CHARGE_FORCE,
    SKILL_TREE_LINK_LENGTH,
    SKILL_TREE_LINK_STRENGTH,
    type Link,
    type Node,
} from './skills.interface'
import { useSkillsStore } from './skills.store'
import EffectInfo from './EffectInfo.vue'

const skillsStore = useSkillsStore()

const nodes = ref<Node[]>(JSON.parse(JSON.stringify(skillsStore.nodes)))
const links = computed<Link[]>(() => {
    const links: Link[] = []

    for (const node of nodes.value) {
        if (node.info.type !== 'skill') continue
        const siblings = node.info.siblings ?? []

        for (const sibling of siblings) {
            // If the link already exists, skip
            if (
                links.some(
                    (link) =>
                        (link.source as Node).id === node.id &&
                        (link.target as Node).id === sibling,
                )
            )
                continue

            // If the target node does not exist, skip
            const target = nodes.value.find((n) => n.id === sibling)
            if (!target) continue

            links.push({
                source: node,
                target,
            })
        }
    }

    return links
})

const chart = ref<HTMLDivElement | null>(null)
const svg = ref<SVGSVGElement | null>(null)

const width = 100
const height = 680
const viewBox = ref([800, -400, width, height].join(' '))

const zoomTransform = ref<d3.ZoomTransform | undefined>(undefined)

const infoNode = ref<Node | undefined>(undefined)

onMounted(() => {
    let mounted = true

    // Get actual width of the chart
    const { width, height } = chart.value!.getBoundingClientRect()

    // Update the viewBox
    // viewBox.value = [100, 0, width, height].join(' ')

    // const simulation =
    const simulation = d3
        .forceSimulation(nodes.value)
        .force(
            'link',
            d3
                .forceLink(links.value)
                .id(
                    (
                        d: any, // eslint-disable-line @typescript-eslint/no-explicit-any
                    ) => d.id,
                )
                .distance(SKILL_TREE_LINK_LENGTH)
                .strength(SKILL_TREE_LINK_STRENGTH),
        )
        .force('center', d3.forceCenter(-width / 2, -height))
        .force(
            'charge',
            d3.forceManyBody().strength(SKILL_TREE_CHARGE_FORCE),
            // .distanceMax(SKILL_TREE_LINK_LENGTH * 2),
            // .theta(0.1),
        )
    // .alphaDecay(0.01)
    // .alphaMin(0.5);
    // .force('x', d3.forceX())
    // .force('y', d3.forceY());

    function refreshSimulation() {
        if (!mounted) return

        simulation.nodes(nodes.value)
        ;(simulation.force('link') as d3.ForceLink<Node, Link>).links(links.value)
        simulation.alpha(1).restart()
    }

    watch(
        () => skillsStore.nodes,
        (newValue) => {
            let needsRefresh = false

            // Iterate over all the new nodes and update the existing ones
            for (const newNode of newValue) {
                const existingNode = nodes.value.find((n) => n.id === newNode.id)

                if (existingNode) {
                    // Update the existing node
                    Object.assign(existingNode, {
                        active: newNode.active,
                        selectable: newNode.selectable,
                    })
                } else {
                    // Add the new node
                    nodes.value.push(newNode)
                    needsRefresh = true
                }
            }

            // Remove nodes that no longer exist
            for (let i = nodes.value.length - 1; i >= 0; i--) {
                if (!newValue.some((n) => n.id === nodes.value[i].id)) {
                    nodes.value.splice(i, 1)
                    needsRefresh = true
                }
            }

            // Only refresh the sim if the length of the nodes array has changed
            if (needsRefresh) refreshSimulation()
        },
        {
            deep: true,
        },
    )

    if (svg.value) {
        const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0, 1]).on('zoom', zoomed)
        d3.select(svg.value).call(zoom as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    onUnmounted(() => {
        // Stop the simulation
        simulation.stop()
        mounted = false
    })
})

// Function to handle zoom event
function zoomed(
    event: d3.D3ZoomEvent<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
) {
    zoomTransform.value = event.transform
}
</script>
