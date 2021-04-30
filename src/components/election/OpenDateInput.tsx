import { Form } from 'antd'
import DatePicker from 'components/overrides/DatePicker'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { isDateNow } from 'validations/isDateNow'

export default function OpenDateInput(): React.ReactElement {
    const [t] = useTranslation(['common', 'election'])
    return (
        <Form.Item
            label={t('common:Open')}
            tooltip={t('election:The date and time you want the election to open')}
            name="openDate"
            rules={[{ required: false, message: 'Please choose a date and time' }, (form) => isDateNow(form)]}
        >
            <DatePicker placeholder="Select date and time" showTime={true} format={'YYYY-MM-DD HH:mm:ss'} />
        </Form.Item>
    )
}
