export enum TriggerType {
    Time = 1,
    Note = 3,
    Combo = 4,
    Perfect = 6,
    StarPerfect = 12,
    Chain = 100,
}

export enum EffectType {
    Plock = 5,
    Heal = 9,
    Score = 11,
    SRU = 2000,
    Encore = 2100,
    PSU = 2201,
    CF = 2300,
    Sync = 2400,
    Amp = 2500,
    Param = 2600,
}

export type CardSkill = {
    trigger: {
        type: TriggerType
        chances: number[]
        values: number[]
    }
    effect: {
        type: EffectType
        durations: number[]
        values: number[]
    }
}

export type AccessorySkill = {
    trigger: {
        chances: number[]
    }
    effect: {
        type: EffectType
        durations: number[]
        values: number[]
    }
}
