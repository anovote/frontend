/**
 * A timeout helper class that gives control
 * over a timer that executes a callback when reached the
 * timeout time. The timer can be started, stopped, and restarted.
 */
export class Timeout {
    private _timeoutTime: number
    private _cb: () => void
    private _timer: number | undefined
    constructor(timeoutTime: number, cb: () => void) {
        this._timeoutTime = timeoutTime
        this._cb = cb
    }

    public start(): void {
        this.stop()
        this._timer = window.setTimeout(this._cb, this._timeoutTime)
    }

    public stop(): void {
        clearTimeout(this._timer)
    }

    public restart(): void {
        this.stop()
        this.start()
    }
}
