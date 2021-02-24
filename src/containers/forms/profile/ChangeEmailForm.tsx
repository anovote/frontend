import { Alert, AlertProps, Form, Input, Space } from 'antd'
import Button from 'antd/lib/button/button'
import { isValidEmail } from 'core/helpers/validation'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function ChangeEmailForm(): ReactElement {
    const [alertMessage, setAlertMessage] = React.useState<AlertProps>()
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])
    const submitForm = async (formData: { email: string }) => {
        console.info(formData)
        setAlertMessage({ type: 'error', message: 'LOGIC NOT IMPLEMENTED' })
    }
    return (
        <Space direction="vertical">
            {!!alertMessage && (
                <Alert
                    message={alertMessage?.message}
                    description={alertMessage?.description}
                    type={alertMessage?.type}
                    onClose={() => {
                        setAlertMessage(undefined)
                    }}
                    showIcon
                    closable
                />
            )}
            <Form onFinish={submitForm} layout={'horizontal'} name="change-email">
                <Space direction="horizontal" className="inline-form-item">
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: t('form:Is required'),
                            },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.reject()
                                    if (isValidEmail(value)) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(t('form:Email is not valid'))
                                },
                            },
                        ]}
                    >
                        <Input style={{ width: 250 }} placeholder={t('common:Email')} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" className="">
                        {t('common:Save')}
                    </Button>
                </Space>
            </Form>
        </Space>
    )
}
