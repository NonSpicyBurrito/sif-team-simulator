<script setup lang="ts">
defineProps<{
    id: string
}>()
</script>

<template>
    <img :key="id" :src="`https://r1.everisay.xyz/sif/accessory/icon1/${id}.png`" />
</template>
