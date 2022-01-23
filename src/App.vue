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
    <div class="pt-4 bg-white/5 shadow-lg sm:pt-8 sm:mb-4">
        <div class="text-2xl font-bold text-center sm:text-5xl">
            SIF Team Simulator
        </div>

        <div class="flex mx-auto mt-4 max-w-lg sm:mt-8">
            <a
                v-for="(value, name) in tabs"
                :key="name"
                class="basis-0 grow p-2 text-center border-b-2 border-white/0 transition-all cursor-pointer sm:p-4"
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
