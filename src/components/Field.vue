<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>

<template>
    <div class="flex my-4">
        <div class="flex-1 grow py-1 font-semibold">{{ label }}</div>
        <div class="flex-1 grow-[2]">
            <slot />
        </div>
    </div>
</template>
