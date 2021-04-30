import * as React from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'

export default function ElectionPasswordInput(): React.ReactElement {
    const [t] = useTranslation(['form', 'common'])
    return (
        <Form.Item
            name="password"
            label={t('common:Password')}
            rules={[{ required: false, message: t('form:Please provide a password') }]}
            tooltip={t('election:Add a password as a verification for your election')}
        >
            <Input.Password placeholder={t('common:Password')} />
        </Form.Item>
    )
}
