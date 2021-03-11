import { createListOfEligibleVoters } from '../../core/helpers/eligibleVoter'

let testArray: string[]

// https://stackoverflow.com/questions/57001262/jest-expect-only-unique-elements-in-an-array
expect.extend({
    toBeDistinct(received) {
        const pass = Array.isArray(received) && new Set(received).size === received.length
        if (pass) {
            return {
                message: () => `expected [${received}] array is unique`,
                pass: true,
            }
        } else {
            return {
                message: () => `expected [${received}] array is not to unique`,
                pass: false,
            }
        }
    },
})

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
    expect(array.invalidEmails).toBeInstanceOf(Array)
    expect(array.noDuplicates).toBeInstanceOf(Array)
    expect(array.eligibleVoters).toBeInstanceOf(Array)
})

it('should remove any invalid emails', () => {
    const array = createListOfEligibleVoters(testArray)
    expect(array.invalidEmails.length).toBe(2)
    expect(array.invalidEmails[0]).toBe('hello')
    expect(array.invalidEmails[1]).toBe('no')
})

it('should remove any duplicates', () => {
    const array = createListOfEligibleVoters(testArray)
    expect(array.noDuplicates).toBeDistinct()
})
