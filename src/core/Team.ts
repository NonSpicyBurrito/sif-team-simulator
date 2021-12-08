export type Member = {
    card: {
        id: number
        level: number
        sl: number
    }
    sisNames: string[]
    accessory?: {
        id: string
        level: number
    }
}

type NineOf<T> = [T, T, T, T, T, T, T, T, T]

export type Team = NineOf<Member>
export type PartialTeam = NineOf<Member | null>

export function isTeamComplete(partialTeam: PartialTeam): partialTeam is Team {
    return !partialTeam.includes(null)
}

export function isTeamEmpty(partialTeam: PartialTeam) {
    return partialTeam.every((member) => member === null)
}
