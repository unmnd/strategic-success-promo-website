<template>
  <div ref="container" class="inset-0 absolute px-8">
    <div class="relative w-full h-screen flex items-center justify-center gap-16">
      <div class="flex flex-col basis-1/3 opacity-0 text-right" ref="text">
        <h1 class="text-2xl font-bold pb-4">
          <i class="ri-brain-fill"></i>
          Skills
        </h1>
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

      <div ref="skills" class="basis-2/3">
        <Skills class="max-w-4xl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skills from './Skills.vue'
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { createTimeline, stagger } from 'animejs'

const text = ref<HTMLElement | null>(null)

const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)
const p3 = ref<HTMLElement | null>(null)

onMounted(() => {
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
