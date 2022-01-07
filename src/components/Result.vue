<script setup lang="ts">
import { ref } from 'vue'
import { getChartDescription } from '../core/chart'
import { duration, percent, small, thousands } from '../core/formatting'
import { simulateScore } from '../core/simulation'
import { charts } from '../database'
import Field from './Field.vue'
import Histogram from './Histogram.vue'

defineProps<{
    chartId: string
    time: number
    summary: ReturnType<typeof simulateScore>
}>()

const sections = {
    score: ['Score', thousands],
    scorePerNote: ['Score / Note', thousands],
    overhealHearts: ['Overheal Hearts', small],
    plockCoverage: ['Plock Coverage', percent],
} as const

const selected = ref<keyof typeof sections>('score')
</script>

<template>
    <div class="surface">
        <Field label="Chart">
            {{ getChartDescription(charts.get(chartId)!) }}
        </Field>
        <Field
            v-for="([label, formatter], key) in sections"
            :key="key"
            :label="label"
        >
            <button class="w-full" @click="selected = key">
                <span>{{ formatter(summary[key].mean) }}</span>
                <span class="ml-2 text-sm text-gray-500">
                    ± {{ formatter(summary[key].stdev) }}
                </span>
            </button>
        </Field>
        <Field label="Time">
            {{ duration(time) }}
        </Field>

        <Histogram
            :data="summary[selected]"
            :formatter="sections[selected][1]"
        />
    </div>

    <div v-if="summary.diagnostics.length" class="surface">
        <div class="overflow-y-auto h-[75vh] font-mono">
            <p
                v-for="(line, index) in summary.diagnostics"
                :key="index"
                class="p-1 border-b-[1px] border-gray-700"
            >
                {{ line }}
            </p>
        </div>
    </div>
</template>
