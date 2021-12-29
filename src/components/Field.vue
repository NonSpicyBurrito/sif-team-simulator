<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>

<template>
    <div class="flex flex-col my-4 sm:flex-row">
        <div class="py-1 font-semibold sm:flex-1 sm:grow">{{ label }}</div>
        <div class="sm:flex-1 sm:grow-[2]">
            <slot />
        </div>
    </div>
</template>
