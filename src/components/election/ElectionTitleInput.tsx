import { Form, Input } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
export default function ElectionTitleInput(): React.ReactElement {
    const [t] = useTranslation(['form', 'common'])
    return (
        <Form.Item
            name="title"
            label={t('common:Title')}
            rules={[{ required: true, message: t('form:Please fill in a title') }]}
        >
            <Input data-testid="title" placeholder={t('common:Title')}></Input>
        </Form.Item>
    )
}
