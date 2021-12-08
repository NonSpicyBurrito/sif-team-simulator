export type Chart = {
    title: string
    difficulty: number
    attribute: number
    notes: {
        startTime: number
        endTime: number
        position: number
        isSwing: boolean
    }[]
}
