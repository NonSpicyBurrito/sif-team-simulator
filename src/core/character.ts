import { characters } from '../database'
import { CharacterId } from '../database/Character'

export function getCharacterIds(keyword: string) {
    const matches: [number, CharacterId][] = []

    ;[...characters.entries()]
        .map(([id, name]) => [id, name.toLocaleLowerCase()] as const)
        .forEach(([id, name]) => {
            const segments = name.split(' ')

            if (name === keyword) matches.push([0, id])
            if (segments.includes(keyword)) matches.push([1, id])
            if (segments.some((segment) => segment.startsWith(keyword))) matches.push([2, id])
            if (segments.some((segment) => segment.includes(keyword))) matches.push([3, id])
        })

    const highest = matches.map(([priority]) => priority).sort((a, b) => a - b)[0]
    return matches.filter(([priority]) => priority === highest).map(([, id]) => id)
}
