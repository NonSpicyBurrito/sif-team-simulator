export function getComboMultiplier(combo: number) {
    return combo <= 50
        ? 1
        : combo <= 100
        ? 1.1
        : combo <= 200
        ? 1.15
        : combo <= 400
        ? 1.2
        : combo <= 600
        ? 1.25
        : combo <= 800
        ? 1.3
        : 1.35
}

export function getHeartBonus(maxHp: number) {
    switch (maxHp) {
        case 9:
            return 0.0026
        case 10:
            return 0.0029
        case 11:
            return 0.0031
        case 12:
            return 0.0034
        case 13:
            return 0.0037
        case 14:
            return 0.004
        case 15:
            return 0.0043
        case 16:
            return 0.0046
        case 17:
            return 0.0049
        case 18:
            return 0.0051
        case 19:
            return 0.0059
        case 20:
            return 0.0063
        case 21:
            return 0.0066
        case 22:
            return 0.007
        case 23:
            return 0.0073
        case 24:
            return 0.0077
        case 25:
            return 0.008
        case 26:
            return 0.0084
        case 27:
            return 0.0088
        case 28:
            return 0.0091
        case 29:
            return 0.0095
        case 30:
            return 0.0099
        case 31:
            return 0.0102
        case 32:
            return 0.0106
        case 33:
            return 0.011
        case 34:
            return 0.0114
        case 35:
            return 0.0118
        case 36:
            return 0.0121
        case 37:
            return 0.0176
        case 38:
            return 0.0183
        case 39:
            return 0.019
        case 40:
            return 0.0197
        case 41:
            return 0.0204
        case 42:
            return 0.0211
        case 43:
            return 0.0218
        case 44:
            return 0.0225
        case 45:
            return 0.0233
        case 46:
            return 0.0264
        case 47:
            return 0.0273
        case 48:
            return 0.0282
        case 49:
            return 0.0291
        case 50:
            return 0.03
        case 51:
            return 0.0309
        case 52:
            return 0.0319
        case 53:
            return 0.0328
        case 54:
            return 0.0338
        case 55:
            return 0.0347
        case 56:
            return 0.0357
        case 57:
            return 0.0367
        case 58:
            return 0.0377
        case 59:
            return 0.0387
        case 60:
            return 0.0398
        case 61:
            return 0.0408
        case 62:
            return 0.0419
        case 63:
            return 0.0429
        default:
            throw `Unknown heart bonus for ${maxHp}`
    }
}
