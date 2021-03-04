import { Time } from './Time'

it('should be true for dates from the past', () => {
    const d1 = new Date('January 19, 2021 23:15:30')
    const d2 = new Date()
    d2.setSeconds(d2.getSeconds() - 1)
    expect(Time.isDateFromPast(d1)).toBe(true)
    expect(Time.isDateFromPast(d2)).toBe(true)
})

it('should be false for dates that is in the future', () => {
    const d1 = new Date()
    d1.setSeconds(d1.getSeconds() + 5)
    expect(Time.isDateFromPast(d1)).toBe(false)
})

it('should return negative time diff when older date is after newer date', () => {
    const dBefore1 = new Date('January 19, 2021 23:15:30')
    const dAfter1 = new Date('January 20, 2021 23:15:30')
    expect(Time.getTimeDiff(dAfter1, dBefore1)).toBeLessThan(0)
})

it('should return positive time when older date is before newer date', () => {
    const dBefore1 = new Date('January 19, 2021 23:15:30')
    const dAfter1 = new Date('January 20, 2021 23:15:30')
    expect(Time.getTimeDiff(dBefore1, dAfter1)).toBeGreaterThan(0)
})

it('should return zero when getting diff between equal dates', () => {
    const dEqual1 = new Date('January 19, 2021 23:15:30')
    const dEqual2 = new Date('January 19, 2021 23:15:30')
    expect(Time.getTimeDiff(dEqual1, dEqual2)).toBe(0)
})
