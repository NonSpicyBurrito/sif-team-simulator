import { StorageSerializers, useLocalStorage } from '@vueuse/core'

export const useConfig = <T>(key: string, value: T) =>
    useLocalStorage<T>(`v1.${key}`, value, {
        serializer: value === null ? StorageSerializers.object : undefined,
    })
