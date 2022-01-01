<script setup lang="ts">
import Field from '../components/Field.vue'

const branch = VITE_APP_BRANCH
const sha1 = VITE_APP_SHA1
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <Field label="Source Code">
            <div class="py-1 sm:text-center">
                <a
                    class="underline cursor-pointer"
                    href="https://github.com/NonSpicyBurrito/sif-team-simulator"
                    target="__blank"
                >
                    https://github.com/NonSpicyBurrito/sif-team-simulator
                </a>
            </div>
        </Field>
        <Field label="Branch">
            <div class="py-1 sm:text-center">
                {{ branch }}
            </div>
        </Field>
        <Field label="SHA1">
            <div class="py-1 sm:text-center">
                {{ sha1 }}
            </div>
        </Field>
    </div>
</template>
