import { Live } from '../Live'
import { doSkill } from './utils'

export function doHeal(live: Live, time: number, index: number, value: number) {
    const multiplier = live.context.sisHealMultipliers[index]

    doSkill(live, time, index, (time, index) => {
        const score = value * multiplier * (live.overheal >= 0 ? 1 : 0)

        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(time, 'Member', index, 'activates Heal', value, 'scores', score)
        }

        live.score += score
        live.increaseHp(value)
    })
}
