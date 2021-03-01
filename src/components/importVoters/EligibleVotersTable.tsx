import * as React from 'react'
import { Table, Upload, Button, UploadProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/lib/upload'

export default function EligibleVotersTable(): React.ReactElement {
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
    ]

    const [fileList, setFileList] = React.useState<RcFile[]>([])

    const saveFile = (file: RcFile): boolean => {
        setFileList([...fileList, file])
        console.log(fileList)
        return false
    }

    return (
        <div className="voters-table-container">
            <Upload beforeUpload={saveFile}>
                <Button icon={<PlusOutlined />} size="large" shape="circle"></Button>
            </Upload>
            <Table columns={columns} />
        </div>
    )
}
