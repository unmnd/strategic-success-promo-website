<template>
  <div ref="container" class="inset-0 absolute opacity-0 px-8">
    <div class="relative w-full h-screen flex items-center justify-center gap-16">
      <div ref="decisions" class="opacity-0 basis-2/3">
        <Decisions class="max-w-4xl" />
      </div>

      <div class="flex flex-col basis-1/3 opacity-0" ref="text">
        <h1 class="text-2xl font-bold pb-4">Decisions</h1>
        <div class="space-y-4">
          <p ref="p1" class="opacity-0">
            Every choice matters. Teams are faced with <b>realistic business decisions</b> that
            impact performance across finance, production, and strategy.
          </p>

          <p ref="p2" class="opacity-0">
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
import { stagger } from 'animejs'

const store = useStageStore()
const decisionsStore = useDecisionsStore()
const backgroundStore = useBackgroundStore()

const container = ref<HTMLElement | null>(null)
const text = ref<HTMLElement | null>(null)
const decisions = ref<HTMLElement | null>(null)

const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)

onMounted(async () => {
  store.createCheckpoint('decisions', async () => {
    backgroundStore.setBackground(null)
  })

  store.timeline
    .call(() => {
      backgroundStore.setBackground(darkGeneric)
    })
    .set(container.value!, {
      opacity: 1,
    })
    .add(
      [decisions.value!, text.value!, p1.value!, p2.value!],
      {
        ...fx.fadeUp,
        delay: stagger(500),
      },
      '+=500',
    )
    .call(() => {
      decisionsStore.addDecision('expandWarehouse')
    }, '+=3000')
    .add('', {}) // Bugfix - for some reason timeline must finish with an add method
})
</script>

<style scoped></style>
