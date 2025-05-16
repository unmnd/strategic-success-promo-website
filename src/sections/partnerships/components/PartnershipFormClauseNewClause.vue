<template>
    <div class="h-[300px] w-full border rounded-md bg-background overflow-hidden flex flex-col">
        <div class="flex items-center border-b px-3">
            <input
                v-model="searchQuery"
                class="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search clause..."
            />
        </div>

        <div class="overflow-y-auto">
            <div
                v-if="filteredGroups.length === 0"
                class="h-full flex items-center justify-center p-6"
            >
                No clauses found.
            </div>

            <div v-else>
                <template v-for="clauseGroup in filteredGroups" :key="clauseGroup.heading">
                    <div class="pt-2 px-2 text-xs font-medium text-muted-foreground">
                        {{ clauseGroup.heading }}
                    </div>

                    <div
                        v-for="clauseID in clauseGroup.clauses"
                        :key="clauseID"
                        @click="selectClause(clauseID)"
                    >
                        <div
                            class="flex gap-2 items-center relative cursor-default rounded-sm px-2 py-3 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
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
                    </div>

                    <div class="h-px bg-border my-1 last:hidden"></div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { clauses, clauseGroups } from '../partnerships.config'

const searchQuery = ref('')

const filteredGroups = computed(() => {
    if (!searchQuery.value.trim()) {
        return clauseGroups
    }

    const query = searchQuery.value.toLowerCase()

    return (
        clauseGroups
            .map((group) => {
                // Filter clauses within each group
                const filteredClauses = group.clauses.filter((clauseID) => {
                    const clause = clauses[clauseID as keyof typeof clauses]
                    return (
                        clause.title.toLowerCase().includes(query) ||
                        clause.description.toLowerCase().includes(query)
                    )
                })

                // Return a new group object with only matching clauses
                return {
                    ...group,
                    clauses: filteredClauses,
                }
            })
            // Only keep groups that have at least one matching clause
            .filter((group) => group.clauses.length > 0)
    )
})

function selectClause(clauseID: string) {
    // Handle clause selection - you can emit an event or implement other logic here
    console.log('Selected clause:', clauseID)
}
</script>

<style scoped></style>
