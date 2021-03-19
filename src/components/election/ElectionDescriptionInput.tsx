import * as React from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'

export default function ElectionDescriptionInput(): React.ReactElement {
    const [t] = useTranslation('election')
    return (
        <Form.Item name="description" rules={[{ required: true, message: t('election:Please fill in a description') }]}>
            <Input.TextArea placeholder="Description"></Input.TextArea>
        </Form.Item>
    )
}
