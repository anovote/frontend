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
    const trimmedList: string[] = []

    for (let i = 0; i < array.length; i++) {
        trimmedList.push(array[i].trim())
    }

    return trimmedList
}

export function filterForDuplicates(array: string[]): string[] {
    return array.filter(function (elem, index, self) {
        return index === self.indexOf(elem)
    })
}
