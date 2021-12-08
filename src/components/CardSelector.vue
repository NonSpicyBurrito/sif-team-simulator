<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { cards, characters } from '../database'
import Card from './Card.vue'
import Field from './Field.vue'

defineEmits<{
    (e: 'select', id: number): void
}>()

const attributes = useLocalStorage('teamPanel.attribute', [true, false, false])
const character = useLocalStorage('teamPanel.character', 1)

const characterIds = [
    ...new Set([...cards.values()].map(({ character }) => character)),
].sort((a, b) => a - b)
</script>

<template>
    <Field label="Attribute">
        <button
            v-for="(name, index) in ['Smile', 'Pure', 'Cool']"
            :key="index"
            class="mr-1"
            :class="{ 'opacity-25': !attributes[index] }"
            @click="attributes[index] = !attributes[index]"
        >
            {{ name }}
        </button>
    </Field>
    <Field label="Character">
        <select v-model="character" class="w-full">
            <option :value="-1">(Any)</option>
            <option v-for="id in characterIds" :key="id" :value="id">
                {{ characters.get(id) || id }}
            </option>
        </select>
    </Field>
    <div class="flex flex-wrap justify-center mt-8 mb-4">
        <template v-for="id in cards.keys()" :key="id">
            <Card
                v-if="
                    attributes[cards.get(id)!.attribute] &&
                    (character === -1 || cards.get(id)?.character === character)
                "
                class="shrink-0 m-1 cursor-pointer"
                :="{ id }"
                @click="$emit('select', id)"
            />
        </template>
    </div>
</template>
