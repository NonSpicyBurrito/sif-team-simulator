<script setup lang="ts">
/* eslint-disable tailwindcss/no-custom-classname */

import { computed } from 'vue'
import { getSkillSimpleDescription } from '../core/skill'
import { accessories } from '../database'
import AccessoryIcon from './AccessoryIcon.vue'

const props = defineProps<{
    id: string
    simple?: boolean
}>()

const simpleDescription = computed(() => {
    const accessory = accessories.get(props.id)
    if (!accessory) return

    return getSkillSimpleDescription(accessory.skill)
})
</script>

<template>
    <div class="relative">
        <AccessoryIcon :="{ id }" />
        <div v-if="simple" class="absolute bottom-0 flex w-full justify-center">
            <div class="bg-black/75 px-1 text-center text-xxs">
                {{ simpleDescription }}
            </div>
        </div>
    </div>
</template>
