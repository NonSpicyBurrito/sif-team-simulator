import { useIntervalFn } from '@vueuse/core'
import { computed, Ref, ref, watch } from 'vue'

export function useLargeArray<T>(
    array: Ref<T[]>,
    interval = 50,
    chunkSize = 10
) {
    const length = ref(0)

    watch(array, () => (length.value = chunkSize))
    useIntervalFn(() => {
        if (length.value >= array.value.length) return

        length.value += chunkSize
    }, interval)

    return computed(() => array.value.slice(0, length.value))
}
