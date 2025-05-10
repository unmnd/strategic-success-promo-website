<template>
    <Card class="w-full">
        <CardHeader class="flex flex-row justify-between">
            <CardTitle>Skills</CardTitle>

            <SkillTreePoints />
        </CardHeader>

        <CardContent>
            <div ref="chart" class="w-full h-full">
                <!-- :width="width"
        :height="height" -->
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
                    :active="infoNode?.state?.active"
                    :visibility="infoNode?.visibility"
                    @close="infoNode = undefined"
                />
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import * as d3 from 'd3'

import SkillTreeNode from './SkillTreeNode.vue'
import SkillTreeLink from './SkillTreeLink.vue'
import EffectInfo from '../decisions/EffectInfo.vue'
import SkillTreePoints from './SkillTreePoints.vue'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
    SKILL_TREE_CHARGE_FORCE,
    SKILL_TREE_LINK_LENGTH,
    SKILL_TREE_LINK_STRENGTH,
} from '~/modules/team/modules/effect/effect.config'
import { useTeamStore } from '~/modules/team/team.store'
import { useEffectStore } from '~/modules/team/modules/effect/effect.store'

const teamStore = (await useTeamStore)()
const effectStore = (await useEffectStore)()

const chart = ref<HTMLDivElement | null>(null)
const svg = ref<SVGSVGElementZoom | null>(null)

const width = 100
const height = 680
const viewBox = [-width / 2, -height / 2, width, height].join(' ')

const nodes = ref<Node[]>(JSON.parse(JSON.stringify(effectStore.nodes)))
const links = computed<Link[]>(() => {
    const links: Link[] = []

    for (const node of nodes.value) {
        const siblings = node.info.siblings

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

const zoomTransform = ref<d3.ZoomTransform | undefined>(undefined)

const infoNode = ref<Node | undefined>(undefined)

onMounted(() => {
    let mounted = true

    // Get actual width of the chart
    const { width, height } = chart.value!.getBoundingClientRect()

    // const simulation =
    const simulation = d3
        .forceSimulation(nodes.value)
        .force(
            'link',
            d3
                .forceLink(links.value)
                .id((d: any) => d.id)
                .distance(SKILL_TREE_LINK_LENGTH)
                .strength(SKILL_TREE_LINK_STRENGTH),
        )
        .force('center', d3.forceCenter(-width, -height / 2))
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

    //     watch(
    //         () => nodes.value.length,
    //         () => {
    //             refreshSimulation();
    //
    //             // Skill points might have changed
    //             teamStore.updateTeamStats();
    //         },
    //     );

    watch(
        () => effectStore.nodes,
        (newValue) => {
            let needsRefresh = false

            // Iterate over all the new nodes and update the existing ones
            for (const newNode of newValue) {
                const existingNode = nodes.value.find((n) => n.id === newNode.id)

                if (existingNode) {
                    // Update the existing node
                    Object.assign(existingNode, {
                        state: newNode.state,
                        visibility: newNode.visibility,
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

            // Skill points might have changed
            teamStore.updateTeamStats()
        },
        {
            deep: true,
        },
    )

    if (svg.value) {
        const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0, 1]).on('zoom', zoomed)
        d3.select(svg.value).call(zoom as any) // eslint-disable-line @typescript-eslint/no-explicit-any

        // Assign the D3 zoom behavior to the ref for later use
        svg.value.__zoomBehavior = zoom
    }

    onUnmounted(() => {
        // Stop the simulation
        simulation.stop()
        mounted = false
    })
})

// Function to handle zoom event
function zoomed(event: d3.D3ZoomEvent<any, any>) {
    zoomTransform.value = event.transform
}

// Function to handle node dragging
// function startDrag(node: Node) {
//     if (svg.value) {
//         // Disable zooming when starting to drag
//         d3.select(svg.value).on('.zoom', null);
//     }
//
//     function dragged(event: d3.D3DragEvent<SVGCircleElement, unknown, SVGSVGElement>) {
//         if (state.zoomTransform && svg.value) {
//             const point = d3.pointer(event, svg.value); // Get the mouse position in the SVG coordinate system
//             const inverted = state.zoomTransform.invert(point); // Invert the current zoom transform
//
//             node.fx = inverted[0];
//             node.fy = inverted[1];
//         } else {
//             node.fx = event.x;
//             node.fy = event.y;
//         }
//     }
//
//     function ended() {
//         node.fx = null;
//         node.fy = null;
//         simulation.alphaTarget(0);
//
//         document.removeEventListener('mousemove', dragged);
//         document.removeEventListener('mouseup', ended);
//
//         // Re-enable zooming when finished dragging
//         if (svg.value && svg.value.__zoomBehavior) {
//             d3.select(svg.value).call(svg.value.__zoomBehavior as any);
//         }
//     }
//
//     simulation.alphaTarget(0.3).restart();
//
//     document.addEventListener('mousemove', dragged);
//     document.addEventListener('mouseup', ended);
// }
</script>
