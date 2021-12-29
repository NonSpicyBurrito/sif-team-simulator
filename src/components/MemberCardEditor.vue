<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */

import { getSkillDescription } from '../core/skill'
import { Member } from '../core/Team'
import { cards } from '../database'
import Field from './Field.vue'

defineProps<{
    member: Member
}>()
</script>

<template>
    <Field label="Card Level">
        <input
            v-model="member.card.level"
            class="w-full"
            type="number"
            min="100"
            max="200"
            step="10"
        />
    </Field>
    <Field label="Card Skill Level">
        <div class="flex flex-wrap -mb-1">
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
            {{
                getSkillDescription(cards.get(member.card.id)!.skill, member.card.sl)
            }}
        </div>
    </Field>
</template>
