import { Alert, Button, Form, Input, Space } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import { BackendAPI } from 'core/api'
import { CredentialError } from 'core/errors/CredentialsError'
import { getPublicRoute } from 'core/routes/siteRoutes'
import { AuthenticationDetails } from 'core/service/authentication/AuthenticationDetails'
import { AuthenticationService } from 'core/service/authentication/AuthenticationService'
import { AuthLevel } from 'core/service/authentication/AuthLevel'
import { LocalStorageService } from 'core/service/storage/LocalStorageService'
import { useAppState, useAppStateDispatcher } from 'core/state/app/AppStateContext'
import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router-dom'

/**
 * Logins view
 * @returns view
 */
export default function LoginView(): React.ReactElement {
    const authService = new AuthenticationService(BackendAPI, new LocalStorageService())
    const [t] = useTranslation(['translation', 'common', 'form'])
    const [errorMessage, setErrorMessage] = React.useState('')
    const appDispatcher = useAppStateDispatcher()
    const history = useHistory()
    const { isLoggedIn } = useAppState()
    const [isLoading, setIsLoading] = useState(false)

    const formValidated = async (form: AuthenticationDetails) => {
        setIsLoading(true)
        setErrorMessage('')
        try {
            setIsLoading(false)
            await authService.authenticateOrganizer(form)
            appDispatcher.setLoginState(AuthLevel.organizer)
            history.replace('/admin')
        } catch (error) {
            setIsLoading(false)
            if (error instanceof CredentialError) {
                setErrorMessage(t('form:Wrong email password'))
            } else {
                setErrorMessage(t('form:Something went wrong'))
            }
        }
    }

    return isLoggedIn ? (
        <Redirect to="/admin" />
    ) : (
        <Layout className="layout">
            <Content className="is-fullscreen is-flex-column has-content-center-center">
                <h1>{t('common:Welcome to Anovote')}</h1>
                <div className="login-form">
                    <div className="error-field">
                        {!!errorMessage && <Alert message={errorMessage} type={'warning'} showIcon closable />}
                    </div>
                    <Form className="is-flex-column" layout="vertical" name="login-form" onFinish={formValidated}>
                        <Form.Item
                            label={t('common:Email')}
                            name="email"
                            rules={[{ required: true, message: t('form:Please provide email') }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t('common:Password')}
                            name="password"
                            rules={[{ required: true, message: t('form:Please provide a password') }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" loading={isLoading}>
                                    {t('common:Log In')}
                                </Button>
                                <Button
                                    onClick={() => {
                                        history.push(getPublicRoute().register)
                                    }}
                                >
                                    {t('form:Register')}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    )
}
