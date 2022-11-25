import { CenterApplyType, CenterEffectType, CenterSkill } from '../database/Center'
import { percent } from './formatting'

export function getCenterDescription(center: CenterSkill) {
    const descriptions: string[] = []

    if (center) {
        descriptions.push(getEffectDescription(center.main.type, center.main.value))

        if (center.extra.apply && center.extra.type && center.extra.value) {
            descriptions.push(
                `additionally for ${getApplyDescription(center.extra.apply)} ${getEffectDescription(
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
            return `unsupported center effect: ${CenterEffectType[type] || type}`
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
        case CenterApplyType.HonokaUmi:
            return 'Honoka and Umi'
        case CenterApplyType.HonokaRin:
            return 'Honoka and Rin'
        case CenterApplyType.HonokaMaki:
            return 'Honoka and Maki'
        case CenterApplyType.HonokaNozomi:
            return 'Honoka and Nozomi'
        case CenterApplyType.HonokaHanayo:
            return 'Honoka and Hanayo'
        case CenterApplyType.HonokaNico:
            return 'Honoka and Nico'
        case CenterApplyType.EliKotori:
            return 'Eli and Kotori'
        case CenterApplyType.EliUmi:
            return 'Eli and Umi'
        case CenterApplyType.EliRin:
            return 'Eli and Rin'
        case CenterApplyType.EliMaki:
            return 'Eli and Maki'
        case CenterApplyType.EliNozomi:
            return 'Eli and Nozomi'
        case CenterApplyType.EliHanayo:
            return 'Eli and Hanayo'
        case CenterApplyType.EliNico:
            return 'Eli and Nico'
        case CenterApplyType.KotoriUmi:
            return 'Kotori and Umi'
        case CenterApplyType.KotoriRin:
            return 'Kotori and Rin'
        case CenterApplyType.KotoriMaki:
            return 'Kotori and Maki'
        case CenterApplyType.KotoriNozomi:
            return 'Kotori and Nozomi'
        case CenterApplyType.KotoriHanayo:
            return 'Kotori and Hanayo'
        case CenterApplyType.KotoriNico:
            return 'Kotori and Nico'
        case CenterApplyType.UmiRin:
            return 'Umi and Rin'
        case CenterApplyType.UmiMaki:
            return 'Umi and Maki'
        case CenterApplyType.UmiNozomi:
            return 'Umi and Nozomi'
        case CenterApplyType.UmiHanayo:
            return 'Umi and Hanayo'
        case CenterApplyType.UmiNico:
            return 'Umi and Nico'
        case CenterApplyType.RinMaki:
            return 'Rin and Maki'
        case CenterApplyType.RinNozomi:
            return 'Rin and Nozomi'
        case CenterApplyType.RinHanayo:
            return 'Rin and Hanayo'
        case CenterApplyType.RinNico:
            return 'Rin and Nico'
        case CenterApplyType.MakiNozomi:
            return 'Maki and Nozomi'
        case CenterApplyType.MakiHanayo:
            return 'Maki and Hanayo'
        case CenterApplyType.MakiNico:
            return 'Maki and Nico'
        case CenterApplyType.NozomiHanayo:
            return 'Nozomi and Hanayo'
        case CenterApplyType.NozomiNico:
            return 'Nozomi and Nico'
        case CenterApplyType.HanayoNico:
            return 'Hanayo and Nico'
        case CenterApplyType.ChikaRiko:
            return 'Chika and Riko'
        case CenterApplyType.ChikaKanan:
            return 'Chika and Kanan'
        case CenterApplyType.ChikaDia:
            return 'Chika and Dia'
        case CenterApplyType.ChikaYou:
            return 'Chika and You'
        case CenterApplyType.ChikaYoshiko:
            return 'Chika and Yoshiko'
        case CenterApplyType.ChikaHanamaru:
            return 'Chika and Hanamaru'
        case CenterApplyType.ChikaMari:
            return 'Chika and Mari'
        case CenterApplyType.ChikaRuby:
            return 'Chika and Ruby'
        case CenterApplyType.RikoKanan:
            return 'Riko and Kanan'
        case CenterApplyType.RikoDia:
            return 'Riko and Dia'
        case CenterApplyType.RikoYou:
            return 'Riko and You'
        case CenterApplyType.RikoYoshiko:
            return 'Riko and Yoshiko'
        case CenterApplyType.RikoHanamaru:
            return 'Riko and Hanamaru'
        case CenterApplyType.RikoMari:
            return 'Riko and Mari'
        case CenterApplyType.RikoRuby:
            return 'Riko and Ruby'
        case CenterApplyType.KananDia:
            return 'Kanan and Dia'
        case CenterApplyType.KananYou:
            return 'Kanan and You'
        case CenterApplyType.KananYoshiko:
            return 'Kanan and Yoshiko'
        case CenterApplyType.KananHanamaru:
            return 'Kanan and Hanamaru'
        case CenterApplyType.KananMari:
            return 'Kanan and Mari'
        case CenterApplyType.KananRuby:
            return 'Kanan and Ruby'
        case CenterApplyType.DiaYou:
            return 'Dia and You'
        case CenterApplyType.DiaYoshiko:
            return 'Dia and Yoshiko'
        case CenterApplyType.DiaHanamaru:
            return 'Dia and Hanamaru'
        case CenterApplyType.DiaMari:
            return 'Dia and Mari'
        case CenterApplyType.DiaRuby:
            return 'Dia and Ruby'
        case CenterApplyType.YouYoshiko:
            return 'You and Yoshiko'
        case CenterApplyType.YouHanamaru:
            return 'You and Hanamaru'
        case CenterApplyType.YouMari:
            return 'You and Mari'
        case CenterApplyType.YouRuby:
            return 'You and Ruby'
        case CenterApplyType.YoshikoHanamaru:
            return 'Yoshiko and Hanamaru'
        case CenterApplyType.YoshikoMari:
            return 'Yoshiko and Mari'
        case CenterApplyType.YoshikoRuby:
            return 'Yoshiko and Ruby'
        case CenterApplyType.HanamaruMari:
            return 'Hanamaru and Mari'
        case CenterApplyType.HanamaruRuby:
            return 'Hanamaru and Ruby'
        case CenterApplyType.MariRuby:
            return 'Mari and Ruby'
        case CenterApplyType.Liella:
            return 'Liella'
        default:
            return `unsupported center apply: ${CenterApplyType[apply] || apply}`
    }
}
