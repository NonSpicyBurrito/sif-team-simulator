export function thousands(value: number) {
    return Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function small(value: number) {
    return value.toFixed(2)
}

export function percent(value: number, digits = 1) {
    return `${(value * 100).toFixed(digits)}%`
}

export function duration(ms: number) {
    if (ms >= 1000) {
        return `${(ms / 1000).toFixed(1)} s`
    } else {
        return `${ms} ms`
    }
}
