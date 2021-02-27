import { CountUpTimer } from './CountUpTimer'

let timer: CountUpTimer
beforeEach(() => {
    timer = new CountUpTimer()
})

it('should return default time of 0 for all fields', () => {
    expect(timer.time).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0 })
})

it('should start from zero even when a negative initial time is passed to constructor', () => {
    expect(new CountUpTimer(-5000).time).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0 })
})

it('should return time object representing time in D H M S from provided time in milliseconds to constructor', () => {
    const oneSecond = 1000
    const oneHour = 3600000
    const oneDayTwoHoursTwentyMinutesTenSeconds = 94810000

    const t1 = new CountUpTimer(oneSecond)
    const t2 = new CountUpTimer(oneHour)
    const t3 = new CountUpTimer(oneDayTwoHoursTwentyMinutesTenSeconds)

    expect(t1.time).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 1 })
    expect(t2.time).toMatchObject({ days: 0, hours: 1, minutes: 0, seconds: 0 })
    expect(t3.time).toMatchObject({ days: 1, hours: 2, minutes: 20, seconds: 10 })
})

it('should increase seconds by one when tick is called', () => {
    timer.tick()
    expect(timer.time.seconds).toBe(1)
})

it('should increase minute by one after 60 ticks', () => {
    const ticks = 60
    for (let index = 0; index < ticks; index++) {
        timer.tick()
    }
    expect(timer.time.minutes).toBe(1)
})

it('should return 1 minute and 25 seconds after 85 ticks', () => {
    const ticks = 85
    for (let index = 0; index < ticks; index++) {
        timer.tick()
    }
    expect(timer.time.minutes).toBe(1)
    expect(timer.time.seconds).toBe(25)
})
