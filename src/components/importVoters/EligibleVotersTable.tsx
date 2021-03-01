import * as React from 'react'
import { Table, Upload, Button } from 'antd'
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
        if (!file.name.includes('.csv')) throw new Error('File not csv!')
        parse(file, {
            complete: (result) => {
                parseToObjectArray(result.data)
            },
        })
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

    return (
        <div className="voters-table-container">
            <Upload beforeUpload={parseFile}>
                <Button type="primary" icon={<PlusOutlined />} size="large" shape="circle"></Button>
            </Upload>
            <Table columns={columns} dataSource={mappedCsvArray} />
        </div>
    )
}
