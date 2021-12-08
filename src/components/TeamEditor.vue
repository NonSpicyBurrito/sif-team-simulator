<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */

import { computed, ref } from 'vue'
import { thousands } from '../core/formatting'
import { calculateTeamStat } from '../core/stats'
import { isTeamComplete, PartialTeam } from '../core/Team'
import { cards } from '../database'
import CardSelector from './CardSelector.vue'
import MemberEditor from './MemberEditor.vue'
import TeamDisplay from './TeamDisplay.vue'

const props = defineProps<{
    team: PartialTeam
    memoryGalleryBonus: number[]
    guestCenter: number
}>()

const teamStat = computed(() => {
    if (!isTeamComplete(props.team)) return

    return calculateTeamStat(
        props.team,
        props.memoryGalleryBonus,
        props.guestCenter
    )
})

const selected = ref(-1)
const member = computed(() => props.team[selected.value])

function moveMember(direction: -1 | 1) {
    const newIndex = selected.value + direction
    if (newIndex < 0 || newIndex > 8) return
    const member = props.team[selected.value]
    props.team[selected.value] = props.team[newIndex]
    props.team[newIndex] = member
    selected.value = newIndex
}

function deleteMember() {
    props.team[selected.value] = null
}

function selectCard(cardId: number) {
    const card = cards.get(cardId)
    if (!card) throw 'Card not found'

    const stats = [...card.stats]
    stats[card.attribute] += 1000

    props.team[selected.value] = {
        card: {
            id: cardId,
            level: 100,
            sl: 8,
        },
        sisNames: [],
    }
}
</script>

<template>
    <div class="my-8">
        <div class="flex justify-center">
            <TeamDisplay v-model="selected" :="{ team }" />
        </div>
        <div
            v-if="teamStat"
            class="flex justify-center items-center my-2 text-center"
        >
            <div class="w-32 text-sm text-gray-600">
                {{ thousands(teamStat.param) }}
            </div>
            <div class="w-32 font-semibold">
                {{ thousands(teamStat.base) }}
            </div>
            <div class="w-32 text-sm text-gray-600">
                {{ thousands(teamStat.trick) }}
            </div>
        </div>
    </div>

    <div v-if="selected !== -1" class="surface">
        <template v-if="member">
            <div class="flex justify-center mb-8">
                <button class="mx-1" @click="moveMember(-1)">Move Left</button>
                <button class="mx-1" @click="deleteMember()">Delete</button>
                <button class="mx-1" @click="moveMember(1)">Move Right</button>
            </div>
            <MemberEditor :="{ member }" />
        </template>
        <CardSelector v-else @select="selectCard" />
    </div>
</template>
