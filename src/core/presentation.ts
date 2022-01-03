export function summarize<T extends string>(results: Record<T, number>[]) {
    const summary = Object.fromEntries(
        Object.keys(results[0]).map((key) => [
            key,
            {
                min: Number.POSITIVE_INFINITY,
                max: Number.NEGATIVE_INFINITY,
                sum: 0,
                count: 0,
                mean: 0,
                m2: 0,
            },
        ])
    )

    for (const result of results) {
        for (const key in result) {
            summary[key].min = Math.min(summary[key].min, result[key])
            summary[key].max = Math.max(summary[key].max, result[key])
            summary[key].sum += result[key]
            summary[key].count++
            const delta = result[key] - summary[key].mean
            summary[key].mean += delta / summary[key].count
            const delta2 = result[key] - summary[key].mean
            summary[key].m2 += delta * delta2
        }
    }

    return Object.fromEntries(
        (Object.keys(summary) as T[]).map((key) => {
            const bars = 50

            const min = summary[key].min
            const max = summary[key].max

            const range = (max - min) / bars
            const values = results.map((result) => result[key])

            const histogram = [...Array(bars + 1).keys()].map((i) => {
                const from = min + (i - 0.5) * range
                const to = min + (i + 0.5) * range
                return values.filter((v) => v >= from && v < to).length
            })
            const maxCount = Math.max(...histogram)

            return [
                key,
                {
                    min,
                    max,
                    mean: summary[key].mean,
                    stdev: Math.sqrt(summary[key].m2 / summary[key].count),
                    histogram: histogram.map((count) => count / maxCount || 0),
                },
            ]
        })
    ) as Record<
        T,
        {
            min: number
            max: number
            mean: number
            stdev: number
            histogram: number[]
        }
    >
}
