<script setup lang="ts">
import { ref } from 'vue'
import About from './views/About.vue'
import Simulator from './views/Simulator.vue'

const tabs = {
    Simulator,
    About,
} as const

const current = ref<keyof typeof tabs>('Simulator')
</script>

<template>
    <div class="p-4">
        <div class="mt-4 mb-8 sm:mb-16">
            <div class="text-2xl font-bold text-center sm:text-5xl">
                SIF Team Simulator
            </div>

            <div class="flex mx-auto mt-4 max-w-lg sm:mt-8">
                <a
                    v-for="(value, name) in tabs"
                    :key="name"
                    class="basis-0 grow p-2 text-center cursor-pointer sm:p-4"
                    :class="{ 'border-b-2 ': current === name }"
                    @click="current = name"
                >
                    {{ name }}
                </a>
            </div>
        </div>

        <component :is="tabs[current]" />
    </div>
</template>
