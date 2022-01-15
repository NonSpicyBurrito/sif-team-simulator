<script setup lang="ts">
import { useDebounce, useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { useLargeArray } from '../composables/large-array'
import { getCharacterIds } from '../core/character'
import { enumKeys } from '../core/utils'
import { cards } from '../database'
import { Rarity } from '../database/Card'
import { EffectType, TriggerType } from '../database/Skill'
import Card from './Card.vue'
import Field from './Field.vue'

defineEmits<{
    (e: 'select', id: number): void
}>()

const search = useLocalStorage('cardSelector.search', '')
const debouncedSearch = useDebounce(search, 500)

const rarities = enumKeys(Rarity)
const attributes = ['smile', 'pure', 'cool']
const triggers = enumKeys(TriggerType)
const effects = enumKeys(EffectType)
const specificTriggers = {
    s: TriggerType.Time,
    n: TriggerType.Note,
    c: TriggerType.Combo,
    p: TriggerType.Perfect,
} as Record<string, TriggerType>

const ids = useLargeArray(
    computed(() => {
        const conditions = debouncedSearch.value.trim().toLowerCase().split(' ')
        if (!conditions[0]) return []

        return conditions.reduce(
            (ids, condition) => {
                if (rarities[condition]) {
                    return ids.filter(
                        (id) => cards.get(id)?.rarity === rarities[condition]
                    )
                }

                if (attributes.includes(condition)) {
                    return ids.filter(
                        (id) =>
                            cards.get(id)?.attribute ===
                            attributes.indexOf(condition)
                    )
                }

                if (triggers[condition]) {
                    return ids.filter(
                        (id) =>
                            cards.get(id)?.skill.trigger.type ===
                            triggers[condition]
                    )
                }

                if (effects[condition]) {
                    return ids.filter(
                        (id) =>
                            cards.get(id)?.skill.effect.type ===
                            effects[condition]
                    )
                }

                const value = +condition.slice(0, -1)
                const type = specificTriggers[condition.slice(-1)]
                if (value && type) {
                    return ids.filter(
                        (id) =>
                            cards.get(id)?.skill.trigger.type === type &&
                            cards.get(id)?.skill.trigger.values[0] === value
                    )
                }

                const wideValue = +condition
                if (wideValue) {
                    return ids.filter(
                        (id) =>
                            cards.get(id)?.skill.trigger.values[0] === wideValue
                    )
                }

                const allowedCharacters = getCharacterIds(condition)
                return ids.filter((id) =>
                    allowedCharacters.includes(cards.get(id)?.character || -1)
                )
            },
            [...cards.keys()]
        )
    })
)
</script>

<template>
    <Field label="Search">
        <input v-model="search" class="w-full" type="text" />
        <div class="my-1 text-sm">
            <p>
                <span class="font-semibold">Rarities:</span>
                {{ Object.keys(rarities).join(', ') }}
            </p>
            <p>
                <span class="font-semibold">Attributes:</span>
                {{ attributes.join(', ') }}
            </p>
            <p>
                <span class="font-semibold">Specific Triggers:</span>
                {{
                    ['', ...Object.keys(specificTriggers)]
                        .map((t) => `20${t}`)
                        .join(', ')
                }}
            </p>
            <p>
                <span class="font-semibold">Triggers:</span>
                {{ Object.keys(triggers).join(', ') }}
            </p>
            <p>
                <span class="font-semibold">Effects:</span>
                {{ Object.keys(effects).join(', ') }}
            </p>
            <p>
                <span class="font-semibold">Character Names:</span>
                any part of a character's name
            </p>
        </div>
    </Field>
    <div class="flex flex-wrap justify-center mt-8 mb-4">
        <template v-for="id in ids" :key="id">
            <Card
                class="shrink-0 m-1 cursor-pointer"
                :="{ id }"
                simple
                @click="$emit('select', id)"
            />
        </template>
    </div>
</template>
