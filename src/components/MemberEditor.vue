<script setup lang="ts">
import { Member } from '../core/Team'
import { sises } from '../database'
import Field from './Field.vue'
import MemberAccessoryEditor from './MemberAccessoryEditor.vue'
import MemberCardEditor from './MemberCardEditor.vue'

const props = defineProps<{
    member: Member
}>()

function toggleSis(name: string) {
    const sisNames = props.member.sisNames
    if (sisNames.includes(name)) {
        sisNames.splice(sisNames.indexOf(name), 1)
    } else {
        sisNames.push(name)
    }
}
</script>

<template>
    <MemberCardEditor :="{ member }" />

    <Field label="SIS">
        <button
            v-for="name in sises.keys()"
            :key="name"
            class="mr-1 mb-1"
            :class="{
                'opacity-25': !member.sisNames.includes(name),
            }"
            @click="toggleSis(name)"
        >
            {{ name }}
        </button>
    </Field>

    <MemberAccessoryEditor :="{ member }" />
</template>
