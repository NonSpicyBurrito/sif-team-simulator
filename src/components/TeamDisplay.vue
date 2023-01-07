<script setup lang="ts">
import { computed } from 'vue'
import { getSkillSimpleDescription } from '../core/skill'
import { Member, PartialTeam } from '../core/Team'
import { cards } from '../database'
import Card from './Card.vue'

const props = defineProps<{
    team: PartialTeam
    modelValue?: number
}>()

defineEmits<{
    (e: 'update:modelValue', id: number): void
}>()

const teamInfo = computed(() =>
    props.team.map((member) => ({ member, description: getMemberDescription(member) }))
)

function getMemberDescription(member: Member | null) {
    if (!member) return

    const card = cards.get(member.card.id)
    if (!card) return

    return getSkillSimpleDescription(card.skill)
}
</script>

<template>
    <div class="flex flex-wrap justify-center">
        <div
            v-for="({ member, description }, index) in teamInfo"
            :key="index"
            class="m-1 flex flex-col items-center justify-end transition-opacity"
        >
            <span
                v-if="description"
                class="rounded-t-sm bg-white/5 px-1 text-center text-xxs transition-opacity"
                :class="{ 'opacity-25': ![undefined, -1].includes(modelValue) }"
            >
                {{ description }}
            </span>
            <div
                class="rounded-full transition-all"
                :class="{
                    'cursor-pointer': modelValue !== undefined,
                    'ring-4 ring-white': modelValue === index,
                    'opacity-25': ![undefined, -1, index].includes(modelValue),
                }"
                @click="$emit('update:modelValue', modelValue === index ? -1 : index)"
            >
                <Card
                    v-if="member"
                    :id="member.card.id"
                    :level="member.card.level"
                    :sl="member.card.sl"
                    :sis-names="member.sisNames"
                    :accessory="member.accessory"
                />
                <div v-else class="h-16 w-16 rounded-full bg-white/10" />
            </div>
        </div>
    </div>
</template>
