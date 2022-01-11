import { ref } from 'vue'
import { Accessory } from './Accessory'
import { Card } from './Card'
import { Character, CharacterId } from './Character'
import { Chart, Difficulty } from './Chart'
import { Sis } from './Sis'

export const isLoading = ref(true)

export const accessories = new Map<string, Accessory>()
export const cards = new Map<number, Card>()
export const characters = new Map<CharacterId, Character>()
export const charts = new Map<string, Chart>()
export const sises = new Map<string, Sis>([
    ['Charm', { type: 'score', value: 2.5 }],
    ['Heal', { type: 'heal', value: 480 }],
    ['Trick', { type: 'plock', value: 0.33 }],
    ['Grand', { type: 'self', value: 0.53 }],
    ['Char', { type: 'self', value: 0.29 }],
    ['Midi', { type: 'self', value: 0.21 }],
    ['Petit', { type: 'self', value: 0.13 }],
    ['Trill', { type: 'self', value: 0.28 }],
    ['Cross', { type: 'self', value: 0.16 }],
    ['Ring', { type: 'self', value: 0.1 }],
    ['Bloom', { type: 'team', value: 0.04 }],
    ['Veil', { type: 'team', value: 0.024 }],
    ['Aura', { type: 'team', value: 0.018 }],
    ['Nonet', { type: 'team', value: 0.042 }],
    ['Nonet Petit', { type: 'team', value: 0.015 }],
    ['Wink', { type: 'flat', value: 1400 }],
    ['Perfume', { type: 'flat', value: 450 }],
    ['Kiss', { type: 'flat', value: 200 }],
])

export async function initDatabase(difficulty: Difficulty) {
    isLoading.value = true

    await Promise.all([
        initCharts(difficulty),
        initAccessories(),
        initCards(),
        initCharacters(),
    ])

    isLoading.value = false
}

async function initAccessories() {
    if (accessories.size) return

    Object.entries(await loadJson('accessories')).forEach(([id, accessory]) =>
        accessories.set(id, accessory as Accessory)
    )
}

async function initCards() {
    if (cards.size) return

    Object.entries(await loadJson('cards')).forEach(([id, card]) =>
        cards.set(+id, card as Card)
    )
}

async function initCharacters() {
    if (characters.size) return

    Object.entries(await loadJson('characters')).forEach(([id, character]) =>
        characters.set(+id, character as Character)
    )
}

let currentDifficulty: Difficulty | undefined

async function initCharts(difficulty: Difficulty) {
    if (currentDifficulty === difficulty) return

    currentDifficulty = difficulty
    charts.clear()

    Object.entries(await loadJson(`charts/${difficulty}`)).forEach(
        ([id, chart]) => charts.set(id, chart as Chart)
    )
}

async function loadJson(name: string) {
    return await (await fetch(`/database/${name}.json`)).json()
}
