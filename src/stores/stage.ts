import { ref, onMounted, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { createTimeline, Timeline } from 'animejs'

export interface SubTimeline {
  id: string
  timeline: Timeline
  completed: boolean
}

export const useStageStore = defineStore('stage', () => {
  const WIDTH = 1200
  const HEIGHT = 720

  // Timeline management
  const mainTimeline = ref<Timeline>(
    createTimeline({
      autoplay: true,
    }),
  )

  const subTimelines = ref<SubTimeline[]>([])
  const currentTimelineIndex = ref(0)
  const isPaused = ref(false)

  // Scroll handling
  const lastScrollY = ref(0)
  const scrollThreshold = 100

  // Add a component timeline to the main timeline
  function addTimeline(id: string, timeline: Timeline) {
    // Set self as completed when the timeline is finished
    timeline.call(() => {
      subTimelines.value[currentTimelineIndex.value].completed = true
    }, '+=0')

    subTimelines.value.push({
      id,
      timeline,
      completed: false,
    })

    // Add the timeline to the main sequence
    mainTimeline.value.sync(timeline)
  }

  // Control functions
  function resumeTimeline() {
    console.log('resumeTimeline')
    isPaused.value = false
    mainTimeline.value.resume()
  }

  function pauseTimeline() {
    console.log('pauseTimeline')
    isPaused.value = true
    mainTimeline.value.pause()
  }

  function restartCurrentTimeline() {
    if (currentTimelineIndex.value > 0) {
      // Go back one timeline
      currentTimelineIndex.value--
      subTimelines.value[currentTimelineIndex.value].completed = false

      // Calculate the position to seek to
      let seekPosition = 0
      for (let i = 0; i < currentTimelineIndex.value; i++) {
        seekPosition += subTimelines.value[i].timeline.duration
      }

      // Seek to the beginning of the current timeline
      mainTimeline.value.seek(seekPosition)
    } else {
      // Restart the main timeline
      mainTimeline.value.restart()
    }

    resumeTimeline()
  }

  // Handle scroll events
  function handleScroll(event: WheelEvent) {
    // Don't do anything if there's an active animation
    if (!isPaused.value) return

    if (event.deltaY > 0) {
      lastScrollY.value = 0

      // Scrolling down - continue animation if paused
      resumeTimeline()
    } else if (event.deltaY < 0) {
      // Scrolling up - restart current timeline if scrolled enough
      lastScrollY.value += Math.abs(event.deltaY)

      if (lastScrollY.value >= scrollThreshold) {
        restartCurrentTimeline()
        lastScrollY.value = 0
      }
    }
  }

  // Setup scroll listener
  onMounted(() => {
    window.addEventListener('wheel', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('wheel', handleScroll)
  })

  // Cursor state (preserved from original)
  const cursorType = ref<'default' | 'handpointing'>('default')
  const cursorPosition = ref({ x: WIDTH / 2, y: HEIGHT + 100 })
  const cursorClick = ref(false)

  return {
    WIDTH,
    HEIGHT,
    mainTimeline,
    subTimelines,
    currentTimelineIndex,
    isPaused,
    addTimeline,
    playTimeline: resumeTimeline,
    pauseTimeline,
    restartCurrentTimeline,
    cursorType,
    cursorPosition,
    cursorClick,
  }
})
