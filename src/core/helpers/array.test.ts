import { convertTwoDimArrayToOneDimArray, filterForDuplicates, trimItemsInArray } from './array'

let testArray: string[]
let noDuplicatesArray: string[]
let twoDimArray: any

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
    noDuplicatesArray = ['hello@gmail.com', 'hasiolhd@gmail.com', '    osiadgh@lada.ru   ']
    twoDimArray = [['Hello@gmail.com'], ['hasiolhd@gmail.com'], ['    osiadgh@lada.ru   ']]
})

it('should trim all items in the array', () => {
    let copy: string[] = [...testArray]
    copy = trimItemsInArray(copy)
    expect(copy[2]).toBe('osiadgh@lada.ru')
})

it('should remove any duplicates in the list', () => {
    let copy: string[] = [...testArray]
    expect(copy).not.toBeDistinct()
    copy = filterForDuplicates(copy)
    expect(copy).toBeDistinct()
})

it('should not remove any items when there are no duplicates in the list', () => {
    let copy: string[] = [...noDuplicatesArray]
    copy = filterForDuplicates(copy)
    expect(copy.length).toBe(noDuplicatesArray.length)
})

it('should convert a 2d array to a 1d array', () => {
    const copy: any = [...twoDimArray]
    const newArr: string[] = convertTwoDimArrayToOneDimArray(copy)
    expect(newArr.length).toBe(3)
    expect(newArr[0]).toBe('Hello@gmail.com')
})
