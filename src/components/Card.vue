<script setup lang="ts">
/* eslint-disable tailwindcss/no-custom-classname */

import { computed } from 'vue'
import { getSkillSimpleDescription } from '../core/skill'
import { Member } from '../core/Team'
import { cards } from '../database'
import AccessoryIcon from './AccessoryIcon.vue'
import CardIcon from './CardIcon.vue'

const props = defineProps<{
    id: number
    level?: number
    sl?: number
    sisNames?: string[]
    accessory?: Member['accessory']
    simple?: boolean
}>()

const simpleDescription = computed(() => {
    const card = cards.get(props.id)
    if (!card) return

    return getSkillSimpleDescription(card.skill)
})
</script>

<template>
    <div class="relative h-16 w-16">
        <CardIcon :="{ id }" />
        <template v-if="accessory">
            <AccessoryIcon :id="accessory.id" class="absolute top-0 left-0 h-6 w-6" />
            <div v-if="level" class="absolute top-0 left-0 rounded-br-sm bg-black/75 px-1 text-xxs">
                {{ accessory.level }}
            </div>
        </template>
        <div class="absolute top-0 right-0 flex flex-col items-end">
            <div v-if="level" class="w-min rounded-bl-sm bg-black/75 px-1 text-xxs">
                {{ level }}
            </div>
            <div v-if="sl" class="w-min rounded-bl-sm bg-black/75 px-1 text-xxs">
                {{ sl }}
            </div>
        </div>
        <div v-if="sisNames" class="absolute bottom-0 flex w-full justify-center">
            <div class="rounded-t-sm bg-black/75 px-1 text-center text-xxs">
                {{ sisNames.join(' ') }}
            </div>
        </div>
        <div v-if="simple" class="absolute bottom-0 flex w-full justify-center">
            <div class="rounded-t-sm bg-black/75 px-1 text-center text-xxs">
                {{ simpleDescription }}
            </div>
        </div>
    </div>
</template>
