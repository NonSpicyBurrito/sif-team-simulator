import { EffectType } from '../../../database/Skill'
import { Live } from '../Live'

export function tickSkills(this: Live, time: number, triggers: [number][]) {
    this.purgeLastSkill = false
    this.tempLastSkill = undefined
    this.tempAmp = 0

    const skillChanceMultiplier =
        (1 + this.context.skillChanceBonus) * (1 + this.sruState.value)

    if (this.coinFlip && triggers.length >= 3) {
        let hasAmp = false
        let hasEncore = false
        let hasNormal = false

        triggers.forEach(([i]) => {
            switch (this.context.skillInfos[i].card.effect.type) {
                case EffectType.Amp:
                    hasAmp = true
                    break
                case EffectType.Encore:
                    hasEncore = true
                    break
                default:
                    hasNormal = true
                    break
            }
        })

        if (hasAmp && hasEncore && hasNormal) {
            this.context.sortTriggers(triggers, this.context.coinFlipPriorities)
        }
    }

    triggers.forEach(([i]) => this.activate(time, i, skillChanceMultiplier))

    this.lastSkill =
        this.tempLastSkill || (this.purgeLastSkill ? undefined : this.lastSkill)

    if (!this.ampState && this.tempAmp) {
        if (VITE_APP_DIAGNOSTICS) {
            this.context.log(time, 'Amp', this.tempAmp, 'activates')
        }

        this.ampState = this.tempAmp
    }
}
