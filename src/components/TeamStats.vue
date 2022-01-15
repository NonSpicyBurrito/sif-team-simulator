<script setup lang="ts">
import { computed } from 'vue'
import { thousands } from '../core/formatting'
import { calculateTeamStat } from '../core/stats'
import { isTeamComplete, PartialTeam } from '../core/Team'
import { charts } from '../database'
import { CenterSkill } from '../database/Center'

const props = defineProps<{
    team: PartialTeam
    memoryGalleryBonus: number[]
    chartId: string
    guestCenter: CenterSkill
}>()

const chartAttribute = computed(() => charts.get(props.chartId)?.attribute)

const teamStat = computed(() => {
    if (!isTeamComplete(props.team)) return

    return calculateTeamStat(
        props.team,
        props.memoryGalleryBonus,
        props.chartId,
        props.guestCenter
    )
})
</script>

<template>
    <div
        v-if="teamStat"
        class="flex justify-around items-center my-2 mx-auto max-w-md text-center"
    >
        <div
            v-for="({ base }, index) in teamStat"
            :key="index"
            :class="
                index === chartAttribute
                    ? 'font-semibold'
                    : 'text-sm text-gray-600'
            "
        >
            {{ thousands(base) }}
        </div>
    </div>
</template>
