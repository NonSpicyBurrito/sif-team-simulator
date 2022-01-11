export enum CenterEffectType {
    SmilePrincess = 1,
    PureAngel = 2,
    CoolEmpress = 3,
    PurePrincess = 112,
    CoolPrincess = 113,
    SmileAngel = 121,
    CoolAngel = 123,
    SmileEmpress = 131,
    PureEmpress = 132,
}

export type CenterSkill = {
    main: {
        type: CenterEffectType
        value: number
    }
    extra: {
        apply?: unknown
        type?: CenterEffectType
        value?: number
    }
}
