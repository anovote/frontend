import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import { Button } from 'antd'
import { EditFilled, CloseOutlined } from '@ant-design/icons'
import { Draggable } from 'react-beautiful-dnd'

export default function PreviewItem({
    title,
    id,
    index,
}: {
    title: string
    id: string
    index: number
}): React.ReactElement {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    key={id}
                    className="preview-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Text>{title}</Text>
                    <Button
                        type="text"
                        icon={<EditFilled />}
                        onClick={() => {
                            console.log('edit clicked')
                        }}
                    ></Button>

                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => {
                            console.log('close clicked')
                        }}
                    ></Button>
                </div>
            )}
        </Draggable>
    )
}
