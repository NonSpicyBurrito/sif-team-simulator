import { Live } from '../Live'
import { doSkill } from './utils'

export function doScore(live: Live, time: number, index: number, value: number) {
    const multiplier = live.context.sisScoreMultipliers[index]

    doSkill(live, time, index, (time, index) => {
        const score = value * multiplier

        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(time, 'Member', index, 'activates Score', score)
        }

        live.score += score
    })
}
