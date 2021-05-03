import { CloseOutlined, EditFilled } from '@ant-design/icons'
import { Button, Space } from 'antd'
import * as React from 'react'

export default function PreviewItem({
    children,
    id,
    onEdit,
    onDelete,
}: {
    children?: string
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
        <div className="preview-item">
            <span className="preview-item-text">{children}</span>
            <Space direction={'horizontal'}>
                <Button type="text" icon={<EditFilled />} onClick={onEditHandler} className="edit"></Button>
                <Button type="text" icon={<CloseOutlined />} onClick={onDeleteHandler} className="delete"></Button>
            </Space>
        </div>
    )
}
