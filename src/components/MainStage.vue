<template>
  <div class="relative w-[1200px] h-[720px]">
    <div
      class="absolute w-[1200px] h-[720px] bg-zinc-950 text-foreground border border-green-500 select-none pointer-events-none"
    >
      <div
        class="overflow-scroll inset-0 absolute"
        ref="scrollContainer"
        @wheel.prevent
        @touchmove.prevent
      >
        <div class="flex flex-col mx-auto gap-4 p-8">
          <img src="../assets/screenshots/title.png" />

          <HeaderImage />

          <ImageNatural>
            <img src="../assets/screenshots/decisions_1.png" />
          </ImageNatural>

          <ImageNatural>
            <img src="../assets/screenshots/decisions_2.png" />
          </ImageNatural>

          <ImageNatural>
            <img src="../assets/screenshots/decisions_3.png" />
          </ImageNatural>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageNatural from './ImageNatural.vue'
import HeaderImage from './HeaderImage.vue'
import { ref } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)

// You can now use scrollContainer.value.scrollTo() to programmatically control scrolling
</script>

<style scoped>
.overflow-scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.overflow-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
