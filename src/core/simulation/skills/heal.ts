import { Live } from '../Live'
import { doSkill } from './utils'

export function doHeal(live: Live, time: number, index: number, value: number) {
    const multiplier = live.context.sisHealMultipliers[index]

    doSkill(live, time, index, (time, index) => {
        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(
                time,
                'Member',
                index,
                'heals',
                value,
                'scores',
                value * multiplier * (live.overheal >= 0 ? 1 : 0)
            )
        }

        live.score += value * multiplier * (live.overheal >= 0 ? 1 : 0)
        live.overheal += value

        if (live.overheal < live.context.maxHp) return
        live.hearts++
        live.overheal -= live.context.maxHp
    })
}
