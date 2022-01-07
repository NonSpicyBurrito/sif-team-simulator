export class ExclusiveState {
    public value = 0

    private endTime = NaN

    public update(time: number) {
        if (time >= this.endTime) {
            this.endTime = NaN
            this.value = 0
        }
    }

    public set(endTime: number, value: number) {
        this.endTime = endTime
        this.value = value
    }
}
