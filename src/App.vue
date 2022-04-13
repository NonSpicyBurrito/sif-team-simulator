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
    <div class="bg-white/5 pt-4 shadow-lg sm:mb-4 sm:pt-8">
        <div class="text-center text-2xl font-bold sm:text-5xl">
            SIF Team Simulator
        </div>

        <div class="mx-auto mt-4 flex max-w-lg sm:mt-8">
            <a
                v-for="(value, name) in tabs"
                :key="name"
                class="grow basis-0 cursor-pointer border-b-2 border-white/0 p-2 text-center transition-all sm:p-4"
                :class="
                    current === name
                        ? 'border-white/100'
                        : 'hover:border-white/50 active:border-white/25'
                "
                @click="current = name"
            >
                {{ name }}
            </a>
        </div>
    </div>

    <div class="p-4 sm:mb-4">
        <component :is="tabs[current]" />
    </div>
</template>
