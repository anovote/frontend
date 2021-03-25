import * as React from 'react'
import { Form, DatePicker } from 'antd'
import moment from 'moment'

export default function OpenDateInput(): React.ReactElement {
    return (
        <Form.Item name="openDate" rules={[{ required: false, message: 'Please choose a date and time' }]}>
            <DatePicker
                placeholder="Select date and time"
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss'), format: 'HH:mm:ss' }}
                format={'YYYY-MM-DD HH:mm:ss'}
            />
        </Form.Item>
    )
}
