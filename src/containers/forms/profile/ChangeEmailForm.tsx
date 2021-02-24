import { Form, Input, Space } from 'antd'
import Button from 'antd/lib/button/button'
import { isValidEmail } from 'core/helpers/validation'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function ChangeEmailFrom(): ReactElement {
    const [t] = useTranslation(['translation', 'common', 'form', 'profile'])
    function one() {
        console.log('hei')
    }
    return (
        <Form onFinish={one} layout={'horizontal'} name="basic">
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
    )
}
