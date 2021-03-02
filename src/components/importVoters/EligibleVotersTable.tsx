import * as React from 'react'
import { Table, Upload, Button, Menu, Dropdown } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FileParser } from './FileParser'

export default function EligibleVotersTable(): React.ReactElement {
    const columns = [
        {
            dataIndex: 'email',
            key: 'email',
        },
    ]

    const [mappedCsvArray, setMappedCsvArray] = React.useState([{}])
    const fileParser = new FileParser()

    /**
     * Parses a CSV or JSON file, where the CSV or JSON
     * needs to be in a specific "email" format.
     * @param file The file we want to parse
     */
    const parseFile = async (file: File): Promise<void> => {
        if (file.type === 'text/csv') {
            const parsedCsv = await fileParser.parseCsv(file)
            parseArrayToObjectArray(parsedCsv)
        } else if (file.type === 'application/json') {
            const parsedJson = await fileParser.parseJson(file)
            setMappedCsvArray(parsedJson.emails)
        } else {
            throw new Error('File is not CSV or JSON!')
        }
        return
    }

    /**
     * Parses an array to an array of objects.
     * @param array The array we want to parse
     */
    const parseArrayToObjectArray = (array: string[]) => {
        for (let i = 0; i < array.length; i++) {
            const email = array[i]
            mappedCsvArray.push({ key: i, email: email[0] })
            const newMappedCsvArray = [...mappedCsvArray]
            setMappedCsvArray(newMappedCsvArray)
        }
        const newArr = [...mappedCsvArray]
        newArr.shift()
        setMappedCsvArray(newArr)
    }

    const ImportFileMenu = (): React.ReactElement => {
        return (
            <Menu>
                <Menu.Item>
                    <Upload beforeUpload={parseFile}>CSV</Upload>
                </Menu.Item>
                <Menu.Item>
                    <Upload beforeUpload={parseFile}>JSON</Upload>
                </Menu.Item>
            </Menu>
        )
    }

    return (
        <div className="voters-table-container">
            <Dropdown className="import-voters-dropdown" overlay={<ImportFileMenu />} placement="bottomRight" arrow>
                <Button
                    className="import-voters-button"
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    shape="circle"
                ></Button>
            </Dropdown>
            <Table columns={columns} dataSource={mappedCsvArray} />
        </div>
    )
}
