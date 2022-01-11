import { CenterSkill } from './Center'
import { CharacterId } from './Character'
import { CardSkill } from './Skill'

export enum Group {
    None = 0,
    Muse = 1,
    Aqours = 2,
    Nijigasaki = 3,
    Liella = 4,
}

export enum Subunit {
    None = 0,
    Printemps = 6,
    LilyWhite = 7,
    BiBi = 8,
    CYaRon = 9,
    AZALEA = 10,
    GuiltyKiss = 11,
}

export enum Rarity {
    R = 2,
    SR = 3,
    SSR = 5,
    UR = 4,
}

export type Card = {
    character: CharacterId
    group: Group
    year: number
    subunit: Subunit
    rarity: Rarity
    stats: number[]
    hp: number
    attribute: number
    center: CenterSkill
    skill: CardSkill
}
