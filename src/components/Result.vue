<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { getChartDescription } from '../core/chart'
import { duration, percent, small, thousands } from '../core/formatting'
import { simulateScore } from '../core/simulation'
import { Team } from '../core/Team'
import { charts } from '../database'
import { CenterSkill } from '../database/Center'
import Field from './Field.vue'
import Histogram from './Histogram.vue'
import TeamDisplay from './TeamDisplay.vue'
import TeamStats from './TeamStats.vue'

const props = defineProps<{
    mode: string
    memoryGalleryBonus: number[]
    chartId: string
    guestCenter: CenterSkill
    team: Team
    time: number
    result: ReturnType<typeof simulateScore>
}>()

const sections = computed(
    () =>
        ({
            survivedNotes: [
                'Survival Rate',
                thousands,
                percent(props.result.survivalRate),
            ],
            score: ['Score', thousands],
            scorePerNote: ['Score / Note', thousands],
            overhealHearts: ['Overheal Hearts', small],
            plockCoverage: ['Plock Coverage', percent],
        } as const)
)

const selected = ref<keyof typeof sections['value']>('survivedNotes')

watchEffect(() => {
    if (selected.value === 'survivedNotes' && props.mode !== 'afk') {
        selected.value = 'score'
    }
})

function exportData() {
    console.log(props.result.raw)
}

const isExpanded = ref<number[]>([])
watch(
    () => props.result.diagnostics,
    () => (isExpanded.value = [])
)

function toggleDiagnosticExpansion(index: number) {
    if (isExpanded.value.includes(index)) {
        isExpanded.value = isExpanded.value.filter((i) => i !== index)
    } else {
        isExpanded.value.push(index)
    }
}
</script>

<template>
    <div class="surface">
        <div class="mb-8">
            <TeamDisplay :="{ team }" />
            <TeamStats :="{ team, memoryGalleryBonus, chartId, guestCenter }" />
        </div>

        <Field label="Chart">
            {{ getChartDescription(charts.get(chartId)!) }}
        </Field>

        <template
            v-for="([label, formatter, title], key) in sections"
            :key="key"
        >
            <Field
                v-if="key !== 'survivedNotes' || mode === 'afk'"
                :label="label"
            >
                <button class="w-full select-text" @click="selected = key">
                    <div v-if="title">
                        {{ title }}
                    </div>
                    <div v-else>
                        <span>{{ formatter(result[key].mean) }}</span>
                        <span class="ml-2 text-sm text-gray-500">
                            ± {{ formatter(result[key].stdev) }}
                        </span>
                    </div>
                </button>
            </Field>
        </template>

        <Field label="Time">
            {{ duration(time) }}
        </Field>

        <Field label="Data">
            <button @click="exportData">Export</button>
        </Field>

        <Histogram
            :data="result[selected]"
            :formatter="sections[selected][1]"
        />
    </div>

    <div v-if="result.diagnostics.length" class="surface">
        <div class="overflow-y-auto h-[75vh] font-mono">
            <div
                v-for="(message, index) in result.diagnostics"
                :key="index"
                class="p-1 border-b-[1px] border-gray-700"
                @click="toggleDiagnosticExpansion(index)"
            >
                <template v-if="message.includes('\n')">
                    <template v-if="isExpanded.includes(index)">
                        ▼ <span class="whitespace-pre-wrap">{{ message }}</span>
                    </template>
                    <template v-else>
                        ►
                        <span class="whitespace-pre-wrap">{{
                            message.split('\n')[0]
                        }}</span
                        >...
                    </template>
                </template>
                <template v-else>
                    <span class="whitespace-pre-wrap">{{ message }}</span>
                </template>
            </div>
        </div>
    </div>
</template>
