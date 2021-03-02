import { ITimeCount } from '../ITimeCount'
import { ITimer } from './ITimer'
import { Time } from '../Time'

/**
 * A Days, hours, minute, seconds count up timer.
 * It can be manually updated using tick, or can be started by calling start where it updates
 * the count each second. It can be stopped by calling stop
 */
export class CountUpTimer extends Time implements ITimer {
    private _time: ITimeCount
    private _tickInterval: number | undefined

    /**
     * Sets up the timer with the initial value provided, defaults to 0.
     * @param initial the initial time to start from, time in milliseconds
     */
    constructor(initial = 0) {
        super()
        if (initial < 0) initial = 0
        this._time = Time.millisecondsToDMHS(initial)
    }

    /**
     * Returns the current time count
     */
    get time(): ITimeCount {
        return this._time
    }
    /**
     * Ticks the time 1 second forward and adjust Days, hours, minutes, seconds accordingly
     * when they wraps e.g. seconds hits 60 resets to 0, and increase minutes by 1 ...
     */
    tick(): void {
        this._time.seconds++
        if (this._time.seconds >= 60) {
            this._time.seconds = 0
            this._time.minutes++

            if (this._time.minutes >= 60) {
                this._time.minutes = 0
                this._time.hours++
            }

            if (this._time.hours >= 24) {
                this._time.hours = 0
                this._time.days++
            }
        }
    }

    /** Tick handler that calls tick each ~second */
    start(): void {
        this._tickInterval = window.setInterval(() => {
            this.tick()
        }, 1000)
    }

    /** stops the internal timer */
    stop(): void {
        clearInterval(this._tickInterval)
    }
}
