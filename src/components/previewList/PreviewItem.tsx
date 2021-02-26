import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import { Button } from 'antd'
import { EditFilled, CloseOutlined } from '@ant-design/icons'

export default function PreviewItem({ title }: { title: string }): React.ReactElement {
    return (
        <div className="preview-item">
            <Text>{title}</Text>
            <Button type="text" icon={<EditFilled />}></Button>

            <Button type="text" icon={<CloseOutlined />}></Button>
        </div>
    )
}
