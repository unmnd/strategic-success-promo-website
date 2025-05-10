<template>
  <Dialog
    v-if="info"
    :open="open"
    @update:open="
      (event) => {
        if (!event) close()
      }
    "
  >
    <DialogContent
      @openAutoFocus="$event.preventDefault()"
      @closeAutoFocus="$event.preventDefault()"
    >
      <DialogHeader>
        <DialogTitle class="flex items-start gap-2 justify-between">
          <h1>{{ active ? info.name : info.actionName }}</h1>
          <Badge v-if="info.ongoing" class="gap-2">
            <i class="ri-timer-line"></i>
            Ongoing
          </Badge>
          <Badge v-else variant="outline" class="gap-2">
            <i class="ri-timer-line"></i>
            One time
          </Badge>
        </DialogTitle>
        <p class="text-muted-foreground mt-1" v-html="info.description.summary"></p>
      </DialogHeader>

      <div v-if="info.description.onAdd">
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
          <i class="ri-add-line mr-1"></i>

          On add:
        </h3>
        <div class="text-muted-foreground" v-html="info.description.onAdd"></div>
      </div>

      <div v-if="info.description.onRoundChange">
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
          <i class="ri-arrow-right-line mr-1"></i>

          On round change:
        </h3>
        <p class="text-muted-foreground" v-html="info.description.onRoundChange"></p>
      </div>

      <div v-if="info.description.onOrder">
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
          <i class="ri-survey-line mr-1"></i>

          On order:
        </h3>
        <p class="text-muted-foreground" v-html="info.description.onOrder"></p>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="outline"> Close </Button>
        </DialogClose>

        <TooltipProvider>
          <Tooltip :delayDuration="100">
            <TooltipTrigger>
              <Button @click="$emit('select')">
                <span v-if="!isAdding">
                  <i class="ri-check-line mr-1"></i>
                  Add
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent> There is no undo for this! </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

const props = defineProps<{
  info?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  active?: boolean
}>()

const isAdding = ref<boolean>(false)

const open = ref(
  // Set initial open state
  props.info !== undefined,
)

let closeTimeout: ReturnType<typeof setTimeout> | undefined = undefined

function close() {
  open.value = false

  // Wait for the drawer to close
  closeTimeout = setTimeout(() => {
    emits('close')
  }, 500)
}

watch(
  () => props.info,
  (info) => {
    if (info) {
      // Open the drawer if the info is defined
      open.value = true

      // Clear the close timeout
      if (closeTimeout) {
        clearTimeout(closeTimeout)
      }
    }
  },
)

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'select'): void
}>()
</script>

<style>
[data-slot='dialog-content'] button.ring-offset-background {
  display: none;
}
</style>
