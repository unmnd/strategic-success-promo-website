<template>
    <Popover id="team" v-model:open="teamOpen">
        <PopoverTrigger as-child>
            <Button
                variant="outline"
                role="combobox"
                :aria-expanded="teamOpen"
                class="w-full justify-between"
            >
                {{ teamValue ?? 'Select recipient...' }}

                <i class="ri-arrow-down-s-line ml-auto h-4 w-4"></i>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="p-0">
            <Command>
                <CommandInput class="h-9" placeholder="Search team..." />
                <CommandEmpty>No teams found.</CommandEmpty>
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                            v-for="id in nonUserTeams"
                            :key="id"
                            :value="id"
                            @select="
                                (ev) => {
                                    if (typeof ev.detail.value === 'string') {
                                        teamValue = ev.detail.value
                                    }
                                    teamOpen = false
                                }
                            "
                        >
                            {{ id }}
                            <i
                                class="ri-check-line ml-auto h-4 w-4"
                                :class="teamValue === id ? 'opacity-100' : 'opacity-0'"
                            ></i>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { Button } from '~/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '~/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'

//
// const nonUserTeams: TeamID[] = Object.keys(tradeStore.teamNames).filter(
//     (teamId) => teamId !== authStore.getUser()._id,
// )

const nonUserTeams = ref([
    'ColorBurst Coatings',
    'Spectrum Paintworks',
    'PrimeHue Industries',
    'VividBlend Paints',
    'EverGloss Solutions',
])

const teamOpen = ref(false)
const teamValue = ref<string | null>(null)
</script>

<style scoped></style>
