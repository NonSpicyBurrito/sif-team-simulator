import { percent } from '../formatting'

export type Performance = {
    perfect: number
    great: number
    good: number
    bad: number
    miss: number
}

export function normalize({ perfect, great, good, bad, miss }: Performance) {
    const values = [perfect, great, good, bad, miss]

    const leftover = 1 - values.reduce((a, b) => a + b, 0)
    const index = values.includes(0) ? values.indexOf(0) : 0
    values[index] += leftover

    return values
}

export function getPerformanceDescription(performance: Performance) {
    const normalized = normalize(performance)
    return normalized.map((value) => percent(value)).join('/')
}
