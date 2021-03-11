import { convertTwoDimArrayToOneDimArray, filterForDuplicates, trimItemsInArray } from './array'

let testArray: string[]
let noDuplicatesArray: string[]
let twoDimArray: any

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
    copy = filterForDuplicates(copy)
    expect(copy.length).toBe(5)
    expect(copy).toContain('hello@gmail.com')
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
