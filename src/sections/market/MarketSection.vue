<template>
  <div ref="container" class="inset-0 absolute px-8 overflow-y-scroll">
    <div class="relative w-full flex flex-col items-center">
      <div class="pt-20 pb-8 max-w-3xl text-center opacity-0" ref="text">
        <h1 class="text-2xl font-bold pb-4">
          <i class="ri-line-chart-fill"></i>
          Market
        </h1>
        <div class="space-y-4">
          <p ref="p1" class="opacity-0">A living, breathing economy.</p>

          <p ref="p2" class="opacity-0">
            Prices of raw materials and products shift organically based on <b>team activity</b> and
            <b>external news</b>. Supply and demand are king.
          </p>

          <p ref="p3" class="opacity-0">
            From pandemics to political instability—reacting to <b>market shocks</b> is part of the
            game.
          </p>
        </div>
      </div>

      <div ref="market" class="h-screen w-full flex items-center justify-center p-8">
        <Market />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Market from './Market.vue'
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { useBackgroundStore } from '~/stores/background'
import { createTimeline, stagger } from 'animejs'

import finance from '~/assets/backgrounds/finance.jpg'

const backgroundStore = useBackgroundStore()

const text = ref<HTMLElement | null>(null)

const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)
const p3 = ref<HTMLElement | null>(null)

onMounted(() => {
  // Set background
  backgroundStore.setBackground(finance)

  // Setup timeline
  createTimeline().add(
    [text.value!, p1.value!, p2.value!, p3.value!],
    {
      ...fx.fadeUp,
      delay: stagger(500),
    },
    '+=500',
  )
})
</script>

<style scoped></style>
