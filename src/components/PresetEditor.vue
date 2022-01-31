<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { isTeamEmpty, PartialTeam } from '../core/Team'
import { clone } from '../core/utils'
import TeamDisplay from './TeamDisplay.vue'

const props = defineProps<{
    team: PartialTeam
}>()

defineEmits<{
    (e: 'select', team: PartialTeam): void
}>()

const presetTeams = useLocalStorage('preset.teams', [] as PartialTeam[])

const canSave = computed(() => !isTeamEmpty(props.team))

function saveTeam() {
    presetTeams.value.push(clone(props.team))
}

function importPreset() {
    try {
        const data = prompt('Paste preset data:', '[]')
        if (!data) throw 'No data'

        presetTeams.value.push(...JSON.parse(data))
    } catch (error) {
        alert('Invalid data')
    }
}

function exportPreset() {
    try {
        navigator.clipboard.writeText(JSON.stringify(presetTeams.value))
        alert('Preset exported to clipboard')
    } catch (error) {
        alert('Failed to copy to clipboard')
    }
}

function deletePresetTeam(index: number) {
    presetTeams.value.splice(index, 1)
}

function movePresetTeam(index: number, direction: -1 | 1) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= presetTeams.value.length) return

    const team = presetTeams.value[index]
    presetTeams.value[index] = presetTeams.value[newIndex]
    presetTeams.value[newIndex] = team
}
</script>

<template>
    <div class="flex flex-col items-center surface">
        <div
            class="flex justify-center"
            :class="{ 'mb-8': presetTeams.length }"
        >
            <button class="mx-1" @click="importPreset()">Import Preset</button>
            <button
                class="mx-1"
                :disabled="!presetTeams.length"
                @click="exportPreset()"
            >
                Export Preset
            </button>
            <button class="mx-1" :disabled="!canSave" @click="saveTeam()">
                Save Team
            </button>
        </div>
        <div
            v-for="(presetTeam, i) in presetTeams"
            :key="i"
            class="flex flex-col justify-center my-2 sm:flex-row"
        >
            <button @click="$emit('select', presetTeam)">
                <TeamDisplay class="my-1" :team="presetTeam" />
            </button>
            <div
                class="flex justify-center mt-2 text-sm sm:flex-col sm:mt-0 sm:ml-2"
            >
                <button @click="movePresetTeam(i, -1)">▲</button>
                <button
                    class="mx-1 sm:my-1 sm:mx-0"
                    @click="deletePresetTeam(i)"
                >
                    ✗
                </button>
                <button @click="movePresetTeam(i, 1)">▼</button>
            </div>
        </div>
    </div>
</template>
