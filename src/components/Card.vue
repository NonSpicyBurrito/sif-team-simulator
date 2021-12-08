<script setup lang="ts">
/* eslint-disable tailwindcss/no-custom-classname */

import { Member } from '../core/Team'
import AccessoryIcon from './AccessoryIcon.vue'
import CardIcon from './CardIcon.vue'

defineProps<{
    id: number
    level?: number
    sl?: number
    sisNames?: string[]
    accessory?: Member['accessory']
}>()
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
            <div class="tag">
                {{ sisNames.join(' + ') }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.tag {
    @apply px-1 text-xxs bg-black/75;
}
</style>
