export function clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
