import * as React from 'react'
import { Form } from 'antd'
import DatePicker from 'components/overrides/DatePicker'
import { compareDesc } from 'date-fns'

export default function CloseDateInput(): React.ReactElement {
    return (
        <Form.Item
            name="closeDate"
            dependencies={['openDate']}
            rules={[
                { required: false, message: 'Please choose a date and time' },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        const openDate = getFieldValue('openDate')

                        // check if close date is after open date. It can also be equal.
                        if (compareDesc(openDate, value) !== -1) {
                            return Promise.resolve()
                        }
                        return Promise.reject(new Error('The close date must be set to after open date'))
                    },
                }),
            ]}
        >
            <DatePicker placeholder="Select date and time" showTime={true} format={'YYYY-MM-DD HH:mm:ss'} />
        </Form.Item>
    )
}
