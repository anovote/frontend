// https://stackoverflow.com/questions/14824283/convert-a-2d-javascript-array-to-a-1d-array/14824303
/**
 * Converts a two dimensional string array to a one dimensional string array
 * @param twoDimArray the array we want to convert
 * @returns string array
 */
export function convertTwoDimArrayToOneDimArray(twoDimArray: string[]): string[] {
    let newArr: string[] = []

    for (let i = 0; i < twoDimArray.length; i++) {
        newArr = newArr.concat(twoDimArray[i])
    }

    return newArr
}

export function trimItemsInArray(array: string[]): string[] {
    return array.map((item) => item.trim())
}

export function filterForDuplicates(array: string[]): string[] {
    return array.filter(function (elem, index, self) {
        return index === self.indexOf(elem)
    })
}

export function doWhiteSpacesExist(array: string[]): boolean {
    const itemsWithWhiteSpace: string[] = []
    let containsWhiteSpace = false
    for (let i = 0; i < array.length; i++) {
        if (array[i].match(' ')) {
            itemsWithWhiteSpace.push(array[i])
        }
    }

    if (itemsWithWhiteSpace.length != 0) containsWhiteSpace = true

    return containsWhiteSpace
}
