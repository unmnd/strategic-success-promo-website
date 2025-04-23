<template>
  <h1 class="roboto-flex text-5xl select-none font-extrabold tracking-tight text-primary relative">
    <div
      ref="logo"
      class="flex w-min"
      :class="{
        'flex-col': twoLines,
        'flex-row': !twoLines,
      }"
    >
      <div>
        <span
          v-for="letter in strategicWithWeight"
          :key="letter.letter"
          :style="{ fontWeight: letter.weight }"
        >
          {{ letter.letter }}
        </span>
      </div>
      <div class="flex justify-between">
        <span
          v-for="letter in successWithWeight"
          :key="letter.letter"
          :style="{ fontWeight: letter.weight }"
        >
          {{ letter.letter }}
        </span>
      </div>
    </div>
  </h1>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

withDefaults(
  defineProps<{
    twoLines?: boolean
  }>(),
  {
    twoLines: false,
  },
)

const logo = ref<HTMLDivElement | null>(null)

const logoWidth = ref(0)

onMounted(() => {
  logoWidth.value = logo.value?.offsetWidth ?? 0
})

const strategic = 'STRATEGIC'.split('')
const success = 'SUCCESS'.split('')

const minWeight = 150
const maxWeight = 700

const strategicWithWeight = strategic.map((letter, index) => ({
  letter,
  weight: minWeight + ((maxWeight - minWeight) / strategic.length) * index,
}))
const successWithWeight = success.map((letter, index) => ({
  letter,
  weight: maxWeight - ((maxWeight - minWeight) / success.length) * index,
}))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap');

.roboto-flex {
  font-family: 'Roboto Flex', sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings:
    'slnt' 0,
    'wdth' 100,
    'GRAD' 0,
    'XOPQ' 96,
    'XTRA' 468,
    'YOPQ' 79,
    'YTAS' 750,
    'YTDE' -203,
    'YTFI' 738,
    'YTLC' 514,
    'YTUC' 712;
}
</style>
