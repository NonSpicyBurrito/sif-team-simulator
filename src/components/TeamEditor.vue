<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */

import { computed, ref } from 'vue'
import { PartialTeam } from '../core/Team'
import { cards } from '../database'
import { CenterSkill } from '../database/Center'
import CardSelector from './CardSelector.vue'
import MemberEditor from './MemberEditor.vue'
import TeamDisplay from './TeamDisplay.vue'
import TeamStats from './TeamStats.vue'

const props = defineProps<{
    team: PartialTeam
    memoryGalleryBonus: number[]
    chartId: string
    guestCenter: CenterSkill
}>()

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
        <TeamStats :="{ team, memoryGalleryBonus, chartId, guestCenter }" />
    </div>

    <div v-if="selected !== -1" class="surface">
        <template v-if="member">
            <div class="mb-8 flex justify-center">
                <button class="mx-1" @click="moveMember(-1)">◄</button>
                <button class="mx-1" @click="deleteMember()">✗</button>
                <button class="mx-1" @click="moveMember(1)">►</button>
            </div>
            <MemberEditor :="{ member }" />
        </template>
        <CardSelector v-else @select="selectCard" />
    </div>
</template>
