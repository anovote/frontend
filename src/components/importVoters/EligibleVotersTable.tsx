import * as React from 'react'
import { Table, Upload, Button, Menu, Dropdown } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { parse } from 'papaparse'

export default function EligibleVotersTable(): React.ReactElement {
    const columns = [
        {
            dataIndex: 'email',
            key: 'email',
        },
    ]

    const [mappedCsvArray, setMappedCsvArray] = React.useState([{}])

    /**
     * Parses a CSV or JSON file, where the CSV or JSON
     * needs to be in a specific "email" format.
     * @param file The file we want to parse
     */
    const parseFile = (file: File): boolean => {
        if (file.type === 'text/csv') {
            parse(file, {
                complete: (result) => {
                    parseArrayToObjectArray(result.data)
                },
            })
        } else if (file.type === 'application/json') {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = (e) => {
                const dataString = JSON.stringify(e.target?.result)
                const data = JSON.parse(JSON.parse(dataString))
                setMappedCsvArray(data.emails)
            }
        } else {
            throw new Error('File is not CSV or JSON!')
        }
        return false
    }

    /**
     * Parses an array to an array of objects.
     * @param array The array we want to parse
     */
    const parseArrayToObjectArray = (array: unknown[]) => {
        for (let i = 1; i < array.length; i++) {
            const email = array[i] as string[]
            mappedCsvArray.push({ key: i, email: email[0] })
            const newMappedCsvArray = [...mappedCsvArray]
            setMappedCsvArray(newMappedCsvArray)
        }
        mappedCsvArray.shift()
        const shifterArray = [...mappedCsvArray]
        setMappedCsvArray(shifterArray)
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
            <Dropdown
                className="import-voters-dropdown"
                overlay={<ImportFileMenu />}
                placement="bottomRight"
                trigger={['click']}
                arrow
            >
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
