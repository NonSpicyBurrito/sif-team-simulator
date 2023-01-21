<script setup lang="ts">
defineProps<{
    id: string
}>()
</script>

<template>
    <img :key="id" :src="`https://lostone.kirara.ca/accessory/icon_${id}_f.png`" />
</template>
