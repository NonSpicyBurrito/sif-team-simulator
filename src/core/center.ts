import {
    CenterApplyType,
    CenterEffectType,
    CenterSkill,
} from '../database/Center'
import { percent } from './formatting'

export function getCenterDescription(center: CenterSkill) {
    const descriptions: string[] = []

    if (center) {
        descriptions.push(
            getEffectDescription(center.main.type, center.main.value)
        )

        if (center.extra.apply && center.extra.type && center.extra.value) {
            descriptions.push(
                `additionally for ${getApplyDescription(
                    center.extra.apply
                )} ${getEffectDescription(
                    center.extra.type,
                    center.extra.value
                )}`
            )
        }
    } else {
        descriptions.push('None')
    }

    return descriptions.join(', ') + '. '
}

function getEffectDescription(type: CenterEffectType, value: number) {
    switch (type) {
        case CenterEffectType.SmilePrincess:
            return `increase Smile by ${percent(value / 100, 0)}`
        case CenterEffectType.PureAngel:
            return `increase Pure by ${percent(value / 100, 0)}`
        case CenterEffectType.CoolEmpress:
            return `increase Cool by ${percent(value / 100, 0)}`
        case CenterEffectType.PurePrincess:
            return `increase Pure by ${percent(value / 100, 0)} of Smile`
        case CenterEffectType.CoolPrincess:
            return `increase Cool by ${percent(value / 100, 0)} of Smile`
        case CenterEffectType.SmileAngel:
            return `increase Smile by ${percent(value / 100, 0)} of Pure`
        case CenterEffectType.CoolAngel:
            return `increase Cool by ${percent(value / 100, 0)} of Pure`
        case CenterEffectType.SmileEmpress:
            return `increase Smile by ${percent(value / 100, 0)} of Cool`
        case CenterEffectType.PureEmpress:
            return `increase Pure by ${percent(value / 100, 0)} of Cool`
        default:
            return `unsupported center effect: ${
                CenterEffectType[type] || type
            }`
    }
}

function getApplyDescription(apply: CenterApplyType) {
    switch (apply) {
        case CenterApplyType.FirstYear:
            return '1st Year'
        case CenterApplyType.SecondYear:
            return '2nd Year'
        case CenterApplyType.ThirdYear:
            return '3rd Year'
        case CenterApplyType.Muse:
            return "μ's"
        case CenterApplyType.Aqours:
            return 'Aqours'
        case CenterApplyType.Printemps:
            return 'Printemps'
        case CenterApplyType.LilyWhite:
            return 'lily white'
        case CenterApplyType.BiBi:
            return 'BiBi'
        case CenterApplyType.CYaRon:
            return 'CYaRon!'
        case CenterApplyType.AZALEA:
            return 'AZALEA'
        case CenterApplyType.GuiltyKiss:
            return 'Guilty Kiss'
        case CenterApplyType.Nijigasaki:
            return 'Nijigasaki'
        case CenterApplyType.HonokaEli:
            return 'Honoka and Eli'
        case CenterApplyType.HonokaKotori:
            return 'Honoka and Kotori'
        case CenterApplyType.HonokaMaki:
            return 'Honoka and Maki'
        case CenterApplyType.HonokaHanayo:
            return 'Honoka and Hanayo'
        case CenterApplyType.HonokaNico:
            return 'Honoka and Nico'
        case CenterApplyType.EliUmi:
            return 'Eli and Umi'
        case CenterApplyType.EliMaki:
            return 'Eli and Maki'
        case CenterApplyType.EliNozomi:
            return 'Eli and Nozomi'
        case CenterApplyType.EliNico:
            return 'Eli and Nico'
        case CenterApplyType.KotoriUmi:
            return 'Kotori and Umi'
        case CenterApplyType.KotoriRin:
            return 'Kotori and Rin'
        case CenterApplyType.KotoriMaki:
            return 'Kotori and Maki'
        case CenterApplyType.KotoriNico:
            return 'Kotori and Nico'
        case CenterApplyType.UmiRin:
            return 'Umi and Rin'
        case CenterApplyType.UmiNozomi:
            return 'Umi and Nozomi'
        case CenterApplyType.UmiHanayo:
            return 'Umi and Hanayo'
        case CenterApplyType.RinNozomi:
            return 'Rin and Nozomi'
        case CenterApplyType.RinHanayo:
            return 'Rin and Hanayo'
        case CenterApplyType.MakiHanayo:
            return 'Maki and Hanayo'
        case CenterApplyType.MakiNico:
            return 'Maki and Nico'
        case CenterApplyType.NozomiHanayo:
            return 'Nozomi and Hanayo'
        case CenterApplyType.NozomiNico:
            return 'Nozomi and Nico'
        case CenterApplyType.ChikaKanan:
            return 'Chika and Kanan'
        case CenterApplyType.ChikaYou:
            return 'Chika and You'
        case CenterApplyType.ChikaYoshiko:
            return 'Chika and Yoshiko'
        case CenterApplyType.ChikaHanamaru:
            return 'Chika and Hanamaru'
        case CenterApplyType.ChikaMari:
            return 'Chika and Mari'
        case CenterApplyType.RikoKanan:
            return 'Riko and Kanan'
        case CenterApplyType.RikoYoshiko:
            return 'Riko and Yoshiko'
        case CenterApplyType.RikoHanamaru:
            return 'Riko and Hanamaru'
        case CenterApplyType.RikoMari:
            return 'Riko and Mari'
        case CenterApplyType.KananDia:
            return 'Kanan and Dia'
        case CenterApplyType.KananYou:
            return 'Kanan and You'
        case CenterApplyType.KananMari:
            return 'Kanan and Mari'
        case CenterApplyType.DiaYou:
            return 'Dia and You'
        case CenterApplyType.DiaYoshiko:
            return 'Dia and Yoshiko'
        case CenterApplyType.DiaMari:
            return 'Dia and Mari'
        case CenterApplyType.DiaRuby:
            return 'Dia and Ruby'
        case CenterApplyType.YouHanamaru:
            return 'You and Hanamaru'
        case CenterApplyType.YouRuby:
            return 'You and Ruby'
        case CenterApplyType.YoshikoHanamaru:
            return 'Yoshiko and Hanamaru'
        case CenterApplyType.YoshikoRuby:
            return 'Yoshiko and Ruby'
        case CenterApplyType.HanamaruRuby:
            return 'Hanamaru and Ruby'
        default:
            return `unsupported center apply: ${
                CenterApplyType[apply] || apply
            }`
    }
}
