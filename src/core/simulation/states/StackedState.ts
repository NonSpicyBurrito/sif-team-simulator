export class StackedState {
    public value = 0

    private buffs: {
        endTime: number
        value: number
    }[] = []

    public update(time: number) {
        for (let i = this.buffs.length - 1; i >= 0; i--) {
            if (time < this.buffs[i].endTime) continue

            this.value -= this.buffs[i].value
            this.buffs.splice(i, 1)
        }
    }

    public add(endTime: number, value: number) {
        this.value += value
        this.buffs.push({ endTime, value })
    }
}
