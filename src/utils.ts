import type { Timeline } from 'animejs'
import { useStageStore } from './stores/stage'
let store: ReturnType<typeof useStageStore> | null = null

export function pause(timeline: Timeline) {
  if (!store) {
    store = useStageStore()
  }
  timeline.call(() => {
    store!.pauseTimeline()
  }, '+=0')
}
