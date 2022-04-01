<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */

import { getSkillDescription } from '../core/skill'
import { Member } from '../core/Team'
import { accessories, cards } from '../database'
import Accessory from './Accessory.vue'
import Field from './Field.vue'

const props = defineProps<{
    member: Member
}>()

function editData() {
    try {
        if (!props.member.accessory) return

        const accessory = accessories.get(props.member.accessory.id)
        if (!accessory) return

        const data = prompt('Edit accessory data:', JSON.stringify(accessory))
        if (!data) throw 'No data'

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
            <button class="ml-2" @click="editData">Edit Data</button>
        </template>
        <div v-else class="flex flex-wrap -mb-1">
            <template
                v-for="[id, accessory] in accessories.entries()"
                :key="id"
            >
                <Accessory
                    v-if="
                        accessory.character === 0 ||
                        accessory.character ===
                            cards.get(member.card.id)?.character
                    "
                    class="mr-1 mb-1 w-12 h-12 cursor-pointer"
                    :="{ id }"
                    simple
                    @click="member.accessory = { id, level: 8 }"
                />
            </template>
        </div>
    </Field>
    <template v-if="member.accessory">
        <Field label="Accessory Level">
            <div class="flex flex-wrap -mb-1">
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
                    getSkillDescription(accessories.get(member.accessory.id)!.skill, member.accessory.level)
                }}
            </div>
        </Field>
    </template>
</template>
