import { ITimeCount } from './ITimeCount'

export class Time {
    /**
     * Returns provided time in milliseconds as object with Days, hours, minutes, seconds count.
     * e.g 1000ms will return object with 0 days, 0 hour, 0 minutes, 1second
     * e.g 3601000 will return object with 0 days, 1 hour, 0 minutes, 1 second
     */
    static millisecondsToDMHS(ms: number): ITimeCount {
        const hoursRaw = ms / 3600000
        const days = Math.floor(hoursRaw / 24)
        const hours = Math.floor(hoursRaw) % 24
        const minutes = Math.floor(ms / 60000) % 60
        const seconds = Math.floor(ms / 1000) % 60
        return { days, hours, minutes, seconds }
    }

    /**
     * Returns Day, hours, minute, seconds string for the provided time count object
     * @param dmhs the Day hours minute seconds object to get string from
     */
    static getDHMSString(dmhs: ITimeCount, delimiter = ':'): string {
        return Object(dmhs)
            .map((timeUnit: number) => (timeUnit < 10 ? '0' + timeUnit : timeUnit))
            .join(delimiter)
    }

    /**
     * Returns the time difference in milliseconds between two date object.
     * @param olderDate the oldest date to get diff from
     * @param newerDate the newest date to get diff from
     */
    static getTimeDiff(olderDate: Date, newerDate: Date): number {
        return newerDate.getTime() - olderDate.getTime()
    }

    /**
     * Returns true if the date is in the past. takes time into consideration.
     * It uses current local time.
     * @param date the date to check if is from the past
     */
    static isDateFromPast(date: Date): boolean {
        return Time.getTimeDiff(date, new Date()) > 0
    }
}
