<script setup lang="ts">
defineProps<{
    id: number
}>()
</script>

<template>
    <img :key="id" :src="`https://lostone.kirara.ca/card/icon_${id}_t.png`" />
</template>
