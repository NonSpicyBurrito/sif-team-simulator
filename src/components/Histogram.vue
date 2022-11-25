<script setup lang="ts">
import { percent } from '../core/formatting'
import { summarize } from '../core/presentation'

defineProps<{
    data: ReturnType<typeof summarize>[string]
    formatter: (value: number) => string
}>()
</script>

<template>
    <div class="relative mt-16 flex h-48 border-b-2 border-l-2 border-gray-300 sm:h-96">
        <div
            v-for="({ value, percentile }, i) in data.histogram"
            :key="i"
            class="group peer flex h-full grow basis-0 flex-col justify-end"
        >
            <div
                class="bg-gray-700 transition-all group-hover:bg-gray-600"
                :style="{ height: `${95 * value}%` }"
            />
            <div class="absolute top-0 right-0 hidden text-right group-hover:block">
                <div>
                    {{ formatter(data.min + ((data.max - data.min) * i) / data.histogram.length) }}
                </div>
                <div class="text-sm text-gray-500">≥ {{ percent(percentile) }}</div>
            </div>
        </div>
        <div class="absolute top-0 right-0 text-right peer-hover:hidden">
            <template v-for="[percentile, value] in data.percentiles" :key="percentile">
                <div>
                    {{ formatter(value) }}
                </div>
                <div class="mb-2 text-sm text-gray-500">≥ {{ percent(percentile) }}</div>
            </template>
        </div>
    </div>
    <div class="my-2 flex justify-between">
        <div>
            {{ formatter(data.min) }}
        </div>
        <div>
            {{ formatter(data.max) }}
        </div>
    </div>
</template>
