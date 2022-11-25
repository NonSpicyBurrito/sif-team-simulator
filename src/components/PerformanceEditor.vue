<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */

import PercentageInput from '../components/PercentageInput.vue'
import { Performance } from '../core/simulation/performance'
import Field from './Field.vue'

const props = defineProps<{
    performance: Performance
}>()

function addOverwrite() {
    try {
        const rawNoteNumber = prompt('Edit note number:', '')
        if (!rawNoteNumber) return
        const noteNumber = +rawNoteNumber
        if (isNaN(noteNumber)) throw 'Invalid note number'

        const rawJudgment = prompt(
            'Edit judgment (0 = Perfect, 1 = Great, 2 = Good, 3 = Bad, 4 = Miss):',
            '4'
        )
        if (!rawJudgment) return
        const judgment = +rawJudgment
        if (![0, 1, 2, 3, 4].includes(judgment)) throw 'Invalid judgment'

        props.performance.overwrites[noteNumber] = judgment
    } catch (error) {
        alert('Invalid data')
    }
}

function removeOverwrite(note: number) {
    delete props.performance.overwrites[note]
}
</script>

<template>
    <Field label="Perfect">
        <PercentageInput
            v-model="performance.perfect"
            :options="{
                '100%': 1,
                '95%': 0.95,
                '90%': 0.9,
                '85%': 0.85,
                '80%': 0.8,
                '75%': 0.75,
                '0%': 0,
            }"
            :min="0"
            :max="1"
            :step="0.05"
        />
    </Field>
    <Field label="Great">
        <PercentageInput
            v-model="performance.great"
            :options="{
                '100%': 1,
                '25%': 0.25,
                '20%': 0.2,
                '15%': 0.15,
                '10%': 0.1,
                '5%': 0.05,
                '2%': 0.02,
                '1%': 0.01,
                '0.5%': 0.005,
                '0.1%': 0.001,
                '0%': 0,
            }"
            :min="0"
            :max="1"
            :step="0.05"
        />
    </Field>
    <Field label="Good">
        <PercentageInput
            v-model="performance.good"
            :options="{
                '100%': 1,
                '25%': 0.25,
                '20%': 0.2,
                '15%': 0.15,
                '10%': 0.1,
                '5%': 0.05,
                '2%': 0.02,
                '1%': 0.01,
                '0.5%': 0.005,
                '0.1%': 0.001,
                '0%': 0,
            }"
            :min="0"
            :max="1"
            :step="0.05"
        />
    </Field>
    <Field label="Bad">
        <PercentageInput
            v-model="performance.bad"
            :options="{
                '100%': 1,
                '25%': 0.25,
                '20%': 0.2,
                '15%': 0.15,
                '10%': 0.1,
                '5%': 0.05,
                '2%': 0.02,
                '1%': 0.01,
                '0.5%': 0.005,
                '0.1%': 0.001,
                '0%': 0,
            }"
            :min="0"
            :max="1"
            :step="0.05"
        />
    </Field>
    <Field label="Miss">
        <PercentageInput
            v-model="performance.miss"
            :options="{
                '100%': 1,
                '25%': 0.25,
                '20%': 0.2,
                '15%': 0.15,
                '10%': 0.1,
                '5%': 0.05,
                '2%': 0.02,
                '1%': 0.01,
                '0.5%': 0.005,
                '0.1%': 0.001,
                '0%': 0,
            }"
            :min="0"
            :max="1"
            :step="0.05"
        />
    </Field>

    <Field label="Overwrites">
        <div v-for="(judgment, note) in performance.overwrites" :key="note" class="mb-2">
            <button @click="removeOverwrite(note)">✗</button>
            <span class="ml-2">
                #{{ note }}:
                {{ ['Perfect', 'Great', 'Good', 'Bad', 'Miss'][judgment] }}
            </span>
        </div>
        <button @click="addOverwrite">Add</button>
    </Field>
</template>
