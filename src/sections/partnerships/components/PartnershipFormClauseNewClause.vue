<template>
    <Command class="h-[300px]">
        <CommandInput class="h-9" placeholder="Search clause..." />
        <CommandEmpty class="h-full">
            <div class="h-full flex items-center justify-center">No clauses found.</div>
        </CommandEmpty>
        <CommandList>
            <template v-for="clauseGroup in clauseGroups" :key="clauseGroup.heading">
                <CommandGroup :heading="clauseGroup.heading">
                    <CommandItem
                        v-for="clauseID in clauseGroup.clauses"
                        :key="clauseID"
                        :value="clauseID"
                    >
                        <div class="flex gap-2 items-center">
                            <i
                                class="text-xl mr-1"
                                :class="clauses[clauseID as keyof typeof clauses].icon"
                            ></i>

                            <div class="flex flex-col gap-2">
                                <div class="font-bold">
                                    {{ clauses[clauseID as keyof typeof clauses].title }}
                                </div>

                                <div class="text-sm text-gray-500">
                                    {{ clauses[clauseID as keyof typeof clauses].description }}
                                </div>
                            </div>
                        </div>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator class="last:hidden" />
            </template>
        </CommandList>
    </Command>
</template>

<script setup lang="ts">
import { clauses, clauseGroups } from '../partnerships.config'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '~/components/ui/command'
</script>

<style scoped></style>
