<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    modelValue: number
    options: Record<string, number>
    min: number
    max: number
    step: number
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()

const optionValue = ref(
    Object.values(props.options).includes(props.modelValue) ? props.modelValue : undefined
)
const customValue = computed({
    get() {
        return props.modelValue * 100
    },
    set(value: number) {
        emit('update:modelValue', value / 100)
    },
})

watch(optionValue, (value) => {
    if (value === undefined) return
    emit('update:modelValue', value)
})
</script>

<template>
    <div class="flex justify-end">
        <input
            v-if="optionValue === undefined"
            v-model="customValue"
            class="mr-1 grow"
            type="number"
            :min="min * 100"
            :max="max * 100"
            :step="step * 100"
        />
        <select v-model="optionValue" :class="optionValue === undefined ? 'w-32' : 'grow'">
            <option v-for="(value, text) in options" :key="value" :value="value">
                {{ text }}
            </option>
            <option :value="undefined">Custom (%)</option>
        </select>
    </div>
</template>
