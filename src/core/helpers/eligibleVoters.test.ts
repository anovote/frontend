import { createListOfEligibleVoters } from './eligibleVoter'

let testArray: string[]

beforeAll(() => {
    testArray = [
        'hello@gmail.com',
        'hasiolhd@gmail.com',
        '    osiadgh@lada.ru   ',
        'hello@gmail.com',
        'hello@gmail.com',
        'hello@gmail.com',
        'hello',
        'no',
    ]
})

it('should create a correct set of arrays', () => {
    const array = createListOfEligibleVoters(testArray)
    expect(array.eligibleVoters.length).toBe(3)
    expect(array.eligibleVoters[0].identification).toBe('hello@gmail.com')
    expect(array.eligibleVoters[1].identification).toBe('hasiolhd@gmail.com')
    expect(array.eligibleVoters[2].identification).toBe('osiadgh@lada.ru')
})

it('should remove any invalid emails', () => {
    const array = createListOfEligibleVoters(testArray)
    expect(array.invalidEmails.length).toBe(2)
    expect(array.invalidEmails[0]).toBe('hello')
    expect(array.invalidEmails[1]).toBe('no')
})

it('should remove any duplicates', () => {
    const array = createListOfEligibleVoters(testArray)
    expect(array.noDuplicates.length).toBe(5)
})
