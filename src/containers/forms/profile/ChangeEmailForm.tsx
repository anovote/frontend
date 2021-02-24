import { Form, Input, Space } from 'antd'
import Button from 'antd/lib/button/button'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ChangeEmailFrom() {
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
