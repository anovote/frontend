import { Form, Input } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export default function ElectionDescriptionInput(): React.ReactElement {
    const [t] = useTranslation(['election', 'common'])
    return (
        <Form.Item
            name="description"
            label={t('common:Description')}
            rules={[{ required: true, message: t('form:Please fill in a description') }]}
        >
            <Input.TextArea placeholder={t('common:Description')}></Input.TextArea>
        </Form.Item>
    )
}
