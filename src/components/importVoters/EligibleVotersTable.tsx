import * as React from 'react'
import { Table, Upload, Button, Menu, Dropdown } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { parse } from 'papaparse'

export default function EligibleVotersTable(): React.ReactElement {
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
    ]

    const [mappedCsvArray, setMappedCsvArray] = React.useState([{}])

    const parseFile = (file: File): boolean => {
        if (file.type === 'text/csv') {
            parse(file, {
                complete: (result) => {
                    parseToObjectArray(result.data)
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
        }
        return false
    }

    const parseToObjectArray = (array: unknown[]) => {
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
            <Dropdown overlay={<ImportFileMenu />} placement="bottomRight" arrow>
                <Button type="primary" icon={<PlusOutlined />} size="large" shape="circle"></Button>
            </Dropdown>
            <Table columns={columns} dataSource={mappedCsvArray} />
        </div>
    )
}
