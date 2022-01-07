export function fill<T>(value: T) {
    return [...Array(9).keys()].map(() => value)
}
