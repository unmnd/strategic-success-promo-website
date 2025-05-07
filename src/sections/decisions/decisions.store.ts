import { ref } from 'vue'
import { defineStore } from 'pinia'
import { EFFECT_INFO } from '~/sections/decisions/decisions.config'

export type DecisionKey = keyof typeof EFFECT_INFO

export const useDecisionsStore = defineStore('decisions', () => {
  // Available decisions
  const decisions = ref<DecisionKey[]>([
    'tradeShowPositiveReputation',
    'newYearMarketingCampaign',
    'staffPayRise',
  ])

  // Add a new decision
  function addDecision(decision: DecisionKey) {
    if (!decisions.value.includes(decision)) {
      decisions.value.push(decision)
    }
  }

  // Remove a decision
  function removeDecision(decision: DecisionKey) {
    decisions.value = decisions.value.filter((d) => d !== decision)
  }

  return {
    decisions,
    addDecision,
    removeDecision,
  }
})
