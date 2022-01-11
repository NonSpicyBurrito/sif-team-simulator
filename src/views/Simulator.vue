<script setup lang="ts">
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import CardSelector from '../components/CardSelector.vue'
import Field from '../components/Field.vue'
import PresetEditor from '../components/PresetEditor.vue'
import Result from '../components/Result.vue'
import TeamEditor from '../components/TeamEditor.vue'
import { getChartDescription } from '../core/chart'
import { simulateScore } from '../core/simulation'
import { isTeamComplete, PartialTeam, Team } from '../core/Team'
import { clone, enumKeys, sleep } from '../core/utils'
import { cards, charts, initDatabase, isLoading } from '../database'
import { CenterSkill } from '../database/Center'
import { Difficulty } from '../database/Chart'

const mode = useLocalStorage('mode', 'normal')
const difficulty = useLocalStorage('difficulty', Difficulty.Master)
const chartId = useLocalStorage('chartId', '')
const perfectRate = useLocalStorage('perfectRate', 0.85)
const noteSpeed = useLocalStorage('noteSpeed', 9)
const memoryGalleryBonus = useLocalStorage('memoryGalleryBonus', [144, 78, 78])
const guestCenter = useLocalStorage<CenterSkill>('guestCenter.1', undefined, {
    serializer: StorageSerializers.object,
})
const tapScoreBonus = useLocalStorage('tapScoreBonus', 0)
const skillChanceBonus = useLocalStorage('skillChanceBonus', 0)
const skillChanceReduction = useLocalStorage('skillChanceReduction', 0)
const count = useLocalStorage('count', 10000)
const team = useLocalStorage('team', Array(9).fill(null) as PartialTeam)

watchEffect(() => initDatabase(difficulty.value))

watchEffect(() => {
    if (isLoading.value) return
    if (charts.get(chartId.value)) return

    chartId.value = charts.keys().next().value
})

const difficulties = enumKeys(Difficulty)

const showSelectCenter = ref(false)
function selectGuestCenter(id: number) {
    guestCenter.value = cards.get(id)?.center
    showSelectCenter.value = false
}

const showPreset = ref(false)
function selectPresetTeam(presetTeam: PartialTeam) {
    team.value = clone(presetTeam)
    showPreset.value = false
}

const canCalculate = computed(() => isTeamComplete(team.value))
const isCalculating = ref(false)

const result = ref<{
    mode: string
    chartId: string
    time: number
    result: ReturnType<typeof simulateScore>
}>()
watch(difficulty, () => (result.value = undefined))

async function simulate() {
    isCalculating.value = true

    await sleep(100)
    await nextTick()

    try {
        const startTime = Date.now()
        const simulateResult = simulateScore(
            team.value as Team,
            mode.value,
            memoryGalleryBonus.value,
            guestCenter.value,
            chartId.value,
            perfectRate.value,
            noteSpeed.value,
            tapScoreBonus.value,
            skillChanceBonus.value,
            skillChanceReduction.value,
            count.value
        )

        result.value = {
            mode: mode.value,
            chartId: chartId.value,
            time: Date.now() - startTime,
            result: simulateResult,
        }
    } catch (error) {
        alert(error)
    }

    isCalculating.value = false
}
</script>

<template>
    <div
        v-if="!isLoading"
        class="mx-auto max-w-4xl transition-opacity"
        :class="{ 'opacity-25': isCalculating }"
    >
        <Field label="Mode">
            <div class="flex flex-wrap -mb-1">
                <button
                    v-for="(value, key) in { normal: 'Normal', afk: 'AFK' }"
                    :key="key"
                    class="mr-1 mb-1"
                    :class="{ 'opacity-25': mode !== key }"
                    @click="mode = key"
                >
                    {{ value }}
                </button>
            </div>
        </Field>
        <Field label="Difficulty">
            <div class="flex flex-wrap -mb-1">
                <button
                    v-for="(value, key) in difficulties"
                    :key="value"
                    class="mr-1 mb-1 first-letter:uppercase"
                    :class="{ 'opacity-25': difficulty !== value }"
                    @click="difficulty = value"
                >
                    {{ key }}
                </button>
            </div>
        </Field>
        <Field label="Chart">
            <select v-model="chartId" class="w-full">
                <option v-for="[id, info] in charts" :key="id" :value="id">
                    {{ getChartDescription(info) }}
                </option>
            </select>
        </Field>
        <Field label="Perfect Rate">
            <input
                v-model="perfectRate"
                class="w-full"
                type="number"
                step="0.01"
            />
        </Field>
        <Field label="Note Speed">
            <div class="flex flex-wrap -mb-1">
                <button
                    v-for="speed in 10"
                    :key="speed"
                    class="mr-1 mb-1"
                    :class="{ 'opacity-25': noteSpeed !== speed }"
                    @click="noteSpeed = speed"
                >
                    {{ speed }}
                </button>
            </div>
        </Field>
        <Field label="Memory Gallery Bonus">
            <div class="flex flex-wrap -mb-1">
                <input
                    v-for="index in 3"
                    :key="index"
                    v-model="memoryGalleryBonus[index - 1]"
                    class="mr-1 mb-1 w-20 sm:w-32"
                    type="number"
                    step="1"
                />
            </div>
        </Field>
        <Field label="Guest Center">
            <template v-if="guestCenter">
                <button @click="guestCenter = undefined">Delete</button>
                <div class="py-1">{{ guestCenter }}</div>
            </template>
            <template v-else>
                <button @click="showSelectCenter = !showSelectCenter">
                    Select
                </button>
            </template>
        </Field>
        <div v-if="!guestCenter && showSelectCenter" class="surface">
            <CardSelector @select="selectGuestCenter" />
        </div>
        <Field label="Tap Score Bonus">
            <input
                v-model="tapScoreBonus"
                class="w-full"
                type="number"
                step="0.1"
            />
        </Field>
        <Field label="Skill Chance Bonus">
            <input
                v-model="skillChanceBonus"
                class="w-full"
                type="number"
                step="0.1"
            />
        </Field>
        <Field label="Skill Chance Reduction">
            <input
                v-model="skillChanceReduction"
                class="w-full"
                type="number"
                step="0.05"
            />
        </Field>
        <Field label="Count">
            <input v-model="count" class="w-full" type="number" step="1000" />
        </Field>
        <Field label="Preset">
            <button @click="showPreset = !showPreset">
                {{ showPreset ? 'Hide' : 'Show' }}
            </button>
        </Field>

        <PresetEditor
            v-if="showPreset"
            :="{ team }"
            @select="selectPresetTeam"
        />

        <div class="flex justify-center my-8">
            <button
                class="text-lg font-semibold"
                :disabled="!canCalculate || isCalculating"
                @click="simulate()"
            >
                Simulate
            </button>
        </div>

        <TeamEditor :="{ team, memoryGalleryBonus, chartId, guestCenter }" />

        <Result v-if="result" :="result" />
    </div>
    <div v-else class="py-8 text-center">Loading...</div>

    <div
        v-if="isCalculating"
        class="fixed top-0 right-0 bottom-0 left-0 z-50 cursor-wait"
    />
</template>
