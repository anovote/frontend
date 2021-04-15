import { Form } from 'antd'
import DatePicker from 'components/overrides/DatePicker'
import * as React from 'react'
import { isDateNow } from 'validations/isDateNow'

export default function OpenDateInput(): React.ReactElement {
    return (
        <Form.Item
            name="openDate"
            rules={[{ required: false, message: 'Please choose a date and time' }, (form) => isDateNow(form)]}
        >
            <DatePicker placeholder="Select date and time" showTime={true} format={'YYYY-MM-DD HH:mm:ss'} />
        </Form.Item>
    )
}
