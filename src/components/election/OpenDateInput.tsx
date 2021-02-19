import * as React from 'react'
import { Form, DatePicker } from 'antd'

export default function OpenDateInput(): React.ReactElement {
    return (
        <Form.Item name="openDate" rules={[{ required: true, message: 'Please choose a date and time' }]}>
            <DatePicker />
        </Form.Item>
    )
}
