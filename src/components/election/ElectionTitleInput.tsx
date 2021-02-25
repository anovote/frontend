import * as React from 'react'
import { Form, Input } from 'antd'
export default function ElectionTitleInput(): React.ReactElement {
    return (
        <Form.Item name="title" rules={[{ required: true, message: 'Please fill in a title!' }]}>
            <Input placeholder="Title"></Input>
        </Form.Item>
    )
}
