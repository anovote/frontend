import { parse } from 'papaparse'
import { ParseError } from './ParseError'

export class FileParser {
    public async parseCsv<T>(file: File): Promise<T[]> {
        return new Promise((resolve) => {
            parse<T>(file, {
                complete: (result) => {
                    resolve(result.data)
                },
                error: (error) => {
                    throw new ParseError(error + 'error in csv parsing')
                },
            })
        })
    }

    public async parseJson<T>(file: File): Promise<T> {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = (e) => {
                const dataString = e.target?.result
                if (dataString && typeof dataString === 'string') {
                    resolve(JSON.parse(dataString as string))
                }
            }
        })
    }
}
