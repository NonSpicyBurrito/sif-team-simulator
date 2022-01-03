<script setup lang="ts">
import { useDebounce, useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { useLargeArray } from '../composables/large-array'
import { cards, characters } from '../database'
import { EffectType, TriggerType } from '../database/Skill'
import Card from './Card.vue'
import Field from './Field.vue'

defineEmits<{
    (e: 'select', id: number): void
}>()

const search = useLocalStorage('cardSelector.search', '')
const debouncedSearch = useDebounce(search, 500)

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

                const allowedCharacters = [...characters.entries()]
                    .filter(([, name]) =>
                        name.toLowerCase().includes(condition)
                    )
                    .map(([character]) => character)
                return ids.filter((id) =>
                    allowedCharacters.includes(cards.get(id)?.character || -1)
                )
            },
            [...cards.keys()]
        )
    })
)

function enumKeys<T>(enumType: Record<string, string | T>) {
    return Object.fromEntries(
        Object.entries(enumType)
            .filter(([, value]) => typeof value === 'number')
            .map(([key, value]) => [key.toLowerCase(), value] as [string, T])
    )
}
</script>

<template>
    <Field label="Search">
        <input v-model="search" class="w-full" type="text" />
        <div class="my-1 text-sm">
            <p>
                <span class="font-semibold">Attributes:</span>
                {{ attributes.join(', ') }}
            </p>
            <p>
                <span class="font-semibold">Specific Triggers:</span>
                {{
                    Object.keys(specificTriggers)
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
                @click="$emit('select', id)"
            />
        </template>
    </div>
</template>
