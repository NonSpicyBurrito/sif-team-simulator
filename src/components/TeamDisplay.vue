<script setup lang="ts">
import { PartialTeam } from '../core/Team'
import Card from './Card.vue'

defineProps<{
    team: PartialTeam
    modelValue: number
}>()

defineEmits<{
    (e: 'update:modelValue', id: number): void
}>()
</script>

<template>
    <div class="flex justify-center">
        <div
            v-for="(member, index) in team"
            :key="index"
            class="m-1 rounded-full cursor-pointer"
            :class="{
                'ring-4 ring-white': modelValue === index,
                'opacity-25': modelValue !== -1 && modelValue !== index,
            }"
            @click="
                $emit('update:modelValue', modelValue === index ? -1 : index)
            "
        >
            <Card
                v-if="member"
                :id="member.card.id"
                :level="member.card.level"
                :sl="member.card.sl"
                :sis-names="member.sisNames"
                :accessory="member.accessory"
            />
            <div v-else class="w-16 h-16 bg-white/10 rounded-full" />
        </div>
    </div>
</template>
