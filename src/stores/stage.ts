import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import { createTimeline } from 'animejs'

export interface Checkpoint {
  id: string
  position: number
  reverseCallback?: () => Promise<void>
}

// LocalStorage constants
const CHECKPOINT_STORAGE_KEY = 'stageCheckpoint'
const CHECKPOINT_TIMEOUT_MS = 10 * 60 * 1000 // 10 minutes in milliseconds

export const useStageStore = defineStore('stage', () => {
  const WIDTH = 1200
  const HEIGHT = 720

  // Create a single main timeline
  const mainTimeline = createTimeline({
    autoplay: false,
  })

  // Checkpoint management
  const checkpoints = ref<Checkpoint[]>([])

  const checkPointStorage = JSON.parse(localStorage.getItem(CHECKPOINT_STORAGE_KEY) || '{}')
  const currentCheckpointIndex = ref(
    Date.now() - (checkPointStorage.timestamp || 0) > CHECKPOINT_TIMEOUT_MS
      ? 0
      : checkPointStorage.index || 0,
  )
  const currentCheckpoint = computed(() => checkpoints.value[currentCheckpointIndex.value]?.id)

  watch(currentCheckpointIndex, (newIndex) => {
    console.log('🔄 Saving checkpoint', newIndex)
    localStorage.setItem(
      CHECKPOINT_STORAGE_KEY,
      JSON.stringify({
        index: newIndex,
        timestamp: Date.now(),
      }),
    )
  })

  const isPaused = ref(false)

  // Scroll handling
  const lastScrollY = ref(0)
  const scrollThreshold = 100

  // Create a checkpoint at the current timeline position
  function createCheckpoint(id: string, reverseCallback?: () => Promise<void>) {
    const position = mainTimeline.duration

    const checkpoint = {
      id,
      position,
      reverseCallback,
    }

    const checkpointIndex = checkpoints.value.length

    // Add a callback at this position to update current checkpoint
    mainTimeline.call(() => {
      currentCheckpointIndex.value = checkpointIndex
    }, position)

    checkpoints.value.push(checkpoint)

    return position
  }

  // Go to a specific checkpoint
  function goToCheckpoint(index: number) {
    if (index >= 0 && index < checkpoints.value.length) {
      const position = checkpoints.value[index].position
      mainTimeline.seek(position)
      currentCheckpointIndex.value = index
      mainTimeline.resume()
    }
  }

  // Control functions
  function resumeTimeline() {
    console.log('⏱️ Timeline resumed')
    isPaused.value = false
    mainTimeline.resume()
  }

  function pauseTimeline() {
    console.log('⏸️ Timeline paused')
    isPaused.value = true
    mainTimeline.pause()
  }

  // Go to previous checkpoint
  async function goToPreviousCheckpoint() {
    if (currentCheckpointIndex.value > 0) {
      // Disable pause state during reversal
      isPaused.value = false

      // Execute the reversal callback if available
      const currentCheckpoint = checkpoints.value[currentCheckpointIndex.value]
      if (currentCheckpoint.reverseCallback) {
        try {
          await currentCheckpoint.reverseCallback()
        } catch (error) {
          console.error(`Error during reverse animation for ${currentCheckpoint.id}:`, error)
        }
      }

      // Get the position of the previous checkpoint
      const prevIndex = currentCheckpointIndex.value - 1
      const prevPosition = prevIndex >= 0 ? checkpoints.value[prevIndex].position : 0

      // Seek to the previous checkpoint
      mainTimeline.seek(prevPosition)
      currentCheckpointIndex.value = prevIndex

      // Keep playing after seeking
      resumeTimeline()
    }
  }

  // Go to next checkpoint
  function goToNextCheckpoint() {
    if (currentCheckpointIndex.value < checkpoints.value.length - 1) {
      const nextIndex = currentCheckpointIndex.value + 1
      const nextPosition = checkpoints.value[nextIndex].position

      // Seek to the next checkpoint
      mainTimeline.seek(nextPosition)
      currentCheckpointIndex.value = nextIndex

      resumeTimeline()
    } else {
      // If we're at the last checkpoint, just resume playing
      resumeTimeline()
    }
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
      // Scrolling up - go to previous checkpoint if scrolled enough
      lastScrollY.value += Math.abs(event.deltaY)

      if (lastScrollY.value >= scrollThreshold) {
        goToPreviousCheckpoint()
        lastScrollY.value = 0
      }
    }
  }

  // Setup scroll listener
  onMounted(() => {
    window.addEventListener('wheel', handleScroll)

    setTimeout(() => {
      goToCheckpoint(currentCheckpointIndex.value)

      console.log('🔄 Restored checkpoint', currentCheckpointIndex.value)
      console.log('checkpoints', checkpoints.value)
    }, 100)
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
    timeline: mainTimeline,
    checkpoints,
    currentCheckpointIndex,
    currentCheckpoint,
    isPaused,
    createCheckpoint,
    playTimeline: resumeTimeline,
    pauseTimeline,
    goToPreviousCheckpoint,
    goToNextCheckpoint,
    goToCheckpoint,
    cursorType,
    cursorPosition,
    cursorClick,
  }
})
