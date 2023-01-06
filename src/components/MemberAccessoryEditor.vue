<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */

import { computed } from 'vue'
import { getSkillDescription } from '../core/skill'
import { Member } from '../core/Team'
import { accessories, cards } from '../database'
import Accessory from './Accessory.vue'
import Field from './Field.vue'

const props = defineProps<{
    member: Member
}>()

const url = computed(
    () =>
        `https://sif.kirara.ca/accessories/search?id=${encodeURIComponent(
            `eq,${props.member.accessory?.id}`
        )}`
)

const accessorySections = computed(() => [
    getAccessoriesOfCharacter(cards.get(props.member.card.id)?.character),
    getAccessoriesOfCharacter(0),
])

function getAccessoriesOfCharacter(character?: number) {
    return [...accessories.entries()]
        .filter(([, accessory]) => accessory.character === character)
        .map(([id]) => id)
}

function editData() {
    if (!props.member.accessory) return

    const accessory = accessories.get(props.member.accessory.id)
    if (!accessory) return

    try {
        const data = prompt('Edit accessory data:', JSON.stringify(accessory))
        if (!data) return

        Object.assign(accessory, JSON.parse(data))
    } catch (error) {
        alert('Invalid data')
    }
}
</script>

<template>
    <Field label="Accessory">
        <template v-if="member.accessory">
            <button @click="member.accessory = undefined">✗</button>
            <a class="button ml-2" :href="url" target="_blank">View Details</a>
            <button class="ml-2" @click="editData">Edit Data</button>
        </template>
        <div
            v-for="(section, index) in accessorySections"
            v-else
            :key="index"
            class="flex flex-wrap"
        >
            <template v-for="id in section" :key="id">
                <Accessory
                    class="mr-1 mb-1 h-12 w-12 cursor-pointer"
                    :="{ id }"
                    simple
                    @click="member.accessory = { id, level: 8 }"
                />
            </template>
        </div>
    </Field>
    <template v-if="member.accessory">
        <Field label="Accessory Level">
            <div class="-mb-1 flex flex-wrap">
                <button
                    v-for="level in 8"
                    :key="level"
                    class="mr-1 mb-1"
                    :class="{ 'opacity-25': member.accessory.level !== level }"
                    @click="member.accessory = { id: member.accessory!.id, level }"
                >
                    {{ level }}
                </button>
            </div>
        </Field>
        <Field label="Accessory Skill">
            <div class="py-1 first-letter:uppercase">
                {{
                    getSkillDescription(
                        accessories.get(member.accessory.id)!.skill,
                        member.accessory.level
                    )
                }}
            </div>
        </Field>
    </template>
</template>
