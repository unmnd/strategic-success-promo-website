<template>
    <g>
        <circle
            @click="clickEffect"
            :cx="node.x"
            :cy="node.y"
            :r="SKILL_TREE_NODE_RADIUS"
            class="transition-colors"
            :data-selectable="selectable"
            :data-active="active"
        >
        </circle>
        <text
            :x="node.x"
            :y="(node.y ?? 0) + SKILL_TREE_NODE_RADIUS + 20"
            class="text-xl select-none"
            text-anchor="middle"
            dominant-baseline="bottom"
            :data-selectable="selectable"
            :data-active="active"
        >
            <tspan dy="0.6em">
                {{ node.info.name }}
            </tspan>
        </text>
    </g>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SKILL_TREE_NODE_RADIUS, type Node } from './skills.interface'
import { useSkillsStore } from './skills.store'
import { EFFECT_INFO } from '../decisions/decisions.config'

// import { SKILL_TREE_NODE_RADIUS } from '~/modules/team/modules/effect/effect.config'
// import { EffectVisibility } from '@/game/effect/effect.interface.enum'

const props = defineProps<{
    node: Node
}>()

const emits = defineEmits<{
    (e: 'clickEffect'): void
}>()

const skillsStore = useSkillsStore()

// const selectable = computed(() => props.node.visibility === EffectVisibility.SELECTABLE)
const selectable = computed(() => props.node.selectable)
const active = computed(() => props.node.active)

function clickEffect() {
    emits('clickEffect')
}
</script>

<style scoped>
* {
    --local-border: var(--border);
    --local-foreground: var(--foreground);
    --local-background: var(--background);
    --local-muted: var(--muted);
    --local-muted-foreground: var(--muted-foreground);
    --local-primary: var(--primary);
    --local-primary-foreground: var(--primary-foreground);
    --local-secondary: var(--secondary);
    --local-secondary-foreground: var(--secondary-foreground);
}

circle {
    fill: var(--local-background);
    stroke: var(--local-border);

    cursor: pointer;
}

circle:hover {
    fill: var(--local-muted);
}

text {
    fill: var(--local-muted-foreground);
}

circle[data-active='true'] {
    fill: var(--local-primary);
}

circle[data-active='true']:hover {
    stroke: var(--local-border);
    stroke-width: 2px;
    fill: var(--local-muted-foreground);
}

circle[data-selectable='true'] {
    stroke: var(--local-primary);
}

circle[data-selectable='true']:hover {
    cursor: pointer;
    fill: var(--local-primary);
}

text[data-selectable='true'],
text[data-active='true'] {
    fill: var(--local-foreground);
}
</style>
