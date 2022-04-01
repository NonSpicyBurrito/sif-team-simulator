import { Live } from '../Live'

export function doEncore(this: Live, time: number, index: number) {
    if (VITE_APP_DIAGNOSTICS) {
        if (this.tempLastSkill || this.lastSkill) {
            this.context.log('⠀⠀⠀⠀⠀⠀⠀ Member', index, 'activates encore')
        } else {
            this.context.log(
                '⠀⠀⠀⠀⠀⠀⠀ Member',
                index,
                'activates encore but no skill to copy'
            )
        }
    }

    const skill = this.tempLastSkill || this.lastSkill
    if (skill) {
        this.encoreActivated++
        skill(time, index)
    }

    this.purgeLastSkill = true
}
