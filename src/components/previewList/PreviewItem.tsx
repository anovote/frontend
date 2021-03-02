import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import { Button, Input, Space } from 'antd'
import { EditFilled, CloseOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

export default function PreviewItem({
    title,
    id,
    children,
    onEdit,
    onDelete,
}: {
    title: string
    id: string | number
    children: React.ReactNode | undefined
    onEdit: (id: string | number) => void
    onDelete: (id: string | number) => void
}): React.ReactElement {
    const [editMode, setEditMode] = useState(false)
    const toggleEditMode = () => {
        setEditMode(!editMode)
    }
    const onEditHandler = () => {
        onEdit(id)
    }
    const onDeleteHandler = () => {
        onDelete(id)
    }
    return (
        <div className="preview-item">
            {children}
            {/*<Text>{title}</Text>
            {editMode && <Input onKeyDown={enterKeyHandler}></Input>}*/}
            <Space direction={'horizontal'}>
                <Button type="text" icon={<EditFilled />} onClick={onEditHandler}></Button>
                <Button type="text" icon={<CloseOutlined />} onClick={onDeleteHandler}></Button>
            </Space>
        </div>
    )
}
