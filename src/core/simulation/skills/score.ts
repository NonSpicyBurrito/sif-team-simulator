import { Live } from '../Live'
import { doSkill } from './utils'

export function doScore(
    this: Live,
    time: number,
    index: number,
    value: number
) {
    const multiplier = this.context.sisScoreMultipliers[index]

    doSkill(this, time, index, (time, index) => {
        if (VITE_APP_DIAGNOSTICS) {
            this.context.log(
                time,
                'Member',
                index,
                'scores',
                value * multiplier
            )
        }

        this.score += value * multiplier
    })
}
