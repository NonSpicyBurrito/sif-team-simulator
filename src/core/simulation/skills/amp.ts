import { Live } from '../Live'

export function doAmp(this: Live, value: number) {
    this.tempAmp = value
    this.tempLastSkill = this.tempLastSkill || (() => this.doAmp(value))
}

export function consumeAmp(this: Live) {
    const temp = this.ampState
    this.ampState = 0
    return temp
}
