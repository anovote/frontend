import { CloseOutlined, EditFilled } from '@ant-design/icons'
import { Button, Space } from 'antd'
import * as React from 'react'
import { Draggable } from 'react-beautiful-dnd'

export default function PreviewItem({
    itemTitle,
    id,
    onEdit,
    onDelete,
    index,
}: {
    itemTitle?: string
    id: string | number
    onEdit: (id: string | number) => void
    onDelete: (id: string | number) => void
    title: string
    index: number
}): React.ReactElement {
    const onEditHandler = () => {
        onEdit(id)
    }
    const onDeleteHandler = () => {
        onDelete(id)
    }
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    className="preview-item"
                    key={id}
                    className="preview-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {itemTitle}
                    <Space direction={'horizontal'}>
                        <Button type="text" icon={<EditFilled />} onClick={onEditHandler}></Button>
                        <Button type="text" icon={<CloseOutlined />} onClick={onDeleteHandler}></Button>
                    </Space>
                </div>
            )}
        </Draggable>
    )
}
