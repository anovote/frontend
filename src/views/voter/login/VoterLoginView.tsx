import { Input, Form, Button } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import { AxiosInstance } from 'axios'
import { BackendAPI } from 'core/api'
import React, { ReactElement } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function VoterLoginView(): ReactElement {
    const [t] = useTranslation(['form', 'common'])
    const [isLoading, setIsLoading] = useState(false)

    const onSubmitHandler = async (form: JoinVoteDetails) => {
        const httpClient: AxiosInstance = BackendAPI
        const { email, electionCode } = form

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
        //await httpClient.get('', {
        //    params: {
        //        email,
        //        electionCode,
        //    },
        //})
    }

    return (
        <Layout className="layout">
            <Content className="is-fullscreen has-content-center-center">
                <Form layout="vertical" name="vote-login-form" onFinish={onSubmitHandler}>
                    <Form.Item
                        label={t('common:Email')}
                        name="email"
                        rules={[{ type: 'email', message: t('form:Email is not valid') }]}
                    >
                        <Input disabled={isLoading} />
                    </Form.Item>
                    <Form.Item
                        label={t('common:Election Code')}
                        name="electionCode"
                        rules={[{ type: 'string', min: 6 }]}
                    >
                        <Input disabled={isLoading} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            {t('common:Submit')}
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    )
}

export default VoterLoginView

interface JoinVoteDetails {
    email: string
    electionCode: string
}
