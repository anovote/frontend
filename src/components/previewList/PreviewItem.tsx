import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import { Button } from 'antd'
import { EditFilled, CloseOutlined } from '@ant-design/icons'

export default function PreviewItem(): React.ReactElement {
    return (
        <div className="preview-item">
            <Text>Hello</Text>
            <div className="button-container-wrap">
                <div className="button-container">
                    <Button type="text" icon={<EditFilled />}></Button>
                </div>

                <div className="button-container">
                    <Button type="text" icon={<CloseOutlined />}></Button>
                </div>
            </div>
        </div>
    )
}
