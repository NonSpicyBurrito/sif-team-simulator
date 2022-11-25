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
            <div v-if="level" class="tag absolute top-0 left-0">
                {{ accessory.level }}
            </div>
        </template>
        <div class="absolute top-0 right-0 flex flex-col items-end">
            <div v-if="level" class="tag w-min">
                {{ level }}
            </div>
            <div v-if="sl" class="tag w-min">
                {{ sl }}
            </div>
        </div>
        <div v-if="sisNames" class="absolute bottom-0 flex w-full justify-center">
            <div class="tag text-center">
                {{ sisNames.join(' ') }}
            </div>
        </div>
        <div v-if="simple" class="absolute bottom-0 flex w-full justify-center">
            <div class="tag text-center">
                {{ simpleDescription }}
            </div>
        </div>
    </div>
</template>
