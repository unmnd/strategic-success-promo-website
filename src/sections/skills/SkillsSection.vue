<template>
  <div
    v-show="store.currentCheckpoint === 'skills'"
    ref="container"
    class="inset-0 absolute opacity-0 px-8"
  >
    <div class="relative w-full h-screen flex items-center justify-center gap-16">
      <div class="flex flex-col basis-1/3 opacity-0 text-right" ref="text">
        <h1 class="text-2xl font-bold pb-4">Skills</h1>
        <div class="space-y-4">
          <p ref="p1" class="opacity-0">Invest in what sets you apart.</p>

          <p ref="p2" class="opacity-0">
            Each team chooses where to specialise—be it <b>logistics</b>, <b>marketing</b>,
            <b>finance</b>, or more. Time and money spent on skills determines your competitive
            edge.
          </p>

          <p ref="p3" class="opacity-0">
            Will you be a jack-of-all-trades or a focused powerhouse?
          </p>
        </div>
      </div>

      <div ref="skills" class="opacity-0 basis-2/3">
        <Skills class="max-w-4xl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skills from './Skills.vue'
import { useStageStore } from '~/stores/stage'
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { useBackgroundStore } from '~/stores/background'

import darkGeneric from '~/assets/backgrounds/dark_generic.jpg'
import { animate, stagger } from 'animejs'

const store = useStageStore()
const backgroundStore = useBackgroundStore()

const container = ref<HTMLElement | null>(null)
const text = ref<HTMLElement | null>(null)
const skills = ref<HTMLElement | null>(null)

const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)
const p3 = ref<HTMLElement | null>(null)

onMounted(async () => {
  store.createCheckpoint('skills', async () => {
    backgroundStore.setBackground(null)
    await animate(container.value!, fx.fadeUpOut).then()
  })

  store.timeline
    .call(() => {
      backgroundStore.setBackground(darkGeneric)
    })
    .set(container.value!, {
      opacity: 1,
    })
    .add(
      [text.value!, p1.value!, p2.value!, p3.value!, skills.value!],
      {
        ...fx.fadeUp,
        delay: stagger(500),
      },
      '+=500',
    )
    .call(() => {
      store.pauseTimeline()
    })
    .add('', { duration: 0 }) // Bugfix - for some reason timeline must finish with an add method
})
</script>

<style scoped></style>
