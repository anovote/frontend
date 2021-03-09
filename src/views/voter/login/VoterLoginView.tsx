import { Input, Form, Button, AlertProps, Alert } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import { AxiosInstance } from 'axios'
import { BackendAPI } from 'core/api'
import React, { ReactElement } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiRoute } from 'core/routes/apiRoutes'

function VoterLoginView(): ReactElement {
    const [t] = useTranslation(['form', 'common'])
    const [isLoading, setIsLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState<AlertProps>()

    const onSubmitHandler = async (form: JoinVoteDetails) => {
        const httpClient: AxiosInstance = BackendAPI
        const { email, electionCode } = form

        setIsLoading(true)

        try {
            await httpClient.get(apiRoute.joinElection, {
                params: {
                    email,
                    electionCode,
                },
            })
        } catch (err) {
            console.log(err)
            setAlertMessage({ type: 'error', message: err.message })
        }
        setIsLoading(false)
    }

    return (
        <Layout className="layout">
            {alertMessage && (
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
            <Content className="is-fullscreen has-content-center-center">
                <Form layout="vertical" name="vote-login-form" onFinish={onSubmitHandler}>
                    <Form.Item
                        label={t('common:Email')}
                        name={t('common:Email').toString()}
                        rules={[{ type: 'email', required: true, message: t('form:Email is not valid') }]}
                    >
                        <Input disabled={isLoading} placeholder="email@example.com" />
                    </Form.Item>
                    <Form.Item
                        label={t('common:Election Code')}
                        name={t('common:Election Code').toString()}
                        rules={[{ type: 'string', required: true, min: 6 }]}
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
