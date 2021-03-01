import * as React from 'react'
import { Table, Upload, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { readString } from 'react-papaparse'

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
        setUploadedFile(file)
        return false
    }

    console.log(uploadedFile)

    return (
        <div className="voters-table-container">
            <Upload beforeUpload={saveFile}>
                <Button type="primary" icon={<PlusOutlined />} size="large" shape="circle"></Button>
            </Upload>
            <Table columns={columns} />
        </div>
    )
}
