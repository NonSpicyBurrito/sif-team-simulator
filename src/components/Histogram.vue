<script setup lang="ts">
import { summarize } from '../core/presentation'

defineProps<{
    data: ReturnType<typeof summarize>[string]
    formatter: (value: number) => string
}>()
</script>

<template>
    <div class="relative mt-16 h-96 border-b-2 border-l-2 border-gray-300">
        <div v-for="(value, i) in data.histogram" :key="i" class="group">
            <div
                class="absolute top-0 bottom-0"
                :style="{
                    left: `${(100 * i) / data.histogram.length}%`,
                    width: `${100 / data.histogram.length}%`,
                }"
            >
                <div
                    class="absolute right-0 bottom-0 left-0 bg-gray-700 group-hover:bg-gray-600"
                    :style="{ height: `${95 * value}%` }"
                />
            </div>
            <div class="hidden group-hover:block absolute top-0 right-0">
                {{
                    formatter(
                        data.min +
                            ((data.max - data.min) * i) /
                                (data.histogram.length - 1)
                    )
                }}
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
