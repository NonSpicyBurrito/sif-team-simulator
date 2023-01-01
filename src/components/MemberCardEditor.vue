<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */

import { getSkillDescription } from '../core/skill'
import { Member } from '../core/Team'
import { cards } from '../database'
import Field from './Field.vue'

const props = defineProps<{
    member: Member
}>()

function viewDetails() {
    window.open(`https://sif.kirara.ca/card/${props.member.card.id}`, '_blank')
}

function editData() {
    const card = cards.get(props.member.card.id)
    if (!card) return

    try {
        const data = prompt('Edit card data:', JSON.stringify(card))
        if (!data) return

        Object.assign(card, JSON.parse(data))
    } catch (error) {
        alert('Invalid data')
    }
}
</script>

<template>
    <Field label="Card">
        <button @click="viewDetails">View Details</button>
        <button class="ml-2" @click="editData">Edit Data</button>
    </Field>
    <Field label="Card Level">
        <input
            v-model="member.card.level"
            class="w-full"
            type="number"
            min="100"
            max="500"
            step="10"
        />
    </Field>
    <Field label="Card Skill Level">
        <div class="-mb-1 flex flex-wrap">
            <button
                v-for="sl in 8"
                :key="sl"
                class="mr-1 mb-1"
                :class="{ 'opacity-25': sl !== member.card.sl }"
                @click="member.card.sl = sl"
            >
                {{ sl }}
            </button>
        </div>
    </Field>
    <Field label="Card Skill">
        <div class="py-1 first-letter:uppercase">
            {{ getSkillDescription(cards.get(member.card.id)!.skill, member.card.sl) }}
        </div>
    </Field>
</template>
