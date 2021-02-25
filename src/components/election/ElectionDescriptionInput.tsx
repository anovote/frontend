import * as React from 'react'
import { Form, Input } from 'antd'

export default function ElectionDescriptionInput(): React.ReactElement {
    return (
        <Form.Item name="description" rules={[{ required: true, message: 'Please fill in a description' }]}>
            <Input.TextArea placeholder="Description"></Input.TextArea>
        </Form.Item>
    )
}
