import { CountUpTimer as Counter } from 'lib/time/counter/CountUpTimer'
import React from 'react'

/**
 * Creates a time object that displays time in D H M S format.
 * It is increased each second.
 * If doCount is set to false it will not count and just display the time in D H M S format.
 */
export default function CountUpTimer({
    initialTime = Date.now(),
    doCount = true,
}: {
    initialTime?: number
    doCount?: boolean
}): JSX.Element {
    const timeDifference = Date.now() - initialTime
    const counter = new Counter(timeDifference)

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
