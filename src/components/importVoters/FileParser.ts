import { parse } from 'papaparse'

export class FileParser {
    public async parseCsv(file: File): Promise<string[]> {
        return new Promise<string[]>((resolve) => {
            parse<string>(file, {
                complete: (result) => {
                    resolve(result.data)
                },
            })
        })
    }

    public async parseJson(file: File): Promise<any> {
        return new Promise<any>((resolve) => {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = (e) => {
                const dataString = JSON.stringify(e.target?.result)
                resolve(JSON.parse(JSON.parse(dataString)))
            }
        })
    }
}
