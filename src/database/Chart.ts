import { Group } from './Card'

export enum Difficulty {
    Easy = 1,
    Normal = 2,
    Hard = 3,
    Expert = 4,
    Master = 6,
}

export type Chart = {
    title: string
    difficulty: Difficulty
    group: Group
    attribute: number
    notes: {
        startTime: number
        endTime: number
        position: number
        isStar: boolean
        isSwing: boolean
    }[]
}
