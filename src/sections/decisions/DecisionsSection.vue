<template>
  <div ref="container" class="inset-0 absolute opacity-0 px-8">
    <div class="relative w-full h-screen flex items-center justify-center gap-16">
      <div ref="decisions" class="opacity-0 basis-2/3">
        <Decisions class="max-w-4xl" />
      </div>

      <div class="flex flex-col basis-1/3 opacity-0" ref="text">
        <h1 class="text-2xl font-bold pb-4">Decisions</h1>
        <div class="text-muted-foreground space-y-4">
          <p>
            Every choice matters. Teams are faced with <b>realistic business decisions</b> that
            impact performance across finance, production, and strategy.
          </p>

          <p>
            From <b>pricing and hiring</b>, to <b>ethical dilemmas</b> and <b>risk management</b>—
            there's no autopilot here.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Decisions from './Decisions.vue'
import { useStageStore } from '~/stores/stage'
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { useDecisionsStore } from '~/sections/decisions/decisions.store'
import { useBackgroundStore } from '~/stores/background'

import darkGeneric from '~/assets/backgrounds/dark_generic.jpg'

const store = useStageStore()
const decisionsStore = useDecisionsStore()
const backgroundStore = useBackgroundStore()

const container = ref<HTMLElement | null>(null)
const text = ref<HTMLElement | null>(null)
const decisions = ref<HTMLElement | null>(null)

onMounted(async () => {
  store.createCheckpoint('decisions', async () => {
    backgroundStore.setBackground(null)
  })

  store.timeline.call(() => {
    backgroundStore.setBackground(darkGeneric)
  }, '+=0')

  store.timeline.add(
    container.value!,
    {
      opacity: [0, 1],
      duration: 0,
    },
    '+=0',
  )

  store.timeline.add(decisions.value!, fx.fadeUp, '<<+=300')
  store.timeline.add(text.value!, fx.fadeUp, '<<+=500')

  store.timeline.call(() => {
    decisionsStore.addDecision('expandWarehouse')
  }, '<<+=2000')
})
</script>

<style scoped></style>
