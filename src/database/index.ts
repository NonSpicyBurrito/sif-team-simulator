import { ref } from 'vue'
import { Accessory } from './Accessory'
import { Card } from './Card'
import { Character } from './Character'
import { Chart } from './Chart'
import { Sis } from './Sis'

export const isLoading = ref(true)

export const accessories = new Map<string, Accessory>()
export const cards = new Map<number, Card>()
export const characters = new Map<number, Character>()
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
])

Promise.all([
    initAccessories(),
    initCards(),
    initCharacters(),
    initCharts(),
]).then(() => (isLoading.value = false))

async function initAccessories() {
    Object.entries(await loadJson('accessories')).forEach(([id, accessory]) =>
        accessories.set(id, accessory as Accessory)
    )
}

async function initCards() {
    Object.entries(await loadJson('cards')).forEach(([id, card]) =>
        cards.set(+id, card as Card)
    )
}

async function initCharacters() {
    Object.entries(await loadJson('characters')).forEach(([id, character]) =>
        characters.set(+id, character as Character)
    )
}

async function initCharts() {
    Object.entries(await loadJson('charts')).forEach(([id, chart]) =>
        charts.set(id, chart as Chart)
    )
}

async function loadJson(name: string) {
    return await (await fetch(`/database/${name}.json`)).json()
}
