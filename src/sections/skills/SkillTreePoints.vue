<template>
    <div class="flex flex-col items-center">
        <div>Skill Points</div>
        <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
            {{ teamStore.teamStats.skillPoints }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTeamStore } from '~/modules/team/team.store'

const teamStore = (await useTeamStore)()
</script>

<style scoped></style>
