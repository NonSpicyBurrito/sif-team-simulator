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
    <div class="relative w-16 h-16">
        <CardIcon :="{ id }" />
        <template v-if="accessory">
            <AccessoryIcon
                :id="accessory.id"
                class="absolute top-0 left-0 w-6 h-6"
            />
            <div v-if="level" class="absolute top-0 left-0 tag">
                {{ accessory.level }}
            </div>
        </template>
        <div class="flex absolute top-0 right-0 flex-col items-end">
            <div v-if="level" class="w-min tag">
                {{ level }}
            </div>
            <div v-if="sl" class="w-min tag">
                {{ sl }}
            </div>
        </div>
        <div
            v-if="sisNames"
            class="flex absolute bottom-0 justify-center w-full"
        >
            <div class="text-center tag">
                {{ sisNames.join(' ') }}
            </div>
        </div>
        <div v-if="simple" class="flex absolute bottom-0 justify-center w-full">
            <div class="text-center tag">
                {{ simpleDescription }}
            </div>
        </div>
    </div>
</template>
