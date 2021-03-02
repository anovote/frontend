import { ITimeCount } from '../ITimeCount'

export interface ITimer {
    time: ITimeCount
    tick: () => void
    start: () => void
    stop: () => void
}
