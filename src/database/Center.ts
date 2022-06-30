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

export enum CenterApplyType {
    FirstYear = 1,
    SecondYear = 2,
    ThirdYear = 3,
    Muse = 4,
    Aqours = 5,
    Printemps = 6,
    LilyWhite = 7,
    BiBi = 8,
    CYaRon = 9,
    AZALEA = 10,
    GuiltyKiss = 11,
    Nijigasaki = 60,
    HonokaEli = 71,
    HonokaKotori = 72,
    HonokaMaki = 75,
    HonokaHanayo = 77,
    HonokaNico = 78,
    EliUmi = 80,
    EliMaki = 82,
    EliNozomi = 83,
    EliNico = 85,
    KotoriUmi = 86,
    KotoriRin = 87,
    KotoriMaki = 88,
    KotoriNico = 91,
    UmiRin = 92,
    UmiNozomi = 94,
    UmiHanayo = 95,
    RinMaki = 97,
    RinNozomi = 98,
    RinHanayo = 99,
    MakiHanayo = 102,
    MakiNico = 103,
    NozomiHanayo = 104,
    NozomiNico = 105,
    HanayoNico = 106,
    ChikaKanan = 108,
    ChikaYou = 110,
    ChikaYoshiko = 111,
    ChikaHanamaru = 112,
    ChikaMari = 113,
    RikoKanan = 115,
    RikoDia = 116,
    RikoYoshiko = 118,
    RikoHanamaru = 119,
    RikoMari = 120,
    KananDia = 122,
    KananYou = 123,
    KananMari = 126,
    KananRuby = 127,
    DiaYou = 128,
    DiaYoshiko = 129,
    DiaMari = 131,
    DiaRuby = 132,
    YouHanamaru = 134,
    YouMari = 135,
    YouRuby = 136,
    YoshikoHanamaru = 137,
    YoshikoRuby = 139,
    HanamaruRuby = 141,
    Liella = 143,
}

export type CenterSkill = {
    main: {
        type: CenterEffectType
        value: number
    }
    extra: {
        apply?: CenterApplyType
        type?: CenterEffectType
        value?: number
    }
} | null
