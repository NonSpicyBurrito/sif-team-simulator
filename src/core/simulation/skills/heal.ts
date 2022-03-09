import { Live } from '../Live'
import { doSkill } from './utils'

export function doHeal(this: Live, time: number, index: number, value: number) {
    const multiplier = this.context.sisHealMultipliers[index]

    doSkill(this, time, index, (time, index) => {
        if (VITE_APP_DIAGNOSTICS) {
            this.context.log(
                '⠀⠀⠀⠀⠀⠀⠀ Member',
                index,
                'heals',
                value,
                'scores',
                value * multiplier * (this.overheal >= 0 ? 1 : 0)
            )
        }

        this.score += value * multiplier * (this.overheal >= 0 ? 1 : 0)
        this.overheal += value

        if (this.overheal < this.context.maxHp) return
        this.hearts++
        this.overheal -= this.context.maxHp
    })
}
