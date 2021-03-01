import * as React from 'react'
import { Table, Upload, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { readFileSync } from 'fs'
import { parse } from 'papaparse'

export default function EligibleVotersTable(): React.ReactElement {
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
    ]

    const [uploadedFile, setUploadedFile] = React.useState<File>()

    const saveFile = (file: File): boolean => {
        parse(file, {
            complete: (result) => {
                console.dir(result.data)
            },
        })
        return false
    }

    return (
        <div className="voters-table-container">
            <Upload beforeUpload={saveFile}>
                <Button type="primary" icon={<PlusOutlined />} size="large" shape="circle"></Button>
            </Upload>
            <Table columns={columns} />
        </div>
    )
}
