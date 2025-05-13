import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from '~/utils'
import { EFFECT_INFO } from './decisions.config'

export const useDecisionsStore = defineStore('decisions', () => {
    const decisions = ref<(keyof typeof EFFECT_INFO)[]>([
        'tradeShowPositiveReputation',
        'newYearMarketingCampaign',
        'staffPayRise',
    ])

    function addDecision(decision: keyof typeof EFFECT_INFO) {
        decisions.value.push(decision)
        toast.info('New Decision Available', {
            description: EFFECT_INFO[decision].name,
        })
    }

    function selectDecision() {
        decisions.value = decisions.value.filter((el) => el !== selectedEffect.value)
        toast.success('Decision Added', {
            description: EFFECT_INFO[selectedEffect.value!].name,
        })
        selectedEffect.value = undefined
    }

    const selectedEffect = ref<keyof typeof EFFECT_INFO | undefined>()

    return {
        decisions,
        addDecision,
        selectDecision,
        selectedEffect,
    }
})
