import { defineStore } from 'pinia'
import { ref } from 'vue'
import { EFFECT_INFO } from '../decisions/decisions.config'
import type { Node } from './skills.interface'
import { toast } from '~/utils'

export const useSkillsStore = defineStore('skills', () => {
    const skills = ref<(keyof typeof EFFECT_INFO)[]>(['factoryBase'])
    const nodes = ref<Node[]>([])

    function recomputeSelectability() {
        for (const node of nodes.value) {
            if (node.info.type !== 'skill') continue

            node.selectable =
                !skills.value.includes(node.id as keyof typeof EFFECT_INFO) &&
                node.info.siblings.some((sib: string) =>
                    skills.value.includes(sib as keyof typeof EFFECT_INFO),
                )
        }
    }

    function addSkill(skillKey: keyof typeof EFFECT_INFO) {
        if (!skills.value.includes(skillKey)) {
            skills.value.push(skillKey)
            recomputeSkillNodes()
            recomputeSelectability()

            toast.success('Skill Added', {
                description: EFFECT_INFO[skillKey].name,
            })
        }
    }

    function removeSkill(skillKey: keyof typeof EFFECT_INFO) {
        const index = skills.value.indexOf(skillKey)
        if (index !== -1) {
            skills.value.splice(index, 1)
            recomputeSkillNodes()
            recomputeSelectability()
        }
    }

    function recomputeSkillNodes() {
        for (const [key, info] of Object.entries(EFFECT_INFO)) {
            // Check if the effect is a skill
            if (info.type !== 'skill') continue

            const existingNode = nodes.value.find((node) => node.id === key)

            if (existingNode) {
                existingNode.active = skills.value.includes(key as keyof typeof EFFECT_INFO)
            } else {
                nodes.value.push({
                    id: key,
                    info,
                    active: skills.value.includes(key as keyof typeof EFFECT_INFO),
                    selectable:
                        !skills.value.includes(key as keyof typeof EFFECT_INFO) &&
                        info.siblings.some((sib: string) =>
                            skills.value.includes(sib as keyof typeof EFFECT_INFO),
                        ),
                    x: 0,
                    vx: (Math.random() - 0.5) * 10,
                    y: 0,
                    vy: (Math.random() - 0.5) * 10,
                })
            }
        }
    }

    // Initialize the nodes
    recomputeSkillNodes()

    return {
        skills,
        nodes,
        addSkill,
        removeSkill,
    }
})
