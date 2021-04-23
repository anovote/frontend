import { Form, Input } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export default function ElectionDescriptionInput(): React.ReactElement {
    const [t] = useTranslation('election')
    return (
        <Form.Item name="description" rules={[{ required: true, message: t('form:Please fill in a description') }]}>
            <Input.TextArea placeholder="Description"></Input.TextArea>
        </Form.Item>
    )
}
