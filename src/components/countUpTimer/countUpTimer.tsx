import React from 'react'
import { CountUpTimer as Counter } from 'lib/time/counter/CountUpTimer'

/**
 * Creates a time object that displays time in D H M S format.
 * It is increased each second.
 * If doCount is set to false it will not count and just display the time in D H M S format.
 */
export default function CountUpTimer({
    initialTime = 0,
    doCount = true,
}: {
    initialTime?: number
    doCount?: boolean
}): JSX.Element {
    const counter = new Counter(initialTime)

    const [time, setTime] = React.useState(counter.time)

    if (doCount) {
        React.useEffect(() => {
            const int = setInterval(() => {
                counter.tick()
                setTime(Object.assign({}, counter.time))
            }, 1000)
            return () => clearInterval(int)
        }, [])
    }

    return <>{`${time.days}D ${time.hours}H ${time.minutes}M ${time.seconds}S`}</>
}
