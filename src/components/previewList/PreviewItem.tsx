import { CloseOutlined, EditFilled } from '@ant-design/icons'
import { Button, Space } from 'antd'
import * as React from 'react'

export default function PreviewItem({
    itemTitle,
    id,
    onEdit,
    onDelete,
}: {
    itemTitle?: string
    id: string | number
    onEdit: (id: string | number) => void
    onDelete: (id: string | number) => void
}): React.ReactElement {
    const onEditHandler = () => {
        onEdit(id)
    }
    const onDeleteHandler = () => {
        onDelete(id)
    }
    return (
        <div className="preview-item" key={id}>
            {itemTitle}
            <Space direction={'horizontal'}>
                <Button type="text" icon={<EditFilled />} onClick={onEditHandler}></Button>
                <Button type="text" icon={<CloseOutlined />} onClick={onDeleteHandler}></Button>
            </Space>
        </div>
    )
}
