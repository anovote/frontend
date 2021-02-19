import * as React from 'react'
import { Form, DatePicker } from 'antd'

export default function CloseDateInput(): React.ReactElement {
    return (
        <Form.Item name="closeDate" rules={[{ required: true, message: 'Please choose a date and time' }]}>
            <DatePicker />
        </Form.Item>
    )
}
