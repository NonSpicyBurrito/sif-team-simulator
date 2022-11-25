<script setup lang="ts">
import Field from '../components/Field.vue'

const branch = VITE_APP_BRANCH
const sha1 = VITE_APP_SHA1
const buildTime = new Date(VITE_APP_BUILD_TIME).toLocaleString()
const diagnostics = VITE_APP_DIAGNOSTICS ? 'Enabled, to use it set Count to 1' : 'Disabled'
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <Field label="Source Code">
            <div class="py-1 sm:text-center">
                <a
                    class="cursor-pointer underline"
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
            <div class="break-all py-1 sm:text-center">
                {{ sha1 }}
            </div>
        </Field>
        <Field label="Build Time">
            <div class="py-1 sm:text-center">
                {{ buildTime }}
            </div>
        </Field>
        <Field label="Diagnostics">
            <div class="py-1 sm:text-center">
                {{ diagnostics }}
            </div>
        </Field>
    </div>
</template>
