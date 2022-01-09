export function clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function enumKeys<T>(enumType: Record<string, string | T>) {
    return Object.fromEntries(
        Object.entries(enumType)
            .filter(([, value]) => typeof value === 'number')
            .map(([key, value]) => [key.toLowerCase(), value] as [string, T])
    )
}
