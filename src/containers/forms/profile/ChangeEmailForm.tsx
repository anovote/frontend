import { Form, Input, Space } from 'antd'
import Button from 'antd/lib/button/button'
import { AlertList } from 'components/alert/AlertList'
import { isValidEmail } from 'core/helpers/validation'
import { useAlert } from 'core/hooks/useAlert'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function ChangeEmailForm(): ReactElement {
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])

    const [alertState, dispatchAlert] = useAlert([{ message: '', alertType: undefined }])

    const submitForm = async (formData: { email: string }) => {
        console.info(formData)
        dispatchAlert({ type: 'add', alertType: 'error', message: 'LOGIC NOT IMPLEMENTED' })
    }
    return (
        <Space direction="vertical">
            <AlertList alertProps={alertState} />
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
