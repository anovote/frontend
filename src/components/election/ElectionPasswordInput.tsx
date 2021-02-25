import * as React from 'react'
import { Form, Input } from 'antd'

export default function ElectionPasswordInput(): React.ReactElement {
    return (
        <Form.Item
            className="password-input"
            name="password"
            rules={[{ required: true, message: 'Please fill in a password!' }]}
        >
            <Input.Password placeholder="Password" />
        </Form.Item>
    )
}
