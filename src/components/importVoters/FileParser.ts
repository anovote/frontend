import { parse } from 'papaparse'
import { EmailArray } from './EmailArray'
import { ParseError } from './ParseError'

export class FileParser {
    public async parseCsv(file: File): Promise<string[]> {
        return new Promise<string[]>((resolve) => {
            parse<string>(file, {
                complete: (result) => {
                    resolve(result.data)
                },
                error: (error) => {
                    throw new ParseError(error + 'error in csv parsing')
                },
            })
        })
    }

    public async parseJson(file: File): Promise<EmailArray> {
        return new Promise<EmailArray>((resolve) => {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = (e) => {
                const dataString = JSON.stringify(e.target?.result)
                resolve(JSON.parse(JSON.parse(dataString)))
            }
        })
    }
}
