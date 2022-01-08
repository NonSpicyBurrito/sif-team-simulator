<script setup lang="ts">
import { percent } from '../core/formatting'
import { summarize } from '../core/presentation'

defineProps<{
    data: ReturnType<typeof summarize>[string]
    formatter: (value: number) => string
}>()
</script>

<template>
    <div
        class="flex relative mt-16 h-48 border-b-2 border-l-2 border-gray-300 sm:h-96"
    >
        <div
            v-for="({ value, percentile }, i) in data.histogram"
            :key="i"
            class="group flex basis-0 flex-col grow justify-end h-full"
        >
            <div
                class="bg-gray-700 group-hover:bg-gray-600"
                :style="{ height: `${95 * value}%` }"
            />
            <div
                class="hidden group-hover:block absolute top-0 right-0 text-right"
            >
                <div>
                    {{
                        formatter(
                            data.min +
                                ((data.max - data.min) * i) /
                                    (data.histogram.length - 1)
                        )
                    }}
                </div>
                <div class="text-sm text-gray-500">
                    ≥ {{ percent(percentile) }}
                </div>
            </div>
        </div>
    </div>
    <div class="flex justify-between my-2">
        <div>
            {{ formatter(data.min) }}
        </div>
        <div>
            {{ formatter(data.max) }}
        </div>
    </div>
</template>
