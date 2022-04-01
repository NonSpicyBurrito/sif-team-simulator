<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */

import PercentageInput from '../components/PercentageInput.vue'
import { Performance } from '../core/simulation/performance'
import Field from './Field.vue'

defineProps<{
    performance: Performance
}>()
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
                '5%': 0.5,
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
                '5%': 0.5,
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
                '5%': 0.5,
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
                '5%': 0.5,
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
</template>
