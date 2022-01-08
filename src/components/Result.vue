<script setup lang="ts">
import { computed, ref } from 'vue'
import { getChartDescription } from '../core/chart'
import { duration, percent, small, thousands } from '../core/formatting'
import { simulateScore } from '../core/simulation'
import { charts } from '../database'
import Field from './Field.vue'
import Histogram from './Histogram.vue'

const props = defineProps<{
    chartId: string
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

const selected = ref<keyof typeof sections['value']>('score')
</script>

<template>
    <div class="surface">
        <Field label="Chart">
            {{ getChartDescription(charts.get(chartId)!) }}
        </Field>
        <Field
            v-for="([label, formatter, title], key) in sections"
            :key="key"
            :label="label"
        >
            <button class="w-full" @click="selected = key">
                <template v-if="title">
                    {{ title }}
                </template>
                <template v-else>
                    <span>{{ formatter(result[key].mean) }}</span>
                    <span class="ml-2 text-sm text-gray-500">
                        ± {{ formatter(result[key].stdev) }}
                    </span>
                </template>
            </button>
        </Field>
        <Field label="Time">
            {{ duration(time) }}
        </Field>

        <Histogram
            :data="result[selected]"
            :formatter="sections[selected][1]"
        />
    </div>

    <div v-if="result.diagnostics.length" class="surface">
        <div class="overflow-y-auto h-[75vh] font-mono">
            <div
                v-for="(line, index) in result.diagnostics"
                :key="index"
                class="p-1 border-b-[1px] border-gray-700"
            >
                {{ line }}
            </div>
        </div>
    </div>
</template>
